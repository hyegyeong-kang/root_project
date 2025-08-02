import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';

// 이 부분을 실제 배포된 main4.py 람다 함수의 API Gateway 엔드포인트로 변경해야 합니다.
// 예: const DISTRICT_API_URL = 'https://YOUR_API_GATEWAY_ENDPOINT/getDistrictRestaurants';
const API_BASE_URL = 'https://znr27ptrdl.execute-api.us-east-1.amazonaws.com/default';
const DISTRICT_API_URL = `${API_BASE_URL}/district`; // main4.py의 엔드포인트

const DistrictRestaurantListPage = () => {
  const { district } = useParams(); // URL에서 'district' 파라미터 가져오기
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDistrictRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        // main4.py 람다 함수 호출
        const response = await fetch(`${DISTRICT_API_URL}?district=${encodeURIComponent(district)}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          console.error("API response is not an array:", data);
          setError("서버 응답 형식이 올바르지 않습니다.");
          setRestaurants([]);
        }
      } catch (err) {
        console.error("Error fetching district restaurants:", err);
        setError(err.message);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    if (district) {
      fetchDistrictRestaurants();
    }
  }, [district]); // district 파라미터가 변경될 때마다 데이터 다시 불러오기

  return (
    <Container className="mt-4">
      <h1 className="mb-4">{district} 핫플레이스</h1>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && <Alert variant="danger">오류: {error}</Alert>}

      {!loading && restaurants.length === 0 && !error && (
        <div className="text-center my-4 text-muted">
          {district}에 해당하는 맛집이 없습니다.
        </div>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {restaurants.map((resto, index) => (
          <Col key={`${resto.가게이름}-${index}`}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={resto.가게이미지URL || 'https://via.placeholder.com/400x300'}
                onError={(e) => (e.target.src = 'https://via.placeholder.com/400x300')}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{resto.가게이름}</Card.Title>
                <Card.Text>
                  <strong>분류:</strong><Badge bg="secondary" className="ms-2">{resto.업태 || '세부정보 없음'}</Badge><br />
                  <strong>평점:</strong> {resto.평점 || 'N/A'}<br />
                  <strong>주소:</strong> {resto.주소}
                </Card.Text>
                {resto.상세보기URL && (
                  <a href={resto.상세보기URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    상세보기
                  </a>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default DistrictRestaurantListPage;
