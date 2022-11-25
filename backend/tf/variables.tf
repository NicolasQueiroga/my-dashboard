variable "aws_access_key" {
  type = string
}

variable "aws_secret_key" {
  type = string
}

variable "access_ip" {
  type = string
}


// ------------------------------
variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "security_groups" {
  type = list(object({
    id          = string
    name        = string
    description = string
    ingress = list(object({
      from_port   = number
      to_port     = number
      protocol    = string
      cidr_blocks = list(string)
    }))
    egress = list(object({
      from_port   = number
      to_port     = number
      protocol    = string
      cidr_blocks = list(string)
    }))
  }))
  default = [ {
    description = "default security group"
    ingress = [ {
      cidr_blocks = [ "0.0.0.0/0" ]
      from_port = 22
      protocol = "tcp"
      to_port = 22
    } ]
    id = "1"
    egress = [ {
      cidr_blocks = [ "0.0.0.0/0" ]
      from_port = 22
      protocol = "tcp"
      to_port = 22
    } ]
    name = "default"
  } ]
}

variable "user_groups" {
  type = list(object({
    id          = string
    name        = string
    description = string
    restrictions = object({
      name        = string
      description = string
      actions     = list(string)
      resources   = list(string)
    })
  }))
}

variable "users" {
  type = list(object({
    groups_ids = list(string)
    name       = string
    restrictions = object({
      name        = string
      description = string
      actions     = list(string)
      resources   = list(string)
    })
  }))
}

variable "instances" {
  type = list(object({
    security_groups_ids = list(string)
    name                = string
    ami                 = string
    instance_type       = string
    region              = string
  }))
}
