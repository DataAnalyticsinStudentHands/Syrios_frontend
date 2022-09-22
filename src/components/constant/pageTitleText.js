import createMarkup from "src/utils/Markup"
function PageTitleComponent(props){
    return(
        <center>
            <h1>{props.title}{props.icon}</h1>
			<h3 className='my-5' dangerouslySetInnerHTML={createMarkup(props.text)}/>
        	<div className='story-text my-5' dangerouslySetInnerHTML={createMarkup(props.subtext)}/>
        </center>
    )
}
export default PageTitleComponent