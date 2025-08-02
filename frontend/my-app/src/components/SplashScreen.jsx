import React from 'react';
import cardImage from '../assets/Card.png';
import './SplashScreen.css';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <img src={cardImage} alt="Card" className="splash-card" />
      <h1 className="splash-title">법카 플렉스</h1>
    </div>
  );
};

export default SplashScreen;
