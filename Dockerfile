FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production

# Command will be provided by deployment configuration
CMD ["node", "dist/index.js"] 