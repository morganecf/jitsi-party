#! /bin/bash

export FLASK_APP="manager.py"
export FLASK_ENV=production
export FLASK_DEBUG=1
export PYTHONUNBUFFERED=1
export FLASK_RUN_PORT=3000
flask run-eventlet

