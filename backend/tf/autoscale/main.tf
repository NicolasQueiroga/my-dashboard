# generate pem file for each instance
resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}
resource "aws_key_pair" "kp" {
  key_name   = "backendKey"
  public_key = tls_private_key.pk.public_key_openssh
  provisioner "local-exec" {
    command = "echo '${tls_private_key.pk.private_key_pem}' > '${path.module}/keys/backendKey.pem'"
  }
}

data "template_file" "user_data" {
  template = "${file("${path.module}/user_data.sh")}"
}
# generate instance
resource "aws_launch_configuration" "webcluster" {
  image_id        = "ami-0c8d2cb746b96ec17"
  instance_type   = "t2.micro"
  security_groups = ["${aws_security_group.websg.id}"]
  key_name        = aws_key_pair.kp.key_name
  user_data       =  "${data.template_file.user_data.rendered}"

  # provisioner "local-exec" {
  #   command = "echo “@reboot cd /home/ubuntu/MeTH-api/ && sudo docker compose up -d” | crontab"
  # }

  lifecycle {
    create_before_destroy = true
  }
}

# generate autoscale group
resource "aws_autoscaling_group" "scalegroup" {
  launch_configuration = aws_launch_configuration.webcluster.name
  availability_zones   = ["us-east-1a", "us-east-1b", "us-east-1c"]
  min_size             = 1
  max_size             = 4
  enabled_metrics      = ["GroupMinSize", "GroupMaxSize", "GroupDesiredCapacity", "GroupInServiceInstances", "GroupTotalInstances"]
  metrics_granularity  = "1Minute"
  load_balancers       = ["${aws_elb.elb1.id}"]
  health_check_type    = "ELB"
  tag {
    key                 = "Name"
    value               = "backend"
    propagate_at_launch = true
  }
}

# generate autoscale policy
resource "aws_autoscaling_policy" "autopolicy" {
  name                   = "terraform-autoplicy"
  scaling_adjustment     = 1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.scalegroup.name
}

# generate autoscale alarm
resource "aws_cloudwatch_metric_alarm" "cpualarm" {
  alarm_name          = "terraform-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "70"

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.scalegroup.name
  }

  alarm_description = "This metric monitor EC2 instance cpu utilization"
  alarm_actions     = ["${aws_autoscaling_policy.autopolicy.arn}"]
}

# generate autoscale alarm
resource "aws_autoscaling_policy" "autopolicy-down" {
  name                   = "terraform-autoplicy-down"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
  autoscaling_group_name = aws_autoscaling_group.scalegroup.name
}

# generate autoscale alarm
resource "aws_cloudwatch_metric_alarm" "cpualarm-down" {
  alarm_name          = "terraform-alarm-down"
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "10"

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.scalegroup.name
  }

  alarm_description = "This metric monitor EC2 instance cpu utilization"
  alarm_actions     = ["${aws_autoscaling_policy.autopolicy-down.arn}"]
}

# generate autoscale instance security group
resource "aws_security_group" "websg" {
  name = "security_group_for_web_server"
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

# generate autoscale load balancer security group
resource "aws_security_group" "elbsg" {
  name = "security_group_for_elb"
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

# generate autoscale load balancer
resource "aws_elb" "elb1" {
  name               = "terraform-elb"
  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]
  security_groups    = ["${aws_security_group.elbsg.id}"]

  listener {
    instance_port     = 80
    instance_protocol = "http"
    lb_port           = 80
    lb_protocol       = "http"
  }

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    target              = "HTTP:80/checkserver/"
    interval            = 30
  }

  cross_zone_load_balancing   = true
  idle_timeout                = 400
  connection_draining         = true
  connection_draining_timeout = 400

}

# generate autoscale load balancer cookie stickiness policy
resource "aws_lb_cookie_stickiness_policy" "cookie_stickness" {
  name                     = "cookiestickness"
  load_balancer            = aws_elb.elb1.id
  lb_port                  = 80
  cookie_expiration_period = 600
}
