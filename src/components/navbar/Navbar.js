import { 
  Navbar,
  Nav,
  NavDropdown,
} from 'react-bootstrap';

import {
  Link
} from "react-router-dom";
import logo from 'src/assets/logoWhiteText.svg';


function BootstrapNavbar() {
  return (
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
            <NavDropdown.Item as={Link} to='/HowToReadACoin' className='navbar-text'>How to Read a coin</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/Toolbox/Coin3D' className='navbar-text'>Coin in 3d</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/Toolbox/Glossary/all' className='navbar-text'>Glossary</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/Toolbox/Research' className='navbar-text'>Research</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/Toolbox/VideoLibrary' className='navbar-text'>Video library</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default BootstrapNavbar;
