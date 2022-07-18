/* eslint-disable eqeqeq */
import { Container, Row, Col } from "react-bootstrap"
// import { Link } from 'react-router-dom';

function createMarkup(textTran){
  return {__html: textTran};
}

export function IsEmptyOrWhiteSpace(str) {
  return str=== null ? true : (str.match(/^\s*$/) || []).length > 0;
}

export const HeadComponent = (props)=>{
  return(
    <Col>
      <div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(props.storyMain)} className='story-h2 text-center'/>
      <div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(props.storyCaption)} className='story-text text-center'/>
    </Col>
  )
}

export const TextComponent = (props)=>{
  let component_background = {
    "null":'',
    "light-blue-background":"light-blue-background",
    "light-yellow-background":"light-yellow-background",
  };
  let text = props.text
    if(text.text==""||text.text==null){
      return(
        <Container className={`${component_background[text.background_color]}`} style={{padding: '20px', paddingTop: '20px'}}>
          <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='story-text text-center'/>
        </Container>
      )
    }
    else if (text.caption == "" || text.caption == null){
      return(
        <Container className={`${component_background[text.background_color]}`} style={{padding: '20px', paddingTop: '20px'}}>
          <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.text)} className='story-h3-blue text-center'/>
        </Container>
      )
    }
    else{
      return (
        <Container className={`${component_background[text.background_color]}`} style={{padding: '20px', paddingTop: '20px'}}>
          <Row onClick={props.toggleBottom}  dangerouslySetInnerHTML={createMarkup(text.text)} className='quote-text text-center'/>
          <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='quote-credit text-center'/>
        </Container>
      )
    }
  
}


export const ImageComponent =(props)=>{

  let image = props.image
  let image_sizes = {
    "Smallest": "25%",
    "Smaller": "50%",
    "Small": "75%",
    "Regular": "100%",
    "Big": "125%",
    "Bigger": "150%",
    "Bigest": "175%",
  };
  let caption_padding = {
    "Smallest": "20px 37% 0%",
    "Smaller": "20px 25% 0%",
    "Small": "20px 15% 0%",
    "Regular": "20px 5% 0%",
    "Big": "",
    "Bigger": "",
    "Bigest": "",
  };
  let component_background = {
    "null":'',
    "light-blue-background":"light-blue-background",
    "light-yellow-background":"light-yellow-background",

  };
  if((image.image.data === null)){
    if(image.reverse_or_obverse){
        return(
          <Col 
            className={`${image.caption_or_both? component_background[image.background_color]:""}`}
          >
            <Row className={`justify-content-center align-items-center`}>
              <a href={`${image.coin.data.attributes.source_image}`} target="_blank" rel="noopener noreferrer" className="text-center">
                <img
                  src={`${process.env.REACT_APP_strapiURL}${image.coin.data.attributes.obverse_file.data.attributes.url}`}            
                  alt={image.coin.data.attributes.obverse_file.data.alternativeText === undefined ? 'img' : image.coin.data.attributes.obverse_file.data.alternativeText}
                  style={{width:image_sizes[image.size]}}
                  className="mb-1"
                />
              </a>
            </Row>
            <Row className={`justify-content-center align-items-center`} >
              <div 
                onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(image.caption)} 
                className={`story-caption text-center ${image.caption_or_both? "":component_background[image.background_color]}`}
                style={{padding: caption_padding[image.size]}}
                />
            </Row>
          </Col>
        )
    }
    else{
      return(
        <Col 
          className={` ${image.caption_or_both? component_background[image.background_color]:""}`}
        >
          <Row className='justify-content-center align-items-center'>
            <a href={`${image.coin.data.attributes.source_image}`} target="_blank" rel="noopener noreferrer" className="text-center">
              <img
                src={`${process.env.REACT_APP_strapiURL}${image.coin.data.attributes.reverse_file.data.attributes.url}`}            
                alt={image.coin.data.attributes.obverse_file.data.alternativeText === undefined ? 'img' : image.coin.data.attributes.reverse_file.data.alternativeText}
                style={{width:image_sizes[image.size]}}
                className="mb-1"
              />
            </a>
          </Row>
          <Row className='justify-content-center align-items-center'>
              <div 
                onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(image.caption)} 
                className={`story-caption text-center ${image.caption_or_both? "":component_background[image.background_color]}`}
                style={{padding: caption_padding[image.size]}}
              />
          </Row>
        </Col>
      )
    }
  }
  else{
    if(IsEmptyOrWhiteSpace(image.additional_link)){
      return(
        <Col 
        className={`${image.caption_or_both? component_background[image.background_color]:""}`}
      >
        <Row className='d-flex justify-content-center align-items-center'>
          <a href={`${image.additional_link}`} target="_blank" rel="noopener noreferrer" className="text-center">
            <img
              src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}            
              alt={image.image.data.attributes.alternativeText === undefined ? 'img' : image.image.data.attributes.alternativeText}
              style={{width:image_sizes[image.size]}}
              className="mb-1"
            />
          </a>
        </Row>
        <Row className={`d-flex justify-content-center align-items-center`} >
          <div 
            onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(image.caption)} 
            className={`story-caption text-center ${image.caption_or_both? "":component_background[image.background_color]}`}
            style={{padding: caption_padding[image.size]}}
          />
        </Row>
      </Col>
      )
    }
    else{
      return(
        <Col className={`${image.caption_or_both? component_background[image.background_color]:""}`}>
          <Row className='d-flex justify-content-center align-items-center'>
              <img
                src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}            
                alt={image.image.data.attributes.alternativeText === undefined ? 'img' : image.image.data.attributes.alternativeText}
                style={{width:image_sizes[image.size]}}
                className="mb-1"
              />
          </Row>
          <Row className={`d-flex justify-content-center align-items-center`} >
            <div 
              onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(image.caption)} 
              className={`story-caption text-center ${image.caption_or_both? "":component_background[image.background_color]}`}
              style={{padding: caption_padding[image.size]}}
            />
          </Row>
        </Col>
      )
      }
  }
}

export const ImagesComponent = (props)=>{
  let imageJsx = []
  if(props.images.length==6){
    props.images.forEach((image)=>{
      imageJsx.push(
        <Col key={image.id} xs={4}>
          <ImageComponent toggleBottom={props.toggleBottom} image={image}/>
        </Col>
      );
      return;
    })
  }
  else if (props.images.length==3){
    props.images.forEach((image)=>{
      imageJsx.push(
        <Col key={image.id} xs={3}>
          <ImageComponent toggleBottom={props.toggleBottom} image={image}/>
        </Col>
      );
      return;
    })
  }
  else if (props.images.length==1){
    props.images.forEach((image)=>{
      imageJsx.push(
        <Col key={image.id} xs={6}>
          <ImageComponent toggleBottom={props.toggleBottom} image={image}/>
        </Col>
      );
      return;
    })
  }
  else{
    props.images.forEach((image)=>{
      imageJsx.push(
        <Col key={image.id}>
          <ImageComponent toggleBottom={props.toggleBottom} image={image}/>
        </Col>
      );
      return;
    })
  }

  return (
      <Container>
        <Row className='d-flex justify-content-around align-items-end'>
          {imageJsx}
        </Row>
      </Container>
  );
}
// export const MainText = (main_text) =>{
//   let main_text_jsx = undefined
//   if(!IsEmptyOrWhiteSpace(main_text)){
//     main_text_jsx=(
//       <Row className='d-flex justify-content-center align-self-center'>
//         <ReactMarkdown className='story-h2 text-center'>
//           {main_text}
//         </ReactMarkdown>
//       </Row>
//     )
//   }
//   return(
//     main_text_jsx
//   )
// };

// export const BigSubText = (sub_text) =>{
//   let big_sub_text_jsx = undefined
//   if(!IsEmptyOrWhiteSpace(sub_text)){
//     big_sub_text_jsx=(
//       <Container className='d-flex justify-content-center align-items-center'>
//         <ReactMarkdown className='blue-text big-sub-text text-center'>
//           {sub_text}
//         </ReactMarkdown>
//       </Container>
//     )
//   }
//   return(
//     big_sub_text_jsx
//   )
// }

// export const SubText = (sub_text) =>{
//   let sub_text_jsx = undefined
//   if(!IsEmptyOrWhiteSpace(sub_text)){
//     sub_text_jsx=(
//       <Container className='d-flex justify-content-center align-items-center'>
//         <ReactMarkdown className='blue-text sub-text text-center'>
//           {sub_text}
//         </ReactMarkdown>
//       </Container>
//     )
//   }
//   return(
//     sub_text_jsx
//   )
// }

// export const CapText = (cap_text) =>{
//   let CubText = undefined
//   if(!IsEmptyOrWhiteSpace(cap_text)){
//     CubText=(
//       <Container className='d-flex justify-content-center align-items-center'>
//         <ReactMarkdown className='gray-text caption-text text-center'>
//           {cap_text}
//         </ReactMarkdown>
//       </Container>
//     )
//   }
//   return(
//     CubText
//   )
// }

// export const SubCapBlueBg = (text)=>{
//   if(text.light_blue_background){
//     return (
//       <Container className='light-blue-background' style={{padding: '20px', paddingTop: '20px'}}>
//         <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.text)} className='quote-text text-center'/>
//         <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='quote-credit text-center'/>
//       </Container>
//     )
//   }
//   else if(text.light_yellow_background){
//     return (
//       <Container className='light-yellow-background' style={{padding: '20px', paddingTop: '20px'}}>
//         <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.text)} className='quote-text text-center '/>
//         <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='quote-credit text-center '/>
//       </Container>
//     )
//   }    
//   else{
//     if (text.caption == "" || text.caption == null){
//       return(
//         <Container style={{padding: '20px', paddingTop: '20px'}}>
//           <div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.text)} className='story-h3-blue text-center '/>
//         </Container>
//       )

//     }
//     if (text.text == "" || text.text == null){
//       return(
//         <Container style={{padding: '20px', paddingTop: '20px'}}>
//           <div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='story-text text-center '/>
//         </Container>
//       )

//     }
//     return(
//       <Container style={{padding: '20px', paddingTop: '20px'}}>
//         <div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='quote-credit text-center'/>
//       </Container>
//     )
//   }
// }

// export const textComponent = (props)=>{
//   let text = props.text
//   if(text.light_blue_background){
//     if(text.text==""||text.text==null){
//       return(
//         <Container className='light-blue-background' style={{padding: '20px', paddingTop: '20px'}}>
//           <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='story-text text-center'/>
//         </Container>
//       )
//     }
//     else if (text.caption == "" || text.caption == null){
//       return(
//         <Container className='light-blue-background' style={{padding: '20px', paddingTop: '20px'}}>
//           <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.text)} className='story-h3-blue text-center'/>
//         </Container>
//       )
//     }
//     else{
//       return (
//         <Container className='light-blue-background' style={{padding: '20px', paddingTop: '20px'}}>
//           <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.text)} className='quote-text text-center'/>
//           <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='quote-credit text-center'/>
//         </Container>
//       )
//     }
//   }
//   else if(text.light_yellow_background){
//     if(text.text==""||text.text==null){
//       return(
//         <Container className='light-yellow-background' style={{padding: '20px', paddingTop: '20px'}}>
//           <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='story-text text-center'/>
//         </Container>
//       )
//     }
//     else if (text.caption == "" || text.caption == null){
//       return(
//         <Container className='light-yellow-background' style={{padding: '20px', paddingTop: '20px'}}>
//         <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='story-h3 text-center'/>
//       </Container>
//       )
//     }
//     else{
//       return (
//         <Container className='light-yellow-background' style={{padding: '20px', paddingTop: '20px'}}>
//           <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.text)} className='quote-text text-center'/>
//           <Row onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='quote-credit text-center'/>
//         </Container>
//       )
//     }

//   }    
//   else{
//     if (text.caption == "" || text.caption == null){
//       return(
//         <Container style={{padding: '20px', paddingTop: '20px'}}>
//           <div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.text)} className='story-h3-blue text-center '/>
//         </Container>
//       )

//     }
//     else if (text.text == "" || text.text == null){
//       return(
//         <Container style={{padding: '20px', paddingTop: '20px'}}>
//           <div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='story-text text-center '/>
//         </Container>
//       )

//     }
//     return(
//       <Container style={{padding: '20px', paddingTop: '20px'}}>
//         <div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.text)} className='story-h3-blue text-center '/>
//         <div onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(text.caption)} className='quote-credit text-center'/>
//       </Container>
//     )
//   }
// }



// export const SubcomponentImageOnly = (image) => {
//   let image_sizes = {
//     "XXS": "50px",
//     "XS": "150px",
//     "S": "250px",
//     "M": "350px",
//     "L": "450px",
//     "XL": "550px",
//     "XXL": "650px"
//   };
//   return (
//     <img
//       src={`${process.env.REACT_APP_strapiURL}${image.data.attributes.url}`}            
//       alt={image.data.attributes.alternativeText === undefined ? 'img' : image.data.attributes.alternativeText}
//       width={image_sizes[image.image.size]} 
//     />
//   );
// }

// export const SubcomponentImage = (image) => {
//   image.light_blue_caption_background = image.light_blue_background ? false : image.light_blue_caption_background;
//   let image_sizes = {
//     "Smallest": "25%",
//     "Smaller": "50%",
//     "Small": "75%",
//     "Regular": "100%",
//     "Big": "125%",
//     "Bigger": "150%",
//     "Bigest": "175%",
//   };
//   return (
//     <Container 
//       className={`d-flex justify-content-center align-items-center ${image.light_blue_background ? "light-blue-background" : ""}`}
//       style={{padding: '20px', paddingBottom: '0px'}}>
//       <Row className='d-flex justify-content-center align-items-center'>
//         <img
//           src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}            
//           alt={image.image.data.alternativeText === undefined ? 'img' : image.image.data.attributes.alternativeText}
//           style={{width:image_sizes[image.size]}}
//           className="mb-1"
//         />
//         <div 
//           className={`d-flex justify-content-center align-items-center ${image.light_blue_caption_background ? "light-blue-background" : ""}`} 
//         >
//           <div 
//             onClick={props.toggleBottom} dangerouslySetInnerHTML={createMarkup(image.caption)} 
//             className='story-caption text-center'
//             style={{padding: '0px', paddingTop: '20px'}}
//           />
//         </div>
//       </Row>
//     </Container>
//   );
// }

// export const SubcomponentImageWithDynamicSizing = (images) => {
//   let image_sizes = {
//     "XXS": "25%",
//     "XS": "50%",
//     "S": "75%",
//     "M": "100%",
//     "L": "500px",
//     "XL": "750px",
//     "XXL": "1200px"
//   };
//   // console.log(images.length)

//   let images_jsx = []
//   if(images.length==6){
//     images.forEach((image) => {
//       // const image_brief_detail_font_size=Math.atan((parseInt(image_sizes[image.size])-250)/50)*30+50;
//       if (!IsEmptyOrWhiteSpace(image.link) && !IsEmptyOrWhiteSpace(image.brief_detail)) {
//         images_jsx.push(
//           <Col xs={4} key={image.id} className='text-center mt-3'>
//             <Link to={image.link}>
//               <img
//                 src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
//                 alt='dynamic_image'
//                 width={image_sizes[image.size]}
//                 className='justify-content-center'
//               />
//             </Link>
//               <p className='story-caption px-3' style={{padding: '0px', paddingTop: '20px', height:"50px"}}>
//                 {image.brief_detail}
//               </p>
//           </Col>
//         );
//         return;
//       }
  
//       if (!IsEmptyOrWhiteSpace(image.link)) {
//         images_jsx.push(
//           <Col xs={4} key={image.id} className='text-center mt-3'>
//             <Link to={image.link}>
//               <img
//                 src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
//                 alt='dynamic_image'
//                 width={image_sizes[image.size]}/>
//             </Link>
//           </Col>
//         );
//         return;
//       }
  
//       if (!IsEmptyOrWhiteSpace(image.brief_detail)) {
//         images_jsx.push(
//           <Col xs={4} key={image.id} className='text-center mt-3'>
//             <img
//               src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
//               alt='dynamic_image'
//               width={image_sizes[image.size]}
//             />
//             <p className='story-text px-5' style={{padding: '0px', paddingTop: '20px', height:"50px"}}>
//               {image.brief_detail}
//             </p>
//           </Col>
//         );
//         return;
//       }
//       else {
//         images_jsx.push(
//           <Col xs={4} key={image.id} className='text-center mt-3'>
//             <img
//               src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
//               alt='dynamic_image'
//               width={image_sizes[image.size]}
//             />
//           </Col>
//         );
//         return;
//       }
//     });
//   }
//   else{
//     images.forEach((image) => {
//       // const image_brief_detail_font_size=Math.atan((parseInt(image_sizes[image.size])-250)/50)*30+50;
//       if (!IsEmptyOrWhiteSpace(image.link) && !IsEmptyOrWhiteSpace(image.brief_detail)) {
//         images_jsx.push(
//           <Col key={image.id} className='text-center'>
//             <Link to={image.link}>
//               <img
//                 src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
//                 alt='dynamic_image'
//                 width={image_sizes[image.size]}
//               />
//             </Link>
//               <p className='story-caption px-5' style={{padding: '0px', paddingTop: '20px'}}>
//                 {image.brief_detail}
//               </p>
//           </Col>
//         );
//         return;
//       }
  
//       if (!IsEmptyOrWhiteSpace(image.link)) {
//         images_jsx.push(
//           <Col key={image.id} className='text-center'>
//             <Link to={image.link}>
//               <img
//                 src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
//                 alt='dynamic_image'
//                 width={image_sizes[image.size]}/>
//             </Link>
//           </Col>
//         );
//         return;
//       }
  
//       if (!IsEmptyOrWhiteSpace(image.brief_detail)) {
//         images_jsx.push(
//           <Col key={image.id} className='text-center'>
//             <img
//               src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
//               alt='dynamic_image'
//               width={image_sizes[image.size]}
//             />
//             <p className='story-caption' style={{padding: '0px', paddingTop: '20px'}}>
//               {image.brief_detail}
//             </p>
//           </Col>
//         );
//         return;
//       }
//       else {
//         images_jsx.push(
//           <Col key={image.id} className='text-center'>
//             <img
//               src={`${process.env.REACT_APP_strapiURL}${image.image.data.attributes.url}`}
//               alt='dynamic_image'
//               width={image_sizes[image.size]}
//             />
//           </Col>
//         );
//         return;
//       }
//     });
//   }
  
//   return (
//     <div>
//       <Container>
//         <Row className='d-flex justify-content-center align-items-end mt-3 mb-5'>
//           {images_jsx}
//         </Row>
//       </Container>
//     </div>
//   );
// }

// export const FlipCoin = (dom) =>{
//   while (dom.className !== 'flip-box-inner') {
//     dom = dom.nextSibling;
//   }

//   if (dom.style.transform === 'rotateY(180deg)') {
//     dom.style.transform = 'rotateY(0deg)'
//   } else {
//     dom.style.transform = 'rotateY(180deg)';
//   }
// }

// export const FlipCoinImg = (img_fornt, img_back) =>{
//   let Coin = undefined
//   Coin = (
//     <div className='flip-box'>
//       <div className='flip-box-inner'>
//         <div className='flip-box-front'>
//           {SubcomponentImage(img_fornt)}
//         </div>
//         <div className='flip-box-back'>
//           {SubcomponentImage(img_back)}
//         </div>
//       </div>
//     </div>
//   )
//   return(
//     Coin
//   )
// }


// export function SwitchFront(switch_item){
//   switch_item.childNodes[0].style.opacity = '0.0';
//   setTimeout(() => {
//     try {
//       switch_item.childNodes[0].style.display = 'none';
//       switch_item.childNodes[1].style.display = 'block';
//     } catch (error) {
//       console.error(error);
//     }
//     setTimeout(() => {
//       try {
//         switch_item.childNodes[1].style.opacity = '1.0';
//       } catch (error) {
//         console.error(error);
//       }
//     });
//   }, 400);
// }

// export function SwitchBack(switch_item){
//   switch_item.childNodes[1].style.opacity = '0.0';
//   setTimeout(() => {
//     try {
//       switch_item.childNodes[1].style.display = 'none';
//       switch_item.childNodes[0].style.display = 'block';
//     } catch (error) {
//       console.error(error);
//     }
//     setTimeout(() => {
//       try {
//         switch_item.childNodes[0].style.opacity = '1.0';
//       } catch (error) {
//         console.error(error);
//       }
//     });
//   }, 400);
// }
