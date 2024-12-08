/* eslint-disable no-unused-vars */
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ip } = req.body;

    // Check if IP is provided
    if (!ip) {
      return res.status(400).json({ message: 'IP address is required' });
    }

    const filePath = path.resolve('data.json');

    // Read existing data from data.json
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
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
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
      return res.status(200).json({ message: 'IP address saved successfully' });
    } catch (err) {
      return res.status(500).json({ message: 'Error reading or saving IP address' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
