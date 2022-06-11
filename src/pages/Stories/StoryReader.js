import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

import Footer from 'src/components/Footer.js';
// import fullPageComponent from 'src/components/FullPageComponent';
import LoadingPage from 'src/components/LoadingPage.js';
import ReactFullpage from '@fullpage/react-fullpage';
import SwitchComponent from 'src/pages/Stories/StoryComponents.js';

const StoryReader = () => {
  const [credits_and_references, set_credits_and_references] = useState(undefined);
  const [loading, set_loading] = useState(true);
  const [story_zone, set_story_zone] = useState(undefined)
  // Fetches story_id via url link.
  const Get_id = () => {
    return new URLSearchParams(useLocation().search).get('id');
  }
  const storyId = Get_id();

  useEffect(() => {
    if (loading) {
      axios.get(`${process.env.REACT_APP_strapiURL}/api/stories/${storyId}`)
        .then((res) => {
          let zone = res.data.data.attributes.zone
          set_credits_and_references(res.data.data.attributes.credits_and_references);
          set_story_zone(zone);
          // ChangeCreditsAndReferences(res.data.data.attributes.credits_and_references);
          set_loading(false);
        }
        );
    }
  }
  );

  // Render
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
        hasCreditsAndReferences={true}
        creditsAndReferences={credits_and_references}
      />
    </>
  );
}

export default StoryReader;
