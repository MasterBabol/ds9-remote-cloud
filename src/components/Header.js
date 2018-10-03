import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Header.css';

const Header = () => {
    return (
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand>
                    <NavLink exact to="/">Deepspace 9</NavLink>
                </Navbar.Brand>
            </Navbar.Header>
            <Nav>
                <LinkContainer exact to="/"><NavItem>Home</NavItem></LinkContainer>
                <LinkContainer to="/logistics"><NavItem>Logistics</NavItem></LinkContainer>
            </Nav>
        </Navbar>
    );
};

export default Header;
