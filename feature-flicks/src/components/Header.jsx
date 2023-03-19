// Header.js
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import styles from './Header.module.css';
import logoSvg from '../assets/popcorn.svg';

const Header = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed='top'>
      <Container>
        <Navbar.Brand href="/" className={styles['brand-title']}>
        <img
            src={logoSvg}
            alt="Logo"
            width="50"
            height="50"
            className="logo-icon me-2"
          />
          Feature Flicks
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
