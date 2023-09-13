/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import glossaryRequest from 'src/api/glossary';
import { Row, Col, ListGroup} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";

function groupByFL(arr) {
    return arr.reduce((store, word) => {
      const letter = word.charAt(0).toUpperCase()
      const keyStore = (
        store[letter] || (store[letter] = []) 
      ); 
      keyStore.push(word)
  
      return store
    }, {})
  }

const Glossary = () =>{
    const [isLoading, setIsLoading] = useState(true)
    const [glossaryData, setGlossaryData]=useState({})

    const {group} = useParams()

    useEffect(()=>{
        async function fetchData(){
            if(group === 'all'){
                const {data:{data}} = await glossaryRequest.glossaryFind()
                const contentList= data.map((glossary)=>{
                    return glossary.attributes.term
                })
                const grouped = groupByFL(contentList)
                const sorted = Object.keys(grouped)
                    .sort()
                    .reduce((obj, key) => {
                        obj[key] = grouped[key];
                        return obj;
                    },{})
                setGlossaryData(sorted)
                setIsLoading(false)
            }
            else{
                const alphabetsArray = group.split("")
                const {data:{data}} = await glossaryRequest.glossarySearch(alphabetsArray)
                const contentList= data.map((glossary)=>{
                    return glossary.attributes.term
                })
                const grouped = groupByFL(contentList)
                const sorted = Object.keys(grouped)
                    .sort()
                    .reduce((obj, key) => {
                        obj[key] = grouped[key];
                        return obj;
                    },{})
                setGlossaryData(sorted)
                setIsLoading(false)
            }
        }
        fetchData()
    },[group])


    if(isLoading)return(
		<div id="glossary-loading">
			<div className="loader"/>
		</div>
    )
    return(
            <div id='glossary-group' className=''>
                <ListGroup as='ul'>
                    {
                        Object.entries(glossaryData).map(([key, value]) => {
                            return(
                                <div className='li-wrapper' key={key}>
                                    <ListGroup.Item key={key}>
                                        <Row className='py-4'>
                                            <Col xs={2} className="glossary-alphabet d-flex justify-content-center align-items-center">{key}</Col>
                                            <Col xs={8}>
                                                <Row className='glossary-term'>
                                                    {value.map((item)=>{
                                                        return(
                                                            <Col xs={3} key={`${item}`}>
                                                                <Link className='glossary-term-a' to={`/Toolbox/Glossary/term/${item}`}>{item}</Link>
                                                            </Col>
                                                        )
                                                    })}
                                                </Row>
                                            </Col>

                                        </Row>
                                    </ListGroup.Item>
                                </div>
                            )
                        })
                    }
                </ListGroup>
            </div>
    )
}

export default Glossary;
