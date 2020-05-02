#! /bin/bash

source setup_prod.sh
flask create-db
FLASK_DEBUG=1 PYTHONUNBUFFERED=1 flask run-prod

