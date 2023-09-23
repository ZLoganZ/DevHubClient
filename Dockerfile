FROM node:20-alpine

# Add your application files to the image
COPY . /app

# Set the working directory to the app directory
WORKDIR /app

# Install dependencies
RUN npm install

# Start the application
CMD ["npm","run","dev"]

