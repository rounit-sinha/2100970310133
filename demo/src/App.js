import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [type, setType] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const fetchNumbers = async () => {
    try {
      const response = await axios.get(`http://localhost:9876/numbers/${type}`);
      setData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
      setData(null);
    }
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>
      <div>
        <label>Enter number type (p, f, e, r): </label>
        <input type="text" value={type} onChange={(e) => setType(e.target.value)} />
        <button onClick={fetchNumbers}>Fetch Numbers</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
