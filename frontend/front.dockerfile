FROM node:18-alpine AS builder

WORKDIR /FRAMES/frontend

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

ARG VITE_API_BASE
ARG VITE_PAYHERE_MERCHANT_ID
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_PAYHERE_MERCHANT_ID=$VITE_PAYHERE_MERCHANT_ID

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine
RUN apk add --no-cache bash gettext

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /FRAMES/frontend/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
