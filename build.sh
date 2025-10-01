#!/bin/bash

# Build script for Vercel deployment
echo "Installing dependencies..."

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install

# Build the React app
echo "Building React app..."
npm run build

echo "Build completed successfully!"
