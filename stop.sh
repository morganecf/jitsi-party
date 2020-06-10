# Swap the landing page
sudo cp ~/jitsi-party/landing/down.html /var/www/html/index.html

# Shut down flask
pkill "flask"

# Shut down run.sh
pkill "run.sh"