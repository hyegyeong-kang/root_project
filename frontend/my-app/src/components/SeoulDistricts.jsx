import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import styles from './SeoulDistricts.module.css';

const seoulDistricts = [
  '강남구', '강동구', '강북구', '강서구', '관악구',
  '광진구', '구로구', '금천구', '노원구', '도봉구',
  '동대문구', '동작구', '마포구', '서대문구', '서초구',
  '성동구', '성북구', '송파구', '양천구', '영등포구',
  '용산구', '은평구', '종로구', '중구', '중랑구'
];

function SeoulDistricts({ onDistrictSelect }) {
  const handleDistrictClick = (district) => {
    console.log(`${district} clicked`);
    // TODO: DB에서 데이터 가져오는 로직 추가
  };

  return (
    <Container className={`my-4 ${styles.districtsContainer}`}>
      <h2 className={styles.title}>회식?</h2>
      <Row>
        {seoulDistricts.map((district) => (
          <Col key={district} style={{ flex: '0 0 20%', maxWidth: '20%' }} className="mb-3 d-flex justify-content-center">
            <Button
              variant="outline-dark"
              className={styles.districtButton}
              onClick={() => onDistrictSelect(district)}
            >
              {district}
            </Button>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default SeoulDistricts;
