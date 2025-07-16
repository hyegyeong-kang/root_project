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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    // 여기에 실제 검색 로직을 구현합니다.
    // 예시: 간단한 필터링
    const dummyResults = [
      { id: 1, name: '맛있는 고기집', description: '최고의 한우를 맛볼 수 있는 곳' },
      { id: 2, name: '분위기 좋은 카페', description: '다양한 커피와 디저트' },
      { id: 3, name: '신나는 노래방', description: '최신곡 완비, 스트레스 해소' },
      { id: 4, name: '깔끔한 일식집', description: '신선한 재료로 만든 초밥' },
    ];
    const filteredResults = dummyResults.filter(item =>
      item.name.includes(searchTerm) || item.description.includes(searchTerm)
    );
    setSearchResults(filteredResults);
  };

  // 로딩 중이거나 에러 발생 시 처리
  if (auth.isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <p>Loading...</p>
      </Container>
    );
  }

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