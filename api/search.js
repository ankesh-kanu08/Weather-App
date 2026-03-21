export default async function handler(req, res) {
  const { q } = req.query;
  const API_KEY = process.env.WEATHER_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  if (!q) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const API_URL = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(q)}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`WeatherAPI responded with status ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}