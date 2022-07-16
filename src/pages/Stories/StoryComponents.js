import Title from 'src/components/StoryComponents/StoryFrames/Title';
import EndFrame from 'src/components/StoryComponents/StoryFrames/EndFrame';
import Images from 'src/components/StoryComponents/StoryFrames/Images'
import TextText from 'src/components/StoryComponents/StoryFrames/TextText'
import ImageText from 'src/components/StoryComponents/StoryFrames/ImageText'
import ImageTextImage from 'src/components/StoryComponents/StoryFrames/ImageTextImage'
import ImageTextText from 'src/components/StoryComponents/StoryFrames/ImageTextText'
import ScaleFrame from 'src/components/StoryComponents/StoryFrames/ScaleFrame'
import FlipFrame from 'src/components/StoryComponents/StoryFrames/FlipFrame'
import FadeFrame from 'src/components/StoryComponents/StoryFrames/FadeFrame'
import CompareFrame from 'src/components/StoryComponents/StoryFrames/CompareFrame'


const StoryComponent = (zone, index,fullpageApi, state,toggleBottom) => {
    switch (zone.__component) {
      case 'frame.title':
        return <Title zone={zone} key={`story_comp_${index}`} index={index} fullpageApi={fullpageApi} toggleBottom={toggleBottom}/>
      case 'frame.end':
        return <EndFrame zone={zone} key={`story_comp_${index}`} index={index} fullpageApi={fullpageApi} state={state} toggleBottom={toggleBottom}/>
      case 'frame.images':
        return <Images zone={zone} key={`story_comp_${index}`} index={index} fullpageApi={fullpageApi} state={state} toggleBottom={toggleBottom}/>
      case 'frame.text-text':
        return <TextText zone={zone} key={`story_comp_${index}`} index={index} fullpageApi={fullpageApi} state={state} toggleBottom={toggleBottom}/>
      case 'frame.image-text':
        return <ImageText zone={zone} key={`story_comp_${index}`} index={index} fullpageApi={fullpageApi} state={state} toggleBottom={toggleBottom}/>
      case 'frame.image-text-image':
        return <ImageTextImage zone={zone} key={`story_comp_${index}`} index={index} fullpageApi={fullpageApi} state={state} toggleBottom={toggleBottom}/>
      case 'frame.image-text-text':
        return <ImageTextText zone={zone} key={`story_comp_${index}`} index={index} fullpageApi={fullpageApi} state={state} toggleBottom={toggleBottom}/>
      case 'frame.scale-frame':
        return <ScaleFrame zone={zone} key={`story_comp_${index}`} index={index} fullpageApi={fullpageApi} state={state} toggleBottom={toggleBottom}/>
      case 'frame.flip-frame':
        return <FlipFrame zone={zone} key={`story_comp_${index}`} index={index}  fullpageApi={fullpageApi} state={state} toggleBottom={toggleBottom}/>
      case 'frame.values-frame':
        return <FadeFrame zone={zone} key={`story_comp_${index}`} index={index} fullpageApi={fullpageApi} state={state} toggleBottom={toggleBottom}/>
        case 'frame.coin-compare':
          return <CompareFrame zone={zone} key={`story_comp_${index}`} index={index} fullpageApi={fullpageApi} state={state} toggleBottom={toggleBottom}/>
      default:
        console.error(`Error: Unrecognized component '${zone.__component}'`);
    }
  }
  
export default StoryComponent
