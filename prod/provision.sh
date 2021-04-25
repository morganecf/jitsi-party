#! /bin/bash
set -x
set -e

cd /home/admin

sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    locales-all

curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

DOCKER_VERSION="5:20.10.5~3-0~debian-buster"

sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
    containerd.io \
    docker-ce=$DOCKER_VERSION \
    docker-ce-cli=$DOCKER_VERSION \
    docker-compose=1.21.0-3 \
    python3 \
    python3-pip \
    jq \
    neovim \
    htop \
    iftop

cat extra_keys >> ~/.ssh/authorized_keys
echo 'PATH=$PATH:$HOME/.local/bin' >> ~/.bashrc

pip3 install awscliv2
