# Swap the landing page
sudo cp ~/jitsi-party/landing/down.html /var/www/html/index.html

# Shut down flask
kill $(cat ~/tmp/FLASK_PID)

# Shut down run.sh
kill $(cat ~/tmp/RUN_PID)

rm -r ~/tmp