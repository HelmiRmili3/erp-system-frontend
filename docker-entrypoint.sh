#!/bin/sh

# Substitute environment variables in the config template
envsubst '\
  $VITE_BASE_URL' \
  </usr/share/nginx/html/config.template.json >/usr/share/nginx/html/config.json
# Execute the CMD from the Dockerfile
exec "$@"
