FROM nginx:1.18.0-alpine

RUN apk add --update openssl && \
    rm -rf /var/cache/apk/*

RUN openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \
    -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=localhost" \
    -keyout /etc/ssl/private/localhost.key -out /etc/ssl/certs/localhost.crt

ADD proxy.conf /etc/nginx/proxy.conf
ADD ssl.conf /etc/nginx/ssl.conf
ADD site.conf /etc/nginx/conf.d/default.conf
