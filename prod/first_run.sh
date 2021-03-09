#! /bin/bash

set -x
set -e

cd /home/admin

cp env.template.sh .env
./gen-passwords.sh
TZ=US/Eastern
perl -pi -e "s#TZ=.*#TZ=$${TZ}#g" .env

sudo docker-compose up -d
sleep 10
sudo docker-compose exec -T -e 'FLASK_ENV=production' -e 'FLASK_APP=manager.py' web-worker_1 flask create-db
