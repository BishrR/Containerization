# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy the application files
COPY app/package*.json ./
COPY app/ ./

# Install dependencies
RUN npm install

# Create the directory for video storage
RUN mkdir -p /data/videos

# Expose the port the app runs on
EXPOSE 3004

# Run the application
CMD ["node", "app.js"]
