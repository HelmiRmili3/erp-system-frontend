FROM node:18-bullseye-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm install sass-embedded sass-embedded-linux-musl-x64

RUN npm install

COPY . .

ENV VITE_BASE_URL=http://51.195.116.184:8080

RUN npm run build-only

FROM nginx:alpine AS production-stage

RUN apk add --no-cache gettext

# Copy build output from "build" stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy config template if needed
COPY public/config.template.json /usr/share/nginx/html/config.template.json

# Copy and enable your custom nginx config + entrypoint
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
