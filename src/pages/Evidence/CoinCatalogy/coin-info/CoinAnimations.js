import React, {useState, useEffect} from "react";

function CoinScaleAndFlip(props) {
    const [coin_rotation, set_coin_rotation] = useState('rotateY(0deg)');
    const [dotted_circle_height, set_dotted_circle_height] = useState('0%');
    const [is_img_scaled, set_is_img_scaled] = useState(false);
    const [size_diameter_jsx, set_size_diameter_jsx] = useState('0');
  
    const ResetCoin = () => {
      set_coin_rotation('rotateY(0deg)');
      set_dotted_circle_height('0%');
      set_is_img_scaled(false);
    };
  
    useEffect(() => {
      ResetCoin();
    }, [props?.coinMetaData]);
  
    useEffect(() => {
      if (is_img_scaled)
        set_size_diameter_jsx('3em');
      else
        set_size_diameter_jsx('0');
    }, [is_img_scaled, props?.diameter]);
  
    const ScaleCoin = () => {
      if (is_img_scaled) {
        set_dotted_circle_height('0%');
      } else {
        set_dotted_circle_height('80%');
  
        const box_percent = 100;
        const box_height_mm = 62.5;
        let height_of_coin_percent = (box_percent / box_height_mm) * props?.diameter;
  
        if (height_of_coin_percent == null || height_of_coin_percent === 0) {
          height_of_coin_percent = 5;
        }
      }
      
      set_is_img_scaled(!is_img_scaled);
    };
  
    const RotateCoin = () => {
      if (coin_rotation.includes('(0deg)')) {
        set_coin_rotation('rotateY(180deg)');
      } else {
        set_coin_rotation('rotateY(0deg)');
      }
    };

  
    return (
      <div className='coin-image-box'>
        <div className='coin-info-dotted-circle' style={{height: dotted_circle_height}}/>
        <div className='coin-info-image-diameter-box coin-info-dark-text' style={{fontSize: size_diameter_jsx}}>
          DIAMETER: {props?.diameter == null ? 'N/A' : `${props?.diameter}mm`}
          </div>
          <div className='flip-box'>
            <div className='flip-box-inner' style={{ transform: coin_rotation }}>
            <div className='flip-box-front'>
              <img
                alt={props.obverseImg?.data?.attributes}
                className='coin-info-image-flip coin-info-image-flip-front'
                src={process.env.REACT_APP_UPLOAD_URL + props.obverseImg?.data?.attributes?.url}
              />
            </div>
            <div className='flip-box-back'>
              <img
                alt={props.reverseImg?.data?.attributes}
                className='coin-info-image-flip coin-info-image-flip-back'
                src={process.env.REACT_APP_UPLOAD_URL + props.reverseImg?.data?.attributes?.url}
              />
            </div>
          </div>
        </div>
        {/*** Scale and Rotate button. MUST be rendered after coin image ***/}
        <div
          className='demo-icon coin-info-icon-rotate'
          onClick={RotateCoin}>
          &#xe833;
        </div>   
        <div
          className='demo-icon coin-info-scale-icon'
          onClick={ScaleCoin}>
        &#xe834;
        </div>
      </div>
    );
  }
  export default CoinScaleAndFlip