import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Train from './components/Train';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

axios.defaults.baseURL = 'https://localhost:8081/api';

function App() {
  return (
    <>
      <Router>
          <Train/>
          <ToastContainer rtl/>
      </Router>
    </>
  );
}

export default App;
