import {
	Container,
	Row,
	Col
} from 'react-bootstrap';

import 'src/components/constants.css';
import './Stories.css';



// Title component for all stories
const Title = (zone) => {
	return (
		<>
			<Container className='d-flex justify-content-center align-items-center TitleWidth'>
				<img
					src={`${process.env.REACT_APP_strapiURL}${zone.image.url}`}
					alt='title image'
					width='300px'/>
			</Container>
			<Container className='d-flex justify-content-center align-items-center TitleWidth'>
				<p id='TitleText' className='BlueText'>
					{zone.title}
				</p>
			</Container>
			<Container className='d-flex justify-content-center align-items-center TitleWidth'>
				<p id='SubTitleText' className='OrangeText'>
					{zone.subtitle}
				</p>
			</Container>
			<Container className='d-flex justify-content-center align-items-center TitleWidth'>
				<p id='CaptionTitleText' className='GrayText'>
					{zone.caption}
				</p>
			</Container>
		</>
	);
}

const End_Frame = (zone) => {
	console.log(zone);
	return (
		<>
			<Container className='d-flex justify-content-center align-items-center'>
				<p id='EndFrameText' className='GrayText text-center'>
					{zone.text}
				</p>
			</Container>
			<Container className='d-flex justify-content-center align-items-center'>
				<p id='AreYouReadyText' className='OrangeText text-center'>
					Are you ready to learn more?
				</p>
			</Container>
			<Container className='d-flex justify-content-center align-items-center'>
				<Row container='justify-content-md-center' className='d-flex justify-content-center'>
					<Col>
						<a href='/Stories/Stories/'>
							<button	className='BlueText EndFrameButtonWidth'>
								Tell Me a Story
							</button>
						</a>
					</Col>
					<Col>
						<Container>
						</Container>
					</Col>
					<Col>
						<Container>
						</Container>
					</Col>
					<Col>
						<Container>
						</Container>
					</Col>
					<Col>
						<a href='/'>
							<button	className='BlueText EndFrameButtonWidth'>
								Explore Coins
							</button>
						</a>
					</Col>
				</Row>
			</Container>
		</>
	);
}


// This function is for mapping name and functions over.
// Did this for organization really. 
const SwitchComponent = (zone, index, fullpageApi) => {
	let jsx = undefined;
	switch (zone.__component) {
		case 'frame.title':
			jsx = Title(zone);
			break;
		case 'frame.endframe':
			jsx = End_Frame(zone);
			break;
		default:
			console.error(`Error: Unrecognized component '${zone.__component}'`);
			jsx = (
				<>
				</>
			);
	}

	return (
		<div className='section' key={zone._id}>
			{jsx}
		</div>

	);
}

export default SwitchComponent
