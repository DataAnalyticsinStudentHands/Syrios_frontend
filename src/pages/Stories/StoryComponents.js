import {
  Container,
  Row,
} from 'react-bootstrap';

import 'src/components/constants.css';
import './Stories.css';
import 'src/components/coin/coinFlip.css';
import backGround from 'src/assets/background.jpg';

import Title from 'src/components/StoryComonents/StoryFrames/Title';
import End_Frame from 'src/components/StoryComonents/StoryFrames/End_Frame';
import Frame1 from 'src/components/StoryComonents/StoryFrames/Frame1';
import Frame2 from 'src/components/StoryComonents/StoryFrames/Frame2';
import Frame3 from 'src/components/StoryComonents/StoryFrames/Frame3';
import Frame4 from 'src/components/StoryComonents/StoryFrames/Frame4';
import Frame5 from 'src/components/StoryComonents/StoryFrames/Frame5';
import Frame6 from 'src/components/StoryComonents/StoryFrames/Frame6';
import Frame7 from 'src/components/StoryComonents/StoryFrames/Frame7';
import Frame8 from 'src/components/StoryComonents/StoryFrames/Frame8';
import Frame9 from 'src/components/StoryComonents/StoryFrames/Frame9';
import Frame10 from 'src/components/StoryComonents/StoryFrames/Frame10';
import InteractiveFrame1 from 'src/components/StoryComonents/StoryFrames/InteractiveFrame1';
import InteractiveFrame2 from 'src/components/StoryComonents/StoryFrames/InteractiveFrame2';
import InteractiveFrame3 from 'src/components/StoryComonents/StoryFrames/InteractiveFrame3';
import InteractiveFrame4 from 'src/components/StoryComonents/StoryFrames/InteractiveFrame4';
import InteractiveFrame5 from 'src/components/StoryComonents/StoryFrames/InteractiveFrame5';

const Testframe =(zone, index, jsonObject) =>{

  //console.log(jsonObject, 'Yee! I get the image link');
  let instance = []
  for (var i = 0; i < jsonObject.results.bindings.length; i++){
    instance.push(jsonObject.results.bindings[i].image.value)
  }
  //console.log(instance);

  return(
    <div key={`story_comp_${index}`} className='section'  style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
        <Container>
          <Row>
            <img
              src={zone.image_link}
              alt= {'test img link'}
              style={{'max-height':'180px','max-width':'180px'}}
            />
          </Row>
          <Row>
            <img
              src={jsonObject.results.bindings[0].image.value} 
              alt= {'test img link 2'}
              style={{'max-height':'180px','max-width':'180px'}}
            />
          </Row>
          <Row>
          <img
              src={instance[1]}
              alt= {'test img link 2'}
              style={{'max-height':'180px','max-width':'180px'}}
            />
          </Row>
        </Container>
    </div>
  )
}
const Testframe2 =(zone, index, jsonObject) =>{

  //console.log(jsonObject.results.bindings);
  let instance = []
  for (var i = 0; i < jsonObject.results.bindings.length; i++){
    instance.push(jsonObject.results.bindings[i].instanceLabel.value)
  }
  //console.log(instance);

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply'}}>
        <Container>
          <Row>
            {jsonObject.results.bindings[0].instanceLabel.value}
          </Row>
          <Row>
            {instance[0]}
          </Row>
        </Container>
    </div>
  )
}

// This function is for mapping name and functions over.
// Did this for organization really. 
const SwitchComponent = (zone, index, jsonObject, fullpageApi,) => {
  let jsx = undefined;
  switch (zone.__component) {
    case 'frame.title':
      jsx = Title(zone, index, jsonObject);
      break;
    case 'frame.endframe':
      jsx = End_Frame(zone, index,jsonObject);
      break;
    case 'frame.frame1':
      jsx = Frame1(zone, index,jsonObject);
      break;
    case 'frame.frame2':
      jsx = Frame2(zone, index,jsonObject);
      break;
    case 'frame.frame3':
      jsx = Frame3(zone, index,jsonObject);
      break;
    case 'frame.frame4':
      jsx = Frame4(zone, index,jsonObject);
      break;
    case 'frame.frame5':
      jsx = Frame5(zone, index, jsonObject);
      break;
    case 'frame.frame6':
      jsx = Frame6(zone, index, jsonObject);
      break;
    case 'frame.frame7':
      jsx = Frame7(zone, index, jsonObject);
      break;
    case 'frame.frame8':
      jsx = Frame8(zone, index, jsonObject);
      break;
    case 'frame.frame9':
      jsx = Frame9(zone, index, jsonObject);
      break; 
    case 'frame.frame10':
      jsx = Frame10(zone, index, jsonObject);
      break; 
    case 'frame.interactive-frame1':
      jsx = InteractiveFrame1(zone, index, jsonObject);
      break;
    case 'frame.interactive-frame2':
      jsx = InteractiveFrame2(zone, index, jsonObject);
      break;
    case 'frame.interactive-frame3':
      jsx = InteractiveFrame3(zone, index, jsonObject);
      break;
    case 'frame.interactive-frame4':
      jsx = InteractiveFrame4(zone, index, jsonObject);
      break;
    case 'frame.interactive-frame5':
      jsx = InteractiveFrame5(zone, index, jsonObject);
      break;
    case 'frame.testframe':
      jsx = Testframe(zone, index, jsonObject);
      break;
    case 'frame.testframe2':
      jsx = Testframe2(zone, index, jsonObject);
      break;
    default:
      console.error(`Error: Unrecognized component '${zone.__component}'`);
  }

  return jsx;
}

export default SwitchComponent
