import React, {useState, useEffect} from 'react';
import {
	Container,
	Row,
	Col,
	button
} from 'react-bootstrap';

import './Footer.css';
import 'src/components/constants.css';
import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';

const Footer = () => {
	const [cr, set_cr] = useState(undefined);

	return (
		<div id='Footer'>
			<a id='FooterLogo' href='https://www.neh.gov/'>
				<img
					src='https://www.neh.gov/sites/default/files/inline-files/NEH-Preferred-Seal-Transparent820.png'
					height='60px'
					alt='NEH Logo'/>
			</a>
			<Container id='FooterLinks'>
				<Row className='justify-content-md-center'>
					<Col sm={6}>
						<button 
							className='blandStyle FooterText centerDiv'
							onClick={() => {
								if (cr === null || cr === undefined) {
									set_cr(
										<OutsideClickHandler
											onOutsideClick={() => {
												setTimeout(()=> {set_cr(undefined)}, 10);
											}}>
											<div id='CreditsAndReferences'>
												<a href='https://www.neh.gov'>
													NEH
												</a>
											</div>
										</OutsideClickHandler>
									);
								}
							}}>
							CREDITS & REFERENCES
						</button>
					</Col>
					<Col sm={3} xs={0}>
						<a href='/' className='blandStyle d-none d-md-block'>
							<p className='FooterText centerDiv'>
								ABOUT US
							</p>
						</a>
					</Col>
					<Col sm={3} xs={0}>
						<a href='/' className='blandStyle d-none d-md-block'>
							<p className='FooterText centerDiv'>
								CONTACT US
							</p>
						</a>
					</Col>
				</Row>
			</Container>
			{cr}
		</div>
	);
}

export default Footer;
