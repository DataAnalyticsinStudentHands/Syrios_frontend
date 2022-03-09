/* eslint-disable eqeqeq */
import backGround from 'src/assets/background.jpg';
import { Container, Row, Col } from "react-bootstrap"
import ReactMarkdown from 'react-markdown';

import {IsEmptyOrWhiteSpace, mainText, capText, subcomponent_image } from "../ComponentFunction/index";

const Frame7 = (zone, index, jsonObject) =>{

    let sub_text_right_top = undefined
    if (!IsEmptyOrWhiteSpace(zone.sub_text_right_top)){
      sub_text_right_top =(
        <Row className='GrayText align-items-start SubText'>
          <ReactMarkdown>
            {zone.sub_text_right_top}
          </ReactMarkdown>
        </Row>
      )
    }
    let cap_text_right_bottom = undefined
    if (!IsEmptyOrWhiteSpace(zone.cap_text_bottom)){
      cap_text_right_bottom =(
        <Row className='LightYellowBackground align-items-end GrayText CaptionText' style={{padding: '20px', paddingTop: '20px'}}>
          <ReactMarkdown>
            {zone.cap_text_bottom}
          </ReactMarkdown>
        </Row>
      )
    }
  
    return(
      <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
        backgroundBlendMode:'multiply'}}>
          <Container className='mb-5'>
            {mainText(zone.main_text)}
          </Container>
          {capText(zone.cap_text_top)}
          <Container className='d-flex justify-content-between align-self-center my-5'>
              <Col xs={8} className='d-flex justify-content-between align-self-center'>
                {subcomponent_image(zone.image)}
              </Col>
              <Col xs={4} className='justify-content-between d-flex flex-column'>
                {sub_text_right_top}
                {cap_text_right_bottom}
              </Col>
          </Container>
          {capText(zone.cap_text_bottom)}
      </div>
    )
  }
  export default Frame7