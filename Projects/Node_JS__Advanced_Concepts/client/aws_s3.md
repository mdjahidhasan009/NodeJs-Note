In this project we use aws s3 in this file added steps to configure aws s3.

IAM User will be created with minimal permissions to access S3 bucket. We will create credential those will work only
one s3 bucket and will have minimal permissions and will not have access to other buckets or any other services.

To resolve CORS issue we need to add CORS configuration to S3 bucket.
```shell
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT"
        ],
        "AllowedOrigins": [
            "http://localhost:3000"
        ],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
    }
]
```

Now no one can see the content of the bucket, we need to change the policy. 
```shell
{
  "Id": "Policy1520902918299",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Stmt1520902915884",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::my-blog-bucket-123/*",
      "Principal": "*"
    }
  ]
}
```