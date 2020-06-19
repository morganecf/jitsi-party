# Swap the landing page
cd ~/jitsi-party/landing
bash update-landing.sh down

# Save the log files
cp ~/tmp/flask-log.txt ~/tmp/last/flask-log.txt
cp ~/tmp/run-log.txt ~/tmp/last/run-log.txt

# Shut down flask
sudo pkill -x "flask"

# shut down webpack
pkill -x "sh"

# shut down node... and reset, because this breaks tty for some reason
pkill -x "node"
reset

# Shut down `bash run.sh`
pkill -x "bash"