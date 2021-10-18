import React, {useEffect, useState} from 'react';
import axios from 'axios';

import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import 'src/components/constants.css';

function LandingPage() {
	const [loading, set_loading] = useState(true);
	const [page, set_page] = useState(undefined);

	useEffect(() => {
		if (loading) {
			axios.get(process.env.REACT_APP_strapiURL + '/landing-page')
				.then((res) => {
				});
		}
	});

	if (loading) {
		return (
			<div id='LandingPage'>
				{Navbar()}
				{LoadingPage()}
				{Footer()}
			</div>
		);
	}

  return (
    <div id='LandingPage'>
			{Navbar()}
			{page}
			{Footer()}
    </div>
  );
}

export default LandingPage;
