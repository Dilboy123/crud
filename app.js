const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

mongoose.connect('mongodb+srv://dilanka:8645@nodeexpressproject.kzfhhoj.mongodb.net/SCRIPT-API?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const Item = mongoose.model('Item', { text: String });

// middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  res.send("backend for text");
});

// Serve API endpoints
app.post('/submit', async (req, res) => {
  try {
    const { text } = req.body;

    // Check if the text already exists in the database
    const existingItem = await Item.findOne({ text });

    if (existingItem) {
      // If the text already exists, send a response indicating that it's a duplicate
      return res.status(400).send('Text already exists in the database.');
    }

    // Save the text to MongoDB
    const newItem = new Item({ text });
    await newItem.save();
    res.status(200).send('Text saved to MongoDB.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
