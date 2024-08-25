// src/App.js
import React from 'react';
import InputForm from './InputForm';

const App = () => {
  React.useEffect(() => {
    document.title = "21BCE0664"; // Replace with your roll number
  }, []);

  return (
    <div className="App">
      <InputForm />
    </div>
  );
};

export default App;
