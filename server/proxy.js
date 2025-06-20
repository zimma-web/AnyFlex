import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Proxy server is running' });
});

// Proxy configuration for different anime sources
const proxyOptions = {
  target: 'https://otakudesu.cloud',
  changeOrigin: true,
  secure: true,
  followRedirects: true,
  timeout: 30000,
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({
      statusCode: 500,
      statusMessage: 'Proxy Error',
      message: 'Failed to fetch data from source',
      ok: false,
      error: err.message
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request: ${req.method} ${req.url}`);
    // Set proper headers
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
    proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.5');
    proxyReq.setHeader('Accept-Encoding', 'gzip, deflate');
    proxyReq.setHeader('Connection', 'keep-alive');
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Proxy response: ${proxyRes.statusCode} for ${req.url}`);
  }
};

// Mock API endpoints since we don't have the actual wajik-anime-api running
app.get('/otakudesu/search', async (req, res) => {
  try {
    const query = req.query.q;
    console.log('Search query:', query);
    
    // Mock search response
    const mockSearchResults = {
      statusCode: 200,
      statusMessage: 'OK',
      message: 'Search results',
      ok: true,
      data: {
        animeList: [
          {
            title: query || 'Sample Anime',
            poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
            episodes: 12,
            releaseDay: 'Friday',
            latestReleaseDate: '01 Jan',
            animeId: 'sample-anime-id',
            href: '/otakudesu/anime/sample-anime-id/',
            otakudesuUrl: 'https://otakudesu.cloud/anime/sample-anime-id/'
          }
        ]
      }
    };
    
    res.json(mockSearchResults.data.animeList);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      statusCode: 500,
      statusMessage: 'Error',
      message: 'Search failed',
      ok: false,
      error: error.message
    });
  }
});

app.get('/otakudesu/anime/:id', async (req, res) => {
  try {
    const animeId = req.params.id;
    console.log('Fetching anime info for ID:', animeId);
    
    // Mock anime info response
    const mockAnimeInfo = {
      statusCode: 200,
      statusMessage: 'OK',
      message: 'Anime info retrieved',
      ok: true,
      data: {
        title: 'Sample Anime',
        poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
        synopsis: 'This is a sample anime description for testing purposes.',
        status: 'Completed',
        episodes: Array.from({ length: 12 }, (_, i) => ({
          id: `episode-${i + 1}`,
          episodeId: `ep-${i + 1}`,
          title: `Episode ${i + 1}`,
          number: i + 1
        })),
        genres: ['Action', 'Adventure', 'Drama'],
        score: 8.5,
        mal_id: parseInt(animeId) || 1
      }
    };
    
    res.json(mockAnimeInfo);
  } catch (error) {
    console.error('Anime info error:', error);
    res.status(500).json({
      statusCode: 500,
      statusMessage: 'Error',
      message: 'Failed to fetch anime info',
      ok: false,
      error: error.message
    });
  }
});

app.get('/otakudesu/episode/:id', async (req, res) => {
  try {
    const episodeId = req.params.id;
    console.log('Fetching episode info for ID:', episodeId);
    
    // Mock episode response
    const mockEpisodeInfo = {
      statusCode: 200,
      statusMessage: 'OK',
      message: 'Episode info retrieved',
      ok: true,
      data: {
        title: `Episode ${episodeId}`,
        serverId: `server-${episodeId}`,
        servers: [
          { id: `server-${episodeId}`, name: 'Server 1' }
        ]
      }
    };
    
    res.json(mockEpisodeInfo);
  } catch (error) {
    console.error('Episode info error:', error);
    res.status(500).json({
      statusCode: 500,
      statusMessage: 'Error',
      message: 'Failed to fetch episode info',
      ok: false,
      error: error.message
    });
  }
});

app.get('/otakudesu/server/:id', async (req, res) => {
  try {
    const serverId = req.params.id;
    console.log('Fetching server info for ID:', serverId);
    
    // Mock server response with a sample video URL
    const mockServerInfo = {
      statusCode: 200,
      statusMessage: 'OK',
      message: 'Server info retrieved',
      ok: true,
      data: {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        quality: '720p',
        server: serverId
      }
    };
    
    res.json(mockServerInfo);
  } catch (error) {
    console.error('Server info error:', error);
    res.status(500).json({
      statusCode: 500,
      statusMessage: 'Error',
      message: 'Failed to fetch server info',
      ok: false,
      error: error.message
    });
  }
});

// Fallback for other routes
app.use('*', (req, res) => {
  res.status(404).json({
    statusCode: 404,
    statusMessage: 'Not Found',
    message: 'Endpoint not found',
    ok: false
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log('📡 Ready to handle anime API requests');
});