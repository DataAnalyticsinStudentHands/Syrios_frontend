import { useEffect, useState } from 'react';
import ReactFullpage from '@fullpage/react-fullpage';
import axios from 'axios';

import 'src/pages/Stories/Stories.css';
import Navbar from 'src/components/Navbar.js';
import Footer from 'src/components/Footer.js';
import LoadingPage from 'src/components/LoadingPage.js';
import SwitchComponent from 'src/pages/Stories/StoryComponents.js';



const HowToReadACoin = () => {
  const [isLoading, set_isLoading] = useState(true);
  const [page, set_page] = useState(undefined);

  useEffect(() => {
    if (isLoading) {
      axios.get(`${process.env.REACT_APP_strapiURL}/HowToReadACoin`)
        .then((res, error) => {
          if (error) {
            set_page(
              <div className='d-flex align-items-center justify-content-center' style={{paddingTop: '10%'}}>
                <p className='OrangeText text-center' style={{fontSize: '76px'}}>
                  Page failed to load. Try refreshing.
                </p>
              </div>
            );
            set_isLoading(false);
          } else {
            set_page(
              <ReactFullpage
                //fullpage options
                licenseKey = {'YOUR_KEY_HERE'}
                navigation = {true}
                autoScrolling = {true}
                render={({ state, fullpageApi }) => {
                  let story = res.data.zone;
                  let storyJSX = [];

                  for (let i = 0; i < story.length; i++) {
                    storyJSX.push(SwitchComponent(story[i], i, fullpageApi));
                  }

                  return (
                    <ReactFullpage.Wrapper>
                      {storyJSX}
                    </ReactFullpage.Wrapper>
                  );
                }}
              />
            );
            set_isLoading(false);

          }
        });
    }
  });

  if (isLoading) {
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
  );
}

export default HowToReadACoin;
