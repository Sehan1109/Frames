# Stage 1: Build - Install dependencies
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /FRAMES/backend

# Copy package files first
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# ---

# Stage 2: Production - Create the final image
FROM node:18-alpine

WORKDIR /FRAMES/backend

# Copy the installed dependencies from builder stage
COPY --from=builder /FRAMES/backend/node_modules ./node_modules

# Copy the rest of your code
COPY . .

# Create uploads folder
RUN mkdir -p /FRAMES/backend/uploads

ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]
