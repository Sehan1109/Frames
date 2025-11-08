#!/bin/sh
set -e

# Replace $PORT in Nginx config
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start Nginx in foreground
nginx -g 'daemon off;'
