import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Container, Form } from 'react-bootstrap';
import styles from '../pages/ExamplePage.module.css'; // 기존 ExamplePage.module.css를 임시로 사용

function ExampleModal({ show, handleClose }) {
  const [doNotShowToday, setDoNotShowToday] = useState(false);

  useEffect(() => {
    const lastClosedDate = localStorage.getItem('exampleModalClosedDate');
    const today = new Date().toDateString();

    if (lastClosedDate === today) {
      // 오늘 이미 닫았으면 모달을 보여주지 않음
      handleClose();
    }
  }, [handleClose]);

  const handleCheckboxChange = (e) => {
    setDoNotShowToday(e.target.checked);
  };

  const handleCloseModal = () => {
    if (doNotShowToday) {
      const today = new Date().toDateString();
      localStorage.setItem('exampleModalClosedDate', today);
    }
    handleClose();
  };

  const exampleRestaurants = [
    {
      id: '1',
      정제_사업장명: '종로 한정식집',
      업태구분명: '한식',
      crawled_주소: '서울 종로구 종로1길 1',
      crawled_평점: 4.5,
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
    <Modal show={show} onHide={handleCloseModal} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>챗봇 사용 예시</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className={styles.examplePageContainer}>
          <div className={`${styles.chatBubbleBase} ${styles.userBubble}`}>
            종로구 한식 회식 장소 추천해줘
          </div>
          <div className={`${styles.chatBubbleBase} ${styles.botBubble}`}>
            <p>다음 식당들을 추천합니다:</p>
            {exampleRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="mb-2" onClick={() => handleRestaurantClick(restaurant)} style={{ cursor: 'pointer' }}>
                <Card.Body>
                  <Card.Title>{restaurant.정제_사업장명}</Card.Title>
                  <Card.Text as="div">
                    <strong>업태:</strong> {restaurant.업태구분명}<br/>
                    <strong>주소:</strong> {restaurant.crawled_주소}<br/>
                    <strong>평점:</strong> {restaurant.crawled_평점 || 'N/A'}<br/>
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
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Form.Check
          type="checkbox"
          label="오늘 하루 이 창을 다시 열지 않음"
          checked={doNotShowToday}
          onChange={handleCheckboxChange}
          className="me-3"
        />
        <Button variant="secondary" onClick={handleCloseModal}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ExampleModal;