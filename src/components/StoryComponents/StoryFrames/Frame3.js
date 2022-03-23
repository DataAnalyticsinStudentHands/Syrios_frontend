import backGround from 'src/assets/background.jpg';
import { mainText, subText, subcomponent_image_with_dynamic_sizing } from "../ComponentFunction/index";


const Frame3 = (zone, index, jsonObject) => {
    return (
      // eslint-disable-next-line eqeqeq
      <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ?  undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
        {subcomponent_image_with_dynamic_sizing(zone.images)}
        <div style={{marginTop: '-60px'}}>
          {mainText(zone.main_text)}
          {subText(zone.sub_text)}
        </div>
      </div>
    );
  }

  export default Frame3