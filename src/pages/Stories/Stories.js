import React, {useEffect, useState} from 'react';
import {
	Container,
	Row,
	Col
} from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Navbar from 'src/components/Navbar';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer';
import './Stories.css';
import 'src/components/constants.css';



const Stories = () => {
	const [loading, set_loading] = useState(true);

	// My idea is to have each page sort defined.
	// When user presses on of the buttons, it will do set_page(whichever_sort);
	// The sorted pages are presorted that way it's snappy 
	const [page, set_page] = useState(undefined);
  /* not yet implemented
	const [page_sortByCity, set_page_sortByCity] = useState(undefined);
	const [page_sortByPolitical, set_page_sortByPolitical] = useState(undefined);
	const [page_sortByEconomic, set_page_sortByEconomic] = useState(undefined);
  const [page_sortBySocioCultural, set_page_sortBySocioCultural] = useState(undefined); */

	const Page = (stories) => {
		return (
			<div id='d-flex justify-content-center align-items-center StoriesPage'>
				<Container style={{position: 'relative', top: '100px'}}>
					<Row container='justify-content-md-center'>
						{/* This is the title text in orage */}
						<Col>
							<p className='BlueText text-center' style={{fontSize: '7em'}}>
								Discover Coin Stories
							</p>
						</Col>
					</Row>
					<Row container='justify-content-md-center' className='d-flex justify-content-center'>
						<Col>
							<button
								className='BlueText'
								onClick={() => {
								}}>
								By City Name
							</button>
						</Col>
						<Col>
							<button
								className='BlueText'
								onClick={() => {
								}}>
								By Political Standing
							</button>
						</Col>
						<Col>
							<button
								className='BlueText'
								onClick={() => {
								}}>
								By Economic System
							</button>
						</Col>
						<Col>
							<button
								className='BlueText'
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
		);
	}

	useEffect(() => {
		if (loading) {
			axios.get(process.env.REACT_APP_strapiURL + '/stories') // Call stories objects to get story info so we can sort our informatoin around
				.then((res) => {
					let storiesJSX = [];
					res.data.forEach((e) => {
            console.log(e);
						storiesJSX.push(
							<Col key={`${e.id}`}>
								<Link to={`/StoryReader?id=${e._id}`}>
									<div className='SelectStoryDiv'>
										<img
											src={`${process.env.REACT_APP_strapiURL}${e.story_image.url}`}
                      alt='Story_Image'
											width='100%'/>
										<p className='OrangeText SelectStoryText text-center'>
											{e.story_name}
										</p>
									</div>
								</Link>
							</Col>
						)
					});

					// set_page no sort
					let pageJSX = [];
					storiesJSX.forEach((e, index) => {
						pageJSX.push(
							<Col key={`story_${index}`}>
								{e}
							</Col>
						);
					});
					set_page(Page(pageJSX));
					set_loading(false);
				});
		}
	});

	if (loading) {
		return (
			<>
				{Navbar()}
				{LoadingPage()}
				{Footer()}
			</>
		);
	}

	return (
		<>
			{Navbar()}
			{page}
			{Footer()}
		</>
	)
}

export default Stories;
