import React, {useEffect, useState} from 'react';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap';
import axios from 'axios';

import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';

import './ExploreTheEvidence.css';



const CoinSort = () => {
  const [isLoading, set_isLoading] = useState(true);
  const [coins, set_coins] = useState(undefined);

  useEffect(() => {
    if (isLoading) {
      axios.get(process.env.REACT_APP_strapiURL + '/coins?_limit=-1&_sort=y_date:ASC')
        .then((res, err) => {
          if (err) {
            console.error(err);
          } else {
            set_coins(res.data);
            set_isLoading(false);
          }
        });
    }
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <LoadingPage />
        <Footer />
      </>
    );
  }

  console.log(coins);
  return (
    <>
      <Navbar />
      <Footer />
    </>
  );
}

export default CoinSort;
