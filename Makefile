# Generate the proto schema for config files
.PHONY: schema
schema:
	protoc -I=app/config/schema --python_out=app/jitsi/schema app/config/schema/*.proto

.PHONY: clean-schema
clean-schema:
	rm -rf app/jitsi/schema/*pb2.py

.env:
	$(shell \
		cp env.template.sh .env; \
		./gen-passwords.sh; \
		TZ=$$(readlink /etc/localtime | grep -oE '[a-zA-Z_]+/[a-zA-Z_]+$$'); \
		perl -pi -e "s#TZ=.*#TZ=$${TZ}#g" .env \
	)

env: .env

.PHONY: clean-env
clean-env:
	rm -rf .env

.PHONY: npm-update
npm-update:
	docker-compose build node
	docker-compose run node cp /build/package-lock.json /app/client/package-lock.json

theme = app/client/styles/themes/_active.scss
$(theme):
	app/set_theme.sh basic

.PHONY: clean-theme
clean-theme:
	rm -rf $(theme)

js = app/client/js
webpack-files := $(js)/bundle.js $(js)/bundle.js.map
$(webpack-files)&: env schema $(theme)
	docker-compose pull node
	docker-compose run node /node_modules/.bin/webpack

.PHONY: webpack
webpack: $(webpack-files)

.PHONY: clean-webpack
clean-webpack:
	rm -rf $(webpack-files)

.PHONY: up
up: webpack env schema
	docker-compose pull
	docker-compose up -d

.PHONY: restart
restart:
	docker-compose restart

.PHONY: db
db:
	docker-compose exec -e 'FLASK_ENV=production' -e 'FLASK_APP=manager.py' web-worker_1 flask create-db

.PHONY: chat
chat:
	docker-compose exec prosody profanity -a guest

.PHONY: clean-docker
clean-docker:
	docker-compose stop
	docker-compose rm -f

.PHONY: clean-config
clean-config:
	rm -f app/config/overrides

.PHONY: clean
clean: env clean-docker clean-env clean-config clean-schema clean-theme clean-webpack

