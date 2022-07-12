import { 
  Navbar,
  Nav,
  NavDropdown,
  Form,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import logo from 'src/assets/logoWhiteText.svg';


function BootstrapNavbar() {
  return (
    <Navbar id='navbar' collapseOnSelect expand='md' className='navbar-dark'>
      <Navbar.Brand>
        <Link to='/'>
          <img 
            src={logo} 
            alt='SyriosLogoLight'
            width='146px'
            style={{
              position: 'relative',
              left: '10px'
            }}/>
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='ms-auto navbar-text'>
          { /* I hate this, but I can't figure out why Nav.Link won't work */ }
          {/* Because Nav is from Bootstrap and Link is from react!!!!!!! */}
            <Nav.Item><Link to='/Stories' className='navbar-text'style={{position: 'relative',top: '8px',left: '-20px'}}>STORIES</Link></Nav.Item>
          <NavDropdown title='EVIDENCE' className='NavDropdown'>
            <NavDropdown.Item><Link to ="/Evidence/CoinSort" className='navbar-text'>Coins in a Pile</Link></NavDropdown.Item>
            <NavDropdown.Item><Link to='/Evidence/MapCoins' className='navbar-text'>Coins on a Map</Link></NavDropdown.Item>
            <NavDropdown.Item><Link to='/Evidence/CoinCatalogy' className='navbar-text'>Coins in a Catalog</Link></NavDropdown.Item>
            <NavDropdown.Item><Link to='/Evidence/Download' className='navbar-text'>Coins as Data</Link></NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title='TOOL BOX' className='NavDropdown'>			
            <NavDropdown.Item><Link to='/HowToReadACoin' className='navbar-text'>How to Read a coin</Link></NavDropdown.Item>
            <NavDropdown.Item><Link to='/Toolbox/VideoLibrary' className='navbar-text'>Video library</Link></NavDropdown.Item>
            <NavDropdown.Item><Link to='/Toolbox/Timeline' className='navbar-text'>Timeline</Link></NavDropdown.Item>
            <NavDropdown.Item><Link to='/Toolbox/Glossary' className='navbar-text'>Glossary</Link></NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title='RESOURCES' className='NavDropdown'>							
            <NavDropdown.Item><Link to='/Resources/TeachingResources' className='navbar-text'>Teaching Resources</Link></NavDropdown.Item>
            <NavDropdown.Item><Link to='/Resources/Research' className='navbar-text'>Research</Link></NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Form style={{width: '145px', marginRight: '10px'}}>
          <Form.Group className='mb-1' controlId='searchbar'>
            <Form.Control size='sm'  type='search' placeholder='search' />
          </Form.Group>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default BootstrapNavbar;
