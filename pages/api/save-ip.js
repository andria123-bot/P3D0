import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ip } = req.body;

    if (!ip) {
      return res.status(400).json({ message: 'IP address is required' });
    }

    const filePath = path.resolve('./public/data.json'); // File must be placed in public folder
    try {
      // Read the existing data from the file
      let data;
      try {
        data = await fs.readFile(filePath, 'utf-8');
      } catch (readError) {
        // If file doesn't exist, start with an empty array
        data = '[]';
      }

      const jsonData = JSON.parse(data);

      // Check if the IP already exists
      if (jsonData.some(entry => entry.ip === ip)) {
        return res.status(200).json({ message: 'IP address already exists' });
      }

      // Add new IP to the array
      jsonData.push({ ip });

      // Write the updated data back to the file
      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));

      return res.status(200).json({ message: 'IP address saved successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error saving IP address', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
