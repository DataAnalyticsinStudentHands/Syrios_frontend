/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import storyRequest from 'src/api/story';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer';
const Stories = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [stories, setStories] = useState(undefined)

	// const [storyReference, setStoryReference] = useState([])
	// const [storyImageSouce, setStoryImageSouce]= useState([])

	useEffect(() => {
		const fetchData = async ()=>{
			const result = await storyRequest.storyFind()
			setStories(result.data.data)
			setIsLoading(false)
		}
		fetchData().catch(console.error);
	},[]);

	if (isLoading)return (<><LoadingPage /><Footer /></>);
	return (
		<>
		<div id='stories-page' 
		// className='d-flex align-items-center'
		>
			<Container>
				<p className='story-h1 text-center'>Discover Coin Stories</p>
				<Row className='d-flex justify-content-center text-center'>
					<Col xs={11}>
					<p className='story-text'>
						Every coin from the ancient world has a story to tell. Some coins were minted for provincial governors or imperial states conquering Syria, while others were produced for local cities and communities. Some coins laud kings and emperors, while others celebrate the beliefs and values of the vibrant Syrian population. And yet, whether rich or poor, citizen or foreigner, young or old – all people used coins in their daily lives.
						<br/>
						<br/>
						Click on a coin to learn more about the politics, economy, and society of ancient Syria.
					</p>
					</Col>
				</Row>
				<Row 
					style={{ marginTop: '2vmax'}} 
					className="d-flex py-5 align-items-end ">
					{stories.map((story)=>{
						return(
							<Col key={`${story.id}`} >
								{story.id === 1 ?(<></>):(
									<Link to={`/StoryReader?id=${story.id}`}>
										<div className='select-story-div '>
											<img
												src={`${process.env.REACT_APP_strapiURL}${story.attributes.image.data.attributes.url}`}
												alt='Story_Image'
												width={"100%"}
												className ="text-center"
											/>
											<p className=' text-center select-story-text'>
												{story.attributes.name}
											</p>

										</div>
									</Link>
								)}
							</Col>
						)
					})}
				</Row>
			</Container>
		</div>
        {/* <Footer references={storyReference} imageReference={storyImageSouce}/> */}
		<Footer/>

		</>
	)
}

export default Stories;
