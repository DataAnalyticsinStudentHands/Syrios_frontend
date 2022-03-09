import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

import './Stories.css';
import Navbar from 'src/components/Navbar.js';
import Footer, { ChangeCreditsAndReferences } from 'src/components/Footer.js';
import fullPageComponent from 'src/components/FullPageComponent';
import LoadingPage from 'src/components/LoadingPage.js';


const StoryReader = () => {
	const [loading, setLoading] = useState(true);
	const [storyZone, setStoryZone] = useState(undefined)
	// Fetches story_id via url link.
	const Get_id = () => {
		return new URLSearchParams(useLocation().search).get('id');
	}
	const storyId = Get_id();
	//console.log(storyId)


	useEffect(() => {
		if (loading) {
			axios.get(`${process.env.REACT_APP_strapiURL}/api/stories/?id=${storyId}&populate=*`)
				.then((res) => {
					setStoryZone(res.data.data[0]);
					ChangeCreditsAndReferences(res.data.data.credits_and_references);
					setLoading(false);

					// let wikidatas = []
					// let wikidataIndex = []
					// for (let i = 0; i < storyZone.length;i++){
					// 	if(storyZone[i].wiki_data !== undefined){
					// 		 wikidatas.push(storyZone[i].wiki_data)
					// 		 wikidataIndex.push(i)
					// 	}
					// }
					// if(wikidatas.length !== 0){
					// 	axios.all(wikidatas.map((wikidata)=>axios.get(wikidata)))
					// 	.then((res)=>{
					// 		for(let i = 0; i<wikidataIndex.length; i++){
					// 			jsonObject[wikidataIndex[i]] = res[i].data
					// 		}
					// 	});
					// }
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
			{fullPageComponent(storyZone)}
			{Footer(true)}
		</>
	);
}

export default StoryReader;
