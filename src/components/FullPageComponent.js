import ReactFullpage from '@fullpage/react-fullpage';
import SwitchComponent from 'src/pages/Stories/StoryComponents.js';

function fullPageComponent(storyZone, storyId){
    return(
        <ReactFullpage
        //fullpage options
        licenseKey = {'YOUR_KEY_HERE'}
        navigation = {true}
        autoScrolling = {true}
        render={() => {
          let storyJSX = [];

          // for (let i = 0; i < storyZone.length; i++) {
          //   storyJSX.push(SwitchComponent(storyZone[i].attributes, i));
          // }
          storyJSX.push(SwitchComponent(storyZone[storyId-1].attributes, storyId));

          return (
            <ReactFullpage.Wrapper>
              {storyJSX}
            </ReactFullpage.Wrapper>
          );
        }}
      />
    )
}
export default fullPageComponent;
