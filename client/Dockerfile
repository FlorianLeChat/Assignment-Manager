# syntax=docker/dockerfile:1

# Use an customized image of Node.js
# https://hub.docker.com/_/node
FROM node:19-alpine

# Copy the website files to the container
COPY ./ /app

# Set the working directory to the client folder
WORKDIR /app/client

# Install the project dependencies
RUN npm install

# Expose the port 4200
EXPOSE 4200

# Run the website
CMD ["npx", "ng", "serve", "--host=0.0.0.0"]