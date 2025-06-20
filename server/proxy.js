import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Proxy server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    statusCode: 200,
    statusMessage: 'OK',
    message: 'Anime API Proxy Server',
    ok: true,
    endpoints: [
      '/otakudesu/search?q=query',
      '/otakudesu/anime/:id',
      '/otakudesu/episode/:id',
      '/otakudesu/server/:id'
    ]
  });
});

// Mock API endpoints for otakudesu
app.get('/otakudesu/search', async (req, res) => {
  try {
    const query = req.query.q;
    console.log('Search query:', query);
    
    // Mock search response that matches the expected format
    const mockSearchResults = [
      {
        title: query || 'Sample Anime',
        poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
        episodes: 12,
        releaseDay: 'Friday',
        latestReleaseDate: '01 Jan',
        animeId: 'sample-anime-id',
        href: '/otakudesu/anime/sample-anime-id/',
        otakudesuUrl: 'https://otakudesu.cloud/anime/sample-anime-id/'
      },
      {
        title: `${query} Season 2` || 'Sample Anime Season 2',
        poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
        episodes: 24,
        releaseDay: 'Saturday',
        latestReleaseDate: '15 Jan',
        animeId: 'sample-anime-s2-id',
        href: '/otakudesu/anime/sample-anime-s2-id/',
        otakudesuUrl: 'https://otakudesu.cloud/anime/sample-anime-s2-id/'
      }
    ];
    
    res.json(mockSearchResults);
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
        synopsis: 'This is a sample anime description for testing purposes. Follow the adventures of our heroes as they embark on an epic journey.',
        status: 'Completed',
        episodes: Array.from({ length: 12 }, (_, i) => ({
          id: `episode-${i + 1}`,
          episodeId: `ep-${animeId}-${i + 1}`,
          title: `Episode ${i + 1}`,
          number: i + 1,
          href: `/otakudesu/episode/ep-${animeId}-${i + 1}/`
        })),
        genres: ['Action', 'Adventure', 'Drama'],
        score: 8.5,
        mal_id: parseInt(animeId) || 1,
        images: {
          jpg: {
            image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
            large_image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=900&fit=crop'
          }
        }
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
          { id: `server-${episodeId}`, name: 'Server 1', quality: '720p' },
          { id: `server-${episodeId}-hd`, name: 'Server 2', quality: '1080p' }
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
        server: serverId,
        type: 'mp4'
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

// Additional endpoints for other sources (samehadaku)
app.get('/samehadaku/search', async (req, res) => {
  try {
    const query = req.query.q;
    console.log('Samehadaku search query:', query);
    
    const mockResults = [
      {
        title: query || 'Sample Anime from Samehadaku',
        poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
        animeId: 'samehadaku-sample-id',
        href: '/samehadaku/anime/samehadaku-sample-id/'
      }
    ];
    
    res.json(mockResults);
  } catch (error) {
    console.error('Samehadaku search error:', error);
    res.status(500).json({
      statusCode: 500,
      statusMessage: 'Error',
      message: 'Samehadaku search failed',
      ok: false,
      error: error.message
    });
  }
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    statusCode: 404,
    statusMessage: 'Not Found',
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    ok: false,
    availableEndpoints: [
      'GET /health',
      'GET /',
      'GET /otakudesu/search?q=query',
      'GET /otakudesu/anime/:id',
      'GET /otakudesu/episode/:id',
      'GET /otakudesu/server/:id',
      'GET /samehadaku/search?q=query'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    message: 'An unexpected error occurred',
    ok: false,
    error: error.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log('📡 Ready to handle anime API requests');
  console.log('🔍 Available endpoints:');
  console.log('  - GET /health');
  console.log('  - GET /otakudesu/search?q=query');
  console.log('  - GET /otakudesu/anime/:id');
  console.log('  - GET /otakudesu/episode/:id');
  console.log('  - GET /otakudesu/server/:id');
});