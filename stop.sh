# Swap the landing page
sudo cp ~/jitsi-party/landing/down.html /var/www/html/index.html

# Shut down flask
pkill -x "flask"

# Shut down `bash run.sh`
pkill -x "bash"

# shut down webpack
pkill -x "sh"

# shut down node... and reset, because this breaks tty for some reason
pkill -x "node"
reset