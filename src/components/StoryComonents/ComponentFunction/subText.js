import IsEmptyOrWhiteSpace from "./IsEmptyOrWhiteSpace"
import { Container } from "react-bootstrap"
import ReactMarkdown from 'react-markdown';

const subText = (sub_text) =>{
  let SubText = undefined
  if(!IsEmptyOrWhiteSpace(sub_text)){
    SubText=(
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='BlueText SubText text-center'>
          {sub_text}
        </ReactMarkdown>
      </Container>
    )
  }
  return(
    SubText
  )
}

export default subText;
