import React from 'react';
import {
	BrowserRouter,
	Route,
	Switch,
	// Redirect,
} from 'react-router-dom';

import LandingPage from 'src/pages/LandingPage.js';
import background from 'src/assets/background.jpg';

function App() {
  return (
    <div id='App' style={{ backgroundImage: `url(${background})`}}>
			<BrowserRouter>
				<Switch>
					<Route exact path='/' component={LandingPage} />
				</Switch>
			</BrowserRouter>
    </div>
  );
}

export default App;
