import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ReactFullpage from '@fullpage/react-fullpage';

import './Stories.css';
import Navbar from 'src/components/Navbar.js';
import Footer, { ChangeCreditsAndReferences } from 'src/components/Footer.js';
import LoadingPage from 'src/components/LoadingPage.js';
import SwitchComponent from './StoryComponents.js';


const StoryReader = () => {
	const [loading, set_loading] = useState(true);
	const [page, set_page] = useState(undefined);
	const [images, setImages] = useState([])
	// Fetches story_id via url link.
	const Get_id = () => {
		return new URLSearchParams(useLocation().search).get('id');
	}
	const storyId = Get_id();

	useEffect(() => {
		if (loading) {
			axios.get(`${process.env.REACT_APP_strapiURL}/stories/${storyId}`)
				.then((res) => {
					let story = res.data.zone
					ChangeCreditsAndReferences(res.data.credits_and_references);
					axios.get(story[16].image_json_link)
						.then((res)=>{

							setImages( images[16] = res.data );
							// console.log(images);
							set_page(
								<ReactFullpage
									//fullpage options
									licenseKey = {'YOUR_KEY_HERE'}
									navigation = {true}
									autoScrolling = {true}
									render={({ state, fullpageApi }) => {
										let storyJSX = [];
								
										for (let i = 0; i < story.length; i++) {
											storyJSX.push(SwitchComponent(story[i], i, images[i], fullpageApi));
										}
										return (
											<ReactFullpage.Wrapper>
												{storyJSX}
											</ReactFullpage.Wrapper>
										);
									}}
								/>
							);
						set_loading(false);
					});
				});
			}
		});

	// Render
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
			{Footer(true)}
		</>
	);
}

export default StoryReader;
