# -------------------------
# Stage 1: Build Frontend
# -------------------------
FROM node:18-alpine AS builder

WORKDIR /FRAMES/frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies — ignore peer dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the code
COPY . .

# Build Vite project
RUN npm run build


# -------------------------
# Stage 2: Serve build via NGINX
# -------------------------
FROM nginx:stable-alpine

# Copy built files from builder stage
COPY --from=builder /FRAMES/frontend/dist /usr/share/nginx/html

# Remove default config and replace with custom one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
