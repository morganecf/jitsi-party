# Stolen from https://github.com/khvzak/docker-openresty-s6

FROM alpine:3.13.4

# Docker Build Arguments
ARG FREP_VERSION=1.3.12
ARG S6_OVERLAY_VERSION="1.21.4.0"
ARG RESTY_VERSION="1.19.3.1"
ARG RESTY_OPENSSL_VERSION="1.1.1j"
ARG RESTY_PCRE_VERSION="8.42"
ARG RESTY_J="1"
ARG RESTY_CONFIG_OPTIONS="\
    --with-file-aio \
    --with-http_addition_module \
    --with-http_auth_request_module \
    --with-http_dav_module \
    --with-http_flv_module \
    --with-http_geoip_module=dynamic \
    --with-http_gunzip_module \
    --with-http_gzip_static_module \
    --with-http_image_filter_module=dynamic \
    --with-http_mp4_module \
    --with-http_random_index_module \
    --with-http_realip_module \
    --with-http_secure_link_module \
    --with-http_slice_module \
    --with-http_ssl_module \
    --with-http_stub_status_module \
    --with-http_sub_module \
    --with-http_v2_module \
    --with-http_xslt_module=dynamic \
    --with-ipv6 \
    --with-mail \
    --with-mail_ssl_module \
    --with-md5-asm \
    --with-pcre-jit \
    --with-sha1-asm \
    --with-stream \
    --with-stream_ssl_module \
    --with-threads \
    "
ARG RESTY_CONFIG_OPTIONS_MORE=""

# These are not intended to be user-specified
ARG _RESTY_CONFIG_DEPS="--with-openssl=/tmp/openssl-${RESTY_OPENSSL_VERSION} --with-pcre=/tmp/pcre-${RESTY_PCRE_VERSION}"


# 1) Install apk dependencies
# 2) Download and untar OpenSSL, PCRE, and OpenResty
# 3) Build OpenResty
# 4) Cleanup

ENV S6_KEEP_ENV=1


RUN apk add --no-cache --virtual .build-deps \
        build-base \
        curl \
        gd-dev \
        geoip-dev \
        libxslt-dev \
        libffi-dev \
        linux-headers \
        make \
        perl-dev \
        python3-dev \
        readline-dev \
        zlib-dev \
    && apk add --no-cache \
        gd \
        libgcc \
        libxslt \
        zlib \
        perl \
        python3 \
        py3-cryptography \
        py3-pip \
    && curl -L -s https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-amd64.tar.gz | tar xvzf - -C / \
    && curl -L -s https://github.com/subchen/frep/releases/download/v$FREP_VERSION/frep-$FREP_VERSION-linux-amd64 > /usr/bin/frep \
    && chmod +x /usr/bin/frep \
    && pip3 install -U pip \
    && pip3 install -U \
        certbot \
        certbot-dns-route53 \
    && cd /tmp \
    && curl -fSL https://www.openssl.org/source/openssl-${RESTY_OPENSSL_VERSION}.tar.gz -o openssl-${RESTY_OPENSSL_VERSION}.tar.gz \
    && tar xzf openssl-${RESTY_OPENSSL_VERSION}.tar.gz \
    && curl -fSL https://ftp.pcre.org/pub/pcre/pcre-${RESTY_PCRE_VERSION}.tar.gz -o pcre-${RESTY_PCRE_VERSION}.tar.gz \
    && tar xzf pcre-${RESTY_PCRE_VERSION}.tar.gz \
    && curl -fSL https://openresty.org/download/openresty-${RESTY_VERSION}.tar.gz -o openresty-${RESTY_VERSION}.tar.gz \
    && tar xzf openresty-${RESTY_VERSION}.tar.gz \
    && cd /tmp/openresty-${RESTY_VERSION} \
    && ./configure -j${RESTY_J} ${_RESTY_CONFIG_DEPS} ${RESTY_CONFIG_OPTIONS} ${RESTY_CONFIG_OPTIONS_MORE} \
    && make -j${RESTY_J} \
    && make -j${RESTY_J} install \
    && cd /tmp \
    && rm -rf \
       openssl-${RESTY_OPENSSL_VERSION} \
       openssl-${RESTY_OPENSSL_VERSION}.tar.gz \
       openresty-${RESTY_VERSION}.tar.gz openresty-${RESTY_VERSION} \
       pcre-${RESTY_PCRE_VERSION}.tar.gz pcre-${RESTY_PCRE_VERSION}

# Add additional binaries into PATH for convenience
ENV PATH=$PATH:/usr/local/openresty/luajit/bin:/usr/local/openresty/nginx/sbin:/usr/local/openresty/bin

RUN opm install zmartzone/lua-resty-openidc \
    && apk del .build-deps \
    && ln -sf /dev/stdout /usr/local/openresty/nginx/logs/access.log \
    && ln -sf /dev/stderr /usr/local/openresty/nginx/logs/error.log \
    && rm -rf /var/cache/apk/*

RUN apk add --no-cache bash openssl

COPY rootfs /

ENTRYPOINT ["/init"]
CMD []
