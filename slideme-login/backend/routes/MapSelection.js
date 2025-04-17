const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = '1b4327452cc20e14a37e40cc130bd03a';

router.get('/search', async (req, res) => {
  const { keyword } = req.query;
  
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  try {
    const response = await axios.get('https://search.longdo.com/mapsearch/json/search', {
      params: {
        key: API_KEY,
        keyword: keyword,
        limit: 5
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({ error: 'Failed to search location' });
  }
});

module.exports = router;