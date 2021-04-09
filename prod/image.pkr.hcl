locals { timestamp = regex_replace(timestamp(), "[- TZ:]", "") }

# source blocks configure your builder plugins; your source is then used inside
# build blocks to create resources. A build block runs provisioners and
# post-processors on an instance created by the source.
source "amazon-ebs" "jitsi-party" {
    ami_name      = "jitsi-party ${local.timestamp} [packer]"
    instance_type = "t2.micro"
    region        = "us-east-2"
    source_ami = "ami-089fe97bc00bff7cc"  # debian-10-amd64-20210329-591
    ssh_username = "admin"
}

build {
    sources = ["source.amazon-ebs.jitsi-party"]

    provisioner "file" {
        source = "./extra_keys"
        destination = "/home/admin/"
    }

    provisioner "shell" {
        script = "./provision.sh"
    }

    provisioner "file" {
        source = "./docker-compose.yml"
        destination = "/home/admin/"
    }

    provisioner "file" {
        source = "../gen-passwords.sh"
        destination = "/home/admin/"
    }

    provisioner "file" {
        source = "../env.template.sh"
        destination = "/home/admin/"
    }
}
