import React from 'react';
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import createMarkup from 'src/utils/Markup.js';


const Footer = ({references,imageReference,isBottomOpen,toggleBottom}) => {
  // let eleheight = document.getElementById("credits-and-references")?.clientHeight
  // let footerheight = document.getElementById("footer")?.clientHeight
  return (
    <>
     <div id='footer'>
         <div id='footer-links' className='d-flex justify-content-center align-items-center mx-5'>
           <div xs={2} className='d-flex align-items-center justify-content-end mx-5'>
            {(imageReference || references) &&( imageReference.length!==0 ||references.length!==0) ?(
              <button className='footer-text reference-tag icon-entypo-arrow-thick-up' onClick={toggleBottom}>
                CREDITS & REFERENCES 
              </button>
            ):(<></>)}
          </div>
        </div>
    </div>
      {(imageReference || references) &&( imageReference.length!==0 ||references.length!==0) ? (<>
        <Drawer
          open={isBottomOpen}
          onClose={toggleBottom}
          direction='bottom'
          className='credits-and-references'
          size={'50vh'}
        >
          <button className='x-button reference-tag' onClick={toggleBottom}> &#xe839;</button>

          <div className='referenceContent' style={{padding:"5% 10%"}}>

              <div className='col-4'>
                  <div className='references-h3 mb-3'>Coin Images Courtesy of:</div>
                  <div id='reference-content'>
                    {imageReference.map((ref,index)=>{
                      return(
                        <div key={index} className='d-flex references-text my-5'>
                            <a href={ref.source_image} target="_blank" rel="noopener noreferrer">{ref.right_holder}<span className='icon-entypo-link-external' style={{color:'#b9ccd7',fontSize:'1.25em'}}/></a>
                        </div>
                      )})}
                  </div>
              </div>
              <div className='col-7'>
                <div className='references-h3 mx-4 mb-3'>To read more, check these out:</div>
                <div id='reference-content'>
                  {references.map((ref,index)=>{
                    return(
                      <div key={index} className='d-flex references-text my-3' style={{overFlowY:'scroll'}}>
                        <span xs={1} className='d-flex justify-content-end mx-5' >[{index+1}]</span>
                        {ref.split("http")[1] 
                        ? <div xs={11} >
                            <a href={`http${ref.split("http")[1].split(".</div>")[0]}`} dangerouslySetInnerHTML={createMarkup(ref.split("http")[0])}target="_blank" rel="noopener noreferrer"/>
                          </div>
                        :<div xs={11} dangerouslySetInnerHTML={createMarkup(ref.split("http")[0])}/>}
                      </div>
                    )})}
                </div>
            </div>

          </div>
        </Drawer>
      </>):(<></>)}
    </>
  )
}

export default Footer;
