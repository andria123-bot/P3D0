import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Enable CORS for all origins (you can restrict this for security later)
app.use(cors());

// Serve static files from the React build folder
app.use(express.static(path.resolve('build')));

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to save IP address to data.json
app.post('/save-ip', (req, res) => {
  const { ip } = req.body;
  
  // Check if IP is provided
  if (!ip) {
    return res.status(400).json({ message: 'IP address is required' });
  }

  const filePath = path.resolve('data.json');

  // Read existing data from data.json
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ message: 'Error reading data file' });
    }

    const jsonData = data ? JSON.parse(data) : [];

    // Check if the IP already exists in the data
    const ipExists = jsonData.some(entry => entry.ip === ip);

    if (ipExists) {
      // If IP already exists, send no response (silent)
      return res.status(200).json({ message: 'IP address already exists' });
    }

    // Add the new IP to the data array
    jsonData.push({ ip });

    // Write the updated data back to data.json
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving IP address' });
      }
      res.status(200).json({ message: 'IP address saved successfully' });
    });
  });
});

// Catch-all handler to serve the React app for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.resolve('build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
