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
  
  
  // Function to handle JSON validation and API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate JSON
      const parsedJson = JSON.parse(jsonInput);
      if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
        throw new Error('Invalid JSON format');
      }

      // Mock API response
      const { apiResponse } = await axios.post(apiUrl, parsedJson);
      console.log(apiResponse);
            
      // Process the response based on selected options
      const filteredResponse = filterResponse(apiResponse, selectedOptions);
      setResponse(filteredResponse);
    } catch (error) {
      console.error('Error processing JSON:', error);
      setResponse('Error: Invalid JSON or failed to process data.');
    }
  };

  // Function to filter response based on selected options
  const filterResponse = (data, options) => {
    const optionValues = options.map(option => option.value);
    return data.filter(item => {
      if (optionValues.includes('alphabets') && /^[A-Za-z]+$/.test(item)) return true;
      if (optionValues.includes('numbers') && /^\d+$/.test(item)) return true;
      if (optionValues.includes('highestLowercase') && item === getHighestLowercase(data)) return true;
      return false;
    });
  };

  // Function to get the highest lowercase alphabet from data
  const getHighestLowercase = (data) => {
    const lowercaseLetters = data.filter(item => /^[a-z]$/.test(item));
    if (lowercaseLetters.length === 0) return '';
    return lowercaseLetters.sort().reverse()[0];
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
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
    </div>
  );
}

export default InputForm;



