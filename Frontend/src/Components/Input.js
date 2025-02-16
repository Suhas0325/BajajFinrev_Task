import React, { useState } from 'react';
import './input.css';

function Input() {
  const [inputValue, setInputValue] = useState('');
  const [validFormat, setValidFormat] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [response, setResponse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setResponse(null);
    
    try {
      const parsedData = JSON.parse(inputValue);
      if (parsedData.data && Array.isArray(parsedData.data)) {
        setValidFormat(true);
        // Send the JSON data to the backend
        const result = await fetch('https://bajaj-finrev-task-backend.vercel.app/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(parsedData),
        });

        if (result.ok) {
          const data = await result.json();
          setResponse(data);
        } else {
          setErrorMessage('Error: ' + result.statusText);
        }
      } else {
        setErrorMessage('Invalid JSON format.');
        setValidFormat(false);
      }
    } catch (error) {
      setErrorMessage('Invalid JSON format.');
      setValidFormat(false);
    }
  };

  const handleChange = (event) => {
    const { options } = event.target;
    const selectedOptions = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedOptions.push(options[i].value);
      }
    }
    setSelectedValues(selectedOptions);
  };

  const getFilteredData = () => {
    if (!response) return {};

    const { numbers = [], alphabets = [], highest_alphabet = [] } = response;

    let filteredNumbers = [];
    let filteredAlphabets = [];
    let highestAlphabet = [];

    if (selectedValues.includes('Numbers')) {
      filteredNumbers = numbers;
    }

    if (selectedValues.includes('Alphabets')) {
      filteredAlphabets = alphabets;
    }

    if (selectedValues.includes('Highest Alpabets')) {
      highestAlphabet = highest_alphabet;
    }

    return { filteredNumbers, filteredAlphabets, highestAlphabet };
  };

  const { filteredNumbers, filteredAlphabets, highestAlphabet } = getFilteredData();

  return (
    <div className='Inp'>
      <h1>Bajaj Finserv</h1>
      <form className='Form' onSubmit={handleSubmit}>
        <input 
          type='text' 
          placeholder='API input' 
          value={inputValue} 
          onChange={handleInputChange} 
        />
        <button type='submit'>Submit</button>
      </form>
      {errorMessage && <p className='error'>{errorMessage}</p>}
      {validFormat && (
        <div>
          <label htmlFor="multi-select">Choose an option:</label>
          <select id="multi-select" value={selectedValues} onChange={handleChange} multiple>
            <option value="">--Select an option--</option>
            <option value="Numbers">Numbers</option>
            <option value="Alphabets">Alphabets</option>
            <option value='Highest Alpabets'>Highest alphabet</option>
          </select>
          {selectedValues.length > 0 && (
            <div>
              <h3>Selected Options:</h3>
              <ul>
                {selectedValues.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
              <h3>Filtered Response:</h3>
              <div>
                {selectedValues.includes('Numbers') && (
                  <>
                    <h4>Numbers:</h4>
                    <pre>{JSON.stringify(filteredNumbers, null, 2)}</pre>
                  </>
                )}
                {selectedValues.includes('Alphabets') && (
                  <>
                    <h4>Alphabets:</h4>
                    <pre>{JSON.stringify(filteredAlphabets, null, 2)}</pre>
                  </>
                )}
                {selectedValues.includes('Highest Alpabets') && (
                  <>
                    <h4>Highest Alphabet:</h4>
                    <pre>{JSON.stringify(highestAlphabet, null, 2)}</pre>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Input;
