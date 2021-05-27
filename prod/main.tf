provider "aws" {
  region = "us-east-2"
}

terraform {
  backend "s3" {
    bucket = "cabinweekend-tfstate"
    key    = "main"
  }
}

resource "aws_key_pair" "main" {
    key_name   = "gomorrah"
    public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCPYesSRAMXn+LovKxYIGV/eYdHGeOVWEkugWg0l0jHAZ+IyQo91A7gImUZilLl+tbHpiv3uj42nfDwREl4TtNur0x9P/QJqZ4VUYAi48RnQgRlqNjrz8o56ji43wfLs6eoV4tGIFmgWO9QG+WMqKC4jcqLjQiGsgCDweHxeu8n5MWwpfsSixGUF4D0CB/11zoQTteQXst9y6ii68synlELSsFf27VbfOdJ/0C8aIpFHJ7f/gMvHFKLxB4X2nDrBoUsNPp8Gg6V7rRlhpIAfsMqih8lch/Cd8QMiP2ZLKrVL8krTgNf9A0dMvOA2NLlInQLhkxzlxq7jkVI6cQqPqX1"
}

data "aws_ami" "jitsi-party" {
    most_recent      = true
    name_regex       = "^jitsi-party \\d+ \\[packer\\]"
    owners           = ["self"]

    filter {
        name   = "root-device-type"
        values = ["ebs"]
    }

    filter {
        name   = "virtualization-type"
        values = ["hvm"]
    }
}


resource "aws_route53_zone" "main" {
    name = "thesatanic.estate"
}

resource "aws_security_group" "main" {
    name = "web"
    description = "web"
    egress = [{
        description = ""
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
        ipv6_cidr_blocks = []
        prefix_list_ids = []
        security_groups = []
        self = false
    }]
    ingress = [
          {
              cidr_blocks      = [
                  "0.0.0.0/0",
                ]
              description      = ""
              from_port        = 15001
              ipv6_cidr_blocks = [
                  "::/0",
                ]
              prefix_list_ids  = []
              protocol         = "udp"
              security_groups  = []
              self             = false
              to_port          = 15001
            },
          {
              cidr_blocks      = [
                  "0.0.0.0/0",
                ]
              description      = ""
              from_port        = 443
              ipv6_cidr_blocks = [
                  "::/0",
                ]
              prefix_list_ids  = []
              protocol         = "tcp"
              security_groups  = []
              self             = false
              to_port          = 443
            },
          {
              cidr_blocks      = [
                  "0.0.0.0/0",
                ]
              description      = ""
              from_port        = 5443
              ipv6_cidr_blocks = [
                  "::/0",
                ]
              prefix_list_ids  = []
              protocol         = "tcp"
              security_groups  = []
              self             = false
              to_port          = 5443
            },
          {
              cidr_blocks      = [
                  "0.0.0.0/0",
                ]
              description      = ""
              from_port        = 5444
              ipv6_cidr_blocks = [
                  "::/0",
                ]
              prefix_list_ids  = []
              protocol         = "tcp"
              security_groups  = []
              self             = false
              to_port          = 5444
            },
          {
              cidr_blocks      = [
                  "0.0.0.0/0",
                ]
              description      = ""
              from_port        = 80
              ipv6_cidr_blocks = [
                  "::/0",
                ]
              prefix_list_ids  = []
              protocol         = "tcp"
              security_groups  = []
              self             = false
              to_port          = 80
            },
          {
              cidr_blocks      = [
                  "0.0.0.0/0",
                ]
              description      = "jitsi"
              from_port        = 15000
              ipv6_cidr_blocks = [
                  "::/0",
                ]
              prefix_list_ids  = []
              protocol         = "udp"
              security_groups  = []
              self             = false
              to_port          = 15000
            },
          {
              cidr_blocks      = [
                  "24.61.42.92/32",
                ]
              description      = "gbre ssh"
              from_port        = 22
              ipv6_cidr_blocks = []
              prefix_list_ids  = []
              protocol         = "tcp"
              security_groups  = []
              self             = false
              to_port          = 22
            },
    ]
}

resource "aws_eip" "main" {
    count = var.vhq_enabled ? 1 : 0
    instance = aws_instance.main[0].id
    vpc = true
}

resource "aws_iam_instance_profile" "main" {
    name = "jitsi_party"
    role = aws_iam_role.main.name
}

resource "aws_iam_role" "main" {
    name = "jitsi-party"
    path = "/"

    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Action = "sts:AssumeRole"
                Effect = "Allow"
                Sid = ""
                Principal = {
                    Service = "ec2.amazonaws.com"
                }
            },
        ]
    })

    inline_policy {
        name = "AccessPartySecrets"

        policy = jsonencode({
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "secretsmanager:GetResourcePolicy",
                        "secretsmanager:GetSecretValue",
                        "secretsmanager:DescribeSecret",
                        "secretsmanager:ListSecretVersionIds"
                    ],
                    "Resource": [
                        "arn:aws:secretsmanager:us-east-2:241532693788:secret:tst/jitsi-party/proxy-vars-9UVtXg"
                    ]
                }
            ]
        })
  }
}

resource "aws_instance" "main" {
    count = var.vhq_enabled ? 1 : 0
    ami = data.aws_ami.jitsi-party.id
    instance_type = "m5.2xlarge"
    iam_instance_profile = aws_iam_instance_profile.main.name
    vpc_security_group_ids = [aws_security_group.main.id]
    key_name = aws_key_pair.main.key_name
    user_data = templatefile("first_run.sh.tpl", { config = "factionhall", theme = "factionhall" })
}

resource "aws_route53_record" "main" {
    zone_id = aws_route53_zone.main.zone_id
    name = "enter.thesatanic.estate"
    type = var.vhq_enabled ? "A" : "CNAME"
    ttl = "60"
    records = [var.vhq_enabled ? aws_eip.main[0].public_ip : "d1u2lx0fagbi00.cloudfront.net"]
}
