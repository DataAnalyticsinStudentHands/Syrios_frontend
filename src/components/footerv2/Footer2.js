import React from "react";
import NEH from 'src/assets/NEH-Preferred-Seal-White.svg';
import { Link } from 'react-router-dom';
import SubscriptionButton from './subscriptionButton'
async function scrollToTop (e){
    // console.log(e)
    document.documentElement.scrollTop = 0;
}
function Footer2(){
    return(
        <div id='footer2'>
            <div id="footer2-Container">
                <div className="split-half">
                    <div id="footer2-head" className="mb-5">Get the latest updates!</div>
                    <div style={{width:'62.5%'}} className="my-5">
                        <SubscriptionButton/>
                        {/* <div className="input-addon">
                            <input type={'email'} id="footer2-email" placeholder="Enter your email" className="mb-5"/>

                            <input type="email" id="footer2-email" placeholder="Enter your email" className="input-addon__input" 
                                value={email} onChange={(e)=>{
                                    setEmail(e.target.value)
                                }}/>
                            <div className="input-addon__addon input-addon__addon--appended" onClick={handleSubmit}>
                                <div id="footer_submit" className="px-3">
                                Submit

                                </div>
                            </div>
                        </div> */}
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
                            <Link to='/About' className="footer2-link" onClick={(e)=>{scrollToTop(e)}}>About SYRIOS</Link>
                            <Link to='/ContactUs' className="footer2-link" onClick={(e)=>{scrollToTop(e)}}> Contact Us</Link>
                            {/* <Link to='/Evidence/MapCoins' className="footer2-link"> Sitemap</Link>
                            <Link to='/' className="footer2-link"> Privacy Policy</Link> */}
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