import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
		<meta charSet="utf-8" name="viewport" content="width=device-width, initial-scale=1, user-scalable=flase;"/>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

/* Use this version to disable react warnings. Some warnings are stupid and need to be ignored, others are good to listen to.
 * Warnings that are stupid are ones that involve one of the libraries we are using, but are required to use
ReactDOM.render(
  <>
		<meta charSet="utf-8" name="viewport" content="width=device-width, initial-scale=1, user-scalable=flase;"/>
    <App />
  </>,
  document.getElementById('root')
);
*/
