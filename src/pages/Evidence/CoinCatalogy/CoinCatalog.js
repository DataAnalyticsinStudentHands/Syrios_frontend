import React from 'react';
import FeedBackicon from 'src/components/constant/FeedBackIcon';
import SearchBar from './component/SearchBar';
import SpotLight from './component/SpotLight';

const CoinCatalog = ()=>{
    return(
        <>
            <FeedBackicon url="default"/>
            <div id='coin-catalog'>
                <div className='catalog-section'>
                    <h1>Explore our Collection</h1>
                    <h3>Our catalog has over 700 coins for you to discover!</h3>
                </div>
                <div className='catalog-section'>
                    <SearchBar/>

                    <div className='catalog-buttons'>
                        <a href='#coin-of-the-day'> Coin of the day</a>
                        <a href='#what-is-the-catalog'> What is the catalog?</a>
                        <a href='#our-research'> Our research</a>
                        <a href='#coin-image-from'> Our partners</a>
                    </div>
                </div>

 

                <div className='catalog-section'>
                    <h2>Spotlight. Trending coins right now</h2>
                    <SpotLight />
                </div>

                <div  className='catalog-section'>
                <span class="anchor" id='coin-of-the-day'></span>

                    <h2>Coins of the day. Past 24 hours</h2>
                    <div className='coins-of-the-day'>
                        <div className='left'>
                            <h1>Coin name goes here </h1>
                            <h2>Coin date found, location goes here</h2>
                            <p>More detailed coin information goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <button> Learn more</button>
                        </div>
                        <div className='right'>
                            <img src={`${process.env.REACT_APP_strapiURL}/uploads/dime_1e86a20b3f.png?updated_at=2022-08-24T01:51:12.499Z`} alt='test_image'/>
                        </div>
                    </div>
                </div>

                <div  className='catalog-section'>
                <span class="anchor" id='what-is-the-catalog'></span>

                    <h2>What is this catalog?</h2>
                    <p>The SYRIOS catalog represents an ongoing effort to bring together examples of all the many and varied coins minted in ancient Syria from 400 BCE to 450 CE. Over 30 different mints produced coins within the region during this period, some of which were intended for local use and others destined to serve an empire.</p>
                    <p>Begin your search by choosing a mint, time period, material, image, issuing authority, or even language.</p>
                </div>

                <div className='catalog-section'>
                    <span class="anchor" id='our-research'></span>
                    <h2>Our research</h2>
                    <p>Every coin from the ancient world has a story to tell. Some coins were minted for provincial governors or imperial states conquering Syria, while others were produced for local cities and communities. Some coins laud kings and emperors, while others celebrate the beliefs and values of the vibrant Syrian population. And yet, whether rich or poor, citizen or foreigner, young or old – all people used coins in their daily lives.</p>
                </div>

                <div className='catalog-section'>
                    <span class="anchor" id='coin-image-from'></span>
                    <h2 >Coin images from</h2>
                    <p>Where a drawing appears instead of photograph, no digital image was available through museum or educational organizations. All drawings are based upon published coin type catalogs. Click on this video to learn more about the ethics and legality of coin collecting.</p>
                    <div className='catalog-VideoBox'>
                        Video place holder
                    </div>
                </div>

            </div>
        </>
    )
}
export default CoinCatalog
