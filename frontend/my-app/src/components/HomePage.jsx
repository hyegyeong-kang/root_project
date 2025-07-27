import React, { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Container, Nav, Button, Row, Col } from 'react-bootstrap';
import useAuthActions from '../hooks/useAuthActions';
import Chatbot from './Chatbot';
import SearchBar from './SearchBar';
import StructuredDisplayArea from './StructuredDisplayArea';
import SeoulDistricts from './SeoulDistricts';
import KakaoMap from './KakaoMap';
import styles from './HomePage.module.css';

function HomePage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { handleSignOut } = useAuthActions();

  const [recommendedPlaces, setRecommendedPlaces] = useState(null);
  const [analyzedReview, setAnalyzedReview] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // 💡 상태 추가

  useEffect(() => {
    if (auth.user) {
      console.log("사용자 정보:", auth.user);
    }
  }, [auth.user]);

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

  const handleSearchResults = (results) => {
    console.log("Search results:", results);
    setRecommendedPlaces(results);
  };

  const handleStructuredData = (data) => {
    if (data.type === 'places_recommendation') {
      setRecommendedPlaces(data.places);
      setAnalyzedReview(null);
    } else if (data.type === 'review_analysis_result') {
      setAnalyzedReview(data);
      setRecommendedPlaces([]);
    } else {
      setRecommendedPlaces([]);
      setAnalyzedReview(null);
    }
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
  };

  return (
    <div className={`d-flex flex-column min-vh-100 ${styles.mainContainer}`}>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">법카 플렉스 KANG1</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              {auth.isAuthenticated ? (
                <>
                  <>
                    <Navbar.Text className="me-3">
                      환영합니다, <strong>{auth.user?.profile.email}</strong>님!
                    </Navbar.Text>
                    <Button variant="outline-light" onClick={handleSignOut}>
                      로그아웃
                    </Button>
                  </>
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

      {/* 메인 콘텐츠 */}
      <div className="flex-grow-1">
        {auth.isAuthenticated ? (
          <Container className="my-4 d-flex">
            <StructuredDisplayArea
              recommendedPlaces={recommendedPlaces}
              analyzedReview={analyzedReview}
            />
            <Chatbot
              isOpen={isChatOpen}
              setIsOpen={setIsChatOpen}
              onStructuredDataReceived={handleStructuredData}
              recommendedPlaces={recommendedPlaces}
            />
          </Container>
        ) : (
          <Container className="my-4 d-flex flex-column">
            <Row className="justify-content-center mb-4">
              <Col md={8}>
                <SearchBar onSearchResults={handleSearchResults} />
                <SeoulDistricts onDistrictSelect={handleDistrictSelect} />
              </Col>
            </Row>
            {selectedDistrict && (
              <Row className="justify-content-center mt-4">
                <Col md={8}>
                  <KakaoMap district={selectedDistrict} />
                </Col>
              </Row>
            )}
            <div className="flex-grow-1">
              <StructuredDisplayArea
                recommendedPlaces={recommendedPlaces}
                analyzedReview={analyzedReview}
              />
            </div>
            <p className="lead mt-4 text-center">로그인하여 챗봇 서비스를 이용해보세요!</p>
          </Container>
        )}
      </div>

      <footer className="bg-light text-center text-lg-start mt-auto py-3">
        <Container>
          <p className="text-muted mb-0">&copy; 2025 법카 플렉스. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

export default HomePage;