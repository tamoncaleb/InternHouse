const express = require('express');
const fetch = require('node-fetch'); // Make sure to install this if not using built-in fetch
require('dotenv').config(); // To load environment variables from .env
const cors = require('cors'); // Import cors package

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON data sent in request bodies

// Endpoint to get compatibility score
app.post('/get-compatibility', async (req, res) => {
  const { userData, profileData } = req.body;

  const prompt = `
    Calculate the compatibility between the following two users based on their job, location, and property type:

    User Data:
    Job: ${userData.job}
    Location: ${userData.location}
    Property Type: ${userData.propertyType}

    Profile Data:
    Job: ${profileData.job}
    Location: ${profileData.location}
    Property Type: ${profileData.propertyType}

    Compatibility Score: (0-100)
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-davinci-003', // Or GPT-4 model
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    const score = parseFloat(data.choices[0].text.trim());
    res.json({ score });
  } catch (error) {
    console.error('Error fetching API:', error);
    res.status(500).json({ error: 'Failed to get compatibility score.' });
  }
  
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

