import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import 'src/components/constants.css';
import './Stories.css';
import 'src/components/coin/CoinFlip.css';

function is_empty_or_white_space(str) {
  return str===undefined ? true : (str.match(/^\s*$/) || []).length > 0;
}

// These are more general exports. All functions may use them
const subcomponent_image = (image) => {
  // If light_blue_background is true, light_blue_caption_background should be false.
  // don't want to double the background causing opacity to double.
  image.light_blue_caption_background = image.light_blue_background ? false : image.light_blue_caption_background;
  
  let image_sizes = {
    "very_small": "50px",
    "small": "130px",
    "medium": "210px",
    "big": "290px",
    "very_big": "370px",
    "gigantic": "450px"
  };
  const image_brief_detail_font_size=Math.atan((parseInt(image_sizes[image.size])-250)/50)*30+50;

  let caption = undefined; 
  if (!is_empty_or_white_space(image.caption)) {
    caption = (
      <>
        <Container className={`d-flex justify-content-center align-items-center ${image.light_blue_caption_background ? "light-blue-background" : ""}`}>
          <ReactMarkdown 
            className='frame-image gray-text caption-text text-center' 
            style={{padding: '0px', paddingTop: '20px', fontSize:image_brief_detail_font_size}}
          >
            {image.caption}
          </ReactMarkdown>
        </Container>
      </>
    );
  }

  return (
    <Container className='d-flex justify-content-center align-items-center'>
      <div className={`${image.light_blue_background ? "light-blue-background" : ""}`} style={{padding: '20px', paddingBottom: '0px'}}>
        <Container className='d-flex justify-content-center align-items-center'>
          <img
            src={`${process.env.REACT_APP_strapiURL}${image.image.url}`}            
            alt={image.image.alternativeText === undefined ? 'img' : image.image.alternativeText}
            className='frame-image'
            width={image_sizes[image.size]} 
          />
        </Container>
        {caption}
      </div>
    </Container>
  );
}

const subcomponent_image_with_dynamic_sizing = (images) => {
  let image_sizes = {
    "very_small": "50px",
    "small": "130px",
    "medium": "210px",
    "big": "290px",
    "very_big": "370px",
    "gigantic": "450px"
  };

  let images_jsx = []
  images.forEach((image) => {
    const image_brief_detail_font_size=Math.atan((parseInt(image_sizes[image.size])-250)/50)*30+50;
    if (!is_empty_or_white_space(image.link) && !is_empty_or_white_space(image.brief_detail)) {
      images_jsx.push(
        <Col key={image.id} className='text-center'>
          <Link to={image.link} className='bland-style'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${image.image.url}`}
              alt='dynamic_image'
              width={image_sizes[image.size]}
            />
            <p className='orange-text' style={{fontSize: image_brief_detail_font_size}}>
              {image.brief_detail}
            </p>
          </Link>
        </Col>
      );
      return;
    }

    if (!is_empty_or_white_space(image.link)) {
      images_jsx.push(
        <Col key={image.id} className='text-center'>
          <Link to={image.link} className='bland-style'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${image.image.url}`}
              alt='dynamic_image'
              width={image_sizes[image.size]}/>
          </Link>
        </Col>
      );
      return;
    }

    if (!is_empty_or_white_space(image.brief_detail)) {
      images_jsx.push(
        <Col key={image.id} className='text-center'>
            <img
              src={`${process.env.REACT_APP_strapiURL}${image.image.url}`}
              alt='dynamic_image'
              width={image_sizes[image.size]}
              className='justify-content-center'
            />
            <p className='black-text' style={{fontSize: image_brief_detail_font_size}}>
              {image.brief_detail}
            </p>
        </Col>
      );
      return;
    }
  });
  return (
    <div>
      <Container>
        <Row style={{ marginTop: '80px', marginBottom: '150px'}} className='d-flex justify-content-center align-items-end'>
          {images_jsx}
        </Row>
      </Container>
    </div>
  );
}



// Title component for all stories
const Title = (zone, index, json_object) => {

  let main_text = undefined
  if (!is_empty_or_white_space(zone.main_text)){
    main_text = (
      <ReactMarkdown id='title-text' className='blue-text text-center'>
        {zone.main_text}
      </ReactMarkdown>
    )
  }

  let sub_text = undefined
  if (!is_empty_or_white_space(zone.sub_text)){
    sub_text = (
      <ReactMarkdown id='sub-title-text' className='orange-text text-center'>
        {zone.sub_text}
      </ReactMarkdown>
    )
  }
  let cap_text = undefined
  if (!is_empty_or_white_space(zone.cap_text)){
    cap_text = (
      <ReactMarkdown id='caption-title-text' className='gray-text text-center'>
        {zone.cap_text}
      </ReactMarkdown>
    )
  }
  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
      <Container className='d-flex justify-content-center align-items-center'>
        <img
          id='title-image'
          src={`${process.env.REACT_APP_strapiURL}${zone.image.url}`}
          alt={zone.image.alternativeText !== undefined ? zone.image.alternativeText : 'title image'} 
        />
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        {main_text}
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        {sub_text}
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        {cap_text}
      </Container>
    </div>
  );
}

const End_Frame = (zone, index, json_object) => {
  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
      <Container className='d-flex justify-content-center align-items-center'>
        <div id='end-frame-text'>
          <ReactMarkdown className='gray-text text-center sub-text'>
            {zone.sub_text}
          </ReactMarkdown>
        </div>
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        <p className='orange-text text-center main-text'>
          Are you ready to learn more?
        </p>
      </Container>
      <Container className='d-flex justify-content-center align-items-center'>
        <Row className='d-flex justify-content-around'>
          <Col >
            <Link to='/Stories'>
              <button	className='blue-text end-frame-button-width text-center'>
                Tell Me a Story
              </button>
            </Link>
          </Col>
          <Col>
            <Link to='/'>
              <button	className='blue-text end-frame-button-width text-center'>
                Explore Coins
              </button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}


const Frame1 = (zone, index, json_object) => {
  let sub_text = undefined;
  if (!is_empty_or_white_space(zone.sub_text_left) && !is_empty_or_white_space(zone.sub_text_right) && !is_empty_or_white_space(zone.caption_text_right)) {
    sub_text = (
      <Container className='d-flex justify-content-center align-items-center'>
        <Row>
          <Col xs={6}>
            <ReactMarkdown className='blue-text big-sub-text text-center'>
              {zone.sub_text_left}
            </ReactMarkdown>
          </Col>
          <Col xs={6} className='light-blue-background p-3'>
            <Row>
              <ReactMarkdown className='blue-text sub-text text-center'>
                {zone.sub_text_right}
              </ReactMarkdown>
            </Row>
            <Row>
              <ReactMarkdown className='gray-text caption-text text-center'>
                {zone.caption_text_right}
              </ReactMarkdown>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  if (sub_text === undefined && !is_empty_or_white_space(zone.sub_text_left)) {
    sub_text = (
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='gray-text big-sub-text text-center'>
          {zone.sub_text_left}
        </ReactMarkdown>
      </Container>
    );
  }

  if (sub_text === undefined && !is_empty_or_white_space(zone.sub_text_right)) {
    sub_text = (
      <Container className='d-flex justify-content-center align-items-center'>
        <Row>
          <ReactMarkdown className='blue-text sub-text text-center'>
            {zone.sub_text_right}
          </ReactMarkdown>
        </Row>
        <Row>
          <ReactMarkdown className='gray-text caption-text text-center'>
            {zone.caption_text_right}
          </ReactMarkdown>
        </Row>
      </Container>
    );
  }

  if (sub_text === undefined && !is_empty_or_white_space(zone.caption_text_right)) {
    sub_text = (
      <Container className='d-flex justify-content-center align-items-center'>
        <Row>
          <ReactMarkdown className='gray-text caption-text text-center'>
            {zone.caption_text_right}
          </ReactMarkdown>
        </Row>
      </Container>
    );
  }

  return (
    <div key={`story_comp_${index}`} className='section testSection' style={{ backgroundImage: zone.background == (undefined || null) ?  undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
      <Container>
        <ReactMarkdown className='orange-text main-text text-center'>
          {zone.main_text}
        </ReactMarkdown>
      </Container>
      {sub_text}
    </div>
  );
}


const Frame2 = (zone, index, json_object) => {

  let sub_text = undefined
  if (!is_empty_or_white_space(zone.sub_text)){
    sub_text = (
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='gray-text sub-text text-center'>
          {zone.sub_text}
        </ReactMarkdown>
      </Container>
    )
  }

  return (
    <div 
      key={`story_comp_${index}`} 
      className='section' 
      style={{ backgroundImage: zone.background == (undefined || null) ?  undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}
    >
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='orange-text main-text text-center'>
          {zone.main_text}
        </ReactMarkdown>
      </Container>
      {sub_text}
      {subcomponent_image(zone.image)}
    </div>
  );
}

const Frame3 = (zone, index, json_object) => {
  
  let main_text = undefined;
  if (zone.main_text !== undefined){
    main_text=(
      <Container style={{marginTop: '-110px'}}>
        <ReactMarkdown className='orange-text main-text text-center'>
          {zone.main_text}
        </ReactMarkdown>
      </Container>
    )
  }
  let sub_text = undefined;
  if (zone.sub_text !== undefined) {
    sub_text = (
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='gray-text sub-text text-center'>
          {zone.sub_text}
        </ReactMarkdown>
      </Container>
    );
  }
  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ?  undefined:`url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
      {subcomponent_image_with_dynamic_sizing(zone.images)}
      {main_text}
      {sub_text}
    </div>
  );
}

const Frame4 = (zone, index, json_object) =>{
  let main_text= undefined;
  if(!is_empty_or_white_space(zone.main_text)){
    main_text = (
      <Row className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='orange-text main-text text-center'>
          {zone.main_text}
        </ReactMarkdown>
      </Row>
    )
  }

  let sub_quote = undefined;

  if (!is_empty_or_white_space(zone.sub_text_left) && !is_empty_or_white_space(zone.sub_text_right)) {
    sub_quote = (
      <Row className='justify-content-around'>
          <Col md={{span:5}} className='light-blue-background justify-content-center align-self-center my-2'style={{padding: '20px', paddingTop: '20px' }} >
              <ReactMarkdown className='blue-text text-center sub-text' >
                {zone.sub_text_left}
              </ReactMarkdown>
              <ReactMarkdown className='gray-text text-center caption-text'>
                {zone.cap_text_left}
              </ReactMarkdown>
          </Col>
          <Col md={{span:5, offset:2}} className='light-blue-background justify-content-center align-self-center my-5' style={{padding: '20px', paddingTop: '20px'}}>
              <ReactMarkdown className='blue-text text-center sub-text'>
                {zone.sub_text_right}
              </ReactMarkdown>
              <ReactMarkdown className='gray-text text-center caption-text'>
                {zone.cap_text_right}
              </ReactMarkdown>   
          </Col>
      </Row>
    );
  }
  if (sub_quote === undefined && !is_empty_or_white_space(zone.sub_text_left)){
    sub_quote = (
      <Row className='justify-content-around' >
        <Col md={{span:5}} className='light-blue-background justify-content-center align-self-center' style={{padding: '20px', paddingTop: '20px'}}>
            <ReactMarkdown className='blue-text text-center sub-text' >
              {zone.sub_text_left}
            </ReactMarkdown>
            <ReactMarkdown className='gray-text text-center caption-text'>
              {zone.cap_text_left}
            </ReactMarkdown>
        </Col>
    </Row>
    )
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        <Container className='justify-content-center align-items-center' style={{marginTop:'-20%'}}>
            {main_text}
            {sub_quote}
        </Container>
    </div>
  )
}

const Frame5 = (zone, index, json_object) =>{
  let main_text = undefined
  if (!is_empty_or_white_space(zone.main_text)){
    main_text = (
      <Container>
        <ReactMarkdown className='orange-text main-text text-center'>
          {zone.main_text}
        </ReactMarkdown>
      </Container>

    )
  }
  let sub_text_middle = undefined
  if(zone.sub_text_middle.light_blue_caption_background){
    sub_text_middle = (
      <Col sm={6} className='align-self-center text-center sub-text px-0 py-3'>
        <ReactMarkdown className='light-blue-background sub-text gray-text'>
          {zone.sub_text_middle.sub_text}
        </ReactMarkdown>
      </Col>
    );
  }
  else{
    sub_text_middle = (
      <Col sm={3} className='align-self-center text-center sub-text'>
        <ReactMarkdown className=' sub-text mt-3 gray-text'>
          {zone.sub_text_middle.sub_text}
        </ReactMarkdown>
      </Col>
    );
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
          {main_text}
        <Container className='d-flex justify-content-around align-self-center'>
          <Row className='d-flex justify-content-between align-self-center'>
                <Col sm={3} style={{padding: '20px', paddingRight: '0px'}}>
                    {subcomponent_image(zone.image_left)}
                </Col>
                {sub_text_middle}
                <Col sm={3} style={{padding: '20px', paddingLeft: '0px'}}>
                    {subcomponent_image(zone.image_right)}
                </Col>
          </Row>
        </Container>
    </div>
  )
}

const Frame6 = (zone, index, json_object) =>{

  let main_text = undefined
  if (!is_empty_or_white_space(zone.main_text)){
    main_text = (
      <Container className='d-flex justify-content-around align-self-center'>
        <ReactMarkdown className='orange-text main-text text-center'>
          {zone.main_text}
        </ReactMarkdown>
      </Container>

    )
  }
  let sub_text_right=undefined
  if(!is_empty_or_white_space(zone.sub_text_right)){
    sub_text_right = (
      <ReactMarkdown className='blue-text text-center sub-text' >
        {zone.sub_text_right}
      </ReactMarkdown>
    )
  }
  let cap_text_right=undefined
  if(!is_empty_or_white_space(zone.cap_text_right)){
    cap_text_right = (
      <ReactMarkdown className='blue-text text-center caption-text' >
        {zone.cap_text_right}
      </ReactMarkdown>
    )
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined: `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        {main_text}
        <Container>
            <Row className='justify-content-around'>
                  <Col sm={6}>
                      {subcomponent_image(zone.image_left)}
                  </Col>
                  <Col sm={6} className='light-blue-background justify-content-center align-self-center' style={{padding: '20px', paddingTop: '20px'}}>
                      {sub_text_right}
                      {cap_text_right}
                  </Col>
                </Row>
        </Container>
    </div>
  )
}

const Frame7 = (zone, index, json_object) =>{

  let main_text = undefined
  if (!is_empty_or_white_space(zone.main_text)){
    main_text =(
      <Container className='d-flex justify-content-center align-self-center'>
          <ReactMarkdown className='orange-text main-text text-center'>
            {zone.main_text}
          </ReactMarkdown>
    </Container>
    )
  }
  let main_caption_text = undefined
  if (!is_empty_or_white_space(zone.main_caption_text)){
    main_caption_text =(
      <Container className='d-flex justify-content-center align-self-center'>
          <ReactMarkdown className='gray-text caption-text text-center'>
            {zone.main_caption_text}
          </ReactMarkdown>
    </Container>
    )
  }
  let cap_text_bottom = undefined
  if (!is_empty_or_white_space(zone.cap_text_bottom)){
    cap_text_bottom =(
      <Container className='d-flex justify-content-center align-self-center'>
      <Row className='my-3 text-center gray-text caption-text' id={'frame7-text-bottom'}>
          {zone.cap_text_bottom}
      </Row>
    </Container>
    )
  }
  let sub_text_right = undefined
  if (!is_empty_or_white_space(zone.sub_text_right)){
    sub_text_right =(
      <Row className='gray-text align-items-start sub-text'>
        <ReactMarkdown>
          {zone.sub_text_right}
        </ReactMarkdown>
      </Row>
    )
  }
  let cap_text_right = undefined
  if (!is_empty_or_white_space(zone.cap_text_right)){
    cap_text_right =(
      <Row className='light-yellow-background p-3 align-items-end gray-text caption-text'>
        <ReactMarkdown>
          {zone.cap_text_right}
        </ReactMarkdown>
      </Row>
    )
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        {main_text}
        {main_caption_text}
        <Container className='d-flex justify-content-center align-self-center py-5'>
            <Col xs={8}>
              {subcomponent_image(zone.image)}
            </Col>
            <Col xs={4} className='justify-content-around d-flex flex-column' id={''}>
              {sub_text_right}
              {cap_text_right}
            </Col>
        </Container>
        {cap_text_bottom}
    </div>
  )
}

const Frame8 = (zone, index, json_object) =>{
  
  let main_text = undefined
  if (!is_empty_or_white_space(zone.main_text)){
    main_text = (
        <ReactMarkdown>
          {zone.main_text}
        </ReactMarkdown>
    )
  }
  let sub_text_right=undefined
  if(!is_empty_or_white_space(zone.sub_text_right)){
    sub_text_right = (
      <ReactMarkdown className='blue-text text-center sub-text' >
        {zone.sub_text_right}
      </ReactMarkdown>
    )
  }
  let cap_text_right=undefined
  if(!is_empty_or_white_space(zone.cap_text_right)){
    cap_text_right = (
      <ReactMarkdown className='blue-text text-center caption-text' >
        {zone.cap_text_right}
      </ReactMarkdown>
    )
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        <Container className='justify-content-center'>
          <Row className='text-center'>
            {subcomponent_image(zone.image_top)}
          </Row>
          <Row className='justify-content-between'>
            <Col md={4}>
              {subcomponent_image(zone.image_left)}
            </Col>
            <Col md={8} className='justify-content-around d-flex flex-column'>
              <Row className='orange-text main-text text-center align-self-center my-3'>
                {main_text}
              </Row>
              <Row>
                <Col className='light-blue-background justify-content-around align-self-end' style={{padding: '20px', paddingTop: '20px'}}>
                  {sub_text_right}
                  {cap_text_right}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
    </div>
  )
}

const Frame9 = (zone, index, json_object) =>{
  
  let main_text = undefined
  if (!is_empty_or_white_space(zone.main_text)){
    main_text = (
        <ReactMarkdown className='orange-text main-text text-center'>
          {zone.main_text}
        </ReactMarkdown>
    )
  }
  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        <Container className='justify-content-center '>
          <Row className='d-flex justify-content-center py-3'>
            {main_text}
          </Row>
          <Row className=' justify-content-around '>
            <Col xs={9} sm={4} >
              {subcomponent_image(zone.image_left)}
            </Col>
            <Col xs={9} sm={4} className='d-flex align-items-center'>
              {subcomponent_image(zone.image_middle)}
            </Col>
            <Col xs={9} sm={4}>
              {subcomponent_image(zone.image_right)}
            </Col>
          </Row>

        </Container>
    </div>
  )
}
// Interactive frames
const interactive-frame1 = (zone, index, json_object) => {
  let blue_background_max_height = '200px';

  const FadeThenSwitchCompAndReset = (dom) => { // This function REQUIRES e.target to be compare scale or reset scale
    // There are more try catches here than the amount of classes you have to take to get a degree.
    let interactive_frame1_compare_scale = undefined;
    let interactive_frame1_reset_scale = undefined;
    // Avoid fast clickers from breaking website
    try {
      let compare_scale_active = true;

      // Are we rendering compare or reset scale?
      if (dom.className.includes('interactive_frame1_compare_scale')) {
        interactive_frame1_compare_scale = dom;
        interactive_frame1_reset_scale = dom.nextSibling;
        compare_scale_active = true;
      } else {
        interactive_frame1_compare_scale = dom.previousSibling;
        interactive_frame1_reset_scale = dom;
        compare_scale_active = false;
      }

      // Leave IF the compare scale to reset scale animation has yet to finish
      let computed_opacity_compare_scale = window.getComputedStyle(interactive_frame1_compare_scale).opacity;
      let computedOpacityResetScale = window.getComputedStyle(interactive_frame1_reset_scale).opacity;
      if (computed_opacity_compare_scale === 0 || computed_opacity_compare_scale === 1 || computedOpacityResetScale === 0 || computedOpacityResetScale === 1) {
        return 0;
      }

      // Get the row with light blue background because we need to do some display switch and opacity flipping on the sub elements
      let row_light_blue_background = dom;

      while (!row_light_blue_background.className.includes("row")) {
        row_light_blue_background = row_light_blue_background.parentElement;
      }
      row_light_blue_background = row_light_blue_background.previousSibling.previousSibling;

      let img_left_div = row_light_blue_background.childNodes[0].childNodes[0];
      let text_center_div = row_light_blue_background.childNodes[1];
      let img_right_div = row_light_blue_background.childNodes[2].childNodes[0];
      

      // If compare scale is active then switch to reset scale else switch to compare scale
      if (compare_scale_active) {
        // Compare scale to Reset scale
        interactive_frame1_compare_scale.style.opacity = '0.0';
        setTimeout(() => {
          try {
            interactive_frame1_compare_scale.style.display = 'none';
            interactive_frame1_reset_scale.style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              interactive_frame1_reset_scale.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // text center front to text center back
        text_center_div.childNodes[0].style.opacity = '0.0';
        setTimeout(() => {
          try {
            text_center_div.childNodes[0].style.display = 'none';
            text_center_div.childNodes[1].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              text_center_div.childNodes[1].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // image left front to image left back
        img_left_div.childNodes[1].style.opacity = '0.0';
        setTimeout(() => {
          try {
            img_left_div.childNodes[1].style.display = 'none';
            img_left_div.childNodes[2].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              img_left_div.childNodes[2].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // image right front to image right back
        img_right_div.childNodes[1].style.opacity = '0.0';
        setTimeout(() => {
          try {
            img_right_div.childNodes[1].style.display = 'none';
            img_right_div.childNodes[2].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              img_right_div.childNodes[2].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
      } else {
        // Reset scale to Compare scale
        interactive_frame1_reset_scale.style.opacity = '0.0';
        setTimeout(() => {
          try {
            interactive_frame1_compare_scale.style.display = 'block';
            interactive_frame1_reset_scale.style.display = 'none';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              interactive_frame1_compare_scale.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // text center back to text center front
        text_center_div.childNodes[1].style.opacity = '0.0';
        setTimeout(() => {
          try {
            text_center_div.childNodes[1].style.display = 'none';
            text_center_div.childNodes[0].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              text_center_div.childNodes[0].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // image left back to image left front
        img_left_div.childNodes[2].style.opacity = '0.0';
        setTimeout(() => {
          try {
            img_left_div.childNodes[2].style.display = 'none';
            img_left_div.childNodes[1].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              img_left_div.childNodes[1].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        // image right back to image right front
        img_right_div.childNodes[2].style.opacity = '0.0';
        setTimeout(() => {
          try {
            img_right_div.childNodes[2].style.display = 'none';
            img_right_div.childNodes[1].style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              img_right_div.childNodes[1].style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
      }
    } catch (error) {
      console.error(error);
    }

  };
  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == null ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
      <Container className='justify-content-center align-items-center'>
        {/* Main text */}
        <Row>
          <Col>
            <ReactMarkdown className='orange-text main-text text-center'>
              {zone.main_text}
            </ReactMarkdown>
          </Col>
        </Row>
        {/* Blue background css grid goodie */}
        <Row className='light-blue-background interactive-frame1-light-blue-sizing d-flex justify-content-around'>

          {/* Images left */}
          <Col xs={3}> 
            <div className='d-flex align-items-center justify-content-center interactive-frame1-image-outer-div' style={{height: '200px'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left_front.url}`}
                alt={is_empty_or_white_space(zone.image_left_front.alternativeText) ? 'Interactive_frame_left_front_image' : zone.image_left_front.alternativeText}
                className=' interactive-frame1-image-front-left'
                id='interactive-frame1'
              />
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left_back.url}`}
                alt={is_empty_or_white_space(zone.image_left_back.alternativeText) ? 'Interactive_frame_left_back_image' : zone.image_left_back.alternativeText}
                className=' interactive-frame1-image-back-left'
                id='interactive-frame1'
              />
            </div>
          </Col>

          {/* Text_center */}
          <Col xs={5} className='d-flex align-items-center justify-content-center' style={{height: blue_background_max_height}}>
            <ReactMarkdown className='gray-text sub-text text-center interactive-frame1-text-front'>
              {zone.sub_text_middle_front}
            </ReactMarkdown>
            <ReactMarkdown className='gray-text sub-text text-center interactive-frame1-text-back'>
              {zone.sub_text_middle_back}
            </ReactMarkdown>
          </Col>

          {/* Images Right */}
          <Col xs={3}> 
            <div className='d-flex align-items-center justify-content-center interactive-frame1-image-outer-div' style={{height: '200px'}}> {/* I fucking hate this. I HAVE to define the height element as an inline style. Not even !important css tag works in the Stories.css file */}
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right_front.url}`}
                alt={is_empty_or_white_space(zone.image_right_front.alternativeText) ? 'Interactive_frame_right_front_image' : zone.image_right_front.alternativeText}
                className=' interactive-frame1-image-front-right'
                id='interactive-frame1'
              />
              <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right_back.url}`}
                alt={is_empty_or_white_space(zone.image_right_back.alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right_back.alternativeText}
                className=' interactive-frame1-image-back-right'
                id='interactive-frame1'
              />
            </div>
          </Col>
        </Row>
        {/* Compare Scale */}
        <Row>
          <Col className='d-flex align-items-center justify-content-center'>
            <i 
              className='demo-icon icon-coin-scale interactive-frame1-scale-icon'
              onClick={(e)=> {
                // Find dom parent element for compare scale and reset scale
                let dom = e.target.parentElement.parentElement.nextSibling.childNodes[0].childNodes;
                if (window.getComputedStyle(dom[0]).display.includes('block')) { // if compare scale is block
                  FadeThenSwitchCompAndReset(dom[0]); // then return compare scale
                } else {
                  FadeThenSwitchCompAndReset(dom[1]); // else return reset scale
                }
              }}>
              &#xe834;</i>
          </Col>
        </Row>
        <Row>
          <Col 
            className='d-flex align-items-center justify-content-center'
            onClick={(e) => {FadeThenSwitchCompAndReset(e.target)}}>
            <p className='orange-text interactive_frame1_compare_scale'>
              Compare Scale
            </p>
            <p className='orange-text interactive_frame1_reset_scale'>
              Reset Scale
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

const interactive-frame2 = (zone, index, json_object) =>{

  let sub_text_middle_top = undefined
  if (!is_empty_or_white_space(zone.sub_text_middle_top)){
    sub_text_middle_top = (
      <Row>
        <ReactMarkdown className='gray-text sub-text text-center align-items-start'>
          {zone.sub_text_middle_top}
        </ReactMarkdown>
      </Row>
    )
  }
  let sub_text_middle_bottom = undefined
  if (!is_empty_or_white_space(zone.sub_text_middle_bottom)){
    sub_text_middle_bottom = (
      <Row>
        <ReactMarkdown className='gray-text sub-text text-center align-items-start'>
          {zone.sub_text_middle_bottom}
        </ReactMarkdown>
      </Row>
    )
  }

  const FlipCoin = (dom) =>{
    while (dom.className !== 'flip-box-inner') {
      dom = dom.nextSibling;
    }

    if (dom.style.transform === 'rotateY(180deg)') {
      dom.style.transform = 'rotateY(0deg)'
    } else {
      dom.style.transform = 'rotateY(180deg)';
    }
  }

  return(
    <div key={`story_comp_${index}`} className='section'style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
      <Container>
        <Row className='d-flex justify-content-between'>
          {/* image_lieft */}
          <Col className='light-blue-background d-flex align-items-center justify-content-center' xs={3}>
            <div className='flip-box'>
              <div className='flip-box-inner'>
                <div className='flip-box-front'>
                  {subcomponent_image(zone.image_left_front)}
                </div>
                <div className='flip-box-back'>
                  {subcomponent_image(zone.image_left_back)}
                </div>
              </div>
            </div>
          </Col>
          {/* text in the middle */}
          <Col xs={4} className='justify-content-around d-flex flex-column'>
              {sub_text_middle_top}
              <Row className='text-center align-items-center' >
                <Col>
                  <Row>
                    <Col className='d-flex align-items-center justify-content-center'>
                      <i 
                        className='demo-icon icon-coin-scale interactive-frame1-scale-icon'
                        onClick={(e)=> {
                          let dom = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                          
                          let coin_left = dom.childNodes[0].childNodes[0].childNodes[0]
                          let coin_right = dom.childNodes[2].childNodes[0].childNodes[0]
                          
                          FlipCoin(coin_left)
                          FlipCoin(coin_right)
                        }}>
                        &#xe833;</i>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {sub_text_middle_bottom}
          </Col>
          {/* image right */}
          <Col className='light-blue-background d-flex align-items-center justify-content-center' xs={3}>
            <div className='flip-box'>
              <div className='flip-box-inner'>
                <div className='flip-box-front'>
                  {subcomponent_image(zone.image_right_front)}
                </div>
                <div className='flip-box-back'>
                  {subcomponent_image(zone.image_right_back)}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

const interactive-frame3 = (zone, index, json_object) =>{

  const switchForFront = (dom) =>{
    
    let img_left_div = dom.childNodes[0].childNodes[0].childNodes[0]
    let text_left_div = dom.childNodes[0].childNodes[1].childNodes[0]
    let text_mid_div = dom.childNodes[1].childNodes[1].childNodes[0]
    let img_right_div = dom.childNodes[2].childNodes[0].childNodes[0]
    let text_right_div = dom.childNodes[2].childNodes[1].childNodes[0]

    img_left_div.childNodes[1].style.opacity = '0.0';
    setTimeout(() => {
      try {
        img_left_div.childNodes[1].style.display = 'none';
        img_left_div.childNodes[0].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          img_left_div.childNodes[0].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    text_left_div.childNodes[1].style.opacity = '0.0';
    setTimeout(() => {
      try {
        text_left_div.childNodes[1].style.display = 'none';
        text_left_div.childNodes[0].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          text_left_div.childNodes[0].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    text_mid_div.childNodes[1].style.opacity = '0.0';
    setTimeout(() => {
      try {
        text_mid_div.childNodes[1].style.display = 'none';
        text_mid_div.childNodes[0].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          text_mid_div.childNodes[0].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    img_right_div.childNodes[1].style.opacity = '0.0';
    setTimeout(() => {
      try {
        img_right_div.childNodes[1].style.display = 'none';
        img_right_div.childNodes[0].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          img_right_div.childNodes[0].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    text_right_div.childNodes[1].style.opacity = '0.0';
    setTimeout(() => {
      try {
        text_right_div.childNodes[1].style.display = 'none';
        text_right_div.childNodes[0].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          text_right_div.childNodes[0].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);


  }

  const switchForBack = (dom) =>{
    
    let img_left_div = dom.childNodes[0].childNodes[0].childNodes[0]
    let text_left_div = dom.childNodes[0].childNodes[1].childNodes[0]
    let text_mid_div = dom.childNodes[1].childNodes[1].childNodes[0]
    let img_right_div = dom.childNodes[2].childNodes[0].childNodes[0]
    let text_right_div = dom.childNodes[2].childNodes[1].childNodes[0]

    img_left_div.childNodes[0].style.opacity = '0.0';
    setTimeout(() => {
      try {
        img_left_div.childNodes[0].style.display = 'none';
        img_left_div.childNodes[1].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          img_left_div.childNodes[1].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    text_left_div.childNodes[0].style.opacity = '0.0';
    setTimeout(() => {
      try {
        text_left_div.childNodes[0].style.display = 'none';
        text_left_div.childNodes[1].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          text_left_div.childNodes[1].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    text_mid_div.childNodes[0].style.opacity = '0.0';
    setTimeout(() => {
      try {
        text_mid_div.childNodes[0].style.display = 'none';
        text_mid_div.childNodes[1].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          text_mid_div.childNodes[1].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    img_right_div.childNodes[0].style.opacity = '0.0';
    setTimeout(() => {
      try {
        img_right_div.childNodes[0].style.display = 'none';
        img_right_div.childNodes[1].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          img_right_div.childNodes[1].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);

    text_right_div.childNodes[0].style.opacity = '0.0';
    setTimeout(() => {
      try {
        text_right_div.childNodes[0].style.display = 'none';
        text_right_div.childNodes[1].style.display = 'block';
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        try {
          text_right_div.childNodes[1].style.opacity = '1.0';
        } catch (error) {
          console.error(error);
        }
      });
    }, 400);


  }

  let main_text = undefined
  if (!is_empty_or_white_space(zone.main_text)){
    main_text = (
        <ReactMarkdown className='orange-text main-text text-center'>
          {zone.main_text}
        </ReactMarkdown>
    )
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
      <Container>
        <Row>
          {main_text}
        </Row>
        <Row className='d-flex justify-content-around'>
          {/* image_lieft */}
          <Col className='light-blue-background' xs={3}>
              <Row className='mt-3'>
                <div className='d-flex align-items-center justify-content-center'> 
                  <img
                    src={`${process.env.REACT_APP_strapiURL}${zone.image_left_front.url}`}
                    alt={is_empty_or_white_space(zone.image_left_front.alternativeText) ? 'Interactive_frame_left_front_image' : zone.image_left_front.alternativeText}
                    style={{display:'block', opacity:1, transition:'0.3s',width:'200px'}}
                  />
                  <img
                    src={`${process.env.REACT_APP_strapiURL}${zone.image_left_back.url}`}
                    alt={is_empty_or_white_space(zone.image_left_back.alternativeText) ? 'Interactive_frame_left_front_image' : zone.image_left_back.alternativeText}
                    style={{display:'none', opacity:0, transition:'0.3s', width:'200px'}}
                  />
                </div>
              </Row>
              <Row className='p-3'>
                <div className='text-center caption-text gray-text'>
                  <ReactMarkdown style={{display:'block', opacity:1, transition:'0.3s'}}>
                    {zone.cap_text_left_front}
                  </ReactMarkdown>
                  <ReactMarkdown style={{display:'none', opacity:0, transition:'0.3s'}}>
                    {zone.cap_text_left_back}
                  </ReactMarkdown>
                </div>
              </Row>
          </Col>
          {/* text in the middle */}
          <Col xs={5} className='justify-content-between d-flex flex-column'>
              <Row className='d-flex justify-content-center'></Row>
              <Row className='d-flex justify-content-center' >
                <Col xs={{span:9}} className='text-center gray-text sub-text'>
                  <ReactMarkdown style={{display:'block', opacity:1, transition:'0.3s'}}>
                    {zone.cap_text_mid_front}
                  </ReactMarkdown>
                  <ReactMarkdown style={{display:'none', opacity:0, transition:'0.3s'}}>
                    {zone.cap_text_mid_back}
                  </ReactMarkdown>
                </Col>
              </Row>
              <Row className='d-flex justify-content-center'>
                <Col className='d-flex justify-content-center'>
                    <button	
                      className='blue-text text-center my-2' 
                      style={{width: '150px'}}
                      onClick={(e)=>{
                        let dom = e.target.parentElement.parentElement.parentElement.parentElement
                        switchForFront(dom)
                      }}
                    >
                      Government
                    </button>
                </Col>
                <Col className='d-flex justify-content-center'>
                    <button	
                      className='blue-text text-center my-2' 
                      style={{width: '150px'}}
                      onClick={(e)=>{
                        let dom = e.target.parentElement.parentElement.parentElement.parentElement
                        switchForBack(dom)
                      }}
                    >
                      Values
                    </button>
                </Col>
              </Row>
          </Col>
          {/* image right */}
          <Col className='light-blue-background' xs={3}>
              <Row className='mt-3'>
                <div className='d-flex align-items-center justify-content-center '> 
                  <img
                    src={`${process.env.REACT_APP_strapiURL}${zone.image_right_front.url}`}
                    alt={is_empty_or_white_space(zone.image_right_front.alternativeText) ? 'Interactive_frame_right_front_image' : zone.image_right_front.alternativeText}
                    style={{display:'block', opacity:1, transition:'0.3s',width:'200px'}}
                  />
                  <img
                    src={`${process.env.REACT_APP_strapiURL}${zone.image_right_back.url}`}
                    alt={is_empty_or_white_space(zone.image_right_back.alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right_back.alternativeText}
                    style={{display:'none', opacity:0, transition:'0.3s',width:'200px'}}
                  />
                </div>
              </Row>
              <Row className='p-3'>
                <div className='text-center caption-text gray-text'>
                  <ReactMarkdown style={{display:'block', opacity:1, transition:'0.3s'}}>
                    {zone.cap_text_right_front}
                  </ReactMarkdown>
                  <ReactMarkdown style={{display:'none', opacity:0, transition:'0.3s'}}>
                    {zone.cap_text_right_back}
                  </ReactMarkdown>
                </div>
              </Row>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

const interactive-frame4 = (zone, index, json_object) => {

  const frameWithTwoImage = (zone) =>{
    return(
      <Row className='d-flex justify-content-around'>
      <Col xs={3}>
        <Row className='d-flex align-items-stretch justify-content-between' >
          <Col xs={6} className='align-self-end'>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left[0].url}`}
                alt={is_empty_or_white_space(zone.image_left[0].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_left[0].alternativeText}
                id='interactive-frame4-image-S'
            />
          </Col>
          <Col xs={6}>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left[1].url}`}
                alt={is_empty_or_white_space(zone.image_left[1].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_left[1].alternativeText}
                id='interactive-frame4-image-M'
              />
          </Col>
        </Row>
        <Row className='text-center caption-text gray-text mt-4 light-blue-background '>
          <ReactMarkdown className='mt-3'>
            {zone.text_left}
          </ReactMarkdown>
        </Row>
      </Col>

      <Col xs={3} className='d-flex justify-content-center align-items-end'>
        <ReactMarkdown className='sub-text text-center gray-text'>
          {zone.text_mid}
        </ReactMarkdown>
      </Col>

      <Col xs={3}>
        <Row className='d-flex align-items-stretch justify-content-between' >
          <Col xs={6} className='align-self-end'>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right[0].url}`}
                alt={is_empty_or_white_space(zone.image_right[0].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right[0].alternativeText}
                id='interactive-frame4-image-S'
              />
          </Col>
          <Col xs={6}>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right[1].url}`}
                alt={is_empty_or_white_space(zone.image_right[1].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right[1].alternativeText}
                id='interactive-frame4-image-M'
              />
          </Col>
        </Row>
        <Row className='text-center caption-text gray-text mt-4 light-blue-background'>
          <ReactMarkdown className='mt-3'>
            {zone.text_right}
          </ReactMarkdown>
        </Row>
      </Col>
    </Row>
    )
  }
  const frameWithOneImage = (zone)=>{
    return(
      <Row className='d-flex justify-content-between'>
      <Col xs={3}>
        <Row className='d-flex align-items-stretch justify-content-center' >
          <Col className='d-flex justify-content-center'>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_left[0].url}`}
                alt={is_empty_or_white_space(zone.image_left[0].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_left[0].alternativeText}
                id='interactive-frame4-image-L'
            />
          </Col>
        </Row>
        <Row className='text-center caption-text gray-text mt-4 light-blue-background'>
          <ReactMarkdown className='mt-3'>
            {zone.text_left}
          </ReactMarkdown>
        </Row>
      </Col>

      <Col xs={3} className='d-flex justify-content-center align-items-end'>
        <ReactMarkdown className='sub-text text-center gray-text'>
          {zone.text_mid}
        </ReactMarkdown>
      </Col>

      <Col xs={3}>
        <Row className='d-flex justify-content-center' >
          <Col className='d-flex justify-content-center'>
            <img
                src={`${process.env.REACT_APP_strapiURL}${zone.image_right[0].url}`}
                alt={is_empty_or_white_space(zone.image_right[0].alternativeText) ? 'Interactive_frame_right_back_image' : zone.image_right[0].alternativeText}
                id='interactive-frame4-image-L'
              />
          </Col>
        </Row>
        <Row className='text-center caption-text gray-text mt-4 light-blue-background'>
          <ReactMarkdown className='mt-3'>
            {zone.text_right}
          </ReactMarkdown>
        </Row>
      </Col>
    </Row>
    )
  }
  const switchFrame = (dom,i) =>{

    let option1 = dom.childNodes[0]
    let option2 = dom.childNodes[1]
    let option3 = dom.childNodes[2]
    let option4 = dom.childNodes[3]

    switch(i){
      case 'option1':
        option2.style.opacity = '0.0';
        option3.style.opacity = '0.0';
        option4.style.opacity = '0.0';
        setTimeout(() => {
          try {
            option1.style.display = 'block';
            option2.style.display = 'none';
            option3.style.display = 'none';
            option4.style.display = 'none';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              option1.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
        break;
      case 'option2':
        option1.style.opacity = '0.0';
        option3.style.opacity = '0.0';
        option4.style.opacity = '0.0';
        setTimeout(() => {
          try {
            option1.style.display = 'none';
            option2.style.display = 'block';
            option3.style.display = 'none';
            option4.style.display = 'none';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              option2.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
          break;
      case 'option3':
        option1.style.opacity = '0.0';
        option2.style.opacity = '0.0';
        option4.style.opacity = '0.0';
        setTimeout(() => {
          try {
            option1.style.display = 'none';
            option2.style.display = 'none';
            option3.style.display = 'block';
            option4.style.display = 'none';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              option3.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);

        break;
      case 'option4':
        option2.style.opacity = '0.0';
        option1.style.opacity = '0.0';
        option3.style.opacity = '0.0';
        setTimeout(() => {
          try {
            option1.style.display = 'none';
            option2.style.display = 'none';
            option3.style.display = 'none';
            option4.style.display = 'block';
          } catch (error) {
            console.error(error);
          }
          setTimeout(() => {
            try {
              option4.style.opacity = '1.0';
            } catch (error) {
              console.error(error);
            }
          });
        }, 400);
        break;
      default:
    }


  }

  return (
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
      <Container className='my-3'>
        <ReactMarkdown className='orange-text main-text text-center'>
          {zone.title}
        </ReactMarkdown>
      </Container>
      <Container className='my-5'>
        <Row className='d-flex justify-content-between'>
          <Col xs={6} sm={3} className='d-flex justify-content-center'>
            <button	
              className='blue-text text-center my-2' 
              onClick={(e)=>{
                let i = 'option1'
                let dom = e.target.parentElement.parentElement.nextSibling
                switchFrame(dom,i)
              }}
            >
              Denomination
            </button>
          </Col>
          <Col xs={6} sm={3} className='d-flex justify-content-center'>
            <button	
              className='blue-text text-center my-2' 
              onClick={(e)=>{
                let i = 'option2'
                let dom = e.target.parentElement.parentElement.nextSibling
                switchFrame(dom,i)
              }}
            >
              Mint Date
            </button>
          </Col>
          <Col xs={6} sm={3} className='d-flex justify-content-center'>
            <button	
              className='blue-text text-center my-2' 
              onClick={(e)=>{
                let i = 'option3'
                let dom = e.target.parentElement.parentElement.nextSibling
                switchFrame(dom,i)
              }}
            >
              Mint Marks
            </button>
          </Col>
          <Col xs={6} sm={3} className='d-flex justify-content-center'>
            <button	
              className='blue-text text-center my-2' 
              onClick={(e)=>{
                let i = 'option4'
                let dom = e.target.parentElement.parentElement.nextSibling
                switchFrame(dom,i)
              }}
            >
              Other Marks
            </button>
          </Col>
        </Row>
        <Row className='mt-5 d-flex justify-content-around' style={{height: '200px'}} >
            <div style={{display:'block', opacity:'1.0', transition:'0.3s'}}>
              {frameWithTwoImage(zone.image_component[0])}
            </div>
            <div style={{display:'none', opacity:'0.0', transition:'0.3s'}}>
              {frameWithOneImage(zone.image_component[1])}
            </div>
            <div style={{display:'none', opacity:'0.0', transition:'0.3s'}}>
              {frameWithOneImage(zone.image_component[2])}
            </div>
            <div style={{display:'none', opacity:'0.0', transition:'0.3s'}}>
              {frameWithOneImage(zone.image_component[3])}
            </div>
        </Row>
      </Container>
    </div>
  );
}

const Testframe =(zone, index, json_object) =>{

  let instance = []
  for (var i = 0; i < json_object.results.bindings.length; i++){
    instance.push(json_object.results.bindings[i].image.value)
  }

  return(
    <div key={`story_comp_${index}`} className='section'  style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
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
              src={json_object.results.bindings[0].image.value} 
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
const Testframe2 =(zone, index, json_object) =>{

  let instance = []
  for (var i = 0; i < json_object.results.bindings.length; i++){
    instance.push(json_object.results.bindings[i].instanceLabel.value)
  }

  return(
    <div key={`story_comp_${index}`} className='section' style={{ backgroundImage: zone.background == (undefined || null) ? undefined : `url(${process.env.REACT_APP_strapiURL}${zone.background.url})`}}>
        <Container>
          <Row>
            {json_object.results.bindings[0].instanceLabel.value}
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
const SwitchComponent = (zone, index, json_object, fullpageApi,) => {
  let jsx = undefined;
  switch (zone.__component) {
    case 'frame.title':
      jsx = Title(zone, index, json_object);
      break;
    case 'frame.endframe':
      jsx = End_Frame(zone, index,json_object);
      break;
    case 'frame.frame1':
      jsx = Frame1(zone, index,json_object);
      break;
    case 'frame.frame2':
      jsx = Frame2(zone, index,json_object);
      break;
    case 'frame.frame3':
      jsx = Frame3(zone, index,json_object);
      break;
    case 'frame.frame4':
      jsx = Frame4(zone, index,json_object);
      break;
    case 'frame.frame5':
      jsx = Frame5(zone, index, json_object);
      break;
    case 'frame.frame6':
      jsx = Frame6(zone, index, json_object);
      break;
    case 'frame.frame7':
      jsx = Frame7(zone, index, json_object);
      break;
    case 'frame.frame8':
      jsx = Frame8(zone, index, json_object);
      break;
    case 'frame.frame9':
      jsx = Frame9(zone, index, json_object);
      break; 
    case 'frame.interactive-frame1':
      jsx = interactive-frame1(zone, index, json_object);
      break;
    case 'frame.interactive-frame2':
      jsx = interactive-frame2(zone, index, json_object);
      break;
    case 'frame.interactive-frame3':
      jsx = interactive-frame3(zone, index, json_object);
      break;
    case 'frame.interactive-frame4':
      jsx = interactive-frame4(zone, index, json_object);
      break;
    case 'frame.testframe':
      jsx = Testframe(zone, index, json_object);
      break;
    case 'frame.testframe2':
      jsx = Testframe2(zone, index, json_object);
      break;
    default:
      console.error(`Error: Unrecognized component '${zone.__component}'`);
  }

  return jsx;
}

export default SwitchComponent
