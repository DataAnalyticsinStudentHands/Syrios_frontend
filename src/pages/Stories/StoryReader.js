import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import qs from 'qs';

import './Stories.css';
import Navbar from 'src/components/Navbar.js';
import Footer, { ChangeCreditsAndReferences } from 'src/components/Footer.js';
// import fullPageComponent from 'src/components/FullPageComponent';
import LoadingPage from 'src/components/LoadingPage.js';
import ReactFullpage from '@fullpage/react-fullpage';
import SwitchComponent from 'src/pages/Stories/StoryComponents.js';

const StoryReader = () => {
	const [loading, setLoading] = useState(true);
	const [storyZone, setStoryZone] = useState(undefined)
	// Fetches story_id via url link.
	const Get_id = () => {
		return new URLSearchParams(useLocation().search).get('id');
	}
	const storyId = Get_id();

	// const query = qs.stringify({
	// 	filters:{
	// 	id: {
	// 		$eq: storyId,
	// 	},
	// 	},
	// 	populate: {
	// 	populate: '*',
	// 	zone: {
	// 		populate: '*',
	// 	},
	// 	},
	// });
	useEffect(() => {
		if (loading) {
			axios.get(`${process.env.REACT_APP_strapiURL}/api/stories/${storyId}`)
				.then((res) => {
					let zone = res.data.data.attributes.zone
					setStoryZone(zone);
					// ChangeCreditsAndReferences(res.data.data.attributes.credits_and_references);
					setLoading(false);
						}
					);
				}
			}
		);

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
			<ReactFullpage
				//fullpage options
				licenseKey = {'YOUR_KEY_HERE'}
				navigation = {true}
				autoScrolling = {true}
				
				render={() => {
					let storyJSX = [];
					for (let i = 0; i < storyZone.length; i++) {
						storyJSX.push(SwitchComponent(storyZone[i], i));
					}
					// console.log(storyJSX)

					return (
						<ReactFullpage.Wrapper>
						{storyJSX}
						</ReactFullpage.Wrapper>
					);
				}}
			/>			
			{Footer(true)}
		</>
	);
}

export default StoryReader;
