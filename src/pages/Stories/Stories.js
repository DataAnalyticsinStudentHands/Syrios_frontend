/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import { Container, Row, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import storyRequest from 'src/api/story';
import LoadingPage from 'src/components/loadingPage/LoadingPage.js';
// import Footer from 'src/components/footer/Footer';
import Footer from 'src/components/footerv2/Footer2';
import createMarkup from 'src/utils/Markup';
import PageTitleComponent from 'src/components/constant/pageTitleText';

const Stories = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [stories, setStories] = useState(undefined)
	const [storyContent, setStoryContent] = useState([])

	useEffect(() => {
		const fetchData = async ()=>{
			const result = await storyRequest.storyFind()
			const textresult = await storyRequest.storyHomeFind()
			setStoryContent(textresult.data.data.attributes)
			function filterOutZotero(item){
				if (item.id !== 1){
					return true
				}
				return false
			}
			setStories(result.data.data.filter(filterOutZotero))
			setIsLoading(false)
		}
		fetchData().catch(console.error);
	},[]);

	if (isLoading)return (<><LoadingPage /><Footer /></>);
	return (
		<div id='stories-page'>
                <PageTitleComponent title={storyContent.head} text={storyContent.text} subtext={storyContent.sub_text}/>
				<Row className="py-5 my-5 align-items-end ">
					{stories.map((story)=>{
						return(
							<Col key={`StoryReader-${story.id}`} >
								<Link to={`/StoryReader?id=${story.id}`}>
									<div className='select-story-div '>
										<img src={`${process.env.REACT_APP_strapiURL}${story.attributes.image.data.attributes.url}`} alt='Story_Image' width={"100%"}className ="text-center"/>
										<p className='text-center select-story-text mt-5'>{story.attributes.name}</p>
									</div>
								</Link>
							</Col>
						)
					})}
				</Row>
		</div>
	)
}

export default Stories;
