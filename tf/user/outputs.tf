# password output for each user
output "password" {
    value = { for user, profile in aws_iam_user_login_profile.profile : user => profile.password }
}