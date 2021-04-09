FROM jitsi/web:stable-5142-4

RUN \
	sed -i 's/".*"/"\/jitsi\/"/' /usr/share/jitsi-meet/base.html

COPY rootfs /
