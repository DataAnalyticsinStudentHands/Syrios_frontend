import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import qs from 'qs';

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

  const query = qs.stringify({
    filters:{
      id: {
        $eq: storyId,
      },
    },
    populate: {
      populate: '*',
      zone: {
        populate: '*',
      },
    },
  });

  console.log(`${process.env.REACT_APP_strapiURL}/api/stories/?${query}`);

	useEffect(() => {
		if (loading) {
			axios.get(`${process.env.REACT_APP_strapiURL}/api/stories/?${query}`)
				.then((res) => {
					setStoryZone(res.data.data[0]);
					console.log(storyZone);
					ChangeCreditsAndReferences(res.data.data.credits_and_references);
					setLoading(false);

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
			{fullPageComponent(storyZone,storyId)}
			{Footer(true)}
		</>
	);
}

export default StoryReader;
