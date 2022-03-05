import { useEffect, useState } from 'react';
import axios from 'axios';

import 'src/pages/Stories/Stories.css';
import Navbar from 'src/components/Navbar.js';
import Footer, { ChangeCreditsAndReferences } from 'src/components/Footer.js';
import LoadingPage from 'src/components/LoadingPage.js';
import fullPageComponent from 'src/components/FullPageComponent';


const HowToReadACoin = () => {
  const [isLoading, set_isLoading] = useState(true);
  const [storyZone, setStoryZone] = useState(undefined)

  useEffect(() => {
    if (isLoading) {
      axios.get(`${process.env.REACT_APP_strapiURL}/how-to-read-a-coin`)
        .then((res, error) => {
            setStoryZone(res.data.zone)
            ChangeCreditsAndReferences(res.data.credits_and_references);
            set_isLoading(false);
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
      {fullPageComponent(storyZone)}
      {Footer(true)}
    </>
  );
}

export default HowToReadACoin;
