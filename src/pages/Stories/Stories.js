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

	const [storyReference, setStoryReference] = useState([])
	const [storyImageSouce, setStoryImageSouce]= useState([])

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
					<Row container='mt-5'>
						<p className='story-h1 text-center'>
							Discover Coin Stories
						</p>
					</Row>
					<Row className='d-flex justify-content-center'>
						<Col xs={6} sm={3}>
							<button
								className='story-button blue-text'
								onClick={() => {
								}}>
								By City Name
							</button>
						</Col>
						<Col xs={6} sm={3}>
							<button
								className='story-button blue-text'
								onClick={() => {
								}}>
								By Political Standing
							</button>
						</Col>
						<Col xs={6} sm={3}>
							<button
								className='story-button blue-text'
								onClick={() => {
								}}>
								By Economic System
							</button>
						</Col>
						<Col xs={6} sm={3}>
							<button 
								className='story-button blue-text'
								onClick={() => {
								}}>
								By Socio-culture Perspective
							</button>
						</Col>
					</Row>
					<Row style={{ marginTop: '80px', marginBottom: '100px'}} className='d-flex justify-content-center'>
						{stories.map((story)=>{
							return(
							<Col key={`${story.id}`}>
								<Link to={`/StoryReader?id=${story.id}`}>
									<div className='select-story-div text-center'>
										<img
											src={`${process.env.REACT_APP_strapiURL}${story.attributes.image.data.attributes.url}`}
                      						alt='Story_Image'
											height='100%'
										/>
										<p className='select-story-text text-center'>
											{story.attributes.name}
										</p>
									</div>
								</Link>
							</Col>
							)
						})}
					</Row>
				</Container>
			</div>
      <Footer references={storyReference} imageReference={storyImageSouce}/>
	</>
	)
}

export default Stories;
