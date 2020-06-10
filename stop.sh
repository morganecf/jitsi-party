# Swap the landing page
sudo cp ~/jitsi-party/landing/down.html /var/www/html/index.html

# Shut down flask
cat ~/tmp/FLASK_PID > kill

# Shut down run.sh
cat ~/tmp/RUN_PID > kill

rm -r ~/tmp