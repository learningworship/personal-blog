const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Railway build process...');

try {
  // Step 1: Install root dependencies
  console.log('📦 Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Step 2: Install server dependencies
  console.log('📦 Installing server dependencies...');
  execSync('cd server && npm install', { stdio: 'inherit' });

  // Step 3: Install client dependencies
  console.log('📦 Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });

  // Step 4: Verify client structure
  console.log('🔍 Verifying client structure...');
  const clientPath = path.join(__dirname, 'client');
  const publicPath = path.join(clientPath, 'public');
  const indexHtmlPath = path.join(publicPath, 'index.html');
  
  console.log('📁 Client path:', clientPath);
  console.log('📁 Public path:', publicPath);
  console.log('📁 Index.html path:', indexHtmlPath);
  
  if (fs.existsSync(indexHtmlPath)) {
    console.log('✅ index.html found in client/public/');
  } else {
    console.log('❌ index.html not found in client/public/');
    console.log('📄 Public directory contents:');
    if (fs.existsSync(publicPath)) {
      const publicFiles = fs.readdirSync(publicPath);
      console.log(publicFiles);
    } else {
      console.log('Public directory does not exist');
    }
    throw new Error('index.html not found in client/public/');
  }

  // Step 5: Build React app
  console.log('🔨 Building React app...');
  execSync('cd client && npm run build', { stdio: 'inherit' });

  // Step 6: Verify build output
  const buildPath = path.join(__dirname, 'client', 'build');
  if (fs.existsSync(buildPath)) {
    console.log('✅ Build completed successfully!');
    console.log('📁 Build directory:', buildPath);
    
    // List build contents
    const files = fs.readdirSync(buildPath);
    console.log('📄 Build files:', files);
  } else {
    throw new Error('Build directory not found');
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
