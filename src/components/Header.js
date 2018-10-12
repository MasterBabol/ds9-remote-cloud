import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Header.css';

const Header = () => {
    return (
        <Navbar staticTop={true} inverse={true}>
            <Navbar.Header>
                <Navbar.Brand>
                    <NavLink exact to="/">Deepspace 9</NavLink>
                </Navbar.Brand>
            </Navbar.Header>
            <Nav>
                <LinkContainer to="/logistics"><NavItem>Logistics</NavItem></LinkContainer>
                <LinkContainer to="/signals"><NavItem>Signals</NavItem></LinkContainer>
                <LinkContainer to="/localestates"><NavItem>Local Estates</NavItem></LinkContainer>
                <LinkContainer to="/technologies"><NavItem>Technologies</NavItem></LinkContainer>
            </Nav>
        </Navbar>
    );
};

export default Header;
