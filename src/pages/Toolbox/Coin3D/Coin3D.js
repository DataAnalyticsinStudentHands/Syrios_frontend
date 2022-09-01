import React from 'react';
import Footer from 'src/components/Footer';
const Coin3D = ()=>{
    return(
        <div id='coin3d-page'>
            <center>
                <h1>Coin in 3D</h1>
                <div className='my-5 py-5'>
                    <iframe
                        title="Eastern King's Coin"
                        width="720"
                        height="540"
                        src="https://sketchfab.com/models/033a5ed32de347e1be254042555ad0c4/embed"
                        frameBorder="0"
                        allow="
                            autoplay; 
                            fullscreen;  
                            xr-spatial-tracking; execution-while-out-of-viewport; execution-while-not-rendered; web-share;"
                        mozallowfullscreen="true"
                        webkitallowfullscreen="true"
                    />
                    <div className='story-caption'> 
                        <a href="https://sketchfab.com/3d-models/eastern-kings-coin-033a5ed32de347e1be254042555ad0c4?utm_medium=embed&utm_campaign=share-popup&utm_content=033a5ed32de347e1be254042555ad0c4" 
                        target="_blank" rel="noopener noreferrer"> 
                            Eastern King's Coin &nbsp;
                        </a> by &nbsp;
                        <a href="https://sketchfab.com/peggylind?utm_medium=embed&utm_campaign=share-popup&utm_content=033a5ed32de347e1be254042555ad0c4" 
                            target="_blank" rel="noopener noreferrer"> 
                            peggylind &nbsp;
                        </a> on &nbsp;
                        <a href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=033a5ed32de347e1be254042555ad0c4" 
                            target="_blank" rel="noopener noreferrer">
                            Sketchfab
                        </a>
                    </div>
                </div>
                </center>
        <Footer/>
        </div>
    )


}
export default Coin3D