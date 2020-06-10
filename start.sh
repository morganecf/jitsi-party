#! /bin/bash

export FLASK_APP="manager.py"
export FLASK_ENV=production
export FLASK_DEBUG=1
export PYTHONUNBUFFERED=1
export FLASK_RUN_PORT=3000 # run homepage on 80 to point to this

source venv/bin/activate
cd app/
source setup.sh
flask create-db
flask run-eventlet &

cd client/
bash run.sh &

cp ~/jitsi-party/landing/running.html /var/www/html/index.html