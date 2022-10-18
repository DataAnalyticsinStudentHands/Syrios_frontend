import React, { useState, useEffect} from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import glossaryRequest from 'src/api/glossary';

function SearchBar(){
    const [data, setData] = useState([])
    const [inputText, setInputText] = useState("");
    const [listData, setListData] = useState([])

    useEffect(()=>{
        async function fetchData(){
            const result = await glossaryRequest.glossaryFind()
            let glossary = []
            result.data.data.forEach((item)=>{
                glossary.push(item.attributes.term)
            })
            setData(glossary)
        }
        fetchData()
    },[])

    useEffect(()=>{
        let filterLise = data.filter(item => item.toLowerCase().includes(inputText))
        setListData(filterLise)
    },[inputText,data])

    return(
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