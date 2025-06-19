const BASE_URL = 'https://aniyoi-api.vercel.app';
const PROXY_BASE_URL = 'https://wajik-anime-api-m4e8.onrender.com/anime/';

export async function searchAnime(query: string) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(query)}`);
  return res.json();
}

export async function getAnimeInfo(id: string) {
  const res = await fetch(`${BASE_URL}/info/${id}`);
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
