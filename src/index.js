import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { CoinContextProvider } from './context/coinContext';
ReactDOM.render(
  <CoinContextProvider>
    <App />
  </CoinContextProvider>
  ,
  document.getElementById('root')
);
