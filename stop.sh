# Swap the landing page
sudo cp ~/jitsi-party/landing/down.html /var/www/html/index.html

# Shut down flask
kill $PID_FLASK

# Shut down run.sh
kill $PID_RUN