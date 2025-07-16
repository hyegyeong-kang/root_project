import React, { useState } from 'react';
import { useAuth } from "react-oidc-context";
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Form, FormControl, Button, Row, Col, Card, InputGroup } from 'react-bootstrap';
import useAuthActions from '../hooks/useAuthActions';
import styles from './HomePage.module.css';

function HomePage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { handleSignOut } = useAuthActions();
  
  if (auth.error) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light text-danger">
        <p>Error: {auth.error.message}</p>
        <Button variant="danger" onClick={() => auth.signinRedirect()}>
          다시 로그인
        </Button>
      </Container>
    );
  }

  return (
    <div className={`d-flex flex-column ${styles.mainContainer}`}>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#home">법카 플렉스</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              {auth.isAuthenticated ? (
                <>
                  <Navbar.Text className="me-3">
                    환영합니다, <strong>{auth.user?.profile.email}</strong>님!
                  </Navbar.Text>
                  <Button variant="outline-light" onClick={handleSignOut}>
                    로그아웃
                  </Button>
                </>
              ) : (
                <Button variant="outline-light" onClick={() => auth.signinRedirect()}>
                  로그인
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <footer className="bg-light text-center text-lg-start mt-auto py-3">
        <Container>
          <p className="text-muted mb-0">&copy; 2025 법카 플렉스. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

export default HomePage;