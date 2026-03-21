export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const API_URL = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&polygon_geojson=1&polygon_threshold=0.01&limit=1&accept-language=en`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Nominatim responded with status ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}