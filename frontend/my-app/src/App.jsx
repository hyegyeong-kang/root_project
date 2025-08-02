import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import SplashScreen from './components/SplashScreen';

function App() {
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(sessionStorage.getItem('hasVisited') === null);

  useEffect(() => {
    if (showSplash) {
      setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('hasVisited', 'true');
      }, 2000);
    } else {
      setLoading(false);
    }
  }, [showSplash]);

  return (
    <>
      {loading && showSplash ? (
        <SplashScreen />
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      )}
    </>
  );
}

export default App;

