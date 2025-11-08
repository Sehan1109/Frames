# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /FRAMES/frontend

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

ARG VITE_API_BASE
ARG VITE_PAYHERE_MERCHANT_ID
ARG VITE_STRIPE_PUBLISHABLE_KEY  # <-- ADD THIS

ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_PAYHERE_MERCHANT_ID=$VITE_PAYHERE_MERCHANT_ID
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /FRAMES/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]