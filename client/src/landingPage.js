import React from 'react';
import Navbar from './components/navbar';
import Footer from './components/footer';

const LandingPage = () => {

	return (
		<div>
			{Navbar()}
			{Footer()}
		</div>
	);
};

export default LandingPage;
