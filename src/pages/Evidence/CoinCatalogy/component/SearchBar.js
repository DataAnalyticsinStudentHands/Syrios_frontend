import React, {useState, useEffect} from 'react'
import './SearchBar.scss'
// import useFetch from 'src/hooks/useFetch';
import { Link } from "react-router-dom";
import qs from 'qs';
import coinCollections from 'src/api/coin-collections';

const SearchBar = () =>{

    // const keyTerms = {
    //     denominations: getKeyTerms( useFetch('/denominations'),'denomination'),
    //     issuing_authorities: getKeyTerms(useFetch('/issuing-authorities'), 'issuing_authority'),
    //     languages: getKeyTerms(useFetch('/languages'),'language'),
    //     materials: getKeyTerms(useFetch('/materials'), 'material'),
    //     mints: getKeyTerms(useFetch('/mints'),'mint'),
    //     governing_powers: getKeyTerms(useFetch('/governing-powers'),'governing_power'),
    //     // obverse_types:getTypeTerms(useFetch('/coin-collections'),'obverse_type')
    //     ancient_territories: getKeyTerms(useFetch('/ancient-territories'),'ancient_territory')
    // }
    // console.log(keyTerms)
    // const keyTerms = [
    //     {denominations: getKeyTerms( useFetch('/denominations'),'denomination')},
    //     {issuing_authorities: getKeyTerms(useFetch('/issuing-authorities'), 'issuing_authority')},
    //     {languages: getKeyTerms(useFetch('/languages'),'language')},
    //     {materials: getKeyTerms(useFetch('/materials'), 'material')},
    //     {mints: getKeyTerms(useFetch('/mints'),'mint')},
    //     {governing_powers: getKeyTerms(useFetch('/governing-powers'),'governing_power')},
    //     {ancient_territories: getKeyTerms(useFetch('/ancient-territories'),'ancient_territory')}
    // ]

    const [tags, setTages] = useState({
        material:[],
        mint:[],
        issuing_authority:[],
        governing_power:[],
        language:[],
        denomination:[],
        ancient_territory:[],
    })

    const [tagOptions,setTageOptions] = useState({
        material:[],
        mint:[],
        issuing_authority:[],
        governing_power:[],
        language:[],
        denomination:[],
        ancient_territory:[],
      })
    
    const [coins, setCoins] = useState([])
    const [pattern, setPattern] = useState('')
    // const [url, setUrl] = useState('')

    useEffect(()=>{
        const fetchData = async ()=>{
            const result = await coinCollections.coinSearch()
            let data = result.data.data
            setCoins(data)
        }
        fetchData().catch(console.error);  
    },[])

    useEffect(()=>{
        function getDeepFilterOptions(filter){
            let options = []
            coins.forEach((coin)=>{
                if (
                    !options.includes(coin?.attributes[filter]?.data?.attributes[filter]) && 
                    coin?.attributes[filter]?.data?.attributes[filter]!== undefined &&
                    coin?.attributes[filter]?.data?.attributes[filter]!== 'Uncertain'
                ){
                options.push(coin?.attributes?.[filter]?.data?.attributes[filter])
                }
            })
            return options
        }
        let data = {
            material:getDeepFilterOptions('material'),
            mint:getDeepFilterOptions('mint'),
            issuing_authority: getDeepFilterOptions('issuing_authority'),
            governing_power: getDeepFilterOptions('governing_power'),
            language: getDeepFilterOptions('language'),
            ancient_territory: getDeepFilterOptions('ancient_territory'),
        }
        setTageOptions(data)
    },[coins])


    // useEffect(()=>{

    //     // let query = qs.stringify({
    //     //     pattern,
    //     //     tags
    //     // })

    //     // qs.parse(query).pattern.length === 0 ? console.log('first') : console.log('second')

    //     // for (const key in tags) {
    //     //     tags[key]?.forEach((tag)=>{
    //     //         query.push(tag)
    //     //     })
    //     // }


    //     // console.log(query)
    //     setUrl(pattern)
    // },[pattern])

    function handleOnChange(e){
        setPattern(e.target.value)
    }

    function addTags(obj,tag){
        let newTagsObj = {...tags}
        let newTagOptionsObj = {...tagOptions}
        newTagOptionsObj[obj]= newTagOptionsObj[obj].filter(i =>i !== tag)
        if(!newTagsObj[obj].includes(tag)){
            newTagsObj[obj].push(tag)
        }
        setTages(newTagsObj)
        setTageOptions(newTagOptionsObj)

    }
    function deleteTags(obj,tag){
        let newTagsObj = {...tags}
        let newTagOptionsObj = {...tagOptions}
        newTagsObj[obj]= newTagsObj[obj].filter(i =>i !== tag)
        if(!newTagOptionsObj[obj].includes(tag)){
            newTagOptionsObj[obj].push(tag)
        }
        setTages(newTagsObj)
        setTageOptions(newTagOptionsObj)
    }

    function GetOptionLi (){
        let li = []
        for (const key in tagOptions) {
            tagOptions[key]?.forEach((tag)=>{
                li.push(<li onClick={()=> addTags(key,`${tag}`)} value={tag}>{tag}</li>)
            })
        }
        return li
    }
    function GetTagLi(){
        let li = []
        for (const key in tags) {
            tags[key]?.forEach((tag)=>{
                li.push(<li>{tag} <i className='icon-syrios-x-thin' onClick={ () => deleteTags(key,`${tag}`)} /></li>)
            })
        }
        return li
    }


    return(
        <div className='search'>
            <div className='tag-content'>
                <ul>
                    {/* {tags.map((tag)=><li >{tag} <i className='icon-syrios-x-thin' onClick={ () => deleteTags(`${tag}`)}/></li>)} */}
                    < GetTagLi/>
                    <input 
                        type="text" className="search-bar__input" 
                        placeholder='Search by coin name, type, date, and more.' 
                        onChange={e=>handleOnChange(e)
                    }
                    />
                </ul>
            </div>
            {/* <SearchOptionPool tags = {tagOptions} addTags = {addTags}/> */}
            <div className='tag-options'>

                <ul>
                    {/* {tagOptions.mint.map((tag)=>{
                        return <li onClick={()=> addTags(obj,`${tag}`)} value={tag}>{tag}</li>
                    })} */}
                    <GetOptionLi />

                </ul>
            </div>

            <div style={{fontSize:'32px'}}>
                <Link className="link" to={`/Coins/${pattern}`}>
                    Search

                </Link>

                
            </div>
        </div>

    )

}
export default SearchBar