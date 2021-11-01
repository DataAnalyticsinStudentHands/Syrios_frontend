import React from 'react';
import {
	BrowserRouter,
	Route,
	Switch,
	// Redirect,
} from 'react-router-dom';

import LandingPage from 'src/pages/LandingPage.js';
import Timeline from 'src/pages/Toolbox/Timeline.js';
import Stories from 'src/pages/Stories/Stories.js';
import StoryReader from 'src/pages/Stories/StoryReader.js';
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
			<BrowserRouter>
				<Switch>
					<Route exact path='/' component={LandingPage} />
					<Route exact path='/Toolbox/Timeline/' component={Timeline} />
					<Route exact path='/Stories/Stories/' component={Stories} />
					<Route exact path='/Stories/StoryReader/' component={StoryReader} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
