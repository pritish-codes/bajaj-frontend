import React, { useState } from 'react';
import Select from 'react-select';
import './InputForm.css'; 
import axios from 'axios';

const apiUrl = 'https://bajaj-backend-bdzi.onrender.com/bfhl'; 

const options = [
  { value: 'alphabets', label: 'Alphabets' },
  { value: 'numbers', label: 'Numbers' },
  { value: 'highestLowercase', label: 'Highest Lowercase Alphabet' }
];

function InputForm() {
  const [jsonInput, setJsonInput] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Function to handle JSON validation and API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate JSON
      const parsedJson = JSON.parse(jsonInput);
      if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
        throw new Error('Invalid JSON format: "data" should be an array.');
      }

      // API request
      const { data: apiResponse } = await axios.post(apiUrl, parsedJson);
      console.log('API Response:', apiResponse);

      // Process the response based on selected options
      const filteredResponse = filterResponse(apiResponse, selectedOptions);
      setResponse(filteredResponse);
      setError(null);  // Clear any previous errors
    } catch (error) {
      console.error('Error processing JSON:', error);
      setResponse(null); // Clear any previous responses
      if (error instanceof SyntaxError) {
        setError('Error: Invalid JSON format.');
      } else {
        setError('Error: Failed to process data.');
      }
    }
  };

  // Function to filter response based on selected options
  const filterResponse = (data, options) => {
    if (!data || typeof data !== 'object') {
      console.error('API response is not an object:', data);
      return [];
    }

    const optionValues = options.map(option => option.value);
    let result = [];

    if (optionValues.includes('alphabets') && Array.isArray(data.alphabets)) {
      result = result.concat(data.alphabets);
    }
    if (optionValues.includes('numbers') && Array.isArray(data.numbers)) {
      result = result.concat(data.numbers);
    }
    if (optionValues.includes('highestLowercase') && typeof data.highest_lowercase_alphabet === 'string') {
      result = result.concat(data.highest_lowercase_alphabet);
    }

    return result;
  };

  // Function to get the highest lowercase alphabet from data
  const getHighestLowercase = (data) => {
    const lowercaseLetters = data.filter(item => /^[a-z]$/.test(item));
    if (lowercaseLetters.length === 0) return '';
    return lowercaseLetters.sort().reverse()[0];
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected || []);
  };

  return (
    <div className="input-form-container">
      <h1>Your Roll Number: 21BCE0664</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows="10"
          cols="50"
          placeholder="Enter JSON here"
        />
        <button type="submit">Submit</button>

        {jsonInput && (
          <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
            placeholder="Select options"
            className="dropdown"
          />
        )}
      </form>

      {response && (
        <div className="response">
          <h2>Filtered Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="error">
          <h2>{error}</h2>
        </div>
      )}
    </div>
  );
}

export default InputForm;
