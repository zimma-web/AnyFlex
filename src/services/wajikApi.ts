const BASE_URL = 'http://localhost:3001';
const PROXY_BASE_URL = 'http://localhost:3001';

export async function searchAnime(query: string) {
  try {
    // Sanitize query by removing special characters except letters, numbers, spaces, and common punctuation
    const sanitizedQuery = query.replace(/[^a-zA-Z0-9\s.,'-]/g, '').trim().replace(/\s+/g, ' ');
    
    // Check if proxy server is running first
    const healthCheck = await fetch(`${BASE_URL}/health`).catch(() => null);
    if (!healthCheck || !healthCheck.ok) {
      throw new Error('Proxy server is not running. Please start the development server with "npm run dev"');
    }
    
    const res = await fetch(`${BASE_URL}/otakudesu/search?q=${encodeURIComponent(sanitizedQuery)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch anime search results from wajik-api: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('wajikApi searchAnime full response:', JSON.stringify(data, null, 2));
    
    // Try to find the array of anime in the response
    let animeList: any[] = [];
    if (Array.isArray(data)) {
      animeList = data;
    } else if (data && typeof data === 'object') {
      if (Array.isArray(data.animeList)) {
        animeList = data.animeList;
      } else if (data.data && typeof data.data === 'object') {
        // Try to find array inside data.data
        for (const key in data.data) {
          if (Array.isArray(data.data[key])) {
            animeList = data.data[key];
            break;
          }
        }
      }
    }
    
    if (!Array.isArray(animeList) || animeList.length === 0) {
      throw new Error('Unexpected response format or empty anime list from wajik-api searchAnime');
    }
    return animeList;
  } catch (error) {
    console.error('Error in searchAnime:', error);
    throw error;
  }
}

export async function getAnimeInfo(id: string) {
  try {
    // Check if proxy server is running first
    const healthCheck = await fetch(`${BASE_URL}/health`).catch(() => null);
    if (!healthCheck || !healthCheck.ok) {
      throw new Error('Proxy server is not running. Please start the development server with "npm run dev"');
    }
    
    const res = await fetch(`${BASE_URL}/otakudesu/anime/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch anime info from wajik-api: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error in getAnimeInfo:', error);
    throw error;
  }
}

export async function getEpisodeStream(episodeId: string) {
  try {
    // Check if proxy server is running first
    const healthCheck = await fetch(`${PROXY_BASE_URL}/health`).catch(() => null);
    if (!healthCheck || !healthCheck.ok) {
      throw new Error('Proxy server is not running. Please start the development server with "npm run dev"');
    }
    
    // Panggil endpoint episode untuk dapatkan detail episode termasuk serverId
    const episodeRes = await fetch(`${PROXY_BASE_URL}/otakudesu/episode/${episodeId}`);
    if (!episodeRes.ok) {
      const text = await episodeRes.text();
      throw new Error(`API wajik error (episode): ${episodeRes.status} - ${text}`);
    }
    const episodeData = await episodeRes.json();

    // Ambil serverId dari episodeData, misal episodeData.data.serverId
    const serverId = episodeData.data?.serverId;
    if (!serverId) {
      throw new Error('Server ID tidak ditemukan di data episode');
    }

    // Panggil endpoint server untuk dapatkan link streaming video
    const serverRes = await fetch(`${PROXY_BASE_URL}/otakudesu/server/${serverId}`);
    if (!serverRes.ok) {
      const text = await serverRes.text();
      throw new Error(`API wajik error (server): ${serverRes.status} - ${text}`);
    }
    const serverData = await serverRes.json();

    // Ambil URL streaming dari serverData, misal serverData.data.url
    const streamUrl = serverData.data?.url;
    if (!streamUrl) {
      throw new Error('URL streaming tidak ditemukan di data server');
    }

    return { url: streamUrl };
  } catch (error) {
    console.error('Error in getEpisodeStream:', error);
    throw error;
  }
}