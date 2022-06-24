import React from 'react';
import {
	BrowserRouter,
	Route,
	Routes,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style/styles.scss";
import Navbar from 'src/components/Navbar.js';
import LandingPage from 'src/pages/LandingPage.js';
import Timeline from 'src/pages/Toolbox/Timeline.js';
import Stories from 'src/pages/Stories/Stories.js';
import StoryReader from 'src/pages/Stories/StoryReader.js';
import HowToReadACoin from 'src/pages/HowToReadACoin.js';
import AboutUs from 'src/pages/AboutUs/AboutUs.js';
import ExploreTheEvidence from 'src/pages/Evidence/ExploreTheEvidence.js';
import CoinSort from 'src/pages/Evidence/CoinSort.js';
import Download from 'src/pages/Download/Download.js';
import ContactUs from './pages/ContactUs/ContactUs';
import Glossary from './pages/Toolbox/Glossary.js';

import background from 'src/assets/background.jpg';

function App() {
	return (
		<div id='App' 
			style={{ backgroundImage: `url(${background})`}}
		>
      { /* Change line below: <BrowserRouter basename='/dev'> to deploy on syrios.uh.edu/dev */ }
			<BrowserRouter basename='/dev'>
				<Navbar />
				<Routes>
					<Route exact path='/' element={<LandingPage />} />
					<Route path='/Toolbox/Timeline' element={<Timeline />} />
					<Route path='/Stories' element={<Stories />} />
					<Route path='/StoryReader' element={<StoryReader />} />
					<Route path='/HowToReadACoin' element={<HowToReadACoin />} />
					<Route path='/About' element={<AboutUs />} />
					<Route path='/Evidence/ExploreTheEvidence' element={<ExploreTheEvidence />} />
					<Route path='/Evidence/CoinSort' element={<CoinSort />} />
					<Route path='/Download' element={<Download />} />
					<Route path='/ContactUs' element={<ContactUs />} />
					<Route path='/Toolbox/Glossary' element={<Glossary />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
