#! /bin/bash

set -x
set -e

cd /home/admin

cp env.template.sh .env
./gen-passwords.sh
TZ=US/Eastern
perl -pi -e "s#TZ=.*#TZ=$${TZ}#g" .env

aws --region us-east-2 secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:us-east-2:241532693788:secret:tst/jitsi-party/proxy-vars-9UVtXg | jq .SecretString | python3 -c 'import json,sys; [print(f"{k}={v}") for k, v in json.loads(json.load(sys.stdin)).items()]' | sudo tee -a .env > /dev/null

echo "PARTY_CONFIG=${config}" >> .env
echo "PARTY_THEME=${theme}" >> .env
echo "PROXY_LETSENCRYPT_ENABLED=1" >> .env
echo "PROXY_LETSENCRYPT_DOMAIN=${domain}" >> .env
echo "PROXY_LETSENCRYPT_EXTRA_DOMAINS=testing.${domain}" >> .env
echo "PROXY_AUTH_ENABLED=${auth_enabled}" >> .env
echo "PROXY_AUTH_CLIENT_ID=${auth_client_id}" >> .env
echo "PROXY_AUTH_CLIENT_SECRET=${auth_client_secret}" >> .env
echo "PROXY_AUTH_ALLOWED_GROUPS=${auth_allowed_groups}" >> .env
echo "PROXY_AUTH_DISCOVERY=${auth_discovery}" >> .env

set +e
i=0
ret=1
while [ $i -lt 60 ] && [ ! $ret -eq 0 ]; do
	echo "Starting..."
	sudo docker-compose up -d
	ret=$?
	let i++
	sleep 10
done
set -e

sudo docker-compose exec -T -e 'FLASK_ENV=production' -e 'FLASK_APP=manager.py' web-worker_1 flask create-db
