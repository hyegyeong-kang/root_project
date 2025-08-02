import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './ExamplePage.module.css';

function ExamplePage() {
  const navigate = useNavigate();

  const exampleRestaurants = [
    {
      id: '1',
      정제_사업장명: '종로 한정식집',
      업태구분명: '한식',
      crawled_주소: '서울 종로구 종로1길 1',
      crawled_평점: 4.5,
      예상_최대_수용_인원: 10,
      tags: ['고급스러운', '단체룸', '조용함'],
      crawled_위도: 37.5700,
      crawled_경도: 126.9770,
    },
    {
      id: '2',
      정제_사업장명: '인사동 퓨전 한식',
      업태구분명: '한식',
      crawled_주소: '서울 종로구 인사동길 2',
      crawled_평점: 4.2,
      예상_최대_수용_인원: 15,
      tags: ['분위기좋은', '데이트', '가성비'],
      crawled_위도: 37.5730,
      crawled_경도: 126.9820,
    },
    {
      id: '3',
      정제_사업장명: '북촌 전통 한옥 식당',
      업태구분명: '한식',
      crawled_주소: '서울 종로구 북촌로 3',
      crawled_평점: 4.7,
      tags: ['한옥', '전통', '경치좋은'],
      crawled_위도: 37.5800,
      crawled_경도: 126.9850,
    },
  ];

  const handleRestaurantClick = (restaurant) => {
    const latitude = restaurant.crawled_위도;
    const longitude = restaurant.crawled_경도;
    const restaurantName = restaurant.정제_사업장명 || restaurant.사업장명_원문;

    if (latitude && longitude) {
      const kakaoMapUrl = `https://map.kakao.com/link/map/${restaurantName},${latitude},${longitude}`;
      window.open(kakaoMapUrl, '_blank');
    } else {
      alert('이 식당의 위치 정보가 없습니다.');
    }
  };

  return (
    <Container className={styles.examplePageContainer}>
      <h1 className="mb-4">챗봇 사용 예시</h1>
      <div className={`${styles.chatBubbleBase} ${styles.userBubble}`}>
        종로구 한식 회식 장소 추천해줘
      </div>
      <div className={`${styles.chatBubbleBase} ${styles.botBubble}`}>
        <p>다음 식당들을 추천합니다:</p>
        {exampleRestaurants.map((restaurant) => (
          <Card key={restaurant.id} className="mb-2" onClick={() => handleRestaurantClick(restaurant)} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title>{restaurant.정제_사업장명}</Card.Title>
              <Card.Text>
                <strong>업태:</strong> {restaurant.업태구분명}<br/>
                <strong>주소:</strong> {restaurant.crawled_주소}<br/>
                <strong>평점:</strong> {restaurant.crawled_평점 || 'N/A'}<br/>
                <strong>인원수:</strong> {restaurant.예상_최대_수용_인원 ? `${restaurant.예상_최대_수용_인원}명 이상` : '정보 없음'}
                {restaurant.tags && restaurant.tags.length > 0 && (
                  <div className={styles.tagsContainer}>
                    {restaurant.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className={styles.tagBadge}>{tag}</span>
                    ))}
                  </div>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
      <Button variant="primary" onClick={() => navigate('/home')} className="mt-4">
        챗봇 시작하기
      </Button>
    </Container>
  );
}

export default ExamplePage;