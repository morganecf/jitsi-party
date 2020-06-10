# Swap the landing page
cd ~/jitsi-party/landing
bash update-landing.sh down.html

# Shut down flask
pkill -x "flask"

# Shut down `bash run.sh`
pkill -x "bash"

# shut down webpack
pkill -x "sh"

# shut down node... and reset, because this breaks tty for some reason
pkill -x "node"
reset