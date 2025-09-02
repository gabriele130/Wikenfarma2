#!/bin/bash

# Build script per WikenFarma - Separazione Frontend/Backend

echo "🔧 Building WikenFarma for production..."

# 1. Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

# 2. Build frontend (React/Vite)
echo "🏗️ Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

# 3. Return to root and build backend
cd ..
echo "🏗️ Building backend..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Frontend assets: dist/public/"
echo "📁 Backend server: dist/index.js"
echo "🚀 Ready for deployment on wikenship.it"