output "elb-dns" {
  value = aws_elb.elb1.dns_name
}