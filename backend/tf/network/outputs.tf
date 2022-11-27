output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "public_subnet" {
  value = aws_subnet.public_subnet.id
}

output "availability_zones" {
  value = data.aws_availability_zones.available.names
}