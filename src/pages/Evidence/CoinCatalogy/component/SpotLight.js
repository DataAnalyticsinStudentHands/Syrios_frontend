import React, {useState, useEffect} from 'react';
import Slider from 'react-slick';
import { SpotlightCard } from '../CoinList/Card';
import coinCollections from 'src/api/coin-collections';

const SpotLight = () => {
    const [spotLightdata, setSpotLightdata] = useState([])

    useEffect(()=>{
		const fetchData = async ()=>{
			const result = await coinCollections.coinSpotLight()
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
            style={{ ...style, display: "block", background: "", zIndex:'1'}}
            onClick={onClick}
          />
        );
      }
    const Slicksettings = {
        dots: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        // centerMode: true,
        pauseOnHover: true,
        lazyLoad: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };
  return (
        <Slider {...Slicksettings} className="spotLight">
            {spotLightdata.map((coin)=> <SpotlightCard coin={coin} key={coin.id}/>)}
        </Slider>
    )
};
export default SpotLight;
