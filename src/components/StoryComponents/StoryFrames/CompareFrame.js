import { Container, Row, Col} from "react-bootstrap"
import { HeadComponent, TextComponent } from "../ComponentFunction/index";
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import createMarkup from 'src/utils/Markup';

const CompareCoin = (props)=>{
    let coin_obverse_url = props.coin.coin.data.attributes.obverse_file.data.attributes.url
    let coin_obverse_alt = props.coin.coin.data.attributes.obverse_file.data.attributes.alternativeText
  
    let coin_reverse_url = props.coin.coin.data.attributes.reverse_file.data.attributes.url
    let coin_reverse_alt = props.coin.coin.data.attributes.reverse_file.data.attributes.alternativeText

    return(
      <Col>
        <Row className={`justify-content-center align-items-center`}>
            <ReactCompareSlider
                {...props}
                itemOne={
                    <ReactCompareSliderImage
                      src={`${process.env.REACT_APP_strapiURL}${coin_obverse_url}`}
                      alt={coin_obverse_alt}
                    />}
                itemTwo={
                    <ReactCompareSliderImage
                      src={`${process.env.REACT_APP_strapiURL}${coin_reverse_url}`}
                      alt={coin_reverse_alt}
                    />}
                style={{
                    display: "flex",
                    width:"25vmax"
                }}
                />
        </Row>
        <Row className={`justify-content-center align-items-center`}>
            <div 
              onClick={props.toggleBottom}
              dangerouslySetInnerHTML={createMarkup(props.coin.coin_caption)} 
              className={`story-caption text-center ${props.coin.caption_background? "light-blue-background":""}`}
              style={{width:"26vmax"}}
            />
        </Row>

      </Col>
    )
  }

const CompareFrame = (props)=>{
    let zone = props.zone
    let grid = {
        "half": 6,
        "third": 4,
        "quarter": 3,
      };
  return(
    <div className='section stories-background' style={{ backgroundImage: zone.background.data === null ? null : `url(${process.env.REACT_APP_strapiURL}${zone.background.data.attributes.url})`}}>
      {zone.head.updown_switch?(
        <Container>
          {zone.cc_text.text === '' && zone.cc_text.caption === '' ?(
            <Row className='d-flex justify-content-center align-items-center'><Col xs={`${grid[zone.grid_option]}`} className='d-flex justify-content-center'><CompareCoin coin={zone.cc_coin}/></Col></Row>
          ):(
            <Row className='d-flex justify-content-center align-items-center'>
              {zone.left_right_switch ? (<>
                <Col xs={`${grid[zone.grid_option]}`}><TextComponent toggleBottom={props.toggleBottom} text = {zone.cc_text}/></Col>
                <Col className='d-flex justify-content-center'><CompareCoin  coin={zone.cc_coin}/></Col>
                </>):(<>
                <Col className='d-flex justify-content-center'><CompareCoin  coin={zone.cc_coin}/></Col>
                <Col xs={`${grid[zone.grid_option]}`}><TextComponent toggleBottom={props.toggleBottom} text = {zone.cc_text}/></Col>
              </>)}
              </Row>)}                
          <Row className='d-flex justify-content-center mt-5'><HeadComponent toggleBottom={props.toggleBottom} storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/></Row>
        </Container>
      ):(
        <Container>
          <Row className='d-flex justify-content-center mb-5 '><HeadComponent toggleBottom={props.toggleBottom} storyMain = {zone.head.head_main} storyCaption = {zone.head.head_caption}/></Row>
          {zone.cc_text.text === '' && zone.cc_text.caption === '' ?(
            <Row className='d-flex justify-content-center align-items-center'>
              <Col xs={`${grid[zone.grid_option]}`} className='d-flex justify-content-center'>
                  <CompareCoin coin={zone.cc_coin}/>
              </Col>
            </Row>
          ):(
            <Row className='d-flex justify-content-center align-items-center'>
              {zone.left_right_switch ? (<>
                <Col xs={`${grid[zone.grid_option]}`}><TextComponent toggleBottom={props.toggleBottom} text = {zone.cc_text}/></Col>
                <Col className='d-flex justify-content-center'><CompareCoin  coin={zone.cc_coin}/></Col>
                </>):(<>
                <Col className='d-flex justify-content-center'><CompareCoin  coin={zone.cc_coin}/></Col>
                <Col xs={`${grid[zone.grid_option]}`}><TextComponent toggleBottom={props.toggleBottom} text = {zone.cc_text}/></Col>
              </>)}
            </Row>)}
        </Container>
      )}
        {props.index === 0 ? (<></>):(<button onClick={()=>props.fullpageApi.moveTo(1)} className='back-to-top'> BACK TO TOP <b className='back-to-top-icon'>&#xe807;</b></button> )}
    </div>
  )
}

export default CompareFrame
