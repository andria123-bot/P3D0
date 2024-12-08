import './style.css';
import axios from 'axios';

function App() {
  // Function to handle the image click
  const fetchIP = () => {
    // API to get the public IP address (IPv4)
    axios.get('https://api.ipify.org?format=json')
      .then(response => {
        const ip = response.data.ip;
        console.log('IP Address:', ip); // Logs the IP address to the console

        // Send the IP address to the backend server to save it in data.json
        axios.post('http://localhost:5000/save-ip', { ip })
          .then(response => {
            console.log(response.data.message);
          })
          .catch(error => {
            console.error('Error saving IP address:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching IP address:', error);
      });
  };

  return (
    <div className="App">
      <h1>Click the Image to Fetch Your IP Address</h1>
      <img
        src="/Random.jpg"
        alt="Click me"
        onClick={fetchIP}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}

export default App;
