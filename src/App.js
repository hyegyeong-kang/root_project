import React from 'react';
import { Container, Navbar, Button, Card, Row, Col } from 'react-bootstrap';

function App() {
  // 예시 데이터
  const events = [
    { id: 1, name: '7월 팀 회식', date: '2025-07-15', place: '강남역 맛집' },
    { id: 2, name: '개발팀 워크샵', date: '2025-08-02', place: '가평 펜션' },
    { id: 3, name: '신입사원 환영회', date: '2025-07-25', place: '홍대 이자카야' },
    { id: 4, name: '더존', date: '2025-07-25', place: '홍대' },
    { id: 5, name: '더킹짐', date: '2025-07-25', place: '종로' },


  ];

  return (
    <div>
      {/* Header */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">회식 관리 시스템</Navbar.Brand>
          <Button variant="outline-light">새 회식 만들기</Button>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container style={{ marginTop: '2rem' }}>
        <h2>예정된 회식</h2>
        <Row>
          {events.map(event => (
            <Col md={4} key={event.id} style={{ marginBottom: '1rem' }}>
              <Card>
                <Card.Body>
                  <Card.Title>{event.name}</Card.Title>
                  <Card.Text>
                    <strong>날짜:</strong> {event.date}<br />
                    <strong>장소:</strong> {event.place}
                  </Card.Text>
                  <Button variant="primary">상세보기</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;