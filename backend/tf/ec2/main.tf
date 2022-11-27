# Get Availability Zones
resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# generate pem file for each instance
resource "aws_key_pair" "kp" {
  for_each = { for instance in var.instances : instance.name => instance }
  key_name   = each.value.name
  public_key = tls_private_key.pk.public_key_openssh
  provisioner "local-exec" {
    command = "echo '${tls_private_key.pk.private_key_pem}' > '${path.module}/keys/${each.value.name}.pem'"
  }
}

# Create a EC2 Instances
resource "aws_instance" "ec2_instance" {
  for_each = { for instance in var.instances : instance.name => instance }
  instance_type          = each.value.instance_type
  key_name               = each.value.name
  ami                    = each.value.ami
  subnet_id              = var.public_subnet
  vpc_security_group_ids = [for sg in aws_security_group.sg : sg.id if contains(each.value.security_groups_ids, sg.tags.id)]

  tags = {
    Name = each.value.name
  }

  root_block_device {
    volume_size = 10
  }
}

# Create and assosiate an Elastic IP for each EC2 Instance
resource "aws_eip" "eip" {
  for_each = { for instance in var.instances : instance.name => instance }
  vpc      = true
  instance = aws_instance.ec2_instance[each.value.name].id
}

# Create Security Groups
resource "aws_security_group" "sg" {
  for_each    = { for sg in var.security_groups : sg.name => sg }
  name        = each.value.name
  description = each.value.description
  vpc_id      = var.vpc_id
  tags = {
    Name = each.value.name
    id   = each.value.id
  }

  dynamic "ingress" {
    for_each = each.value.ingress

    content {
      from_port   = ingress.value.from_port
      to_port     = ingress.value.to_port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }

  dynamic "egress" {
    for_each = each.value.egress

    content {
      from_port   = egress.value.from_port
      to_port     = egress.value.to_port
      protocol    = egress.value.protocol
      cidr_blocks = egress.value.cidr_blocks
    }
  }
}
