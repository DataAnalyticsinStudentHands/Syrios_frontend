import IsEmptyOrWhiteSpace from "./IsEmptyOrWhiteSpace"
import { Container } from "react-bootstrap"
import ReactMarkdown from 'react-markdown';

const bigSubText = (sub_text) =>{
  let BigsubText = undefined
  if(!IsEmptyOrWhiteSpace(sub_text)){
    BigsubText=(
      <Container className='d-flex justify-content-center align-items-center'>
        <ReactMarkdown className='BlueText BigSubText text-center'>
          {sub_text}
        </ReactMarkdown>
      </Container>
    )
  }
  return(
    BigsubText
  )
}
  export default bigSubText;
