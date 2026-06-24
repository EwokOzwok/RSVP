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

# Alpine's bundled mime.types has no entry for .mjs files. Without this,
# nginx serves them as application/octet-stream, and browsers refuse to
# run them as a JS module — this is what breaks pdf.js's worker script
# (pdf.worker.min.mjs), causing "Setting up fake worker failed" errors.
RUN sed -i 's/application\/javascript[[:space:]]*js;/application\/javascript js mjs;/' /etc/nginx/mime.types

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]