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
			{// Link is used to download the bootstrap css
			}
			<link
				rel="stylesheet"
				href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css"
				integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU"
				crossorigin="anonymous"
			/>
			<BrowserRouter>
				<Switch>
					<Route exact path='/' component={LandingPage} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
