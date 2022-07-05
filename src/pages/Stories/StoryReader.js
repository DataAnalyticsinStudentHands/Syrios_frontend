import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Footer from 'src/components/Footer.js';
import LoadingPage from 'src/components/LoadingPage.js';
import ReactFullpage from '@fullpage/react-fullpage';
import SwitchComponent from 'src/pages/Stories/StoryComponents.js';

import storyRequest from 'src/api/story';
import zoteroRequest from 'src/api/zotero';

const StoryReader = () => {
  // const [credits_and_references, set_credits_and_references] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  // const [story_zone, set_story_zone] = useState(undefined)

  const [storyFrame, setStoryFrame] = useState([])
  const [storyAnchors, setStoryAnchors]=useState([])
  const [storyReference, setStoryReference] = useState([])
  const [storyImageSouce, setStoryImageSouce]= useState([])

  const Get_id = () => {
    return new URLSearchParams(useLocation().search).get('id');
  }
  const storyId = Get_id();

  // useEffect(() => {
  //   if (isLoading) {
  //     axios.get(`${process.env.REACT_APP_strapiURL}/api/stories/${storyId}`)
  //     // axios.get(`http://localhost:1337/api/stories/${storyId}`)
  //       .then((res) => {
  //         console.log(res.data.data)
  //         let zone = res.data.data.attributes.zone
  //         set_credits_and_references(res.data.data.attributes.credits_and_references);
  //         set_story_zone(zone);
  //         // ChangeCreditsAndReferences(res.data.data.attributes.credits_and_references);
  //         setIsLoading(false);
  //       }
  //       );
  //   }
  // }
  // );
  const fetchData = async ()=>{
    if(isLoading === false) setIsLoading(true);
    const result = await storyRequest.storyFindOne(storyId)

    let resultData = result.data.data.attributes

    let imgRef=[]
    resultData.zone.forEach((frame)=>{
      //coin-compare
      if(frame.cc_coin){
        let ref = {}
        ref['right_holder']=frame.cc_coin.coin.data.attributes.right_holder
        ref['source_image']=frame.cc_coin.coin.data.attributes.source_image
        imgRef.push(ref)
      }
      //scale-frame
      else if(frame.scale_coin_left && frame.scale_coin_right){
        let ref1 = {}
        let ref2 = {}
        ref1['right_holder']=frame.scale_coin_left.coin.data.attributes.right_holder
        ref1['source_image']=frame.scale_coin_left.coin.data.attributes.source_image
        ref2['right_holder']=frame.scale_coin_right.coin.data.attributes.right_holder
        ref2['source_image']=frame.scale_coin_right.coin.data.attributes.source_image
        imgRef.push(ref1,ref2)
      }
      //fades-frame
      else if(frame.fades){
        frame.fades.forEach((fade)=>{
          let ref1 = {}
          let ref2 = {}
          ref1['right_holder']=fade.coin_left.data.attributes.right_holder
          ref1['source_image']=fade.coin_left.data.attributes.source_image
          ref2['right_holder']=fade.coin_right.data.attributes.right_holder
          ref2['source_image']=fade.coin_right.data.attributes.source_image
          imgRef.push(ref1,ref2)
        })
      }
      //flip-frame
      else if(frame.flip_coin_left && frame.flip_coin_right){
        let ref1 = {}
        let ref2 = {}
        ref1['right_holder']=frame.flip_coin_left.coin.data.attributes.right_holder
        ref1['source_image']=frame.flip_coin_left.coin.data.attributes.source_image
        ref2['right_holder']=frame.flip_coin_right.coin.data.attributes.right_holder
        ref2['source_image']=frame.flip_coin_right.coin.data.attributes.source_image
        imgRef.push(ref1,ref2)
      }
      else if(frame.images){
        frame.images.forEach((image)=>{
          let ref = {}
          if(image.coin.data){
          ref['right_holder']=image.coin.data.attributes.right_holder
          ref['source_image']=image.coin.data.attributes.source_image
          imgRef.push(ref)
          }
        })
      }
      else if(frame.it_image){
        let ref = {}
        if(frame.it_image.coin.data){
          ref['right_holder']=frame.it_image.coin.data.attributes.right_holder
          ref['source_image']=frame.it_image.coin.data.attributes.source_image
          imgRef.push(ref)
        }
      }
      else if(frame.iti_image_left && frame.iti_image_right){
        let ref1 = {}
        if(frame.iti_image_left.coin.data){
          ref1['right_holder']=frame.iti_image_left.coin.data.attributes.right_holder
          ref1['source_image']=frame.iti_image_left.coin.data.attributes.source_image
        }
        let ref2 = {}
        if(frame.iti_image_right.coin.data){
          ref2['right_holder']=frame.iti_image_right.coin.data.attributes.right_holder
          ref2['source_image']=frame.iti_image_right.coin.data.attributes.source_image
        }
        imgRef.push(ref1,ref2)
      }
    })
    function compare(a,b){
      if ( a.right_holder < b.right_holder ){return -1;}
      if ( a.right_holder > b.right_holder ){return 1;}
      return 0;
    }
    function unique(arr, key) {
      if (!arr) return arr
      if (key === undefined) return [...new Set(arr)]
      const map = {
          'string': e => e[key],
          'function': e => key(e),
      }
      const fn = map[typeof key]
      const obj = arr.reduce((o,e) => (o[fn(e)]=e, o), {})
      return Object.values(obj)
  }
    imgRef = imgRef.sort(compare)
    imgRef = unique(imgRef,'right_holder')
    setStoryImageSouce(imgRef)

    let itemkeys = []
    resultData.references.data.forEach((reference)=>{itemkeys.push(reference.attributes.item_key)})
    let bibArr = []
    for (const itemkey of itemkeys){
      const data = await zoteroRequest.getOneItemBib(itemkey)
      bibArr.push(data.data)
    }

    bibArr = bibArr.sort()
    setStoryReference(bibArr)

    // let itemkeys = []
    // resultData.references.data.forEach((reference)=>{itemkeys.push(reference.attributes.item_key)})
    // let zoteroReference = []
    // for (const itemkey of itemkeys){
    //   const data = await zoteroRequest.getOneItem(itemkey)
    //   zoteroReference.push(data.data)
    // }
    //   //order Bib by last name
    //   function compare(a,b){
    //     if ( a.data.creators[0].lastName < b.data.creators[0].lastName ){return -1;}
    //     if ( a.data.creators[0].lastName > b.data.creators[0].lastName ){return 1;}
    //     return 0;
    // }
    // zoteroReference = zoteroReference.sort(compare)
    // console.log(zoteroReference)
    // setStoryReference(zoteroReference)


    let arrAnchros = []
    for (let i=0; i<resultData.zone.length;i++){
      let title = resultData.name.replace(/\s/g, '')
      arrAnchros.push(title+'-slides-' +i)
    }
    setStoryAnchors(arrAnchros)

    setStoryFrame(resultData.zone)
    setIsLoading(false)
  }

  useEffect(()=>{
    fetchData().catch(console.error);
  },[])

  // Render
  if (isLoading) {
    return (
      <>
        <LoadingPage />
        <Footer
          references={storyReference}
          imageReference={storyImageSouce}
        />
      </>
    );
  }

  return (
    <>
      <ReactFullpage
        licenseKey = 'i getted a license'
        navigation = {true}
        anchors={storyAnchors}
        autoScrolling = {true}
        // onLeave={(origin, destination, direction) => {
        //   console.log("onLeave event", { origin, destination, direction });
        // }}
        render={({state, fullpageApi}) => {
          // console.log("render prop change", state, fullpageApi);
          let storyJSX = [];
          for (let i = 0; i < storyFrame.length; i++) {
            storyJSX.push(
              SwitchComponent(storyFrame[i], i,fullpageApi, state)
              );
          }
          return (
            <ReactFullpage.Wrapper>
               {storyJSX}
            </ReactFullpage.Wrapper>
          );
        }}
      />	
      <Footer
        references={storyReference}
        imageReference={storyImageSouce}
        // hasCreditsAndReferences={true}
        // creditsAndReferences={credits_and_references}
      />
    </>
  );
}

export default StoryReader;
