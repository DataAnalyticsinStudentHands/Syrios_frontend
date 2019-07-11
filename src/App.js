import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import logo from './img_2.png';
import Collection from './components/Collection'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        navigate: false
    }
}
handleClick = () => {
    this.setState({ navigate: true});
    return(this.state.navigate ? <Link to='/employers'/> : null)
}
  render(){
    return (
      <Router>
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
                <button className = 'App-b1'> 
                <Link to="/collections" className = 'words'> Explore the Collection </Link>
                </button>
                </tr>
                <tr>
                <button className = 'App-b1' type = "button" onClick= {this.handleClick} >Follow The Coins
                </button>
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
        <Route exact path ="/collections" component={Collection} />
      </Router>
    );
  }
}

export default App;
