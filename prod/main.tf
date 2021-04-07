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

resource "aws_instance" "main" {
    count = var.vhq_enabled ? 1 : 0
    ami = data.aws_ami.jitsi-party.id
    instance_type = "t3.medium"
    vpc_security_group_ids = [aws_security_group.main.id]
    key_name = aws_key_pair.main.key_name
    user_data = file("first_run.sh")
}

resource "aws_route53_record" "main" {
    zone_id = aws_route53_zone.main.zone_id
    name = "enter.thesatanic.estate"
    type = "A"
    ttl = "300"
    records = [var.vhq_enabled ? aws_eip.main[0].public_ip : "8.8.8.8"]
}