import React from "react";
import { Outlet } from "react-router";
import { Container, Row, Col, Nav} from 'react-bootstrap';
import Footer from "../Footer";
// import { useParams } from "react-router-dom";
// import glossaryRequest from "src/api/glossary";
// import { Link } from "react-router-dom";

function GlossaryWrapper(){

    const alphabetGroup = ["ABC","DEF","GHI","JKL","MNO","PQRS","TUV","WXYZ"];

    // const [searchInput, setSearchInput] = useState("");
    // const [glossaryData, setGlossaryData] = useState([])
    // const [searchFilter, setSearchFilter] = useState([])

    // useEffect(()=>{
    //     async function fetchData(){
    //         const result = await glossaryRequest.glossaryFind()
    //         console.log(result.data.data)
    //         setGlossaryData(result.data.data)
    //     }
    //     fetchData()
    // },[searchInput])

    // const handleChange = (e) => {

    //     e.preventDefault();

    //     // console.log(e.target.value)
    //     setSearchInput(e.target.value);

    // };

    // function handleSearch (){
    //     console.log('The value is',searchInput)
    // }
    
    return(
        <div id='glossary-page'>
            <Container>
                    <p className='story-h1 text-center'>
                        Glossary
                    </p>
                    <Row className='d-flex justify-content-between align-items-center'>
                        <Col xs={2}>
                            <i className='demo-icon glossary-icon'>
                                &#xe817;
                            </i>
                        </Col>
                        <Col xs={10} className='story-text'>
                            Explorethisglossary to learn about terms related to coins, the ancient world, historical investigation, and archaeology. Begin by searching for a term, selecting a category, or clicking through the tabs. 
                        </Col>
                    </Row>

                    {/* <Row className="my-5" >
                        <Col>
                            <div className="search">
                                <span className='search-span'><button onClick={handleSearch}> <b className="search-icon ">&#xe827;</b></button></span>
                                <input
                                type="text"
                                placeholder="Search glossary"
                                onChange={handleChange}
                                value={searchInput} 
                                />
                            </div>

                            <ListGroup variant="flush" className="search-filter">
                                {searchFilter.length === 0?(<></>):(
                                <>
                                    {searchFilter.forEach((term)=>{
                                        if (term){
                                            console.log(term)
                                            return(
                                            <ListGroup.Item key={term.input}>
                                                {term.input}
                                            </ListGroup.Item>
                                            )
                                        }
                                    })}
                                </>)}
                            </ListGroup>

                        </Col>
                    </Row> */}
                    
                    <Nav variant="tabs" defaultActiveKey="/All" className="d-flex justify-content-center">
                        <Nav.Item>
                            <Nav.Link href="/dev/Toolbox/Glossary/all" eventKey="All">All</Nav.Link>
                        </Nav.Item>
                        {alphabetGroup.map((alphabet)=>{
                            return(
                                <Nav.Item key={alphabet}>
                                    <Nav.Link href={`/dev/Toolbox/Glossary/${alphabet}`} eventKey={alphabet}>{alphabet}</Nav.Link>
                                </Nav.Item>
                            )
                        })}
                    </Nav>
                    <Outlet/>
                </Container>
                <Footer/>
        </div>
    )

}
export default GlossaryWrapper;