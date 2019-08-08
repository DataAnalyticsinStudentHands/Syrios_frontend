import React from 'react';
import {Link} from 'react-router-dom';
import './Main.css'
import logo from './img_2.png';
import uhlogo from './images/uh.png'
import logo1 from './images/homepage/home1.png'
import logo2 from './images/homepage/home2.png'
import logo3 from './images/homepage/home3.png'
import logo4 from './images/homepage/home4.png'
import logo5 from './images/homepage/home5.png'
import './users.css'

class MainPage extends React.Component{
    render(){
        return(
          <div className="App">
          <header className="App-header">
          <h1 className="App-h1">Finding Connections <br></br>in Ancient Syria</h1>
          <table className='App-t1' cellSpacing= '1'>
            <tr>
              <td>
              <img src={logo} className="App-logo" alt="logo" />
              </td>
              <td>
                <tr>
                <img src={logo1} className="App-logo1" alt="logo" />
                </tr>
                <tr>
                <img src={logo2} className="App-logo1 logo2" alt="logo" />
                </tr>
                <tr>
                <img src={logo3} className="App-logo1 logo3" alt="logo" />
                </tr>
                <tr>
                <img src={logo4} className="App-logo1 logo4" alt="logo" />
                </tr>
                <tr>
                <img src={logo5} className="App-logo1 logo5" alt="logo" />
                </tr>
              </td>
              <td>
                <tr>
                <button className = 'App-b1'>
                  <Link to = "/users" className = 'words'> Explore the Collection </Link>
                </button>
                </tr>
                <tr>
                <button className = 'App-b1'> Follow the Coins
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
          <div>
                <table cellSpacing = '25' className ='tdm'>
                  <tr>
                    <td>
                    <img src={uhlogo} className="App-logo_uh" alt="logo" /> 
                    </td>
                    <td>
                    <a href="/" className = 'div2'>Home</a>
                    </td>
                    <td>
                      <p className = 'div2'> Partners </p>
                    </td>
                    <td>
                      <p className = 'div2'> <nobr>Contact Us</nobr></p>
                    </td>
                    <td>
                      <p className = 'div2'> Credits </p>
                    </td>
                    <td>
                      <p className = 'div2'> <nobr> Terms of Use </nobr></p>
                    </td>
                    <td>
                    <a href="#top" className = 'div2'> <nobr> Go to top </nobr> </a>
                    </td>
                    <td>
                    <img src={uhlogo} className="App-logo_uh" alt="logo" /> 
                    </td>
                  </tr>
                </table>
            </div>
        
          </header>
        </div>
        );
    }
}

export default MainPage;