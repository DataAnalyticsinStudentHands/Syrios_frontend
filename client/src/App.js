import './App.css';
import background from './assets/background.jpg';
import LandingPage from './landingPage.js';
import Timeline from './explore/timeline.js';

import {
	BrowserRouter as Router,
	Route,
	Switch,
	// Redirect,
} from "react-router-dom";

function App() {
  return (
		<div style={{ backgroundImage: `url(${background})`}}>
			<Router>
				<Switch>
					<Route exact path="/" component={LandingPage} />
					<Route exact path="/explore/timeline" component={Timeline} />
					{/* <Redirect to="/404" /> */}
				</Switch>
			</Router>
		</div>
  );
}

export default App;
