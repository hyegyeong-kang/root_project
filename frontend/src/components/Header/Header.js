import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ currentLocation }) => {
  const navigate = useNavigate();

  const handleLocationClick = () => {
    navigate('/map');
  };

  return (
    <header className="header-container">
      <div className="header-top">
        <span className="header-title-small">직장인들을 위한 회식 잘알</span>
        <h1 className="header-title-large">법카 플렉스</h1>
      </div>
      <div className="header-location">
        <span className="location-icon">📍</span>
        <button className="current-location-btn" onClick={handleLocationClick}>
          현재 위치 ({currentLocation})
        </button>
        <button className="select-other-location-btn">다른 지역 선택</button>
      </div>
    </header>
  );
};

export default Header;