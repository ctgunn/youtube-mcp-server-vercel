#!/bin/bash

# YouTube MCP Server - Vercel Deployment Setup Script
# This script helps you prepare and deploy your MCP server to Vercel

set -e

echo "🚀 YouTube MCP Server - Vercel Deployment Setup"
echo "=================================================="
echo ""

# Check for required tools
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Dependencies installed"
echo ""

# Build the project
echo "🔨 Building the project..."
npm run build

echo "✅ Project built successfully"
echo ""

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is ready"
echo ""

# Summary
echo "=================================================="
echo "✨ Setup complete! Next steps:"
echo ""
echo "1. Set your YouTube API key in Vercel:"
echo "   vercel env add YOUTUBE_API_KEY"
echo ""
echo "2. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "3. Test your deployment:"
echo "   curl https://your-url.vercel.app/api/health"
echo ""
echo "📚 For detailed instructions, see VERCEL_DEPLOYMENT.md"
echo "=================================================="
