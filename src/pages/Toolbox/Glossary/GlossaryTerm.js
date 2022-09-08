import React, {useState, useEffect} from 'react';
import glossaryRequest from 'src/api/glossary';
import createMarkup from 'src/utils/Markup';
import { Link, useParams } from "react-router-dom";

import CoinSortIcon from "./res/CoinSort.svg"
import MapIcon from "./res/Map.svg"
import StoryIcon from "./res/Stories.svg"
import TimelineIcon from "./res/Timeline.svg"
import VideoIcon from "./res/Video.svg"


const GlossaryTerm = () =>{
    const [isLoading, setIsLoading] = useState(true)
    const [termData, setTermData]=useState([])
    const {term} = useParams()

    useEffect(()=>{
        async function fetchData(){
            if(term){
                const results = await glossaryRequest.glossaryFindByTerm(term)
                setTermData(results.data[0])
                setIsLoading(false)
            }
        }
        fetchData()
    },[term])

    if(isLoading)return(
        <div id="glossary-loading">
            <div className="loader"/>
        </div>
    )
    return(
        <div id='glossary-term' >
            <div className='glossary-term'>{termData.term}
                <br/>
                <p className='glossary-basic'>
                    <span> {termData.type} </span>
                    {termData.syllabication ? (<>  <span>&nbsp;|&nbsp;</span> <span> {termData.syllabication} </span></>):(<></>)}
                    {termData.sounds_like ? (<>  <span>&nbsp;|&nbsp;</span> <span> {termData.sounds_like} </span></>):(<></>)}
                </p>
            </div>
            <br/>

            { termData.definition.length === 0 ? (<></>):(
                <>
                    <div className='glossary-title'>DEFINITION
                        <br/>
                        <div className='glossary-body' dangerouslySetInnerHTML={createMarkup(termData.definition)}/>
                    </div>
                    <br/>
                </>

            )}


            {termData.glossaries.length === 0 ? (<></>):(
                <>
                    <div className='glossary-title'>Related Words
                        <br/>
                        <div className='glossary-related-word'>
                            {termData.glossaries.map((word)=>{return(<span key={word.term}><Link to={`/Toolbox/Glossary/term/${word.term}`}>{word.term}</Link>&nbsp;&nbsp;</span>)})}
                        </div>
                    </div>
                    <br/>
                </>
            )}
            
            <div className='glossary-title'>See Word in Context 
                <br/>
                <div className='glossary-body glossary-context'>
                    <span style={{marginRight:"1.5vmax"}}>
                        <Link to='/Toolbox/VideoLibrary'>
                        <img src={`${VideoIcon}`} alt="VideoIcon" height="25vmax"/>
                        </Link>
                    </span>
                    <span style={{marginRight:"1.5vmax"}}>
                        <Link to='/Evidence/MapCoins'>
                        <img src={`${MapIcon}`} alt="MapIcon" height="25vmax"/>  
                        </Link>
                    </span>
                    <span style={{marginRight:"1.5vmax"}}>
                        <Link to='/Stories'>
                        <img src={`${StoryIcon}`} alt="StoryIcon" height="25vmax"/> 
                        </Link>
                    </span>
                    <span style={{marginRight:"1.5vmax"}}>
                        <Link to='/Evidence/Timeline'>
                        <img src={`${TimelineIcon}`} alt="TimelineIcon" height="25vmax"/>  
                        </Link>
                    </span>
                    <span style={{marginRight:"1.5vmax"}}>
                        <Link to='/Evidence/CoinSort'>
                        <img src={`${CoinSortIcon}`} alt="CoinSortIcon" height="25vmax"/>  
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default GlossaryTerm;
