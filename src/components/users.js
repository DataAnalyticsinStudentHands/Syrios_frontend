import React from "react";
import {Link} from 'react-router-dom';
import logo from './images/image1.png'
import logo_2 from './images/image2.png'
import logo_3 from './images/image3.png'
import logo_4 from './images/image4.png'
import logo_5 from './images/image5.png'
import logo_6 from './images/image6.png'
import logo_7 from './images/image7.png'
import logo_9 from './images/image9.png'
import './users.css'


/* We simply can use an array and loop and print each user */
const UsersPage = () => {
  return (
      <body>
          <div>
              <p>
                <img src={logo} className="App-logo_1" alt="logo" /> 
                <img src={logo_2} className="App-logo_2" alt="logo" />
                <img src={logo_3} className="App-logo_3" alt="logo" />
                <img src={logo_4} className="App-logo_4" alt="logo" />
                <img src={logo_5} className="App-logo_5" alt="logo" />
                <img src={logo_6} className="App-logo_6" alt="logo" />
                <img src={logo_7} className="App-logo_7" alt="logo" />
                <button className = 'b1'> </button>
                <button className = 'b4'> </button>
              </p>
              <p>
              <button className = 'b2'></button>
              <button className = 'b5'></button>
              </p>
              <p>
              <button className = 'b3'> </button>
              <button className = 'b6'></button>
              </p>
              <p>
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
