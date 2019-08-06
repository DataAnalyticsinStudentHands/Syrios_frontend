import React from "react";
import logo from './images/bronze/image1.png'
import logo_2 from './images/silver/image2.png'
import logo_3 from './images/gold/image3.png'
import logo_4 from './images/silver/image4.png'
import logo_5 from './images/bronze/image5.png'
import logo_6 from './images/bronze/image6.png'
import logo_7 from './images/gold/image7.png'
import logo_9 from './images/bronze/image19.png'
import logo_10 from './images/bronze/image20.png'
import logo_11 from './images/gold/image21.png'
import logo_12 from './images/bronze/image22.png'
import logo_13 from './images/bronze/image23.png'
import logo_14 from './images/silver/image24.png'
import logo_15 from './images/gold/image1.png'
import logo_16 from './images/gold/image2.png'
import logo_17 from './images/gold/image4.png'
import logo_18 from './images/silver/image1.png'
import logo_19 from './images/silver/imagea.png'
import logo_20 from './images/silver/imageb.png'
import './users.css'
import {Link} from 'react-router-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";



/* We simply can use an array and loop and print each user */
class UsersPage extends React.Component{
  state = {
    selectedButton : ''
  };
  render(){
    return (
        <Router>
          <Switch>
            <Route path = '/goldcoins' render = {
              () => {
                return (
                  <body className = 'gc_body'>
                      <p>
                      <img src={logo_3} className="App-logo_3" alt="logo" />
                      <img src={logo_7} className="App-logo_7" alt="logo" />
                      <img src={logo_11} className="App-logo_11" alt="logo" /> 
                      </p>
                  </body>
              )
              }
            }/>
          </Switch>
          <body>
              <div className = 'meh'>
                <p>
                  <button className = 'hb1'> 300-129 BCE</button>
                  <button className = 'hb1 hba'> 129-31 BCE</button>
                  <button className = 'hb1 hba'> 31 BCE - 192 CE</button>
                  <button className = 'hb1 hba'> 192-284 CE </button>
                  <button className = 'hb1 hba'> 284-480 CE</button>
                </p>
                  <p> 
                    <h2 className = 'h2'>TIME PERIOD</h2>
                    <img src={logo} className="App-logo_1" alt="logo" /> 
                    <img src={logo_2} className="App-logo_1 logo2" alt="logo" />
                    <img src={logo_3} className="App-logo_3" alt="logo" />
                    <img src={logo_4} className="App-logo_4" alt="logo" />
                    <img src={logo_5} className="App-logo_1 logo5" alt="logo" />
                    <img src={logo_6} className="App-logo_1 logo6" alt="logo" />
                    <img src={logo_7} className="App-logo_1 logo7" alt="logo" />
                    <img src={logo_9} className="App-logo_3 logo9" alt="logo" /> 
                    <img src={logo_10} className="App-logo_1 logo10" alt="logo" /> 
                    <img src={logo_11} className="App-logo_11" alt="logo" /> 
                    <img src={logo_12} className="App-logo_1 logo12" alt="logo" /> 
                    <img src={logo_13} className="App-logo_1 logo13" alt="logo" /> 
                    <img src={logo_14} className="App-logo_1 logo14" alt="logo" />
                    <img src={logo_15} className="App-logo_1 logo15" alt="logo" />
                    <img src={logo_16} className="App-logo_16" alt="logo" />
                    <img src={logo_17} className="App-logo_16 logo17" alt="logo" />
                    <img src={logo_18} className="App-logo_3 logo188" alt="logo" />
                    <img src={logo_19} className="App-logo_19" alt="logo" />
                    <img src={logo_20} className="App-logo_19 logo20" alt="logo" />
                    <button className = 'b1'> </button>
                    {this.renderButtonSelector()}
                
                  </p>
                  <p>
                    <table>
                      <tr>
                        <td>
                        <button className = 'b1 b2'></button>
                        </td>
                        <td>
                        <button className = 'bx bm'> ISSUING AUTHORITY </button>
                        </td>
                        <td>
                        <button className = 'bx'> METAL </button>
                        </td>
                        <td>
                        <button className = 'b4 b5'>  </button>
                        </td>
                      </tr>
                    </table>
                  </p>
                  <p>
                  <button className = 'b1 b3'> </button>
                  <button className = 'b4 b6'> BRONZE </button>
                  </p>
                  <p>
                    <h2 className = 'h2 h2a'>COIN TYPE</h2>
                    <button className = 'b7'></button>
                    <button className = 'b7 b8'></button>
                    <button className = 'b7 b9'></button>
                    <button className = 'b7 b10'></button>
                    <button className = 'b7 b11'></button>
                    <button className = 'b7 b12'></button>
                    <button className = 'b7 b13'></button>
                  </p>
              </div>
              

              
          </body>
        </Router>
    );
  }
  renderButtonSelector() {
    return(
      <button className = 'b4' onClick = {(e) => {this.setState({selectedButton: e.target.value})}}> GOLD </button>
    );
  }
};

export default UsersPage;
