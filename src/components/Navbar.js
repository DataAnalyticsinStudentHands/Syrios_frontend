import { 
  Navbar,
  Nav,
  NavDropdown,
} from 'react-bootstrap';

import logo from 'src/assets/logoWhiteText.svg';


function BootstrapNavbar() {
  return (
    <Navbar id='navbar' collapseOnSelect expand='md' className='navbar-dark'>
      <Navbar.Brand>
        <Nav.Link href='/dev'>
          <img 
            src={logo} 
            alt='SyriosLogoLight'
            width='146px'
            style={{
              position: 'relative',
              left: '10px'
            }}/>
        </Nav.Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='ms-auto'  style={{marginRight:'100px'}}>
          { /* I hate this, but I can't figure out why Nav.Link won't work */ }
          {/* Because Nav is from Bootstrap and Link is from react!!!!!!! */}
            <Nav.Link href='/dev/Stories' className='navbar-text d-flex align-items-center'>STORIES</Nav.Link>
          <NavDropdown title='EVIDENCE' className='navbar-text'>
            <NavDropdown.Item href='/dev/Evidence/CoinSort' className='navbar-text '>Coins in a Pile</NavDropdown.Item>
            <NavDropdown.Item href='/dev/Evidence/MapCoins' className='navbar-text'>Coins on a Map</NavDropdown.Item>
            <NavDropdown.Item href='/dev/Evidence/CoinCatalog' className='navbar-text'>Coins in a Catalog</NavDropdown.Item>
            <NavDropdown.Item href='/dev/Evidence/Download' className='navbar-text'>Coins as Data</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title='TOOL BOX' className='navbar-text'>			
            <NavDropdown.Item href='/dev/HowToReadACoin' className='navbar-text'>How to Read a coin</NavDropdown.Item>
            <NavDropdown.Item href='/dev/Toolbox/VideoLibrary' className='navbar-text'>Video library</NavDropdown.Item>
            <NavDropdown.Item href='/dev/Toolbox/Timeline' className='navbar-text'>Timeline</NavDropdown.Item>
            <NavDropdown.Item href='/dev/Toolbox/Glossary/all' className='navbar-text'>Glossary</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title='RESOURCES' className='navbar-text'>							
            <NavDropdown.Item href='/dev/Resources/TeachingResources' className='navbar-text'>Teaching Resources</NavDropdown.Item>
            <NavDropdown.Item href='/dev/Resources/Research' className='navbar-text'>Research</NavDropdown.Item>
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
