import React from "react";
import logo_3 from './images/gold/image3.png'
import logo_7 from './images/gold/image7.png'
import logo_11 from './images/gold/image21.png'
import './gold_coins.css'

const Gold_coins = () => {
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

export default Gold_coins;

