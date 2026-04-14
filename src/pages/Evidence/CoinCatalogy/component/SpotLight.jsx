/**
 * SpotLight.jsx — Data Compatibility Note (2026)
 *
 * Notes:
 * - Passes raw coin objects to SpotlightCard
 * - Card.jsx now handles normalization internally
 *
 * Why:
 * - Previous mismatch between `coin` and `coin.attributes`
 *   caused missing images in spotlight carousel
 *
 * Outcome:
 * - No changes required here after Card.jsx refactor
 */

import React from 'react';
import Slider from 'react-slick';
import { SpotlightCard } from '../CoinList/Card';

const SpotLight = (props) => {
  const { data } = props;

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
            { data.length > 0 && data.map((coin)=> <SpotlightCard coin={coin} key={coin.id}/>)}
        </Slider>
    )
};
export default SpotLight;