import React from 'react';
import {
	BrowserRouter,
	Route,
	Routes,
	// Redirect,
} from 'react-router-dom';

import LandingPage from 'src/pages/LandingPage.js';
import Timeline from 'src/pages/Toolbox/Timeline.js';
import Stories from 'src/pages/Stories/Stories.js';
import StoryReader from 'src/pages/Stories/StoryReader.js';
import HowToReadACoin from 'src/pages/HowToReadACoin.js';
import About from 'src/pages/bottomNavigation/About.js';
import ExploreTheEvidence from 'src/pages/Evidence/ExploreTheEvidence.js';

import background from 'src/assets/background.jpg';

function App() {
	return (
		<div id='App' style={{ backgroundImage: `url(${background})`}}>
			{// Link is used to download the bootstrap css
			}
			<link
				rel="stylesheet"
				href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
				integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
				crossOrigin="anonymous"
			/>
      { /* Change line below: <BrowserRouter basename='/dev'> to deploy on syrios.uh.edu/dev */ }
			<BrowserRouter basename='/dev'>
				<Routes>
          <Route exact path='/' element={<LandingPage />} />
          <Route path='/Toolbox/Timeline' element={<Timeline />} />
          <Route path='/Stories' element={<Stories />} />
          <Route path='/StoryReader' element={<StoryReader />} />
          <Route path='/HowToReadACoin' element={<HowToReadACoin />} />
          <Route path='/About' element={<About />} />
          <Route path='/Evidence/ExploreTheEvidence' element={<ExploreTheEvidence />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
