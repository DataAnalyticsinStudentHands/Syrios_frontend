import ReactFullpage from '@fullpage/react-fullpage';
import SwitchComponent from 'src/pages/Stories/StoryComponents.js';

function fullPageComponent(story_zone, story_id){
    return(
        <ReactFullpage
        //fullpage options
        licenseKey = {'YOUR_KEY_HERE'}
        navigation = {true}
        autoScrolling = {true}
        
        render={() => {
          let story_jsx = [];
          for (let i = 0; i < story_zone.length; i++) {
            story_jsx.push(SwitchComponent(story_zone[i].attributes, story_id));
          }

          return (
            <ReactFullpage.Wrapper>
              {story_jsx}
            </ReactFullpage.Wrapper>
          );
        }}
      />
    )
}
export default fullPageComponent;
