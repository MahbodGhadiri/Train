import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Train from './components/Train';

function App() {
  return (
    <>
      <Router>
        <Train/>
      </Router>
    </>
  );
}

export default App;
