import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../Header/Header';
import SearchBar from '../SearchBar/SearchBar';
import RecommendationTags from '../RecommendationTags/RecommendationTags';
import PopularCategories from '../PopularCategories/PopularCategories';
import Top5List from '../Top5List/Top5List';
import './App.css'; // For general app styling
import MapPage from '../MapPage/MapPage'; // Import MapPage
import { Routes, Route } from 'react-router-dom'; // Import routing components

function App() {
  const [currentLocation, setCurrentLocation] = useState("위치 확인 중..."); // Default location
  const [currentLat, setCurrentLat] = useState(37.5665); // Default Seoul Lat
  const [currentLon, setCurrentLon] = useState(126.9780); // Default Seoul Lon

  useEffect(() => {
    const getGeoLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setCurrentLat(latitude);
            setCurrentLon(longitude);

            // TODO: Replace with actual reverse geocoding API call
            const dummyReverseGeocode = (lat, lon) => {
              if (lat > 37.5 && lon < 127) {
                setCurrentLocation("종로 3가");
              } else if (lat < 37.5 && lon > 127) {
                setCurrentLocation("강남역");
              } else {
                setCurrentLocation("서울 어딘가");
              }
            };
            dummyReverseGeocode(latitude, longitude);
          },
          (error) => {
            console.error("Error getting geolocation:", error);
            setCurrentLocation("위치 확인 실패");
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        setCurrentLocation("위치 정보 사용 불가");
      }
    };

    getGeoLocation();
  }, []);

  return (
    <Routes>
        <Route path="/" element={
          <div className="App">
            <Container fluid>
              <Row>
                <Col xs={12}>
                  <Header currentLocation={currentLocation} />
                </Col>
              </Row>
              <Row>
                <Col md={8}> {/* Left column for main content */}
                  <SearchBar />
                  <RecommendationTags />
                  {/* Fun speech bubbles */} 
                  <div style={{
                    backgroundColor: '#e0f7fa',
                    border: '1px solid #b2ebf2',
                    borderRadius: '15px',
                    padding: '10px 15px',
                    margin: '15px 20px 10px 20px',
                    fontSize: '15px',
                    color: '#006064',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    "오늘 점심은 뭐 먹지?" 고민은 이제 그만! 🧐
                  </div>
                  <div style={{
                    backgroundColor: '#fff3e0',
                    border: '1px solid #ffe0b2',
                    borderRadius: '15px',
                    padding: '10px 15px',
                    margin: '0 20px 15px 20px',
                    fontSize: '15px',
                    color: '#e65100',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    회식 장소, 제가 다 찾아드릴게요! 🚀
                  </div>
                  <PopularCategories />
                  <Top5List currentLocation={currentLocation} />
                </Col>
                <Col md={4}> {/* Right column for chatbot */}
                  <div style={{
                    padding: '20px',
                    border: '1px dashed #ccc',
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f0f0',
                    position: 'sticky', /* Make it sticky */
                    top: '50%', /* Position at 50% from the top */
                    transform: 'translateY(-50%)', /* Adjust for vertical centering */
                    alignSelf: 'flex-start', /* Align to the start of the flex container */
                    height: 'fit-content', /* Adjust height to fit content */
                    margin: '20px 0', /* Add some margin */
                  }}>
                    <p style={{ color: '#666', fontSize: '18px' }}>챗봇이 들어갈 공간</p>
                    <p style={{ color: '#666', fontSize: '14px' }}>(스크롤 시 따라옴)</p>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        } />
        <Route path="/map" element={<MapPage lat={currentLat} lon={currentLon} />} />
      </Routes>
  );
}

export default App;