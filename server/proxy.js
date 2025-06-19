import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());

app.get('/proxy/anime/watch/:episodeId', async (req, res) => {
  const { episodeId } = req.params;
  try {
    const response = await fetch(`https://api.consumet.org/anime/watch/${episodeId}`);
    if (!response.ok) {
      const text = await response.text();
      console.error('Consumet API error:', response.status, text);
      return res.status(response.status).json({ error: `Consumet API error: ${response.status}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch from consumet API' });
  }
});

app.get('/proxy/anime/watch/:episodeId', async (req, res) => {
  const { episodeId } = req.params;
  try {
    const response = await fetch(`https://api.consumet.org/anime/watch/${episodeId}`);
    if (!response.ok) {
      const text = await response.text();
      console.error('Consumet API error:', response.status, text);
      return res.status(response.status).json({ error: `Consumet API error: ${response.status}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch from consumet API' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`); 
});
