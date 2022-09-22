import React, {useState, useEffect} from 'react';
import toolboxRequest from 'src/api/toolbox';
import LoadingPage from 'src/components/LoadingPage';
import Footer from 'src/components/Footer';
import { Container, Row, Col} from 'react-bootstrap';
import { WhiteBGDesign } from 'src/components/constant/WhiteBGDesign';
import PageTitleComponent from 'src/components/constant/pageTitleText';
const Toolbox = ()=>{

    const [isLoading, setIsLoading] = useState(true)
    const [toolboxData, setToolboxData] = useState([])

    useEffect(()=>{
        async function fetchData(){
            const result = await toolboxRequest.toolboxFind()
            setToolboxData(result.data.data.attributes)
            setIsLoading(false)
        }
        fetchData()
    },[])
    if (isLoading){
        return(
            <>
                <LoadingPage/>
                <Footer/>
            </>
        )
    }
    return(
        <div id='tool-box' >
            <Container>
                <PageTitleComponent
                    title={toolboxData.title}
                    text={toolboxData.text}
                    subtext={toolboxData.subtext}
                />
                <Row className='my-5 d-flex py-5 justify-content-around'>
                <Col xs={3}>
                    <WhiteBGDesign
                        link={toolboxData.image_icons[0].url_path}
                        imageSrc={toolboxData.image_icons[0].image.data.attributes.url}
                        title={toolboxData.image_icons[0].title}
                        subtext={toolboxData.image_icons[0].subtext}
                        height="15vmax"
                        width="15vmax"
                    />
                </Col>
                <Col xs={3}>
                    <WhiteBGDesign
                        link={toolboxData.image_icons[1].url_path}
                        imageSrc={toolboxData.image_icons[1].image.data.attributes.url}
                        title={toolboxData.image_icons[1].title}
                        subtext={toolboxData.image_icons[1].subtext}
                        height="15vmax"
                        width="15vmax"
                    />
                </Col>
                <Col xs={3}>
                    <WhiteBGDesign
                        link={toolboxData.image_icons[2].url_path}
                        imageSrc={toolboxData.image_icons[2].image.data.attributes.url}
                        title={toolboxData.image_icons[2].title}
                        subtext={toolboxData.image_icons[2].subtext}
                        height="15vmax"
                        width="15vmax"
                    />
                </Col>
                </Row>
                <hr />
                <Row className='d-flex align-items-center justify-content-around my-5 py-5'>
                <Col xs={3}>
                    <WhiteBGDesign
                        link={toolboxData.image_icons[3].url_path}
                        imageSrc={toolboxData.image_icons[3].image.data.attributes.url}
                        title={toolboxData.image_icons[3].title}
                        subtext={toolboxData.image_icons[3].subtext}
                        height="15vmax"
                        width="15vmax"
                    />
                </Col>
                <Col xs={3}>
                    <WhiteBGDesign
                        link={toolboxData.image_icons[4].url_path}
                        imageSrc={toolboxData.image_icons[4].image.data.attributes.url}
                        title={toolboxData.image_icons[4].title}
                        subtext={toolboxData.image_icons[4].subtext}
                        height="15vmax"
                        width="15vmax"
                    />
                </Col>
                </Row>
            </Container>
            <Footer/>
        </div>
    )
}
export default Toolbox