import Title from 'src/components/StoryComponents/StoryFrames/Title';
import EndFrame from 'src/components/StoryComponents/StoryFrames/EndFrame';
import Frame1 from 'src/components/StoryComponents/StoryFrames/Frame1';

import Images from 'src/components/StoryComponents/StoryFrames/Images'
import TextText from 'src/components/StoryComponents/StoryFrames/TextText'
import ImageText from 'src/components/StoryComponents/StoryFrames/ImageText'
import ImageTextImage from 'src/components/StoryComponents/StoryFrames/ImageTextImage'
import ImageTextText from 'src/components/StoryComponents/StoryFrames/ImageTextText'
import ScaleFrame from 'src/components/StoryComponents/StoryFrames/ScaleFrame'
import FlipFrame from 'src/components/StoryComponents/StoryFrames/FlipFrame'

const SwitchComponent = (zone, index) => {
    switch (zone.__component) {
      case 'frame.title':
        return <Title zone={zone} key={`story_comp_${index}`}/>
      case 'frame.end':
        return <EndFrame zone={zone} key={`story_comp_${index}`}/>
      case 'frame.1':
        return <Frame1 zone={zone} key={`story_comp_${index}`}/>
      case 'frame.images':
        return <Images zone={zone} key={`story_comp_${index}`}/>
      case 'frame.text-text':
        return <TextText zone={zone} key={`story_comp_${index}`}/>
      case 'frame.image-text':
        return <ImageText zone={zone} key={`story_comp_${index}`}/>
      case 'frame.image-text-image':
        return <ImageTextImage zone={zone} key={`story_comp_${index}`}/>
      case 'frame.image-text-text':
        return <ImageTextText zone={zone} key={`story_comp_${index}`}/>
      case 'frame.scale-frame':
        return <ScaleFrame zone={zone} key={`story_comp_${index}`}/>
        case 'frame.flip-frame':
          return <FlipFrame zone={zone} key={`story_comp_${index}`}/>
      default:
        console.error(`Error: Unrecognized component '${zone.__component}'`);
    }
  }
  

  

export default SwitchComponent
