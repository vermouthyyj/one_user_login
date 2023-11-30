# Stage 1: Build the Node.js application
FROM node:21 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build TypeScript code
RUN npm run build

# Stage 2: Use a smaller image for the final container
FROM node:21-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only necessary files from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# Expose the port that the app will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

# Stage 3: Add MongoDB
FROM mongo:latest