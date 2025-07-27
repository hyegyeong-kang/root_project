import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { StarFill } from 'react-bootstrap-icons';
import './PlaceCard.css';

const PlaceCard = ({ place }) => {
  return (
    <Card className="place-card mb-3">
      {place.image_url && <Card.Img variant="top" src={place.image_url} alt={place.name} className="place-card-img" />}
      <Card.Body>
        <Card.Title>{place.store_name}</Card.Title>
        <Card.Text className="place-category">{place.category}</Card.Text>
        {place.business_hours && <Card.Text className="place-business-hours">영업시간: {place.business_hours}</Card.Text>}
        {place.parking_available && <Card.Text className="place-parking-available">주차: {place.parking_available}</Card.Text>}
        {place.recommended_people && <Card.Text className="place-recommended-people">추천 인원: {place.recommended_people}</Card.Text>}
        
        
        
        
      </Card.Body>
    </Card>
  );
};

export default PlaceCard;
