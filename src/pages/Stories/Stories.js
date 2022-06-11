import React, {useEffect, useState} from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer';


const Stories = () => {
	const [loading, set_loading] = useState(true);
	const [stories, set_stories] = useState(undefined)
	useEffect(() => {
		if (loading) {
			axios.get(process.env.REACT_APP_strapiURL + '/api/stories') // Call stories objects to get story info so we can sort our informatoin around
				.then((res) => {
					let data = res.data.data;
					let stories_jsx = [];
					data.forEach((e, index) => {
						stories_jsx.push(
							<Col key={`${index}`}>
								<Link to={`/StoryReader?id=${e.id}`}>
									<div className='select-story-div'>
										<img
											src={`${process.env.REACT_APP_strapiURL}${e.attributes.image.data.attributes.url}`}
                      						alt='Story_Image'
											width='100%'
										/>
										<p className='orange-text select-story-text text-center'>
											{e.attributes.name}
										</p>
									</div>
								</Link>
							</Col>
						)
					});

					let page_jsx = [];
					stories_jsx.forEach((e, index) => {
						page_jsx.push(
							<Col key={`story_${index}`}>
							{/* <Col key={`${e.key}`}> */}
								{e}
							</Col>
						);
					});
					set_stories(page_jsx)
					set_loading(false);
				});
			}
		});

	if (loading) {
		return (
			<>
				<LoadingPage />
				<Footer />
			</>
		);
	}

	return (
		<>
			<div id='stories-page' className='d-flex align-items-center'>
				<Container >
					<Row container='justify-content-md-center'>
						<Col>
							<p className='story-h1 text-center'>
								Discover Coin Stories
							</p>
						</Col>
					</Row>
					<Row container='justify-content-md-center' className='d-flex justify-content-center mt-5'>
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
					<Row style={{ marginTop: '80px', marginBottom: '100px'}}>
						{stories}
					</Row>
				</Container>
			</div>
      <Footer />
		</>
	)
}

export default Stories;
