# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first so they're cached unless package*.json changes
COPY package*.json ./
RUN npm install

# Copy the rest of the source and build the production bundle
COPY . .
RUN npm run build

# ---- Serve stage ----
FROM nginx:1.27-alpine AS serve

# Custom config: SPA fallback to index.html + gzip for the JS/CSS bundles
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
