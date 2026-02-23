import express, { Request, Response } from 'express';
import { Server } from '@modelcontextprotocol/sdk/server';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { VideoService } from '../src/services/video.js';
import { TranscriptService } from '../src/services/transcript.js';
import { PlaylistService } from '../src/services/playlist.js';
import { ChannelService } from '../src/services/channel.js';
import {
    VideoParams,
    SearchParams,
    TranscriptParams,
    ChannelParams,
    ChannelVideosParams,
    PlaylistParams,
    PlaylistItemsParams,
} from '../src/types.js';

const app = express();
app.use(express.json());

// 1. Create a Router to handle the '/api' prefix
const router = express.Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', key_configured: !!process.env.YOUTUBE_API_KEY });
});

// Check for required environment variables
if (!process.env.YOUTUBE_API_KEY) {
    console.error('Error: YOUTUBE_API_KEY environment variable is required.');
}

// let serverInstance: Server | null = null;
// let transport: SSEServerTransport | null = null;

const videoService = new VideoService();
const transcriptService = new TranscriptService();
const playlistService = new PlaylistService();
const channelService = new ChannelService();

async function createMcpServer(transport: StreamableHTTPServerTransport) {
    // if (serverInstance) {
    //     return serverInstance;
    // }

    const server = new Server(
        {
            name: 'youtube-mcp-server',
            version: '1.0.0',
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: 'videos_getVideo',
                    description: 'Get detailed information about a YouTube video',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            videoId: {
                                type: 'string',
                                description: 'The YouTube video ID',
                            },
                            parts: {
                                type: 'array',
                                description: 'Parts of the video to retrieve',
                                items: {
                                    type: 'string',
                                },
                            },
                        },
                        required: ['videoId'],
                    },
                },
                {
                    name: 'videos_searchVideos',
                    description: 'Search for videos on YouTube',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            query: {
                                type: 'string',
                                description: 'Search query',
                            },
                            maxResults: {
                                type: 'number',
                                description: 'Maximum number of results to return',
                            },
                        },
                        required: ['query'],
                    },
                },
                {
                    name: 'transcripts_getTranscript',
                    description: 'Get the transcript of a YouTube video',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            videoId: {
                                type: 'string',
                                description: 'The YouTube video ID',
                            },
                            language: {
                                type: 'string',
                                description: 'Language code for the transcript',
                            },
                        },
                        required: ['videoId'],
                    },
                },
                {
                    name: 'channels_getChannel',
                    description: 'Get information about a YouTube channel',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            channelId: {
                                type: 'string',
                                description: 'The YouTube channel ID',
                            },
                        },
                        required: ['channelId'],
                    },
                },
                {
                    name: 'channels_listVideos',
                    description: 'Get videos from a specific channel',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            channelId: {
                                type: 'string',
                                description: 'The YouTube channel ID',
                            },
                            maxResults: {
                                type: 'number',
                                description: 'Maximum number of results to return',
                            },
                        },
                        required: ['channelId'],
                    },
                },
                {
                    name: 'playlists_getPlaylist',
                    description: 'Get information about a YouTube playlist',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            playlistId: {
                                type: 'string',
                                description: 'The YouTube playlist ID',
                            },
                        },
                        required: ['playlistId'],
                    },
                },
                {
                    name: 'playlists_getPlaylistItems',
                    description: 'Get videos in a YouTube playlist',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            playlistId: {
                                type: 'string',
                                description: 'The YouTube playlist ID',
                            },
                            maxResults: {
                                type: 'number',
                                description: 'Maximum number of results to return',
                            },
                        },
                        required: ['playlistId'],
                    },
                },
            ],
        };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;

        try {
            switch (name) {
                case 'videos_getVideo': {
                    const result = await videoService.getVideo(args as unknown as VideoParams);
                    return {
                        content: [{
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }]
                    };
                }
                
                case 'videos_searchVideos': {
                    const result = await videoService.searchVideos(args as unknown as SearchParams);
                    return {
                        content: [{
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }]
                    };
                }
                
                case 'transcripts_getTranscript': {
                    const result = await transcriptService.getTranscript(args as unknown as TranscriptParams);
                    return {
                        content: [{
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }]
                    };
                }
                
                case 'channels_getChannel': {
                    const result = await channelService.getChannel(args as unknown as ChannelParams);
                    return {
                        content: [{
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }]
                    };
                }
                
                case 'channels_listVideos': {
                    const result = await channelService.listVideos(args as unknown as ChannelVideosParams);
                    return {
                        content: [{
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }]
                    };
                }
                
                case 'playlists_getPlaylist': {
                    const result = await playlistService.getPlaylist(args as unknown as PlaylistParams);
                    return {
                        content: [{
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }]
                    };
                }
                
                case 'playlists_getPlaylistItems': {
                    const result = await playlistService.getPlaylistItems(args as unknown as PlaylistItemsParams);
                    return {
                        content: [{
                            type: 'text',
                            text: JSON.stringify(result, null, 2)
                        }]
                    };
                }
                
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        } catch (error) {
            return {
                content: [{
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`
                }],
                isError: true
            };
        }
    });

    // 3. Connect the server to THIS request's transport
    await server.connect(transport);

    // serverInstance = server;
    
    return server;
}

// Unified MCP HTTP Endpoint
router.all('/mcp', async (req: Request, res: Response) => {
    // 1. CRITICAL: Set headers BEFORE any async work to prevent buffering
    res.setHeader('X-Accel-Buffering', 'no'); // Bypass Vercel/Cloud Run buffering
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    try {
        if (!process.env.YOUTUBE_API_KEY) {
            return res.status(500).json({ error: 'YOUTUBE_API_KEY is required' });
        }

        // 2. Initialize stateless transport
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined 
        });

        // 3. Register handlers (Ensure this is AWAITED)
        await createMcpServer(transport); 

        // 4. Handle the request
        // This method from the SDK handles the JSON-RPC handshake
        await transport.handleRequest(req, res);

        // 5. Ensure the response is closed if the SDK didn't end it
        if (!res.writableEnded) {
            res.end();
        }

    } catch (error) {
        console.error('MCP HTTP Transport Error:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : String(error)
            });
        }
    }
});


// This catches the absolute root of your domain (https://your-app.vercel.app)
app.get('/', (req: Request, res: Response) => {
    res.send('YouTube MCP Server is running. Access MCP at /api/mcp');
});

// Mount the router under the '/api' path
// This ensures Express matches Vercel's incoming '/api/...' request
app.use('/api', router);

// Fallback for the base /api route
app.get('/api', (req, res) => {
    res.send('YouTube MCP Server is running at /api/mcp');
});

// Get the port from environment variables, defaulting to 8080
// We convert it to a Number to satisfy TypeScript's strict typing
const port = Number(process.env.PORT) || 8080;

app.listen(port, '0.0.0.0', () => {
    console.log(`YouTube MCP Server listening on port ${port}`);
});

export default app;