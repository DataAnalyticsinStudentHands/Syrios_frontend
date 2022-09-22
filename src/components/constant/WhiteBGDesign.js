import { Link } from "react-router-dom"
import createMarkup from "src/utils/Markup"

export const WhiteBGDesign = (props)=>{
    return(
            <center>
                <Link to={props.link}>
                    <img
                        alt={'missing alt'}
                        src={`${process.env.REACT_APP_strapiURL}${props.imageSrc}`}
                        style={{
                            height:props.height??"auto",
                            width:props.width??"auto"
                        }}
                        className="bg-white p-3"
                    />
                </Link>
                <h4 className='mt-5'>{props.title}</h4>
                <p className='story-caption' dangerouslySetInnerHTML={createMarkup(props.subtext)} />
            </center>
    )
}