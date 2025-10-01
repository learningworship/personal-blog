@echo off
echo Installing dependencies...

REM Install root dependencies
npm install

REM Install server dependencies
cd server
npm install
cd ..

REM Install client dependencies
cd client
npm install

REM Build the React app
echo Building React app...
npm run build

echo Build completed successfully!
