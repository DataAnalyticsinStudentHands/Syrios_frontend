import createMarkup from "src/utils/Markup"
function PageTitleComponent(props){
    return(
        <div style={{width:props.addContanter==='true'?'80%':'', marginLeft: props.addContanter==='true'?'10%':''}}>
        <center >
            <h1>{props.title}{props.icon}</h1>
			<h3 className='my-5' dangerouslySetInnerHTML={createMarkup(props.text)}/>
        	<div className='story-text my-5' dangerouslySetInnerHTML={createMarkup(props.subtext)}/>
        </center>
        </div>

    )
}
export default PageTitleComponent