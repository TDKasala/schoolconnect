#!/bin/bash

# SchoolConnect Deployment Script for Vercel

echo "🚀 Starting SchoolConnect deployment preparation..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run type checking
echo "🔍 Running TypeScript type checking..."
npx tsc --noEmit

# Run linting (if available)
if npm run lint --silent 2>/dev/null; then
    echo "🧹 Running ESLint..."
    npm run lint
fi

# Build the project
echo "🏗️ Building project for production..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output is in the 'dist' directory"
    
    # Display build size information
    echo "📊 Build size information:"
    du -sh dist/
    
    # List main files
    echo "📄 Main build files:"
    ls -la dist/
    
    echo ""
    echo "🎉 Ready for Vercel deployment!"
    echo "💡 Next steps:"
    echo "   1. Push your changes to GitHub"
    echo "   2. Connect your repository to Vercel"
    echo "   3. Deploy automatically or run 'vercel --prod'"
    
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
