import React, {useEffect, useState} from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Navbar from 'src/components/Navbar';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer';
import './Stories.css';
import 'src/components/constants.css';

const Stories = () => {
	const [loading, set_loading] = useState(true);
	const [stories, setStories] = useState(undefined)
	useEffect(() => {
		if (loading) {
			axios.get(process.env.REACT_APP_strapiURL + '/api/stories') // Call stories objects to get story info so we can sort our informatoin around
				.then((res) => {
					let data = res.data.data;
					let storiesJSX = [];
					data.forEach((e, index) => {
						storiesJSX.push(
							<Col key={`${index}`}>
								<Link to={`/StoryReader?id=${e.id}`}>
									<div className='SelectStoryDiv'>
										<img
											src={`${process.env.REACT_APP_strapiURL}${e.attributes.image.data.attributes.url}`}
                      						alt='Story_Image'
											width='100%'
										/>
										<p className='orange-text SelectStoryText text-center'>
											{e.attributes.name}
										</p>
									</div>
								</Link>
							</Col>
						)
					});

					let pageJSX = [];
					storiesJSX.forEach((e, index) => {
						pageJSX.push(
							<Col key={`story_${index}`}>
							{/* <Col key={`${e.key}`}> */}
								{e}
							</Col>
						);
					});
					setStories(pageJSX)
					set_loading(false);
				});
			}
		});

	if (loading) {
		return (
			<>
        <Navbar />
        <LoadingPage />
        <Footer />
			</>
		);
	}

	return (
		<>
      <Navbar />
			<div id='d-flex justify-content-center align-items-center StoriesPage'>
				<Container style={{position: 'relative', top: '100px'}}>
					<Row container='justify-content-md-center'>
						<Col>
							<p className='blue-text text-center' id='StoryMainTitle'>
								Discover Coin Stories
							</p>
						</Col>
					</Row>
					<Row container='justify-content-md-center' className='d-flex justify-content-center'>
						<Col xs={6} sm={3}>
							<button
								className='blue-text'
								onClick={() => {
								}}>
								By City Name
							</button>
						</Col>
						<Col xs={6} sm={3}>
							<button
								className='blue-text'
								onClick={() => {
								}}>
								By Political Standing
							</button>
						</Col>
						<Col xs={6} sm={3}>
							<button
								className='blue-text'
								onClick={() => {
								}}>
								By Economic System
							</button>
						</Col>
						<Col xs={6} sm={3}>
							<button className='blue-text'
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
