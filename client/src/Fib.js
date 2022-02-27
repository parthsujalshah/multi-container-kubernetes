import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fib = () => {

  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState('');

  useEffect(() => {
    console.log("useEffect");
    fetchValues();
    fetchIndexes();
  }, []);

  async function fetchValues() {
    const values = await axios.get('/api/values/current');
    setValues(values.data);
  }

  async function fetchIndexes() {
    console.log("fetchIndexes")
    const seenIndexes = await axios.get('/api/values/all');
    console.log("SEEN:", seenIndexes)
    setSeenIndexes(seenIndexes.data);
  }

  const handleSubmit = async event => {
    event.preventDefault();

    await axios.post('/api/values', {
      index: index
    });
    setIndex('');
  };

  function renderSeenIndexes() {
    return seenIndexes.map(({ number }) => number).join(', ');
  }

  function renderValues() {
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  }

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={index}
            onChange={event => setIndex(event.target.value)}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {renderValues()}
      </div>
    );
  }
export default Fib;
