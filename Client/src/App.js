import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Train from './components/Train';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8233/api';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type']='application/json' //? is this needed?

function App() {
  
  return (
    <>

      <Router>
        <Train />
        <ToastContainer rtl />
      </Router>
    </>
  );
}

export default App;
