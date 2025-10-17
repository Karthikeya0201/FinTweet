const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3003;

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Middleware to parse JSON
app.use(express.json());

// Serve static files (including index.html)
app.use(express.static('public'));

// Route to fetch tweets from MongoDB
app.get('/tweets', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('fintweet');
    const tweetsCollection = database.collection('tweets');
    const tweets = await tweetsCollection.find({}).toArray();
    res.json(tweets);
  } catch (error) {
    console.error('Error fetching tweets from MongoDB:', error);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  } finally {
    await client.close();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
