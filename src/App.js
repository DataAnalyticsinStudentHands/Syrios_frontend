import React from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style/styles.scss";
import background from 'src/assets/background.jpg';

import Navbar from 'src/components/Navbar.js';
import LandingPage from 'src/pages/LandingPage.js';
import AboutUs from 'src/pages/AboutUs/AboutUs.js';
import ContactUs from './pages/ContactUs/ContactUs';

import Stories from 'src/pages/Stories/Stories.js';
import StoryReader from 'src/pages/Stories/StoryReader.js';


import ExploreTheEvidence from 'src/pages/Evidence/ExploreTheEvidence.js';
import CoinSort from 'src/pages/Evidence/CoinSort/CoinSort.js';
import MapCoins from './pages/Evidence/MapCoins/MapCoins';
import CoinCatalog from './pages/Evidence/CoinCatalogy/CoinCatalog';
import Download from 'src/pages/Evidence/Download/Download.js';

import Toolbox from './pages/Toolbox/Toolbox';
import HowToReadACoin from 'src/pages/Stories/HowToReadACoin.js';
import VideoLibrary from './pages/Toolbox/VideoLibrary/VideoLibrary';
import Timeline from 'src/pages/Toolbox/Timeline/Timeline.js';
import Glossary from './pages/Toolbox/Glossary/Glossary.js';
import Coin3D from './pages/Toolbox/Coin3D/Coin3D';
import Research from './pages/Toolbox/Research/Research';
// import TeachingResources from './pages/Resources/TeachingResources/TeachingResources';

import GlossaryWrapper from './pages/Toolbox/Glossary/glossary-wrapper';
import GlossaryTerm from './pages/Toolbox/Glossary/GlossaryTerm';

import ErrorPage from './components/404';

function App() {
	return (
		<div id='App' style={{ backgroundImage: `url(${background})`}}>
      { /* Change line below: <BrowserRouter basename='/dev'> to deploy on syrios.uh.edu/dev */ }
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route exact path='/' element={<LandingPage />} />
					<Route path='/HowToReadACoin' element={<HowToReadACoin />} />
					<Route path='/Stories' element={<Stories />} />
					<Route path='/Evidence' element={<ExploreTheEvidence />} /> 
					<Route path='/Toolbox' element={<Toolbox />} />
					<Route path='/StoryReader' element={<StoryReader />} />
					<Route path='/Evidence/CoinSort' element={<CoinSort />} />
					<Route path='/Evidence/MapCoins' element={<MapCoins />} />
					<Route path='/Evidence/Timeline' element={<Timeline />} />
					<Route path='/Evidence/CoinCatalog' element={<CoinCatalog />} />
					<Route path='/Evidence/Download' element={<Download />} />
					<Route path='/Toolbox/VideoLibrary' element={<VideoLibrary />} />
					<Route path='/Toolbox/Research' element={<Research />} />
					<Route path='/Toolbox/Coin3D' element={<Coin3D />} />
					<Route element={<GlossaryWrapper/>}>
						<Route path='/Toolbox/Glossary/:group' element={<Glossary />} />
						<Route path='/Toolbox/Glossary/term/:term' element={<GlossaryTerm />} />
					</Route>
					{/* <Route path='/Resources/TeachingResources' element={<TeachingResources />} /> */}
					<Route path='/ContactUs' element={<ContactUs />} />
					<Route path='/About' element={<AboutUs />} />

					<Route path='/*' element={<ErrorPage />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
