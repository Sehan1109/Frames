# Stage 1: Build the Vite app
FROM node:18-alpine AS builder

WORKDIR /FRAMES/frontend

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Build-time env vars (optional, for local dev)
ARG VITE_API_BASE
ARG VITE_PAYHERE_MERCHANT_ID

ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_PAYHERE_MERCHANT_ID=$VITE_PAYHERE_MERCHANT_ID

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine

# Install envsubst to replace variables at runtime
RUN apk add --no-cache bash gettext

# Remove default html
RUN rm -rf /usr/share/nginx/html/*

# Copy built files
COPY --from=builder /FRAMES/frontend/dist /usr/share/nginx/html

# Use a template Nginx config
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Replace env vars in index.html and Nginx config at runtime
CMD envsubst '\$VITE_API_BASE \$VITE_PAYHERE_MERCHANT_ID \$VITE_STRIPE_PUBLISHABLE_KEY' \
    < /usr/share/nginx/html/index.html \
    > /usr/share/nginx/html/index.html.tmp && \
    mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html && \
    envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && \
    nginx -g 'daemon off;'
