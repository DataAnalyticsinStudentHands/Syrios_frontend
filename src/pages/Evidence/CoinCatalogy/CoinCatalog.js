import React, {useState, useEffect} from 'react';
import FeedBackicon from 'src/components/constant/FeedBackIcon';
import coinCollections from 'src/api/coin-collections';
import Slider from 'react-slick';
import { SpotlightCard } from './CoinList/Card';
import { Row, Col } from 'react-bootstrap';

const CoinCatalog = ()=>{

    const [spotLightdata, setSpotLightdata] = useState([])

    useEffect(()=>{
		const fetchData = async ()=>{
			const result = await coinCollections.coinSpotLight()
            // console.log(result.data.data)
            setSpotLightdata(result.data.data)
        }
		fetchData().catch(console.error);    
    },[])

    function NextArrow(props){
        const { className, style, onClick } = props;
        return (
            <div
            className={className}
            style={{ ...style, display: "block", background: "" }}
            onClick={onClick}
            />
        );
    }
    function PrevArrow(props) {
        const { className, style, onClick } = props;
        return (
          <div
            className={className}
            style={{ ...style, display: "block", background: "", fontSize:'5rem'}}
            onClick={onClick}
          />
        );
      }
    const Slicksettings = {
        dots: true,
        autoplay: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        // centerMode: true,
        pauseOnHover: true,
        lazyLoad: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
      };


    return(
        <>
            <FeedBackicon url="default"/>
            <div id='coin-catalog'>
                <div className='catalog_section text-center'>
                    <h1>Explore our Collection</h1>
                    <h3>Our catalog has over 700 coins for you to discover!</h3>
                
                    <div className="input-addon">
                        <div className="input-addon__addon input-addon__addon--prepended icon-entypo-search"/>
                        <input type="text" className="input-addon__input" placeholder='Search by coin name, type, date, and more.'/>
                    </div>
                    <Row style={{padding:"5% 5%"}}>
                        <Col xs={6} sm={3}><button className='catalog-button'> What is the catalog?</button></Col>
                        <Col xs={6} sm={3}><button className='catalog-button'> Our partners</button></Col>
                        <Col xs={6} sm={3}><button className='catalog-button'> Our research</button></Col>
                        <Col xs={6} sm={3}><button className='catalog-button'> Coin of the day</button></Col>
                    </Row>
                </div>

                <div className='catalog_section text-center'>
                    <h2 >Spotlight. Trending coins right now</h2>
                    
                    <div className='my-5 py-5'>
                    <Slider {...Slicksettings}>
                        {spotLightdata.map((coin)=> <SpotlightCard coin={coin} key={coin.id}/>)}
                    </Slider>
                    </div>
                </div>

                <div className='catalog_section'>
                    <h2 className='text-center'>Coins of the day. Past 24 hours</h2>
                    <Row id='coins_of_the_day' className='justify-content-between align-items-center my-5 py-5'>
                        <Col xs={7}>
                            <div className='catalog-content-coin-name'> Coin name goes here </div>
                            <div className='catalog-content-coin-date'>Coin date found, location goes here</div>
                            <div className='catalog-content-p' >More detailed coin information goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                        </Col>
                        <Col xs={4}>
                            <div className='catalog-content-coin-image'><img src={`${process.env.REACT_APP_strapiURL}/uploads/dime_1e86a20b3f.png?updated_at=2022-08-24T01:51:12.499Z`} alt='test_image'width={'100%'}/></div>
                        </Col>
                    </Row>
                    <div>
                        <button className='catalog-content-button'>Learn more</button>
                    </div>
                </div>

                <div className='catalog_section text-center'>
                    <h2 >What is this catalog?</h2>
                    <div className='catalog-content-p my-5 pt-5'>The SYRIOS catalog represents an ongoing effort to bring together examples of all the many and varied coins minted in ancient Syria from 400 BCE to 450 CE. Over 30 different mints produced coins within the region during this period, some of which were intended for local use and others destined to serve an empire.</div>
                    <div className='catalog-content-p'>Begin your search by choosing a mint, time period, material, image, issuing authority, or even language.</div>
                </div>

                <div className='catalog_section text-center'>
                    <h2 >Our research</h2>
                    <div className='catalog-content-p my-5 py-5'>Every coin from the ancient world has a story to tell. Some coins were minted for provincial governors or imperial states conquering Syria, while others were produced for local cities and communities. Some coins laud kings and emperors, while others celebrate the beliefs and values of the vibrant Syrian population. And yet, whether rich or poor, citizen or foreigner, young or old – all people used coins in their daily lives.</div>
                </div>

                <div className='catalog_section text-center'>
                    <h2 >Coin images from</h2>
                    <div className='catalog-content-p my-5 py-5'>Where a drawing appears instead of photograph, no digital image was available through museum or educational organizations. All drawings are based upon published coin type catalogs. Click on this video to learn more about the ethics and legality of coin collecting.</div>
                    <div className='catalog-VideoBox'>
                        Video place holder
                    </div>
                </div>

            </div>
        </>
    )
}
export default CoinCatalog
