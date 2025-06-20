const BASE_URL = 'http://localhost:3001';
const PROXY_BASE_URL = 'http://localhost:3001';

export async function searchAnime(query: string) {
  // Sanitize query by removing special characters except letters, numbers, spaces, and common punctuation
  const sanitizedQuery = query.replace(/[^a-zA-Z0-9\s.,'-]/g, '').trim().replace(/\s+/g, ' ');
  const res = await fetch(`${BASE_URL}/otakudesu/search?q=${encodeURIComponent(sanitizedQuery)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch anime search results from wajik-api: ${res.status}`);
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
}

export async function getAnimeInfo(id: string) {
  const res = await fetch(`${BASE_URL}/otakudesu/anime/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch anime info from wajik-api: ${res.status}`);
  }
  return res.json();
}

export async function getEpisodeStream(episodeId: string) {
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
}