/* eslint-disable eqeqeq */
import { Container, Row, Col} from "react-bootstrap"

import { HeadComponent} from "../ComponentFunction/index";
import createMarkup from 'src/utils/Markup.js';

const FadeButton = (props)=>{
  let buttonOptin = []
  for (let i=0; i<props.options.length; i++){
    buttonOptin.push(
      <Col xs={2} className="text-center" key={i}>
      <button className='fade-frame-button '
        onClick={(e)=>{
          let dom = e.target.parentElement.parentElement.parentElement
          toShow(dom,i,props.options.length)
        }}> {props.options[i].topic}
      </button>
    </Col>
    )
  }
  if(props.options.length == 2) return(<Row className='justify-content-center fade-2button-row'>{buttonOptin}</Row>)
  if(props.options.length == 4) return(<Row className='justify-content-around fade-4button-row'>{buttonOptin}</Row>)}

const FadeBody = (props)=>{
  // console.log(props)
  let coin_left = props.coin.coin_left.data.attributes
  let sourUrl_left = coin_left.source_image
  let coin_left_url = undefined
  let coin_left_alt = undefined
  if(props.coin.left_coin_obverse_or_reverse){
    coin_left_url = coin_left.reverse_file.data.attributes.url
    coin_left_alt = coin_left.reverse_file.data.attributes.alternativeText
  }
  else{
    coin_left_url = coin_left.obverse_file.data.attributes.url
    coin_left_alt = coin_left.obverse_file.data.attributes.alternativeText
  }

  let coin_right = props.coin.coin_right.data.attributes
  let sourUrl_right = coin_right.source_image
  let coin_right_url = undefined
  let coin_right_alt = undefined
  if(props.coin.right_coin_obverse_or_reverse){
    coin_right_url = coin_right.reverse_file.data.attributes.url
    coin_right_alt = coin_right.reverse_file.data.attributes.alternativeText
  }
  else{
    coin_right_url = coin_right.obverse_file.data.attributes.url
    coin_right_alt = coin_right.obverse_file.data.attributes.alternativeText
  }
  return(
    <>      
      <Col xs={3} className={`px-3 ${props.coin.caption_or_all? 'light-blue-background':''}`} >
        <Row>
          <a href={`${sourUrl_left}`} target="_blank" rel="noopener noreferrer" className={`text-center`}>
            <img 
              src={`${process.env.REACT_APP_strapiURL}${coin_left_url}`} 
              alt={coin_left_alt}
              style={{width:"15vmax", marginTop:"20px"}}/>
          </a>
        </Row>
        <Row className={`px-3 ${props.coin.caption_or_all? '':'light-blue-background'}`}>
            <div 
              onClick={props.toggleBottom}
              dangerouslySetInnerHTML={createMarkup(props.coin.caption_left)} 
              className={`story-caption text-center`}
              style={{ marginTop:"20px"}}/>
        </Row>
      </Col>
      <Col xs={3} className="align-self-center">
          <div 
            onClick={props.toggleBottom}
            dangerouslySetInnerHTML={createMarkup(props.coin.caption)} 
            className={`story-text text-center`}
          />
      </Col>
      <Col xs={3} className={` px-3 ${props.coin.caption_or_all? 'light-blue-background':''}`}>
        <Row>
          <a href={`${sourUrl_right}`} target="_blank" rel="noopener noreferrer" className={`text-center`}>
            <img 
              src={`${process.env.REACT_APP_strapiURL}${coin_right_url}`} 
              alt={coin_right_alt}
              style={{width:"15vmax", marginTop:"20px"}}
            />
          </a>
        </Row>
        <Row className={` px-3 ${props.coin.caption_or_all? '':'light-blue-background'}`}>
            <div 
              onClick={props.toggleBottom}
              dangerouslySetInnerHTML={createMarkup(props.coin.caption_right)} 
              className={`story-caption text-center`}
              style={{marginTop:"20px"}}
            />
        </Row>
      </Col>
    </>
  )
}

const FadeBack = (props)=>{
  let fadeBack = []
  for(let body = 1; body<props.bodys.length; body++){
    fadeBack.push(
      <div className='fade-back'key={body}>
        <div className='d-flex justify-content-around'style={{height:'22vmax'}}>
          <FadeBody toggleBottom={props.toggleBottom} coin = {props.bodys[body]} />
        </div>
      </div>
    )
  }
  return(<>{fadeBack}</>)
}

function toShow (dom,index, length) {
  if (length == 2){
    let Option0 = dom.childNodes[0]
    let Option1 = dom.childNodes[1]
  
    switch(index){
      case 0:
        Option1.style.opacity = '0.0'
        setTimeout(()=>{
          try{
            Option1.style.display ='none';
            Option0.style.display = 'block'
          }catch(error){
            console.error(error)
          }
          setTimeout(() => {
            try {
              Option0.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        },400);
        break;
      case 1:
        Option0.style.opacity = '0.0'
        setTimeout(()=>{
          try{
            Option0.style.display ='none';
            Option1.style.display = 'block';
          }catch(error){
            console.error(error)
          }
          setTimeout(() => {
            try {
              Option1.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        },400);
      break;
  
      default:
        console.log('Only take 2 or 4 options')
    }
  }
  if (length == 4 ){
    let Option0 = dom.childNodes[0]
    let Option1 = dom.childNodes[1]
    let Option2 = dom.childNodes[2]
    let Option3 = dom.childNodes[3]

    switch(index){
      case 0:
        Option1.style.opacity = '0.0'
        Option2.style.opacity = '0.0'
        Option3.style.opacity = '0.0'
        setTimeout(()=>{
          try{
            Option0.style.display = 'block';
            Option1.style.display = 'none';
            Option2.style.display = 'none';
            Option3.style.display = 'none';
          }catch(error){
            console.error(error)
          }
          setTimeout(() => {
            try {
              Option0.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        },400);
        break;
      case 1:
        Option0.style.opacity = '0.0'
        Option2.style.opacity = '0.0'
        Option3.style.opacity = '0.0'
        setTimeout(()=>{
          try{
            Option0.style.display = 'none';
            Option1.style.display = 'block';
            Option2.style.display = 'none';
            Option3.style.display = 'none';
          }catch(error){
            console.error(error)
          }
          setTimeout(() => {
            try {
              Option1.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        },400);
      break;
      case 2:
        Option0.style.opacity = '0.0'
        Option1.style.opacity = '0.0'
        Option3.style.opacity = '0.0'
        setTimeout(()=>{
          try{
            Option0.style.display = 'none';
            Option1.style.display = 'none';
            Option2.style.display = 'block';
            Option3.style.display = 'none';
          }catch(error){
            console.error(error)
          }
          setTimeout(() => {
            try {
              Option2.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        },400);
      break;
      case 3:
        Option0.style.opacity = '0.0'
        Option1.style.opacity = '0.0'
        Option2.style.opacity = '0.0'
        setTimeout(()=>{
          try{
            Option0.style.display = 'none';
            Option1.style.display = 'none';
            Option2.style.display = 'none';
            Option3.style.display = 'block';
          }catch(error){
            console.error(error)
          }
          setTimeout(() => {
            try {
              Option3.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        },400);
      break;
  
      default:
        console.log('Only take 2 or 4 options')
    }
  }
  
}

const FadeFrame = (props) =>{
  let zone = props.zone
    return(
      <div className='section stories-background' style={{ backgroundImage: zone.background.data === null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url})`}}>
      {zone.head.updown_switch?(
        <Container>
          <Container >
            <div className='fade-front'>
              <div className='d-flex justify-content-between ' style={{height:'22vmax'}}>
                  <FadeBody toggleBottom={props.toggleBottom} coin = {zone.fades[0]}/>
              </div>
            </div>
            <FadeBack toggleBottom={props.toggleBottom} bodys={zone.fades}/>
            <FadeButton options = {zone.fades} />
          </Container>  
          <Row className='d-flex justify-content-center mt-5'><HeadComponent storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/></Row>
        </Container>
      ):(
        <Container>
          <Row className='d-flex justify-content-center mb-5'><HeadComponent storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/></Row>
          <Container className="pt-5">
            <div className='fade-front'>
              <div className='d-flex justify-content-between ' style={{height:'22vmax'}}>
                  <FadeBody toggleBottom={props.toggleBottom} coin = {zone.fades[0]}/>
              </div>
            </div>
            <FadeBack toggleBottom={props.toggleBottom} bodys={zone.fades}/>
            <FadeButton options = {zone.fades} />
          </Container>       
        </Container>
      )}
        {props.index === 0 ? (<></>):(<button onClick={()=>props.fullpageApi.moveTo(1)} className='back-to-top'> BACK TO TOP <b className='back-to-top-icon'>&#xe807;</b></button> )}
    </div>
    )
  }

  export default FadeFrame
