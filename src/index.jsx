import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

import { CoinContextProvider } from './context/coinContext.jsx';
ReactDOM.render(
  <CoinContextProvider>
    <App />
  </CoinContextProvider>
  ,
  document.getElementById('root')
);
