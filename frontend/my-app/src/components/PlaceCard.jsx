import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './PlaceCard.css';

const PlaceCard = ({ place, onClick }) => {
  return (
    <Card className="place-card mb-3" onClick={onClick} style={{ cursor: 'pointer' }}>
      {place.image_url && <Card.Img variant="top" src={place.image_url} alt={place.store_name} className="place-card-img" />}
      <Card.Body>
        <Card.Title>{place.store_name}</Card.Title>
        <Card.Text className="place-category">{place.category}</Card.Text>
        {place.address && <Card.Text className="place-address">주소: {place.address}</Card.Text>}
        {place.business_hours && <Card.Text className="place-business-hours">영업시간: {place.business_hours}</Card.Text>}
        {place.parking_available && <Card.Text className="place-parking-available">주차: {place.parking_available}</Card.Text>}
        {place.recommended_people && <Card.Text className="place-recommended-people">추천 인원: {place.recommended_people}</Card.Text>}
        {place.rating && <Card.Text className="place-rating">평점: ★ {place.rating}</Card.Text>}
        {place.review_summary && <Card.Text className="place-review-summary">리뷰 요약: {place.review_summary}</Card.Text>}
        {place.review_keywords && place.review_keywords.length > 0 && (
          <div className="place-keywords">
            <strong>키워드:</strong>
            {place.review_keywords.map((keyword, idx) => (
              <Button
                key={idx}
                variant="outline-secondary"
                size="sm"
                className={`ms-1 mb-1 keywordButtonCommon`}
                onClick={(e) => e.stopPropagation()} // 카드 클릭 방지
              >
                #{keyword}
              </Button>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PlaceCard;
