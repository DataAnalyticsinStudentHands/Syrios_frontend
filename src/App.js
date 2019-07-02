import React from 'react';
import './App.css';
import logo from './img_2.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <h1 className="App-h1">Finding Connections in Ancient Syria</h1>
      <table className='App-t1' cellSpacing= '1'>
        <tr>
          <td>
          <img src={logo} className="App-logo" alt="logo" />
          </td>
          <td>
            <tr>
            <button className = 'App-b1' type = "button"> Explore the collection </button>
            </tr>
            <tr>
            <button className = 'App-b1' type = "button">Follow The Coins</button>
            </tr>
            <tr>
            <button className = 'App-b1' type = "button">Discover the Story</button>
            </tr>
            <tr>
            <button className = 'App-b1' type = "button">Learn About the Coins</button>
            </tr>
            <tr>
            <button className = 'App-b1' type = "button">Meet the Team</button>
            </tr>
          </td>
        </tr>
      </table>
    
      </header>
    </div>
  );
}

export default App;
