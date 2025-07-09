import React from 'react';
import './RecommendationTags.css';

const RecommendationTags = () => {
  const tags = [
    "주차 장소가 넓은 곳",
    "새로 오픈한 양식 맛집",
    "부장님이 좋아하시는 해장 국밥집 추천해줘",
    "MZ 신입 사원이 좋아하는 치맥 스팟은 어디?",
    "발렛파킹이 되는 깔끔한 한정식 집",
    "가성비 좋은 회식 장소",
    "조용한 분위기의 한정식",
  ];

  return (
    <div className="tags-container">
      {tags.map((tag, index) => (
        <button key={index} className="tag-button">
          {tag}
        </button>
      ))}
    </div>
  );
};

export default RecommendationTags;