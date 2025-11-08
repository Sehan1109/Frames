# Stage 1: Build the Vite app
FROM node:18-alpine AS builder

WORKDIR /FRAMES/frontend

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Optional build-time args (for local testing)
ARG VITE_API_BASE
ARG VITE_PAYHERE_MERCHANT_ID
ARG VITE_STRIPE_PUBLISHABLE_KEY

ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_PAYHERE_MERCHANT_ID=$VITE_PAYHERE_MERCHANT_ID
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

# Build the frontend
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine

# Install envsubst for runtime env replacement
RUN apk add --no-cache bash gettext

# Remove default Nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend
COPY --from=builder /FRAMES/frontend/dist /usr/share/nginx/html

# Copy template Nginx config
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Replace env vars in index.html and Nginx at runtime
CMD envsubst '\$VITE_API_BASE \$VITE_PAYHERE_MERCHANT_ID \$VITE_STRIPE_PUBLISHABLE_KEY' \
    < /usr/share/nginx/html/index.html \
    > /usr/share/nginx/html/index.html.tmp && \
    mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html && \
    envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && \
    nginx -g 'daemon off;'
