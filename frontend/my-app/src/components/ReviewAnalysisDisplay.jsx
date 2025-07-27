import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import './ReviewAnalysisDisplay.css'; // 새로운 CSS 파일 임포트

const ReviewAnalysisDisplay = ({ reviewData }) => {
  if (!reviewData) {
    return null;
  }

  return (
    <Card className="review-analysis-card mb-4">
      <Card.Body>
        <Card.Title>리뷰 요약</Card.Title>
        <Card.Text className="review-summary">{reviewData.content}</Card.Text>
        
        {reviewData.keywords && reviewData.keywords.length > 0 && (
          <div className="review-keywords">
            <h5>핵심 키워드:</h5>
            {reviewData.keywords.map((keyword, index) => (
              <Badge key={index} pill bg="info" className="keyword-badge">
                #{keyword}
              </Badge>
            ))}
          </div>
        )}

        {reviewData.original_review && (
          <div className="original-review-section mt-3">
            <h6>원본 리뷰:</h6>
            <p className="original-review-text">{reviewData.original_review}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReviewAnalysisDisplay;