import React from "react";
import Intro from "./Components/IntroPage/intro";
import Syrios from "./Components/FetchAPIdata/syrios"; //* uncomment this import to retrieve objects from "https://sites.lib.uh.edu/kmneuma2/api/items" API
import Animate from "./Components/CoinAnimate/animate"; //* uncomment this import to retrieve images from 'data/images.json'
import SelectStory from "./Components/SelectStory/select"
import Civic from "./Components/CivicStory/civic-story";
import Economic from "./Components/EconomicStory/economic-story";
// import Demo from "./Components/Demo/demo"

import {
  BrowserRouter as Router,
  Route,
  Switch,
  // Redirect,
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch>
        {/* <Route exact path="/" component={Demo}/> */}
        <Route exact path="/" component={Intro} />
        <Route exact path="/coins" component={Animate} />
        <Route exact path="/data-api" component={Syrios} />
        <Route exact path="/select-story" component={SelectStory}/>
        <Route exact path="/civic-story" component={Civic} />
        <Route exact path="/economic-story" component={Economic}/>
        {/* <Redirect to="/404" /> */}
      </Switch>
    </Router>
  );
};

export default App;
