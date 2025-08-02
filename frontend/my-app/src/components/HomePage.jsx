import React, { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button, Modal, Form, InputGroup, Row, Col } from 'react-bootstrap';
import useAuthActions from '../hooks/useAuthActions';
import UnifiedChat from './UnifiedChat';
import ExampleModal from './ExampleModal';
import styles from './HomePage.module.css';
import beopkaLogo from '../assets/beopka2.png';
import chatIcon from '../assets/Card.png';
import beopka1 from '../assets/beopka1.png';
import koreanFoodIcon from '../assets/한식.png';
import chineseFoodIcon from '../assets/중국식.png';
import westernFoodIcon from '../assets/경양식.png';
import japaneseFoodIcon from '../assets/일식.png';
import bbqIcon from '../assets/식육.png';
import chickenIcon from '../assets/통닭.png';
import beerIcon from '../assets/호프.png';
import etcIcon from '../assets/기타.png';

function HomePage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { handleSignOut } = useAuthActions();

  const [showChat, setShowChat] = useState(false);
  const [showExampleModal, setShowExampleModal] = useState(true);
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleCloseExampleModal = () => setShowExampleModal(false);

  const categories = [
    { name: '한식', icon: koreanFoodIcon },
    { name: '중국식', icon: chineseFoodIcon },
    { name: '경양식', icon: westernFoodIcon },
    { name: '일식', icon: japaneseFoodIcon },
    { name: '식육(숯불구이)', icon: bbqIcon },
    { name: '통닭(치킨)', icon: chickenIcon },
    { name: '호프', icon: beerIcon },
    { name: '기타', icon: etcIcon },
  ];

  const districts = [
    '강남구', '강북구', '강동구', '강서구', '관악구', 
    '동작구', '성북구', '송파구', '영등포구', '서초구'
  ];

  const renderMainContent = () => (
    <Container className="flex-grow-1 my-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-left mb-4">
            <img src={beopka1} alt="어떤 맛집을 찾고 계신가요?" style={{ width: '300px' }} />
          </div>
          <InputGroup className="mb-3" onClick={() => setIsSearching(true)}>
            <Form.Control
              placeholder="매장을 검색해보세요"
              readOnly
              className={styles.searchInput}
            />
          </InputGroup>

          <Row className="text-center my-5 g-4">
            {categories.map((category, index) => (
              <Col key={index} xs={3}>
                <div className={styles.categoryIcon}>
                  <img src={category.icon} alt={category.name} />
                </div>
                <p>{category.name}</p>
              </Col>
            ))}
          </Row>

          <hr />

          <div className="my-5">
            <h2 className="text-left mb-4">서울 지역별 인기 맛집</h2>
            <Row>
              {districts.map((district, index) => (
                <Col key={index} md={6} className="mb-3">
                  <div className={styles.districtBox}>
                    {district}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );

  const renderSearchContent = () => (
    <Container className="flex-grow-1 my-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <InputGroup className="mb-3">
            <Button variant="link" onClick={() => setIsSearching(false)}>&lt;</Button>
            <Form.Control
              placeholder="매장을 검색해보세요"
              autoFocus
              className={styles.searchInput}
            />
          </InputGroup>
          {/* 검색 결과 표시 영역 */}
        </Col>
      </Row>
    </Container>
  );

  if (auth.error) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light text-danger">
        <p>Error: {auth.error.message}</p>
        <Button variant="danger" onClick={() => auth.signinRedirect()}>다시 로그인</Button>
      </Container>
    );
  }

  return (
    <div className={`d-flex flex-column min-vh-100 ${styles.mainContainer}`}>
      <Navbar style={{ backgroundColor: '#4A90E2' }} variant="dark" expand="lg" className="py-1">
        <Container fluid>
          <Navbar.Brand href="/" onClick={() => window.location.reload()} style={{ color: '#FFFFFF' }}>
            <img src={beopkaLogo} width="200" height="50" className="d-inline-block align-top" alt="Beopka Flex Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              {auth.isAuthenticated ? (
                <>
                  <Navbar.Text className="me-3">환영합니다. <strong>{auth.user?.profile.email}</strong>님!</Navbar.Text>
                  <Button variant="outline-light" onClick={handleSignOut}>로그아웃</Button>
                </>
              ) : (
                <Button variant="outline-light" onClick={() => auth.signinRedirect()}>로그인</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {isSearching ? renderSearchContent() : renderMainContent()}

      <div className={styles.chatIconContainer} onClick={() => setShowChat(true)}>
        <img src={chatIcon} alt="Chat Icon" className={styles.chatIcon} />
      </div>

      <Modal show={showChat} onHide={() => setShowChat(false)} centered size="lg" dialogClassName={styles.chatModal}>
        <Modal.Body className="p-0">
          <UnifiedChat setRecommendedPlaces={setRecommendedPlaces} closeChat={() => setShowChat(false)} />
        </Modal.Body>
      </Modal>

      <ExampleModal show={showExampleModal} handleClose={handleCloseExampleModal} />

      <footer className="bg-light text-center text-lg-start mt-auto py-3">
        <Container>
          <p className="text-muted mb-0">&copy; 2025 법카 플렉스. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

export default HomePage;
