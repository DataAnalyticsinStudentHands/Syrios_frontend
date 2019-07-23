import React from "react";
import {Link} from 'react-router-dom';
import logo from './images/image1.png'
import logo_2 from './images/image2.png'
import logo_3 from './images/image3.png'
import logo_4 from './images/image4.png'
import logo_5 from './images/image5.png'
import logo_6 from './images/image6.png'
import logo_7 from './images/image7.png'
import logo_9 from './images/image19.png'
import logo_10 from './images/image20.png'
import logo_11 from './images/image21.png'
import logo_12 from './images/image22.png'
import logo_13 from './images/image23.png'
import logo_14 from './images/image24.png'
import './users.css'


/* We simply can use an array and loop and print each user */
const UsersPage = () => {
  return (
      <body>
          <div className = 'meh'>
            <p>
              <button className = 'hb1'> 300-129 BCE</button>
              <button className = 'hb2'> 129-31 BCE</button>
              <button className = 'hb3'> 31 BCE - 192 CE</button>
              <button className = 'hb4'> 192-284 CE </button>
              <button className = 'hb5'> 284-480 CE</button>
            </p>
              <p> 
                <h2 className = 'h2'>TIME PERIOD</h2>
                <img src={logo} className="App-logo_1" alt="logo" /> 
                <img src={logo_2} className="App-logo_2" alt="logo" />
                <img src={logo_3} className="App-logo_3" alt="logo" />
                <img src={logo_4} className="App-logo_4" alt="logo" />
                <img src={logo_5} className="App-logo_5" alt="logo" />
                <img src={logo_6} className="App-logo_6" alt="logo" />
                <img src={logo_7} className="App-logo_7" alt="logo" />
                <img src={logo_9} className="App-logo_9" alt="logo" /> 
                <img src={logo_10} className="App-logo_10" alt="logo" /> 
                <img src={logo_11} className="App-logo_11" alt="logo" /> 
                <img src={logo_12} className="App-logo_12" alt="logo" /> 
                <img src={logo_13} className="App-logo_13" alt="logo" /> 
                <img src={logo_14} className="App-logo_14" alt="logo" />
                <button className = 'b1'> </button>
                <button className = 'b4'> </button>
              </p>
              <p>
                <table>
                  <tr>
                    <td>
                    <button className = 'b2'></button>
                    </td>
                    <td>
                    <button className = 'bm'> ISSUING AUTHORITY </button>
                    </td>
                    <td>
                    <button className = 'bx'> METAL </button>
                    </td>
                    <td>
                    <button className = 'b5'></button>
                    </td>
                  </tr>
                </table>
              </p>
              <p>
              <button className = 'b3'> </button>
              <button className = 'b6'></button>
              </p>
              <p>
                <h2 className = 'h2b'>COIN TYPE</h2>
                <button className = 'b7'></button>
                <button className = 'b8'></button>
                <button className = 'b9'></button>
                <button className = 'b10'></button>
                <button className = 'b11'></button>
                <button className = 'b12'></button>
                <button className = 'b13'></button>
              </p>
          </div>
      </body>
  );
};

export default UsersPage;
