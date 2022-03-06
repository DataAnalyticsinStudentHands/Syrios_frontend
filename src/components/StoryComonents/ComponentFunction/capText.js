import IsEmptyOrWhiteSpace from "./IsEmptyOrWhiteSpace"
import { Container } from "react-bootstrap"
import ReactMarkdown from 'react-markdown';

const capText = (cap_text) =>{
  let CubText = undefined
  if(!IsEmptyOrWhiteSpace(cap_text)){
    CubText=(
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='GrayText CaptionText text-center'>
          {cap_text}
        </ReactMarkdown>
      </Container>
    )
  }
  return(
    CubText
  )
}

export default capText;
