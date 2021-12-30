import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Train from './components/Train';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
          <Train/>
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
