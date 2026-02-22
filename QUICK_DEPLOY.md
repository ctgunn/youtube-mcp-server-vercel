# Quick Deploy Guide - YouTube MCP Server on Vercel

## ⚡ 5-Minute Deployment

### Prerequisites
- GitHub account with repository pushed
- Vercel account (free tier available)
- YouTube API Key from Google Cloud Console

### Option 1: GitHub Integration (Easiest)

1. **Go to Vercel Dashboard**
   ```
   https://vercel.com/new
   ```

2. **Select Your Repository**
   - Click "Import Project"
   - Find `youtube-mcp-server`
   - Click "Import"

3. **Configure Project**
   - Framework: `Other`
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `dist` (auto-filled)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Name: `YOUTUBE_API_KEY`
   - Value: `your-youtube-api-key`
   - Click "Save"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your live URL!

### Option 2: Using Vercel CLI

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. From project root, run:
vercel

# 3. Follow the prompts to link to your GitHub repo

# 4. Add environment variable
vercel env add YOUTUBE_API_KEY
# Enter your YouTube API key when prompted

# 5. Deploy to production
vercel --prod

# 6. View your URL
vercel ls
```

### Option 3: Using Deploy Script

```bash
# Run automated setup
./scripts/deploy-vercel.sh

# Then deploy
vercel --prod
```

## ✅ Verify Deployment

Test your live server:

```bash
# Replace with your Vercel URL
curl https://your-project.vercel.app/api/health

# Expected response:
# {
#   "status": "ok",
#   "service": "YouTube MCP Server",
#   "version": "1.0.0",
#   "timestamp": "2025-02-21T..."
# }
```

## 🔧 What's Been Set Up

| Component | Details |
|-----------|---------|
| **Serverless Runtime** | Node.js 20.x |
| **Function Timeout** | 60 seconds |
| **Memory Allocated** | 1024 MB |
| **Endpoints** | `/api/health`, `/api/sse` |
| **Environment** | YOUTUBE_API_KEY (required) |

## 📱 Use with Claude Desktop

Update your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "youtube": {
      "url": "https://your-project.vercel.app/api/sse",
      "env": {
        "YOUTUBE_API_KEY": "your-api-key"
      }
    }
  }
}
```

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| **API key error** | Add YOUTUBE_API_KEY in Vercel dashboard, then redeploy |
| **404 on health check** | Wait 3-5 minutes after deployment, build may still be processing |
| **Build fails** | Clear cache: `vercel --prod --force` |

## 📊 Monitoring

After deployment:

1. **View Logs**
   ```bash
   vercel logs your-project-name
   ```

2. **Check Dashboard**
   - Go to https://vercel.com/dashboard
   - Select your project
   - View Functions, Analytics, and Logs

## 📈 Scaling

Free tier includes:
- ✅ 100 GB-hours of function execution monthly
- ✅ Unlimited HTTPS requests
- ✅ Auto-scaling
- ✅ Free custom domains

For higher limits, consider Vercel Pro ($20/month).

## 🔐 Security Notes

- ✅ API keys stored in Vercel environment variables (not in code)
- ✅ HTTPS enabled by default
- ✅ CORS headers configured
- ✅ No sensitive data in logs

## 📚 Next Steps

1. ✅ Deploy your project
2. ✅ Test the health endpoint
3. ✅ Configure Claude Desktop
4. ✅ Start using your YouTube MCP tools!

Need detailed help? See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

---

**Status**: 🚀 Ready to Deploy!
