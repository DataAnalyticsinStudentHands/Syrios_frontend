import { useEffect, useState } from 'react';
import axios from 'axios';

import 'src/pages/Stories/Stories.css';
import Navbar from 'src/components/Navbar.js';
import Footer from 'src/components/Footer.js';
// import fullPageComponent from 'src/components/FullPageComponent';
import LoadingPage from 'src/components/LoadingPage.js';
import ReactFullpage from '@fullpage/react-fullpage';
import SwitchComponent from 'src/pages/Stories/StoryComponents.js';

const HowToReadACoin = () => {
  const [loading, set_loading] = useState(true);
  const [story_zone, set_story_zone] = useState(undefined);
  const [credits_and_references, set_credits_and_references] = useState(undefined);

  useEffect(() => {
    if (loading) {
      axios.get(`${process.env.REACT_APP_strapiURL}/api/how-to-read-a-coin`)
        .then((res, error) => {
          let data=res.data.data.attributes
          set_story_zone(data.zone);
          set_credits_and_references(data.credits_and_references);
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
			<ReactFullpage
				//fullpage options
				licenseKey = {'YOUR_KEY_HERE'}
				navigation = {true}
				autoScrolling = {true}
				
				render={() => {
					let storyJSX = [];
					for (let i = 0; i < story_zone.length; i++) {
						storyJSX.push(SwitchComponent(story_zone[i], i));
					}

					return (
						<ReactFullpage.Wrapper>
						{storyJSX}
						</ReactFullpage.Wrapper>
					);
				}}
			/>	      
      <Footer
        hadCreditsAndReferences={true}
        creditsAndRefernces={credits_and_references}
      />
    </>
  );
}

export default HowToReadACoin;
