const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// POST method endpoint to handle JSON input
app.post('/bfhl', async (req, res) => {
  const { data } = req.body;

  if (data && Array.isArray(data)) {
    const numbers = data.filter(item => /^[0-9]+$/.test(item));
    const alphabets = data.filter(item => /^[A-Za-z]$/.test(item));
    const highestAlphabet = alphabets.reduce((highest, current) => current > highest ? current : highest, alphabets[0]);
    const response = {
      status: 'success',
      user_id: 'john_doe_17091999',
      email: 'john@xyz.com',
      roll_number: 'ABCD123',
      numbers: numbers,
      alphabets: alphabets,
      highest_alphabet:highestAlphabet
    };

    res.json(response);
  } else {
    res.status(400).json({ error: 'Invalid JSON format. "data" key with an array value is required.' });
  }
});

// GET method endpoint
app.get('/bghl', async (req, res) => {
  res.json({ operation_code: 'YOUR_OPERATION_CODE' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
