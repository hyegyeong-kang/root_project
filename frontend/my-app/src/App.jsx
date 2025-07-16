import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} /> {/* 초기 접속 시 HomePage 렌더링 */}
      <Route path="/login" element={<AuthPage />} /> {/* Cognito 리다이렉트 URI */}
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

export default App;
