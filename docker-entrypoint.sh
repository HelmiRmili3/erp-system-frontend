#!/bin/sh

# Substitute environment variables in the config template
envsubst '$VITE_BASE_URL' \
  < /app/dist/config.template.json \
  > /app/dist/config.json

echo "✅ Generated config.json with VITE_BASE_URL=$VITE_BASE_URL"

# Execute the CMD from the Dockerfile (nginx -g "daemon off;")
exec "$@"