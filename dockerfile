# Use an official Node image
FROM node:22-alpine

RUN apk add --no-cache ffmpeg

# Create app directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the project
COPY . .

# Build (only if your project has a build step)
# RUN npm run build

# Expose the application's port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]