// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to generate a story
app.post('/story', async (req, res) => {
  try {
    const { child, friend, pet, theme } = req.body;

    if (!child || !theme) {
      return res.status(400).json({ error: 'Missing child name or theme' });
    }

    const prompt = `
Write a fun and imaginative children's bedtime story between 600 and 750 words.
The main characters are ${child}, their friend ${friend || 'a friend'}, and their pet ${pet || 'a pet'}.
The story theme is ${theme}.
The story should be suitable for kids aged 3 to 10, with a positive message and easy language.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1100,
      temperature: 0.8,
    });

    const story = response.choices[0].message?.content?.trim() || "No story generated.";

    res.json({ story });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Story server running at http://localhost:${PORT}`);
});
