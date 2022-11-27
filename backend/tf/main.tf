module "network" {
  count     = length(var.instances) == 0 || length(var.security_groups) == 0 ? 0 : 1
  source    = "./network"
  access_ip = var.access_ip
  vpc_cidr  = local.vpc_cidr
}

module "ec2" {
  count           = length(var.instances) == 0 ? 0 : 1
  source          = "./ec2"
  public_subnet   = module.network[0].public_subnet
  vpc_id          = module.network[0].vpc_id
  instances       = var.instances
  security_groups = var.security_groups
}

module "user" {
  count  = length(var.users) == 0 ? 0 : 1
  source = "./user"
  users  = var.users
}

module "groups" {
  count       = length(var.user_groups) == 0 ? 0 : 1
  source      = "./groups"
  user_groups = var.user_groups
  users       = var.users
}

module "autoscale" {
  count = terraform.workspace == "default" ? 1 : 0
  source = "./autoscale"
}

output "network" {
  value = module.network
}

output "ec2" {
  value = module.ec2
}

output "user" {
  value = module.user
}

output "autoscale" {
  value = module.autoscale
}
