# Deploying YouTube MCP Server to Vercel

This guide explains how to deploy your YouTube MCP Server as a serverless application on Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **YouTube API Key**: Get from [Google Cloud Console](https://console.cloud.google.com/)

## Setup Steps

### Step 1: Prepare Your Environment

The project has been updated with Vercel-specific configuration:

- **`api/sse.ts`** - Serverless function for SSE-based MCP communication
- **`api/health.ts`** - Health check endpoint
- **`vercel.json`** - Vercel deployment configuration
- **`.vercelignore`** - Files to ignore during deployment

### Step 2: Update Dependencies

Your `package.json` has been updated with `@vercel/node` for serverless runtime support.

Install dependencies locally:
```bash
npm install
```

### Step 3: Set Environment Variables in Vercel

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:

| Variable | Value | Notes |
|----------|-------|-------|
| `YOUTUBE_API_KEY` | `your-api-key-here` | Required. Get from Google Cloud Console |

### Step 4: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project root
vercel

# For production deployment
vercel --prod
```

#### Option B: Using GitHub Integration

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select your GitHub repository
3. Configure project settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables
5. Deploy

## Architecture

The deployment transforms your stdio-based MCP server into a serverless HTTP-based service:

### Original Architecture
```
CLI → StdioServerTransport → MCP Server
```

### Vercel Architecture
```
HTTP Client → Vercel Function (api/sse.ts) → ServerSSETransport → MCP Server
```

## Endpoints

### Health Check
```
GET /api/health
```

Returns:
```json
{
  "status": "ok",
  "service": "YouTube MCP Server",
  "version": "1.0.0",
  "timestamp": "2025-02-21T..."
}
```

### MCP Server (SSE)
```
GET /api/sse
```

Server-Sent Events endpoint for MCP protocol communication.

## Configuration Details

### `vercel.json` Configuration

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": {
    "api/sse.ts": {
      "runtime": "nodejs20.x",
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

- **runtime**: Node.js 20.x runtime
- **memory**: 1024MB allocated per function
- **maxDuration**: 60 seconds execution timeout

### Suggested Updates for Production

For production workloads, consider:

1. **Increase Timeout** (if needed):
   ```json
   "maxDuration": 120
   ```

2. **Increase Memory** (for large operations):
   ```json
   "memory": 3008
   ```

3. **Add Regions** (for low latency):
   ```json
   "regions": ["iad1", "sfo1", "lhr1"]
   ```

## Usage

### Via Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "youtube": {
      "url": "http://localhost:3000/api/sse",
      "env": {
        "YOUTUBE_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Via Direct HTTP Client

```bash
curl https://your-vercel-url.vercel.app/api/health
```

## Features Available

Once deployed, you'll have access to:

- **Video Information**: Get video details, search, statistics
- **Transcripts**: Retrieve and search video transcripts
- **Channels**: Get channel information and videos
- **Playlists**: List and manage playlist items

## Monitoring

### Vercel Dashboard

1. Monitor deployment at [vercel.com/dashboard](https://vercel.com/dashboard)
2. Check function logs in **Functions** section
3. View analytics and performance metrics

### Local Development

For local testing before deployment:

```bash
# Build the project
npm run build

# Test with Vercel CLI
vercel dev
```

## Troubleshooting

### YOUTUBE_API_KEY not found

**Error**: `YOUTUBE_API_KEY environment variable is required`

**Solution**: 
1. Add environment variable in Vercel dashboard
2. Redeploy the project
3. Verify variable is set: `vercel env list`

### Function timeout

**Error**: `504 Gateway Timeout`

**Solution**:
1. Increase `maxDuration` in `vercel.json`
2. Optimize function performance
3. Consider using Vercel Pro for longer timeouts

### Build fails with module errors

**Solution**:
1. Clear build cache: `vercel --prod --force`
2. Check `tsconfig.json` includes are correct
3. Verify all dependencies are in `package.json`

## Performance Notes

- **Cold starts**: ~500ms on first invocation
- **Warm starts**: ~50ms for subsequent calls
- **Memory**: 1GB default, scalable to 3GB
- **Execution time**: 60 seconds per request (upgradable to 900s with Pro)

## Cost Considerations

Vercel's free tier includes:
- 100 GB-hours of function execution monthly
- Automatic scaling
- No setup fees

See [Vercel Pricing](https://vercel.com/pricing) for details.

## Next Steps

1. Deploy your code to Vercel
2. Test health endpoint: `https://your-url.vercel.app/api/health`
3. Configure Claude Desktop or your client to use the Vercel endpoint
4. Start using your YouTube MCP tools!

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MCP Protocol Guide](https://modelcontextprotocol.io)
- [YouTube API Documentation](https://developers.google.com/youtube/v3)
