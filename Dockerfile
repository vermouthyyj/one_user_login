# Stage 1: Build the Node.js application
FROM node:21-alpine AS development

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json .

# Install dependencies
RUN npm install

# Install ts-node-dev globally
RUN npm install -g ts-node-dev

# Copy the rest of the application code to the container
COPY . .

# Build TypeScript code
RUN npm run build

# Stage 2: Use a smaller image for the final container
FROM node:21-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=development /app/dist ./dist

# Command to run the application
CMD ["nodemon", "dist/bin/server.js"]

# Stage 3: Add MongoDB
FROM mongo:latest