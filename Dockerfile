# Use a Node image as the base
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy app source code
COPY . ./

# Build the app for production
# RUN npm run build

# Serve the app using Vite
CMD ["npm", "run", "dev"]