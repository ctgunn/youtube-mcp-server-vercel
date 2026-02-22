# ... (Keep Stage 1: Build as is) ...

# Stage 2: Production Runtime
FROM node:22-slim
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
RUN npm install --omit=dev

# Copy the ENTIRE dist folder from the builder
COPY --from=builder /usr/src/app/dist ./dist

# Set execution environment
ENV PORT=8080
ENV NODE_ENV=production

# The CRITICAL change: Point to the actual compiled file location
# Since your source is api/index.ts, tsc puts it in dist/api/index.js
CMD ["node", "dist/api/index.js"]
