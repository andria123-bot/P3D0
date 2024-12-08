// api/save-ip.js
import { firestore } from '../../lib/firestore'; // You would need to set up Firestore in your project

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ip } = req.body;

    // Check if IP is provided
    if (!ip) {
      return res.status(400).json({ message: 'IP address is required' });
    }

    try {
      // Reference to Firestore collection
      const ipRef = firestore.collection('ips');
      const snapshot = await ipRef.where('ip', '==', ip).get();

      // Check if the IP already exists
      if (!snapshot.empty) {
        return res.status(200).json({ message: 'IP address already exists' });
      }

      // Add the new IP to Firestore
      await ipRef.add({ ip });
      return res.status(200).json({ message: 'IP address saved successfully' });

    } catch (err) {
      return res.status(500).json({ message: 'Error reading or saving IP address', error: err });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
