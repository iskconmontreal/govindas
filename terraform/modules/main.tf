locals {
  organization          = "holistic-shield"
  project_name          = "website"
  project_resource_name = "website"
  owner                 = "Thageesan Thanabalasingam"
  ssm_path_arn          = "arn:aws:ssm:*:*:parameter/${var.env}/holistic-shield/*"
  role                  = "holistic-shield"
  name                  = "Holistic Shield"
}
