import React, {useState} from 'react';
import colorLessLogo from '../assets/logos/colorlessLogo.png';
import OutsideClickHandler from '../reactHelpers/OutsideClickHandler';
import './navbar.css';

const Navbar = () => {
	const [TellMeAStoryDropDown, setTellMeAStoryDropDown] = useState(undefined);
	const [LetMeExploreDropDown, setLetMeExploreDropDown] = useState(undefined);
	const [TellMeAStoryDropDownTimer, setTellMeAStoryDropDownTimer] = useState(new Date());
	const [LetMeExploreDropDownTimer, setLetMeExploreDropDownTimer] = useState(new Date());

	return (
		<div id='Navbar'>
			<a id='NavbarHomeLink' href='/'>
				<div id='NavbarLogoDiv'>
					<img id='NavbarLogo' src={colorLessLogo} alt="SyriosColorLessLogo" style={{width: "100%"}}/>
				</div>
			</a>
		</div>
	);
}

export default Navbar;
