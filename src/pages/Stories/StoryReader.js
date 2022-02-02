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
	const [jsonObject, setJsonObject] = useState([])
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

					let endPoints = [
						story[16].image_json_link,
						story[17].text_json_link
					]
					
					axios.all(endPoints.map((endPoint)=>axios.get(endPoint)))
						.then((res)=>{

							setJsonObject(
								jsonObject[16] = res[0].data,
								jsonObject[17] = res[1].data);
							
							set_page(
								<ReactFullpage
									//fullpage options
									licenseKey = {'YOUR_KEY_HERE'}
									navigation = {true}
									autoScrolling = {true}
									render={({ state, fullpageApi }) => {
										let storyJSX = [];
								
										for (let i = 0; i < story.length; i++) {
											storyJSX.push(SwitchComponent(story[i], i, jsonObject[i], fullpageApi));
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
