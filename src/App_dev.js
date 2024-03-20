import React from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style/styles.scss";
import background from 'src/assets/background.jpg';
import LandingPage from 'src/pages/LandingPage.js';
import AboutUs from 'src/pages/AboutUs/AboutUs.js';
import ContactUs from './pages/ContactUs/ContactUs';
import Stories from 'src/pages/Stories/Stories.js';
import StoryReader from 'src/pages/Stories/StoryReader.js';
import ExploreTheEvidence from 'src/pages/Evidence/ExploreTheEvidence.js';
import CoinSort from 'src/pages/Evidence/CoinSort/CoinSort.js';
import MapCoins from './pages/Evidence/MapCoins/MapCoins';
import CoinCatalog from './pages/Evidence/CoinCatalogy/CoinCatalog';
import Coins from './pages/Evidence/CoinCatalogy/CoinList/Coins';
import CoinInfoPage from './pages/Evidence/CoinCatalogy/coin-info/CoinInfoPage';
import Download from 'src/pages/Evidence/Download/Download.js';
import Toolbox from './pages/Toolbox/Toolbox';
import HowToReadACoin from 'src/pages/Stories/HowToReadACoin.js';
import VideoLibrary from './pages/Toolbox/VideoLibrary/VideoLibrary';
import Timeline from 'src/pages/Toolbox/Timeline/Timeline.js';
import Glossary from './pages/Toolbox/Glossary/Glossary.js';
import Coin3D from './pages/Toolbox/Coin3D/Coin3D';
import Research from './pages/Toolbox/Research/Research';
import GlossaryWrapper from './pages/Toolbox/Glossary/glossary-wrapper';
import GlossaryTerm from './pages/Toolbox/Glossary/GlossaryTerm';

import ErrorPage from './components/error/404';
import FooterWrapper from './components/footerv2/Footer2Wrapper';

import { Navbar,Nav,NavDropdown,} from 'react-bootstrap';
import {Link} from "react-router-dom";
import logo from 'src/assets/logoWhiteText.svg';
import AutoScrollToTop from './utils/ScrollToTop';

function App() {
	return (
		<div id='App' style={{ backgroundImage: `url(${background})`}}>
      { /* Change line below: <BrowserRouter basename='/dev'> to deploy on syrios.uh.edu/dev */ }
			<BrowserRouter basename={'/dev'}>
				<AutoScrollToTop>
				{/* <Navbar /> */}
				<Navbar id='navbar' collapseOnSelect expand='md' sticky='top' className='navbar-dark'>
					<Nav.Link as={Link} to='/'>
					<img src={logo} alt='SyriosLogoLight'style={{width:'50%'}}/>
					</Nav.Link>
				<Navbar.Collapse id='responsive-navbar-nav'>
					<Nav className='ms-auto'  style={{marginRight:'5.2vmax'}}>
						<Nav.Link as={Link} to='/' className='navbar-text d-flex align-items-center'>HOME</Nav.Link>
						<Nav.Link as={Link} to='/Stories' className='navbar-text d-flex align-items-center'>STORIES</Nav.Link>
					<NavDropdown title='EVIDENCE' className='navbar-text'>
						<NavDropdown.Item as={Link} to='/Evidence' className='navbar-text '>Overview</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item as={Link} to='/Evidence/CoinSort' className='navbar-text'>Coins in a Pile</NavDropdown.Item>
						<NavDropdown.Item as={Link} to='/Evidence/MapCoins' className='navbar-text'>Coins on a Map</NavDropdown.Item>
						<NavDropdown.Item as={Link} to='/Evidence/Timeline' className='navbar-text'>Coins in Time</NavDropdown.Item>
						<NavDropdown.Item as={Link} to='/Evidence/CoinCatalog' className='navbar-text'>Coins in a Catalog</NavDropdown.Item>
						<NavDropdown.Item as={Link} to='/Evidence/Download' className='navbar-text'>Coins as Data</NavDropdown.Item>
					</NavDropdown>
					<NavDropdown title='TOOL BOX' className='navbar-text'>
						<NavDropdown.Item as={Link} to='/Toolbox' className='navbar-text '>Overview</NavDropdown.Item>
						<NavDropdown.Divider />			
						<NavDropdown.Item as={Link} to='/HowToReadACoin' className='navbar-text'>How to Read a Coin</NavDropdown.Item>
						<NavDropdown.Item as={Link} to='/Toolbox/Coin3D' className='navbar-text'>Coin in 3D</NavDropdown.Item>
						<NavDropdown.Item as={Link} to='/Toolbox/Glossary/all' className='navbar-text'>Glossary</NavDropdown.Item>
						<NavDropdown.Item as={Link} to='/Evidence/Download' className='navbar-text'>Download Data</NavDropdown.Item>
						<NavDropdown.Item as={Link} to='/Toolbox/Research' className='navbar-text'>Research</NavDropdown.Item>
						<NavDropdown.Item as={Link} to='/Toolbox/VideoLibrary' className='navbar-text'>Video Library</NavDropdown.Item>
					</NavDropdown>
					</Nav>
				</Navbar.Collapse>
				</Navbar>

				<Routes>
					<Route element={<FooterWrapper/>}>
						<Route exact path='/' element={<LandingPage />} />
						<Route path='/Stories' element={<Stories />} />
						<Route path='/Evidence' element={<ExploreTheEvidence />} /> 
						<Route path='/Toolbox' element={<Toolbox />} />
						<Route path='/Evidence/CoinSort' element={<CoinSort />} />
						<Route path='/Evidence/MapCoins' element={<MapCoins />} />
						<Route path='/Evidence/Timeline' element={<Timeline />} />
						<Route path='/Evidence/CoinCatalog' element={<CoinCatalog />} />
						<Route path='/Coins/:params' element={<Coins />} />
						<Route path='/Coin/:id' element={<CoinInfoPage />} />

						<Route path='/Evidence/Download' element={<Download />} />
						<Route path='/Toolbox/VideoLibrary' element={<VideoLibrary />} />
						<Route path='/Toolbox/Research' element={<Research />} />
						<Route path='/Toolbox/Coin3D' element={<Coin3D />} />
						<Route element={<GlossaryWrapper/>}>
							<Route path='/Toolbox/Glossary/:group' element={<Glossary />} />
							<Route path='/Toolbox/Glossary/term/:term' element={<GlossaryTerm />} />
						</Route>
						{/* <Route path='/Resources/TeachingResources' element={<TeachingResources />} /> */}
						<Route path='/ContactUs' element={<ContactUs />} />
						<Route path='/About' element={<AboutUs />} />
						<Route path='/*' element={<ErrorPage />} />
					</Route>
					<Route path='/HowToReadACoin' element={<HowToReadACoin />} />
					<Route path='/StoryReader' element={<StoryReader />} />

				</Routes>
				</AutoScrollToTop>
			</BrowserRouter>
		</div>
	);
}

export default App;
