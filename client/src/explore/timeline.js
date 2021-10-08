import React from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import LoadingPage from '../components/loadingPage';

const Timeline = () => {
	return (
		<div>
			{Navbar()}
			<div id="Timeline">
			</div>
			{Footer()}
		</div>
	);
}

export default Timeline;
