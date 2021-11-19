import { 
	Navbar,
	Nav,
	NavDropdown,
	Form,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import logo from 'src/assets/logoWhiteText.svg';
import './Navbar.css'
import 'src/components/constants.css'

function BootstrapNavbar() {
	return (
		<Navbar id='Navbar' collapseOnSelect expand='md' className='navbar-dark'>
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
				<Nav className='ms-auto NavbarText text-white'>
          { /* I hate this, but I can't figure out why Nav.Link won't work */ }
          <Nav.Link><Link to='/Stories' className='blandStyle NavbarText text-white'>STORIES</Link></Nav.Link>
					<NavDropdown title='EVIDENCE'>
            { /* Same as above but for NavDropdown.Item to keyword */ }
            <NavDropdown.Item><Link to='/' className='blandStyle NavbarText text-white'>Coins in a Pile</Link></NavDropdown.Item>
            <NavDropdown.Item><Link to='/' className='blandStyle NavbarText text-white'>Coins on a Map</Link></NavDropdown.Item>
              <NavDropdown.Item><Link to='/' className='blandStyle NavbarText text-white'>Coins in a Catalog</Link></NavDropdown.Item>
              <NavDropdown.Item><Link to='/' className='blandStyle NavbarText text-white'>Coins as Data</Link></NavDropdown.Item>
					</NavDropdown>
					<NavDropdown title='TOOL BOX'>							
            <NavDropdown.Item><Link to='/' className='blandStyle NavbarText text-white'>Get to Know Syria</Link></NavDropdown.Item>
              <NavDropdown.Item><Link to='/' className='blandStyle NavbarText text-white'>Get to Know Coins</Link></NavDropdown.Item>
              <NavDropdown.Item><Link to='/' className='blandStyle NavbarText text-white'>Timeline</Link></NavDropdown.Item>
              <NavDropdown.Item><Link to='/' className='blandStyle NavbarText text-white'>Glossary</Link></NavDropdown.Item>
					</NavDropdown>
					<NavDropdown title='RESOURCES'>							
            <NavDropdown.Item><Link to='/' className='blandStyle NavbarText text-white'>Teaching Resources</Link></NavDropdown.Item>
              <NavDropdown.Item><Link to='/' className='blandStyle NavbarText text-white'>Research</Link></NavDropdown.Item>
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
