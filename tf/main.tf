module "network" {
  source          = "./network"
  access_ip       = var.access_ip
  vpc_cidr        = local.vpc_cidr
  security_groups = var.security_groups

}

module "ec2" {
  source        = "./ec2"
  public_subnet = module.network.public_subnet
  security_groups = module.network.security_groups
  instances = var.instances
}

module "user" {
  source    = "./user"
  users = var.users
  pgp_key = var.pgp_key
}

module "groups" {
  source    = "./groups"
  user_groups = var.user_groups
  users = var.users
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