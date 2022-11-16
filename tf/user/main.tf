# create an iam user for each item in the list
resource "aws_iam_user" "user" {
  for_each = { for user in var.users : user.name => user }
  name     = each.value.name
}

# give each iam user programatic access
resource "aws_iam_access_key" "iam_access_key" {
  for_each = { for user in var.users : user.name => user }
  user     = aws_iam_user.user[each.value.name].name
}

# create the inline policy
data "aws_iam_policy_document" "ec2_policy" {
  for_each = { for user in var.users : user.name => user }
  policy_id = each.value.name
  statement {
    effect = "Allow"
    sid = "VisualEditor0"
    actions = each.value.restrictions.actions
    resources = each.value.restrictions.resources
  }
}

# create the policy
resource "aws_iam_policy" "ec2_policy" {
  for_each = { for user in var.users : user.name => user }
  name        = each.value.restrictions.name
  description = each.value.restrictions.description
  policy      = data.aws_iam_policy_document.ec2_policy[each.value.name].json
}


# attach policy to user
resource "aws_iam_user_policy_attachment" "user_policy_attachment" {
  for_each = { for user in var.users : user.name => user }
  user      = aws_iam_user.user[each.value.name].name
  policy_arn = aws_iam_policy.ec2_policy[each.value.name].arn
}

# create user login profile for each user
resource "aws_iam_user_login_profile" "profile" {
  for_each                = { for user in var.users : user.name => user }
  user                    = aws_iam_user.user[each.value.name].name
#   pgp_key                 = var.pgp_key
  password_length         = 13
  password_reset_required = true
}

