import { google, youtube_v3 } from 'googleapis';
import { VideoParams, SearchParams, TrendingParams, RelatedVideosParams } from '../types.js';

/**
 * Service for interacting with YouTube videos
 */
export class VideoService {
  private youtube!: youtube_v3.Youtube;
  private initialized = false;

  constructor() {
    // Don't initialize in constructor
  }

  /**
   * Initialize the YouTube client only when needed
   */
  private initialize() {
    if (this.initialized) return;
    
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error('YOUTUBE_API_KEY environment variable is not set.');
    }

    this.youtube = google.youtube({
      version: 'v3',
      auth: apiKey
    });
    
    this.initialized = true;
  }

  /**
   * Get detailed information about a YouTube video
   */
  async getVideo({ 
    videoId, 
    parts = ['snippet', 'contentDetails', 'statistics'] 
  }: VideoParams): Promise<any> {
    try {
      this.initialize();
      
      const response = await this.youtube.videos.list({
        part: parts,
        id: [videoId]
      });
      
      return response.data.items?.[0] || null;
    } catch (error) {
      throw new Error(`Failed to get video: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Search for videos on YouTube
   */
  async searchVideos({ 
    query, 
    maxResults = 10 
  }: SearchParams): Promise<any[]> {
    try {
      this.initialize();
      
      const response = await this.youtube.search.list({
        part: ['snippet'],
        q: query,
        maxResults,
        type: ['video']
      });
      
      return response.data.items || [];
    } catch (error) {
      throw new Error(`Failed to search videos: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get video statistics like views, likes, and comments
   */
  async getVideoStats({ 
    videoId 
  }: { videoId: string }): Promise<any> {
    try {
      this.initialize();
      
      const response = await this.youtube.videos.list({
        part: ['statistics'],
        id: [videoId]
      });
      
      return response.data.items?.[0]?.statistics || null;
    } catch (error) {
      throw new Error(`Failed to get video stats: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get trending videos
   */
  async getTrendingVideos({ 
    regionCode = 'US', 
    maxResults = 10,
    videoCategoryId = ''
  }: TrendingParams): Promise<any[]> {
    try {
      this.initialize();
      
      const params: any = {
        part: ['snippet', 'contentDetails', 'statistics'],
        chart: 'mostPopular',
        regionCode,
        maxResults
      };
      
      if (videoCategoryId) {
        params.videoCategoryId = videoCategoryId;
      }
      
      const response = await this.youtube.videos.list(params);
      
      return response.data.items || [];
    } catch (error) {
      throw new Error(`Failed to get trending videos: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get related videos for a specific video
   */
  async getRelatedVideos({ 
  videoId, 
  maxResults = 10 
  }: RelatedVideosParams): Promise<any[]> {
    try {
      this.initialize();
      
      // 1. Get the original video info to find "related" context
      const videoInfo = await this.youtube.videos.list({
        part: ['snippet'],
        id: [videoId]
      });

      const snippet = videoInfo.data.items?.[0]?.snippet;
      if (!snippet) throw new Error('Source video not found');

      // 2. Use the title or tags as a search query
      // We filter for 'video' and exclude the original videoId
      const response = await this.youtube.search.list({
        part: ['snippet'],
        q: snippet.title, // Use the title as the search context
        maxResults: maxResults + 1, // Get one extra in case the original shows up
        type: ['video']
      });
      
      // Filter out the original video if it appears in results
      return (response.data.items || []).filter(item => item.id?.videoId !== videoId).slice(0, maxResults);
      
    } catch (error) {
      throw new Error(`Failed to get similar videos: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

//   async getRelatedVideos({ 
//     videoId, 
//     maxResults = 10 
//   }: RelatedVideosParams): Promise<any[]> {
//     try {
//       this.initialize();
      
//       const response = await this.youtube.search.list({
//         part: ['snippet'],
//         relatedToVideoId: videoId,
//         maxResults,
//         type: ['video']
//       });
      
//       return response.data.items || [];
//     } catch (error) {
//       throw new Error(`Failed to get related videos: ${error instanceof Error ? error.message : String(error)}`);
//     }
//   }
}