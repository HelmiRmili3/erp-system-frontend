# --- Build stage ---
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Pass VITE_BASE_URL at build time (optional)
ARG VITE_BASE_URL
ENV VITE_BASE_URL=${VITE_BASE_URL}

# Build frontend
RUN npm run build

# --- Runtime stage ---
FROM nginx:alpine

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy config template
COPY --from=build /app/public/config.template.json /usr/share/nginx/html/config.template.json

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh


ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
