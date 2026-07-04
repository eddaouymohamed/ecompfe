import { StrictMode } from 'react'
import axios from 'axios';
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx';
import store from './app.js';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer/>
    </Provider>
  // </StrictMode>,
)
//