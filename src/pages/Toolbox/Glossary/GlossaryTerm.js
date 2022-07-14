/* eslint-disable no-unused-vars */
import React, {useState, useEffect} from 'react';
import LoadingPage from 'src/components/LoadingPage.js';
import glossaryRequest from 'src/api/glossary';
import createMarkup from 'src/utils/Markup';
import { Link, useParams } from "react-router-dom";

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

    if(isLoading)return(<LoadingPage/>)
    return(
        <div id='glossary-term' >
            <div className='glossary-term'>{termData.term}
                <br/>
                <p className='glossary-basic'>
                    <span> {termData.type} </span> <span>&nbsp;|&nbsp;</span> 
                    <span> {termData.syllabication} </span> <span>&nbsp;|&nbsp;</span> 
                    <span> {termData.sounds_like} </span> 
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

            {termData.context? (
            <>
                {termData.context.length === 0 ? (<></>):(
                <>
                <div className='glossary-title'>See Word in Context 
                    <br/>
                    <div className='glossary-body glossary-context-icon'>
                        {/* <span className='media-play text-center'> &#xe81f;</span>
                        <span> &#xe81a;</span> */}
                        <div dangerouslySetInnerHTML={createMarkup(termData.context)}/>
                    </div>
                </div>
            </>)}
            </>):(<></>)}

        </div>
    )
}

export default GlossaryTerm;
