import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import { CoinContextProvider } from './context/coinContext.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <CoinContextProvider>
    <App />
  </CoinContextProvider>,
);
