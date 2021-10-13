import logo from 'src/assets/logoWhiteText.png';
import dropdown from 'src/assets/dropdown.png';
import './Navbar.css'
import 'src/components/constants.css'
import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';

function Navbar() {
	return (
		<div id='Navbar'>
			{/* Navbar Logo */}
			<a href='/'>
				<div id='NavbarLogoDiv'>
					<img src={logo} alt='logo.png' className='imgFill'/>
				</div>
			</a>

			{/* Resources */}
			<div id='Resources'>
				<p className='NavbarText'>
					RESOURCES <i className='DropDownArrowUp' />
				</p>
			</div>
		</div>
	);
}

export default Navbar;
