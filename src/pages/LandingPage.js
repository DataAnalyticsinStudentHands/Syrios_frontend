import React, {useEffect, useState} from 'react';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import {
	Container,
	Row,
	Col
} from 'react-bootstrap';
import axios from 'axios';

import Navbar from 'src/components/Navbar.js';
import LoadingPage from 'src/components/LoadingPage.js';
import Footer from 'src/components/Footer.js';
import 'src/components/constants.css';
import './LandingPage.css';

function LandingPage() {
	const [loading, set_loading] = useState(true);
	const [page, set_page] = useState(undefined);

	useEffect(() => {
		if (loading) {
			axios.get(process.env.REACT_APP_strapiURL + '/landing-page')
				.then((res) => {
					console.log(res.data);
					set_page(
						<div id='LandingPage' className='d-flex align-items-center'>
							<Container style={{height: '640px'}}>
								<Row container='justify-content-md-center'>
									<Col>
										<p className='OrangeText' style={{fontSize: '4em'}}>
											<ReactMarkdown>
												{res.data.shortDescription}
											</ReactMarkdown>
										</p>
									</Col>
								</Row>
								<Row container='justify-content-md-center'>
									<Col>
										<div id='LandingVideo'>
											<div id='LandingVideoSize'>
												<ReactPlayer 
													width='100%'
													url={res.data.videoLink} />
											</div>
										</div>
									</Col>
									<Col>
										<Container>
											<Row>
												<Col>
													<div className='LandingButtonsPadding'>
														<a href='/'>
															<div className='LandingButtonsImage'>
																<div className='LandingButtonsImageDarken'>
																	<p className='blandStyle BoldWhiteText LandingButtonsText'>
																		How to Read a Coin
																	</p>
																</div>
															</div>
														</a>
													</div>
												</Col>
												<Col>
													<div className='LandingButtonsPadding'>
														<a href='/'>
															<div className='LandingButtonsImage'>
																<div className='LandingButtonsImageDarken'>
																	<p className='blandStyle BoldWhiteText LandingButtonsText'>
																		Discover Stories from Coins
																	</p>
																</div>
															</div>
														</a>
													</div>
												</Col>
											</Row>
											<Row>
												<Col>
													<div className='LandingButtonsPadding'>
														<a href='/'>
															<div className='LandingButtonsImage'>
																<div className='LandingButtonsImageDarken'>
																	<p className='blandStyle BoldWhiteText LandingButtonsText'>
																		Explore the Evidence
																	</p>
																</div>
															</div>
														</a>
													</div>
												</Col>
												<Col>
													<div className='LandingButtonsPadding'>
														<a href='/'>
															<div className='LandingButtonsImage'>
																<div className='LandingButtonsImageDarken'>
																	<p className='blandStyle BoldWhiteText LandingButtonsText'>
																		Open the Historian's Toolbox
																	</p>
																</div>
															</div>
														</a>
													</div>
												</Col>
											</Row>
										</Container>
									</Col>
								</Row>
								<Row container='justify-content-md-center'>
									<Col>
										<p className='BlueText' style={{fontSize:'1.3em'}}>
											<ReactMarkdown>
												{res.data.LandingParagraph}
											</ReactMarkdown>
										</p>
									</Col>
								</Row>
							</Container>
						</div>
					);

					set_loading(false);
				});
		}
	});

	if (loading) {
		return (
			<div>
				{Navbar()}
				{LoadingPage()}
				{Footer()}
			</div>
		);
	}

  return (
    <div>
			{Navbar()}
			{page}
			{Footer()}
    </div>
  );
}

export default LandingPage;
