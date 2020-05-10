import React from "react";
import Syrios from "./syrios/syrios"; //* uncomment this import to retrieve objects from "https://sites.lib.uh.edu/kmneuma2/api/items" API
// import Animate from './animate/animate'      //* uncomment this import to images from 'data/images.json'

const App = () => {
  return (
    <div>
      <Syrios />
      {/* <Animate /> */}
    </div>
  );
};

export default App;
