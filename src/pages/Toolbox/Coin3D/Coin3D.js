import React from 'react';
import Footer from 'src/components/Footer';
const Coin3D = ()=>{
    return(
        <div id='coin3d-page'>
            <center>
                <h1>Coin in 3D</h1>
                <div className='sketchfab-embed-wrapper my-5 py-5'>
                    <iframe 
                            title="Eastern King's Coin" 
                            width="720"
                            height="540"
                            frameborder="0" 
                            allowfullscreen 
                            mozallowfullscreen="true" 
                            webkitallowfullscreen="true" 
                            allow="autoplay; fullscreen; xr-spatial-tracking" 
                            xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share 
                            src="https://sketchfab.com/models/033a5ed32de347e1be254042555ad0c4/embed"/> 
                </div>
                </center>
        <Footer/>
        </div>
    )


}
export default Coin3D