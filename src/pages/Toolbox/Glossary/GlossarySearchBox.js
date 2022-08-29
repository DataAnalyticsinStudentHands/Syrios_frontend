import React, { useState, useEffect} from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import glossaryRequest from 'src/api/glossary';

const SearchBar = () => {

    const [data, setData] = useState([])
    const [inputText, setInputText] = useState("");

    useEffect(()=>{
        async function fetchData(){
            const result = await glossaryRequest.glossaryFind()
            setData(result.data.data)
        }
        fetchData()
    },[])

    let inputHandler = (e) => {
      //convert input text to lower case
      var lowerCase = e.target.value.toLowerCase();
      setInputText(lowerCase);
    };

    
    return(
        <div className="search my-5 py-5" style={{marginLeft:"32.5%"}}>
        <b className="search-icon ">&#xe827;</b>
          <input
            id="glossary-input"
            onChange={inputHandler}
            variant="outlined"
            label="Search glossary"
            placeholder={'Search glosssary'}/>
        <>
        {inputText.length === 0? (<></>):(
            <ListGroup className='search-list-group'>
                {data.filter((el) => {return el.attributes.term.toLowerCase().includes(inputText)})
                    .map((item) => (
                    <ListGroup.Item key={item.id}>
                         <Link className='glossary-term-a' to={`/Toolbox/Glossary/term/${item.attributes.term}`}>{item.attributes.term}</Link>
                    </ListGroup.Item>)
                )}
            </ListGroup>
        )}
        </>
        </div>
    )

}
export default SearchBar