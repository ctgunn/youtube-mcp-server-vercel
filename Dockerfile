# Stage 1: Build
FROM node:22-slim AS builder
WORKDIR /usr/src/app

# Copy package files and install ALL dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy source and build the application
COPY . .
RUN npm run build

# Stage 2: Production Runtime
FROM node:22-slim
WORKDIR /usr/src/app

# Copy only the package files
COPY package*.json ./

# Install only production dependencies to keep the image small
RUN npm install --omit=dev

# Copy the compiled JS from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
# Copy other necessary source files if your app needs them at runtime
# (e.g., if you have any static assets or non-TS files in 'src')
COPY --from=builder /usr/src/app/src ./src 

# Set execution environment
ENV PORT=8080
EXPOSE 8080

# Run the app
CMD ["node", "dist/index.js"]
