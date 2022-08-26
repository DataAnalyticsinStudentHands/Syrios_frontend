import React from "react";
import { Outlet } from "react-router";
import { Container, Row, Col, Nav} from 'react-bootstrap';
import Footer from "../../../components/Footer";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import SearchBar from "./GlossarySearchBox";
function GlossaryWrapper(){
    const alphabetGroup = ["ABC","DEF","GHI","JKL","MNO","PQRS","TUV","WXYZ"];
    const {group, term} = useParams()
    return(
        <div id='glossary-page'>
            <Container>
                    <p className='story-h1 text-center'>Glossary</p>
                    <Row className='d-flex justify-content-between align-items-top'>
                        <Col xs={2}><i className='demo-icon glossary-icon'>&#xe817;</i></Col>
                        <Col xs={10} className='story-text text-center'>Explore this glossary to learn about terms related to coins, the ancient world, historical investigation, and archaeology. Begin by searching for a term, selecting a category, or clicking through the tabs.</Col>
                    </Row>
                    <SearchBar/>
                    <Nav variant="tabs" defaultActiveKey="/All" className="d-flex justify-content-center" style={{marginTop:"125px"}}>
                        <Nav.Item><Link to="/Toolbox/Glossary/all" eventkey="All" style={{backgroundColor: group ==="all" ? "white":"" }}>All</Link></Nav.Item>
                        {group ? (<>{alphabetGroup.map((alphabet)=>{return(<Nav.Item key={alphabet}><Link to={`/Toolbox/Glossary/${alphabet}`} style={{backgroundColor: group === alphabet ? "white":""}} eventkey={alphabet}>{alphabet}</Link></Nav.Item>)})}</>):(<></>)}
                        {term ? (<>{alphabetGroup.map((alphabet)=>{return(<Nav.Item key={alphabet}><Link to={`/Toolbox/Glossary/${alphabet}`} style={{backgroundColor: alphabet.indexOf(term.charAt(0).toUpperCase()) !==-1 ? "white":""}} eventkey={alphabet}>{alphabet}</Link></Nav.Item>)})}</>):(<></>)}
                    </Nav>
                    <Outlet/>
                </Container>
                <Footer/>
        </div>
    )

}
export default GlossaryWrapper;