import React, { useState, useEffect} from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import glossaryRequest from 'src/api/glossary';

function SearchBar(){
    const [data, setData] = useState([])
    const [inputText, setInputText] = useState("");
    const [listData, setListData] = useState([])
    const [show, setShow] = useState(false)

    useEffect(()=>{
        async function fetchData(){
            const result = await glossaryRequest.glossaryFind()
            let glossary = []
            result.data.data.forEach((item)=>{
                glossary.push(item.attributes.term)
            })
            // console.log(glossary)          
            setData(glossary)
        }
        fetchData()
    },[])

    useEffect(()=>{
        // console.log(inputText)
        // console.log(data.filter(item => item.includes(inputText)))
        // console.log(data.filter(item => item.toLowerCase().includes(inputText)))
        let filterLise = data.filter(item => item.toLowerCase().includes(inputText))

        if(filterLise.length >5){filterLise=filterLise.slice(0,5)}

        setListData(filterLise)

    },[inputText])

    // let inputHandler = (e) => {
    //   //convert input text to lower case
    //   var lowerCase = e.target.value.toLowerCase();
    //   setInputText(lowerCase);
    // };

    
    return(
        // <div className="search my-5 py-5" style={{marginLeft:"32.5%"}}>
        // <b className="search-icon ">&#xe827;</b>
        //   <input
        //     id="glossary-input"
        //     onChange={inputHandler}
        //     variant="outlined"
        //     label="Search glossary"
        //     placeholder={'Search glosssary'}/>
        // <>
        // {inputText.length === 0? (<></>):(
        //     <ListGroup className='search-list-group'>
        //         {data.filter((el) => {return el.attributes.term.toLowerCase().includes(inputText)})
        //             .map((item) => (
        //             <ListGroup.Item key={item.id}>
        //                  <Link className='glossary-term-a' to={`/Toolbox/Glossary/term/${item.attributes.term}`}>{item.attributes.term}</Link>
        //             </ListGroup.Item>)
        //         )}
        //     </ListGroup>
        // )}
        // </>
        // </div>

        <>
            <div className="search-box">
                <input type="text" className="search-box__input" label="Search glossary" placeholder='Search glosssary' 
                onChange={(e)=>{setInputText(e.target.value)}}
                />
                {/* <div className='icon-entypo-search search-icon'/> */}
            </div>
            {inputText.length === 0 ?<></>
                :<ListGroup className='result-list'>
                    {listData.map((item, index)=>{
                    return(
                    <ListGroup.Item key={index} className='result-list-item'>
                        <Link className='glossary-term-a' to={`/Toolbox/Glossary/term/${item}`} onClick={(e)=>{setInputText('')}}>{item}</Link>
                    </ListGroup.Item>
                    )
                })}
                </ListGroup>
            }
        </>
    )

}
export default SearchBar