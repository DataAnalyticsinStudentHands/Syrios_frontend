import subcomponent_image_only from "./subcomponent_image_only"

const FlipCoinImg = (img_fornt, img_back) =>{
    let Coin = undefined
    Coin = (
      <div className='flip-box'>
        <div className='flip-box-inner'>
          <div className='flip-box-front'>
            {subcomponent_image_only(img_fornt)}
          </div>
          <div className='flip-box-back'>
            {subcomponent_image_only(img_back)}
          </div>
        </div>
      </div>
    )
    return(
      Coin
    )
  }

  export default FlipCoinImg