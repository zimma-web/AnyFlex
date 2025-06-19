const BASE_URL = 'https://api.jikan.moe/v4';

// Rate limiting helper
let lastRequestTime = 0;
const REQUEST_DELAY = 2000; // 2000ms (2 seconds) between requests to comply with Jikan API rate limits

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const makeRequest = async (url: string) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < REQUEST_DELAY) {
    await delay(REQUEST_DELAY - timeSinceLastRequest);
  }
  
  lastRequestTime = Date.now();
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const jikanApi = {
  // Get popular anime (currently airing)
  getPopularAnime: async (page: number = 1) => {
    return makeRequest(`${BASE_URL}/anime?order_by=popularity&page=${page}&limit=24`);
  },

  // Get currently airing anime
  getAiringAnime: async () => {
    return makeRequest(`${BASE_URL}/anime?status=airing&order_by=popularity&limit=24`);
  },

  // Get top rated anime
  getTopAnime: async () => {
    return makeRequest(`${BASE_URL}/anime?order_by=score&sort=desc&limit=24`);
  },

  // Get anime by ID
  getAnimeById: async (id: number) => {
    return makeRequest(`${BASE_URL}/anime/${id}`);
  },

  // Search anime
  searchAnime: async (query: string) => {
    return makeRequest(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=24`);
  },

  // Get anime characters
  getAnimeCharacters: async (id: number) => {
    return makeRequest(`${BASE_URL}/anime/${id}/characters`);
  },

  // Get anime staff
  getAnimeStaff: async (id: number) => {
    return makeRequest(`${BASE_URL}/anime/${id}/staff`);
  },

  // Get anime episodes
  getAnimeEpisodes: async (id: number) => {
    return makeRequest(`${BASE_URL}/anime/${id}/episodes`);
  },

  // Get anime recommendations
  getAnimeRecommendations: async (id: number) => {
    return makeRequest(`${BASE_URL}/anime/${id}/recommendations`);
  }
};