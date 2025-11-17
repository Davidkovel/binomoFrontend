import { StrictMode } from 'react'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.jsx'
import {store} from './store.js'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>
)


// 12345ASJDBASKJDBASKB!@!@nsf