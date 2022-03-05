import { useEffect, useState } from 'react';
import axios from 'axios';

import 'src/pages/Stories/Stories.css';
import Navbar from 'src/components/Navbar.js';
import Footer, { ChangeCreditsAndReferences } from 'src/components/Footer.js';
import fullPageComponent from 'src/components/FullPageComponent';
import LoadingPage from 'src/components/LoadingPage.js';



const HowToReadACoin = () => {
  const [loading, setLoading] = useState(true);
  const [storyZone, setStoryZone] = useState(undefined)

  useEffect(() => {
    if (loading) {
      axios.get(`${process.env.REACT_APP_strapiURL}/how-to-read-a-coin`)
        .then((res, error) => {
            setStoryZone(res.data.zone)
            ChangeCreditsAndReferences(res.data.credits_and_references);
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
      {fullPageComponent(storyZone)}
      {Footer(true)}
    </>
  );
}

export default HowToReadACoin;
