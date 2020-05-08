import React from 'react';
// import Syrios from './syrios/syrios';      //* uncomment this import to retrieve objects from "https://sites.lib.uh.edu/kmneuma2/api/items" API
import Animate from './animate/animate'

class App extends React.Component {
    render() {
        return(
          <div>
            <Animate />
          </div>
        );
    }

}

export default App;