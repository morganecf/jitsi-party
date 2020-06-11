# get git
sudo apt-get install git

# get pip for Python3
sudo apt-get install python3-pip

# get *proper* nodeJS version
sudo curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt-get install -y nodejs

# For checking on DNS config (not necessary)
# sudo apt-get install dnsutils

# For setting up SSL cert
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot

# For installing Apache
# Will start automatically once installed
sudo apt-get install apache2

# Set the landing page
cd ~/jitsi-party/landing
bash update-landing.sh down