# create groups
resource "aws_iam_group" "group" {
    for_each = { for group in var.user_groups : group.name => group }
    name     = each.value.name
}

data "aws_iam_policy_document" "ec2_policy" {
  for_each = { for group in var.user_groups : group.name => group }
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
  for_each = { for group in var.user_groups : group.name => group }
  name        = each.value.restrictions.name
  description = each.value.restrictions.description
  policy      = data.aws_iam_policy_document.ec2_policy[each.value.name].json
}

# attach policy to groups
resource "aws_iam_group_policy_attachment" "group_policy_attachment" {
  for_each = { for group in var.user_groups : group.name => group }
  group      = aws_iam_group.group[each.value.name].name
  policy_arn = aws_iam_policy.ec2_policy[each.value.name].arn
}

# add all users that have this group id in their groups_ids list to the group
resource "aws_iam_group_membership" "group_membership" {
  for_each = { for group in var.user_groups : group.name => group }
  name = each.value.name
  users = [for user in var.users : user.name if contains(user.groups_ids, each.value.id)]
  group = aws_iam_group.group[each.value.name].name
}
