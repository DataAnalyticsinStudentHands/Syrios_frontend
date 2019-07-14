import React from "react";
import logo from './images/image1.png'
import logo_2 from './images/image2.png'
import logo_3 from './images/image3.png'
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
              </p>
          </div>
      </body>
  );
};

export default UsersPage;
