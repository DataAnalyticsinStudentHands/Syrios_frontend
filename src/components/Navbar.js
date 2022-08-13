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
    <Navbar id='navbar' collapseOnSelect expand='md' className='navbar-dark'>
      <Navbar.Brand>
        <Nav.Link href='/dev'>
          <img 
            src={logo} 
            alt='SyriosLogoLight'
            style={{
              position: 'relative',
              left: '0.5vmax',
              height:"3.125vmax"
            }}/>
        </Nav.Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='ms-auto'  style={{marginRight:'5.2vmax'}}>
          { /* I hate this, but I can't figure out why Nav.Link won't work */ }
          {/* Because Nav is from Bootstrap and Link is from react!!!!!!! */}
            <Nav.Link as={Link} to='/' className='navbar-text d-flex align-items-center'>HOME</Nav.Link>
            {/* <Nav.Link href='/dev/Stories' className='navbar-text d-flex align-items-center'>STORIES</Nav.Link> */}
            <Nav.Link as={Link}  to='/Stories' className='navbar-text d-flex align-items-center'>STORIES</Nav.Link>
          <NavDropdown title='EVIDENCE' className='navbar-text'>
            <NavDropdown.Item as={Link} to='/Evidence' className='navbar-text '>Overview</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to='/Evidence/CoinSort' className='navbar-text '>Coins in a Pile</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/Evidence/MapCoins' className='navbar-text'>Coins on a Map</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/Evidence/Timeline' className='navbar-text'>Coins in Time</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/Evidence/CoinCatalog' className='navbar-text'>Coins in a Catalog</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/Evidence/Download' className='navbar-text'>Coins as Data</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title='TOOL BOX' className='navbar-text'>
            <NavDropdown.Item as={Link} to='/Toolbox' className='navbar-text '>Overview</NavDropdown.Item>
            <NavDropdown.Divider />			
            <NavDropdown.Item as={Link} to='/HowToReadACoin' className='navbar-text'>How to Read a coin</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/Toolbox/VideoLibrary' className='navbar-text'>Video library</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/Toolbox/Glossary/all' className='navbar-text'>Glossary</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title='RESOURCES' className='navbar-text'>							
            <NavDropdown.Item as={Link} to='/Resources/TeachingResources' className='navbar-text'>Teaching Resources</NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/Resources/Research' className='navbar-text'>Research</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        {/* <Form style={{width: '145px', marginRight: '10px'}}>
          <Form.Group className='mb-1' controlId='searchbar'>
            <Form.Control size='sm'  type='search' placeholder='search' />
          </Form.Group>
        </Form> */}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default BootstrapNavbar;
