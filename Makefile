# Generate the proto schema for config files
.PHONY: schema
schema:
	protoc -I=app/config/schema --python_out=app/jitsi/schema app/config/schema/*.proto

.PHONY: clean-schema
clean-schema:
	rm -rf app/jitsi/schema/*pb2.py

.env:
	cp env.template.sh .env

passwords: .env
	./gen-passwords.sh

.PHONY: timezone
timezone: .env
	$(shell \
		TZ=$$(readlink /etc/localtime | grep -oE '[a-zA-Z_]+/[a-zA-Z_]+$$'); \
		sed -i "" -e "s#TZ=.*#TZ=$${TZ}#g" .env \
	)

.PHONY: config
config: passwords timezone

.PHONY: clean-config
clean-config:
	rm -rf .env

app/client/node_modules:
	docker-compose run node npm install

.PHONY: clean-node
clean-node:
	rm -rf app/client/node_modules

theme = app/client/styles/themes/default/_active.scss
$(theme):
	app/set_theme.sh basic

.PHONY: clean-theme
clean-theme:
	rm -rf $(theme)

js = app/client/js
webpack-files := $(js)/bundle.js $(js)/bundle.js.map
$(webpack-files)&: config app/client/node_modules schema $(theme)
	docker-compose run node node_modules/.bin/webpack

.PHONY: webpack
webpack: $(webpack-files)

.PHONY: clean-webpack
clean-webpack:
	rm -rf $(webpack-files)

.PHONY: up
up: webpack config schema
	docker-compose up -d

.PHONY: restart
restart:
	docker-compose restart

.PHONY: db
db:
	docker-compose exec -e 'FLASK_ENV=production' -e 'FLASK_APP=manager.py' web-worker_1 flask create-db

.PHONY: clean-docker
clean-docker:
	docker-compose stop
	docker-compose rm -f

.PHONY: clean
clean: config clean-docker clean-config clean-schema clean-theme clean-webpack

.PHONY: clean-all
clean-all: clean clean-node

