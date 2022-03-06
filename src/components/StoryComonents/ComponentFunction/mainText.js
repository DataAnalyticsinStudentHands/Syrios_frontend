import IsEmptyOrWhiteSpace from "./IsEmptyOrWhiteSpace"
import { Container } from "react-bootstrap"
import ReactMarkdown from 'react-markdown';

const mainText = (main_text) =>{
    let MainText = undefined
    if(!IsEmptyOrWhiteSpace(main_text)){
      MainText=(
        <Container className='d-flex justify-content-center align-self-center'>
          <ReactMarkdown className='OrangeText MainText text-center'>
            {main_text}
          </ReactMarkdown>
        </Container>
      )
    }
    return(
      MainText
    )
  }
  export default mainText;
