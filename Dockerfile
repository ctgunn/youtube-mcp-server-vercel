# Use a modern, stable Node.js version (LTS is best)
FROM node:22-slim

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package files for caching
COPY package*.json ./

# Install production dependencies
# Using --omit=dev keeps the image small
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Cloud Run sets the PORT environment variable (usually 8080)
# Ensure your app listens on 0.0.0.0 (not 127.0.0.1)
ENV PORT=8080

# Start the server
# Use the compiled entry point from your 'dist' folder
CMD ["node", "dist/index.js"]
