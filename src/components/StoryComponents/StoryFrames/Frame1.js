import { Container, Row, Col } from "react-bootstrap"
import backGround from 'src/assets/background.jpg';
import { mainText, bigSubText, subText, capText, IsEmptyOrWhiteSpace, sub_cap_blue_bg } from "../ComponentFunction/index";

const Frame1 = (zone, index, jsonObject) => {
    let subtext = undefined;
    if (!IsEmptyOrWhiteSpace(zone.sub_text_left) && !IsEmptyOrWhiteSpace(zone.sub_text_right) && !IsEmptyOrWhiteSpace(zone.caption_text_right)) {
      subtext = (
        <Container className='d-flex justify-content-center align-items-center'>
          <Row>
            <Col xs={6}>
              {bigSubText(zone.sub_text_left)}
            </Col>
            <Col xs={6} className='p-3'>
              {/* <Row>
                {subText(zone.sub_text_right)}
              </Row>
              <Row>
                {capText(zone.caption_text_right)}
              </Row> */}
              {sub_cap_blue_bg(zone.sub_text_right,zone.caption_text_right)}
            </Col>
          </Row>
        </Container>
      );
    }
  
    if (subtext === undefined && !IsEmptyOrWhiteSpace(zone.sub_text_left)) {
      subtext = (
        <Container className='d-flex justify-content-center align-items-center'>
          {bigSubText(zone.sub_text_left)}
        </Container>
      );
    }
  
    if (subtext === undefined && !IsEmptyOrWhiteSpace(zone.sub_text_right)) {
      subtext = (
        <Container className='d-flex justify-content-center align-items-center'>
          <Row>
            {subText(zone.sub_text_right)}
          </Row>
          <Row>
            {capText(zone.caption_text_right)}
          </Row>
        </Container>
      );
    }
  
    if (subtext === undefined && !IsEmptyOrWhiteSpace(zone.caption_text_right)) {
      subtext = (
        <Container className='d-flex justify-content-center align-items-center'>
          <Row>
            {capText(zone.caption_text_right)}
          </Row>
        </Container>
      );
    }
  
    return (
      // eslint-disable-next-line eqeqeq
      <div key={`story_comp_${index}`} className='section testSection' style={{ backgroundImage: zone.background == (undefined || null) ?  undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url}),url(${backGround})`,
      backgroundBlendMode:'multiply' }}>
        <Container className='mb-5'>
          {mainText(zone.main_text)}
        </Container>
        {subtext}
      </div>
    );
  }
  export default Frame1