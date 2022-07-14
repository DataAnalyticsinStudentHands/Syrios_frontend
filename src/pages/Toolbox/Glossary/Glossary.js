/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import LoadingPage from 'src/components/LoadingPage.js';
import glossaryRequest from 'src/api/glossary';
import { Container, Row, Col, Form, InputGroup, Button, Modal,Tab, Tabs, ListGroup} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";

const Glossary = () =>{

    // const alphabetGroup = ["ABC","DEF","GHI","JKL","MNO","PQRS","TUV","WXYZ"];
    const [isLoading, setIsLoading] = useState(true)
    const [glossaryData, setGlossaryData]=useState([])

    const {group} = useParams()

    useEffect(()=>{
        async function fetchData(){
            if(group === 'all'){
                const alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
                let contentList= []
                for (let i=0; i<alphabets.length; i++){
                    let alp = {}
                    // console.log(alphabets[i])
                    const data = await glossaryRequest.glossaryFindStartWIth(alphabets[i])
                    alp['alphabet']=alphabets[i]
                    alp['data'] = data.data
                    contentList.push(alp)
                }
                // console.log(contentList)
                setGlossaryData(contentList)
                setIsLoading(false)
            }
            else{
                // console.log(group)
                const alphabetsArray = group.split("")
                let contentList= []
                for (let i=0; i<alphabetsArray.length; i++){
                    let alp = {}
                    // console.log(alphabets[i])
                    const data = await glossaryRequest.glossaryFindStartWIth(alphabetsArray[i])
                    alp['alphabet']=alphabetsArray[i]
                    alp['data'] = data.data
                    contentList.push(alp)
                }
                console.log(contentList)
                setGlossaryData(contentList)
                setIsLoading(false)

            }
        }
        fetchData()
    },[group])


    if(isLoading)return(<LoadingPage/>)
    return(
            <div id='glossary-group' className=''>
                <ListGroup as='ul'>
                    {glossaryData.map((alphabet)=>{
                        return(
                            <div className='li-wrapper' key={alphabet.alphabet}>
                                {alphabet.data.length ===0 ?(<></>):(
                                    <ListGroup.Item key={alphabet.alphabet}>
                                        <Row className='py-4'>
                                            <Col xs={2} className="glossary-alphabet d-flex justify-content-center align-items-center">
                                                {alphabet.alphabet}
                                            </Col>
                                            <Col xs={6}>
                                                <Row className='glossary-term'>
                                                    {alphabet.data.map((item)=>{
                                                        return(
                                                            <Col xs={3} key={`${item.id}`}>
                                                                <Link className='glossary-term-a' to={`/Toolbox/Glossary/term/${item.term}`}>{item.term}</Link>
                                                            </Col>
                                                        )
                                                    })}
                                                </Row>
                                            </Col>

                                        </Row>
                                    </ListGroup.Item>
                                )}
                            </div>
                        )
                    })}
                </ListGroup>
            </div>
    )
}

export default Glossary;
