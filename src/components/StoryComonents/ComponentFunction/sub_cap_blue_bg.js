import IsEmptyOrWhiteSpace from "./IsEmptyOrWhiteSpace"
import { Container } from "react-bootstrap"
import ReactMarkdown from 'react-markdown';

const sub_cap_blue_bg = (sub_text, cap_text)=>{
  let Sub_Cap_Blue_Bg = undefined
  if(!IsEmptyOrWhiteSpace(cap_text)){
    Sub_Cap_Blue_Bg = (
      <Container className='LightBlueBackground' style={{padding: '20px', paddingTop: '20px'}}>
        <ReactMarkdown className='BlueText text-center SubText' >
          {sub_text}
        </ReactMarkdown>
        <ReactMarkdown className='GrayText text-center CaptionText' >
          {cap_text}
        </ReactMarkdown>
      </Container>
    )
  }
  else{
    Sub_Cap_Blue_Bg = (
      <Container>
        <ReactMarkdown className='GrayText text-center BigSubText' >
          {sub_text}
        </ReactMarkdown>
      </Container>
    )
  }
  return(
    Sub_Cap_Blue_Bg
  )
}

export default sub_cap_blue_bg;
