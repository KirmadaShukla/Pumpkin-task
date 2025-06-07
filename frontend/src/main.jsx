import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import {store} from './store/store.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(

    <Provider store={store}>
      <Toaster />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
)
