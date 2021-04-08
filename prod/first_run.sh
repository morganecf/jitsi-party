#! /bin/bash

set -x
set -e

cd /home/admin

cp env.template.sh .env
./gen-passwords.sh
TZ=US/Eastern
perl -pi -e "s#TZ=.*#TZ=$${TZ}#g" .env

aws --region us-east-2 secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:us-east-2:241532693788:secret:tst/jitsi-party/proxy-vars-9UVtXg | jq .SecretString | python3 -c 'import json,sys; [print(f"{k}={v}") for k, v in json.loads(json.load(sys.stdin)).items()]' | sudo tee -a .env > /dev/null

sudo docker-compose up -d
sleep 10
sudo docker-compose exec -T -e 'FLASK_ENV=production' -e 'FLASK_APP=manager.py' web-worker_1 flask create-db
