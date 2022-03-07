import { Container} from "react-bootstrap"
import backGround from 'src/assets/background.jpg';

import { mainText, subText, subcomponent_image } from "../ComponentFunction/index";

const Frame2 = (zone, index, jsonObject) => {
    return (
      <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ?  undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
        <Container className='mb-5'>
          {mainText(zone.main_text)}
        </Container>
        {subText(zone.sub_text)}
        {subcomponent_image(zone.image)}
      </div>
    );
  }
export default Frame2