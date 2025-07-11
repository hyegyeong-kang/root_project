import React, { useRef } from 'react';
import './Top5List.css';

const Top5List = ({ currentLocation }) => {
  const scrollRef = useRef(null);

  const topItems = [
    { id: 1, name: "광화문 미진", description: "메밀국수 / 보쌈", location: "광화문역" },
    { id: 2, name: "광화문 미진", description: "메밀국수 / 보쌈", location: "광화문역" },
    { id: 3, name: "광화문 미진", description: "메밀국수 / 보쌈", location: "광화문역" },
    { id: 4, name: "광화문 미진", description: "메밀국수 / 보쌈", location: "광화문역" },
    { id: 5, name: "광화문 미진", description: "메밀국수 / 보쌈", location: "광화문역" },
    { id: 6, name: "종로 맛집", description: "파스타 / 스테이크", location: "종각역" },
    { id: 7, name: "강남 회식", description: "한우 / 와인", location: "강남역" },
    { id: 8, name: "홍대 핫플", description: "퓨전 요리 / 칵테일", location: "홍대입구역" },
    { id: 9, name: "이태원 바베큐", description: "미국식 바베큐 / 수제맥주", location: "이태원역" },
    { id: 10, name: "여의도 일식", description: "초밥 / 사시미", location: "여의도역" },
  ];

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className="top-list-section">
      <h2 className="top-list-title">
        <span className="highlight">{currentLocation}</span> 직장인들이
        <br />
        지금 많이 찾는 TOP 10
      </h2>
      <div className="scroll-container">
        <button className="scroll-button left" onClick={() => scroll(-200)}>&#10094;</button>
        <div className="top-list-items" ref={scrollRef}>
          {topItems.map((item) => (
            <div key={item.id} className="top-list-item">
              <div className="item-rank">{item.id}</div>
              <div className="item-image-placeholder"></div>
              <div className="item-text">
                <div className="item-name">{item.name}</div>
                <div className="item-description">{item.description}</div>
                <div className="item-location">{item.location}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="scroll-button right" onClick={() => scroll(200)}>&#10095;</button>
      </div>
    </div>
  );
};

export default Top5List;