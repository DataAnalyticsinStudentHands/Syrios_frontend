import React, {useEffect, useState} from 'react';
import { 
	Navbar,
	Nav,
	NavDropdown,
	Form,
	FormControl,
	Button,
	Container
} from 'react-bootstrap'

import logo from 'src/assets/logoWhiteText.svg';
import dropdownBackground from 'src/assets/dropdown.png';
import './Navbar.css'
import 'src/components/constants.css'
import OutsideClickHandler from 'src/utils/OutsideClickHandler.js';

function BootstrapNavbar() {
	return (
		<Navbar id='Navbar' collapseOnSelect expand='md' className='navbar-dark'>
			<Navbar.Brand href='/'>
				<img 
					src={logo} 
					alt='SyriosLogoLight'
					width='146px'
					style={{
						position: 'relative',
						left: '10px'
					}}/>
			</Navbar.Brand>
			<Navbar.Toggle aria-controls='responsive-navbar-nav' />
			<Navbar.Collapse id='responsive-navbar-nav'>
				<Nav className='ms-auto NavbarText'>
					<Nav.Link href='/' className='NavbarText text-white'>STORIES</Nav.Link>
					<NavDropdown title='EVIDENCE' className='NavbarText text-white'>
						<NavDropdown.Item href='/'>Coins in a Pile</NavDropdown.Item>
						<NavDropdown.Item href='/'>Coins on a Map</NavDropdown.Item>
						<NavDropdown.Item href='/'>Coins in a Catalog</NavDropdown.Item>
						<NavDropdown.Item href='/'>Coins as Data</NavDropdown.Item>
					</NavDropdown>
					<NavDropdown title='TOOL BOX' className='NavbarText text-white'>							
						<NavDropdown.Item href='/'>Get to Know Syria</NavDropdown.Item>
						<NavDropdown.Item href='/'>Get to Know Coins</NavDropdown.Item>
						<NavDropdown.Item href='/Toolbox/Timeline'>Timeline</NavDropdown.Item>
						<NavDropdown.Item href='/'>Glossary</NavDropdown.Item>
					</NavDropdown>
					<NavDropdown title='RESOURCES' className='NavbarText text-white'>							
						<NavDropdown.Item href='/'>Teaching Resources</NavDropdown.Item>
						<NavDropdown.Item href='/'>Research</NavDropdown.Item>
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
