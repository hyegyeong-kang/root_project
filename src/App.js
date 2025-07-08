
import React from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">회식 어디서?</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">홈</Nav.Link>
              <Nav.Link href="#link">추천 요청</Nav.Link>
              <NavDropdown title="더보기" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">공지사항</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">이벤트</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">고객센터</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link href="#login">로그인</Nav.Link>
              <Nav.Link href="#register">회원가입</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row>
          <Col>
            <div className="p-5 mb-4 bg-light rounded-3">
              <Container fluid className="py-5">
                <h1 className="display-5 fw-bold">회식 장소, 더 이상 고민하지 마세요!</h1>
                <p className="col-md-8 fs-4">원하는 조건에 맞는 최고의 회식 장소를 찾아드립니다. 지금 바로 검색해보세요.</p>
                <Form className="d-flex">
                  <FormControl
                    type="search"
                    placeholder="지역, 메뉴, 가게 이름 등으로 검색"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button variant="primary">검색</Button>
                </Form>
              </Container>
            </div>
          </Col>
        </Row>
      </Container>

      <Container>
        <Link to="/map">
          <Button variant="success" className="mb-4">
            주변위치 클릭
          </Button>
        </Link>
      </Container>

      <Container>
        <h2 className="mb-4">이번 주 인기 회식 장소</h2>
        <Row>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Col md={4} key={idx} className="mb-4">
              <Card>
                <Card.Img variant="top" src={`https://picsum.photos/seed/${idx}/300/200`} />
                <Card.Body>
                  <Card.Title>인기 회식 장소 {idx + 1}</Card.Title>
                  <Card.Text>
                    여기는 정말 맛있는 음식을 제공하는 곳입니다. 회식하기에 안성맞춤!
                  </Card.Text>
                  <Button variant="outline-primary">자세히 보기</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <footer className="bg-light text-center text-lg-start mt-5">
        <Container className="p-4">
          <p>&copy; 2025 회식 어디서?. All Rights Reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

export default App;
