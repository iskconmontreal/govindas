resource "aws_s3_bucket" "bucket" {
  bucket        = "www.${var.env}.${var.domain}"
  force_destroy = true
  acl           = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.bucket.id
  policy = data.aws_iam_policy_document.policy.json
}
