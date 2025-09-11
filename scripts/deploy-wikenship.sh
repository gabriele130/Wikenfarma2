#!/bin/bash

# WikenFarma Deployment Script per ScalaHosting
# Uso: ./scripts/deploy-wikenship.sh

set -e

echo "🚀 Deploying WikenFarma to wikenship.it..."

# 1. Verifica environment variables
echo "🔐 Checking environment variables..."
REQUIRED_VARS=("DATABASE_URL" "SESSION_SECRET" "GESTLINE_API_URL" "GESTLINE_API_USERNAME" "GESTLINE_API_PASSWORD")

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required environment variable: $var"
        exit 1
    fi
done

# 2. Clean build
echo "🧹 Cleaning previous build..."
rm -rf dist/
rm -rf client/dist/

# 3. Install dependencies
echo "📦 Installing dependencies..."
npm install --production=false

# 4. Build application
echo "🔨 Building application..."
npm run build

# 5. Verifica build output
if [ ! -f "dist/index.js" ]; then
    echo "❌ Build failed - dist/index.js not found"
    exit 1
fi

if [ ! -f "dist/public/index.html" ]; then
    echo "❌ Build failed - dist/public/index.html not found"
    exit 1
fi

# 6. Test configuration
echo "🧪 Testing server configuration..."
NODE_ENV=production node -e "
const config = {
  port: process.env.PORT || 3100,
  host: '0.0.0.0',
  cors: 'https://wikenship.it',
  database: process.env.DATABASE_URL ? '✅' : '❌',
  gestline: process.env.GESTLINE_API_URL ? '✅' : '❌'
};
console.log('Configuration:', JSON.stringify(config, null, 2));
"

# 7. Create production start script
echo "📝 Creating production start script..."
cat > start-production.sh << 'EOF'
#!/bin/bash
export NODE_ENV=production
export PORT=3100
export HOST=0.0.0.0

echo "🚀 Starting WikenFarma production server..."
echo "📡 Server will be available at: https://wikenship.it:3100"
echo "🗄️ Database: $DATABASE_URL"
echo "🔗 GestLine API: $GESTLINE_API_URL"

# Start with automatic restart on crash
while true; do
    node dist/index.js
    echo "💥 Server crashed, restarting in 5 seconds..."
    sleep 5
done
EOF

chmod +x start-production.sh

echo "✅ Deployment ready!"
echo ""
echo "📋 Next steps on your ScalaHosting server:"
echo "1. Upload files to wikenship.it"
echo "2. Run: chmod +x start-production.sh"
echo "3. Run: ./start-production.sh"
echo "4. Or with PM2: pm2 start dist/index.js --name wikenfarma"
echo ""
echo "🔍 Troubleshooting:"
echo "- Check logs: tail -f ~/logs/wikenfarma.log"
echo "- Check process: ps aux | grep node"
echo "- Check port: netstat -tlnp | grep 3100"