# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Start Next.js in development mode with hot-reloading
CMD ["npm", "run", "dev"]