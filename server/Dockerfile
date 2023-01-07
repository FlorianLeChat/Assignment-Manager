# syntax=docker/dockerfile:1

# Use an customized image of Node.js
# https://hub.docker.com/_/node
FROM node:19-alpine

# Copy the website files to the container
COPY ./ /app

# Set the working directory to the server folder
WORKDIR /app/server

# Install the project dependencies
RUN npm install

# Expose the port 3001
EXPOSE 3001

# Run the website
CMD [ "node", "server.js" ]