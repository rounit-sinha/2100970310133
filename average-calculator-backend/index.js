const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;

// Configuration
const WINDOW_SIZE = 10;
const numbersStore = {
  p: [], // Prime numbers
  f: [], // Fibonacci numbers
  e: [], // Even numbers
  r: []  // Random numbers
};

// Actual API Endpoints
const API_ENDPOINTS = {
  p: 'http://20.244.56.144/test/primes',
  f: 'http://20.244.56.144/test/fibo',
  e: 'http://20.244.56.144/test/even',   // Assuming there are endpoints for even and random numbers as well
  r: 'http://20.244.56.144/test/random'  // Assuming there are endpoints for even and random numbers as well
};

// Helper function to fetch numbers from third-party service
const fetchNumbers = async (type) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS[type]}`);
    return response.data.numbers; // Assuming the response contains a 'numbers' array
  } catch (error) {
    console.error(`Error fetching ${type} numbers:`, error);
    throw new Error('Failed to fetch numbers from third-party service');
  }
};

// API endpoint
app.get('/numbers/:type', async (req, res) => {
  const type = req.params.type;
  const validTypes = ['p', 'f', 'e', 'r'];

  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid number type' });
  }

  try {
    const newNumbers = await fetchNumbers(type);

    // Ensure uniqueness
    const uniqueNumbers = newNumbers.filter(num => !numbersStore[type].includes(num));

    // Add new numbers to the store
    numbersStore[type] = [...numbersStore[type], ...uniqueNumbers];

    // Maintain window size
    if (numbersStore[type].length > WINDOW_SIZE) {
      numbersStore[type] = numbersStore[type].slice(-WINDOW_SIZE);
    }

    const prevWindowState = numbersStore[type].slice(0, -uniqueNumbers.length);
    const currWindowState = numbersStore[type];

    const avg = currWindowState.reduce((sum, num) => sum + num, 0) / currWindowState.length;

    res.json({
      windowPrevState: prevWindowState,
      windowCurrState: currWindowState,
      numbers: uniqueNumbers,
      avg: avg.toFixed(2)
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch numbers from third-party service' });
  }
});

app.listen(PORT, () => {
  console.log(`Average Calculator Microservice running on http://localhost:${PORT}`);
});
