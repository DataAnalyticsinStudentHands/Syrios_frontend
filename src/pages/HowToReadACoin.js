import { useEffect, useState } from 'react';
import axios from 'axios';

import 'src/pages/Stories/Stories.css';
import Navbar from 'src/components/Navbar.js';
import Footer, { ChangeCreditsAndReferences } from 'src/components/Footer.js';
// import fullPageComponent from 'src/components/FullPageComponent';
import LoadingPage from 'src/components/LoadingPage.js';
import ReactFullpage from '@fullpage/react-fullpage';
import SwitchComponent from 'src/pages/Stories/StoryComponents.js';

const HowToReadACoin = () => {
  const [loading, setLoading] = useState(true);
  const [storyZone, setStoryZone] = useState(undefined)

  useEffect(() => {
    if (loading) {
      axios.get(`${process.env.REACT_APP_strapiURL}/api/how-to-read-a-coin`)
        .then((res, error) => {
          let data =res.data.data.attributes
          setStoryZone(data.zone)
          // ChangeCreditsAndReferences(data.credits_and_references);
          setLoading(false);
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

export default HowToReadACoin;
