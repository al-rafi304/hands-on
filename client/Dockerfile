# Use Node.js for development
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port for Vite (default is 5173)
EXPOSE 5173

# Run the dev server
CMD ["npm", "run", "dev", "--", "--host"]
