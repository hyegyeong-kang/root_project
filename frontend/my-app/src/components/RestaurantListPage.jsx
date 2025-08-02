import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';

const API_BASE_URL = 'https://o6nz8c2d5e.execute-api.us-east-1.amazonaws.com/default';

const RestaurantListPage = () => {
  const { foodType } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const observer = useRef();

  // ★ 음식 종류가 변경되면 데이터 초기화
  useEffect(() => {
    setRestaurants([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [foodType]);

  // ★ 마지막 요소 감지
  const lastRestaurantElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // ★ 데이터 가져오기
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/getRestaurants?food_type=${foodType}&page=${page}&limit=9`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setRestaurants((prev) => [...prev, ...data]);
        setHasMore(data.length > 0);
      } catch (err) {
        console.error("Error fetching:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (foodType) {
      fetchRestaurants();
    }
  }, [foodType, page]);

  return (
    <Container className="mt-4">
      <h1 className="mb-4">{foodType} 맛집 리스트</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row xs={1} md={2} lg={3} className="g-4">
        {restaurants.map((resto, index) => {
          const isLast = restaurants.length === index + 1;
          return (
            <Col key={`${resto.가게이름}-${index}`}>
              <Card ref={isLast ? lastRestaurantElementRef : null} className="h-100 shadow-sm">
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
          );
        })}
      </Row>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {!loading && !hasMore && restaurants.length > 0 && (
        <div className="text-center my-4 text-muted">더 이상 맛집이 없습니다.</div>
      )}

      {!loading && restaurants.length === 0 && !error && (
        <div className="text-center my-4 text-muted">해당 조건에 맞는 맛집이 없습니다.</div>
      )}
    </Container>
  );
};

export default RestaurantListPage;
