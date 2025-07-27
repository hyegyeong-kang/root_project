import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PlaceCard from './PlaceCard'; // PlaceCard 임포트
import ReviewAnalysisDisplay from './ReviewAnalysisDisplay'; // ReviewAnalysisDisplay 임포트
import './StructuredDisplayArea.css'; // 새로운 CSS 파일 임포트

const StructuredDisplayArea = ({ recommendedPlaces, analyzedReview }) => {
  // recommendedPlaces가 null이면 아무것도 렌더링하지 않음
  if (recommendedPlaces === null && !analyzedReview) {
    return null;
  }

  return (
    <Col md={12} className="structured-display-area"> {/* 화면의 대부분을 차지 */}
      {recommendedPlaces && recommendedPlaces.length > 0 && (
        <>
          <h3 className="display-area-title">추천 장소</h3>
          <Row className="justify-content-center">
            {recommendedPlaces.map((place, index) => (
              <Col key={index} xs={12} sm={6} md={3} lg={3} className="mb-4">
                <PlaceCard place={place} />
              </Col>
            ))}
          </Row>
        </>
      )}

      {analyzedReview && (
        <>
          <h3 className="display-area-title">리뷰 분석 결과</h3>
          <ReviewAnalysisDisplay reviewData={analyzedReview} />
        </>
      )}

      {recommendedPlaces && recommendedPlaces.length === 0 && !analyzedReview && (
        <div className="no-data-message">
          <p>찾고 싶은 회식 장소의 지역이나 상호명을 검색해보세요!</p>
          <p>예: "강남역", "OO식당"</p>
        </div>
      )}
    </Col>
  );
};

export default StructuredDisplayArea;