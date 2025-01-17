# Stage 1: Build the React app
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the project
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the React app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Start the app
CMD ["nginx", "-g", "daemon off;"]
