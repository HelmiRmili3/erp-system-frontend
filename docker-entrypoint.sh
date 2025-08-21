#!/bin/sh

# Substitute environment variables in the config template
envsubst '$VITE_BASE_URL' \
  < /usr/share/nginx/html/config.template.json \
  > /usr/share/nginx/html/config.json

echo "✅ Generated config.json with VITE_BASE_URL=$VITE_BASE_URL"

# Execute the CMD from the Dockerfile (nginx -g "daemon off;")
exec "$@"
