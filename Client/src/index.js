import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';


// if("serviceWorker" in navigator) {
//   window.addEventListener('load',
//     navigator.serviceWorker
//       .register('/service-worker.js')
//       .then(reg =>  console.log("service-worker: registered"))
//       .catch(err => console.log(`service-worker: error: ${err}`))
//   )
// }else
// {
//   console.log("service worker unavailable")
// }

ReactDOM.render(
 
    <Provider store={store}>
      <App />
    </Provider>
 ,
  document.getElementById('root')
);


