#! /bin/bash

export FLASK_APP="manager.py"
export FLASK_ENV=production
export FLASK_DEBUG=1
export PYTHONUNBUFFERED=1
export FLASK_RUN_PORT=3000 # run homepage on 80 to point to this

# Holds variables needed for killing processes
mkdir -p ~/tmp

source venv/bin/activate
cd app/
source setup.sh
flask create-db
flask run-eventlet &
echo $! >> ~/tmp/FLASK_PID

cd client/
bash run.sh &
echo $! >> ~/tmp/RUN_PID

sudo cp ~/jitsi-party/landing/running.html /var/www/html/index.html