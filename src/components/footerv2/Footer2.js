import React from "react";
import NEH from 'src/assets/NEH-Preferred-Seal-White.svg';
import { Link } from 'react-router-dom';

function Footer2(){
    return(
        <div id='footer2'>
            <div id="footer2-Container">
                <div className="split-half">
                    <div id="footer2-head" className="mb-5">Get the latest updates!</div>
                    <div>
                        <input type={'email'} id="footer2-email" placeholder="Enter your email" className="mb-5"/>
                    </div>
                    <div id='footer2-syrios'>
                        SYRIOS is a project of the University of Houston. It is made possible through the support of:
                    </div>
                    <a href='https://www.neh.gov/'>
                        <img
                        src={NEH}
                        id='footer2-logo'
                        alt='NEH Logo'/>
                    </a>
                </div>

                <div className="split-half">
                    <div style={{marginTop:'12.5%'}}>
                        <div id="footer2-links">
                            <Link to='/About' className="footer2-link">About Syrios</Link>
                            <Link to='/ContactUs' className="footer2-link"> Contact Us</Link>
                            <Link to='/Evidence/MapCoins' className="footer2-link"> Sitemap</Link>
                            <Link to='/' className="footer2-link"> Privacy Policy</Link>
                        </div>
                    </div>
                    <div id="footer2-licensed" style={{marginTop:'30%'}}>
                        <strong>SYRIOS is licensed under a</strong> <br/>
                        Creative Common Attribution-Non Commercial 3.0 <br/>
                        International License (CC BY-NC 3.0).
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Footer2