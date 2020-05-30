FROM jitsi/web:stable-5142-4

RUN \
	sed -i 's/".*"/"\/jitsi\/"/' /usr/share/jitsi-meet/base.html && \
	sed -i "s|config.bosh = '.*';|config.bosh = '/jitsi/http-bind';|" /defaults/system-config.js
