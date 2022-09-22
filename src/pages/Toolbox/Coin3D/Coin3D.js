import React from 'react';
import Footer from 'src/components/Footer';
import LoadingPage from 'src/components/LoadingPage.js';
import coin3DRequest from 'src/api/coin-3d';
import { useEffect, useState } from 'react';
import createMarkup from 'src/utils/Markup';
import PageTitleComponent from 'src/components/constant/pageTitleText';
const Coin3D = ()=>{
    const [isLoading, setIsLoading] = useState(true);
    const [coin3D, setCoin3D] = useState([])

    useEffect(()=>{
		const fetchData = async ()=>{
			const result = await coin3DRequest.coin3DFind()
			setCoin3D(result.data.data.attributes)
			setIsLoading(false)
		}
		fetchData().catch(console.error);
    },[])
    if (isLoading)return (<><LoadingPage /><Footer /></>);
    return(
        <div id='coin3d-page'>
                <PageTitleComponent
                    title={coin3D.title}
                    text={coin3D.text}
                    subtext={coin3D.sub_text}
                />
            <center>
                <div className='sketchfab-embed-wrapper my-5 py-5'>
                    <iframe 
                        title="Eastern King's Coin" 
                        width="720"
                        height="540"
                        frameBorder="0" 
                        allowFullScreen 
                        mozallowfullscreen="true" 
                        webkitallowfullscreen="true" 
                        allow="autoplay; fullscreen; xr-spatial-tracking" 
                        xr-spatial-tracking="true" 
                        execution-while-out-of-viewport="true" 
                        execution-while-not-rendered="true" 
                        web-share="true" 
                        src="https://sketchfab.com/models/033a5ed32de347e1be254042555ad0c4/embed"
                    /> 
                </div>
            </center>
        <Footer/>
        </div>
    )


}
export default Coin3D