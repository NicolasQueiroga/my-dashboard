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
  vpc_security_group_ids = [for sg in var.security_groups : sg.id if contains(each.value.security_groups_ids, sg.tags.id)]

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