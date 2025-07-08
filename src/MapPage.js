
import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { Button } from 'react-bootstrap';

function MapPage() {
  const [location, setLocation] = useState(null); // 초기값을 null로 설정하여 위치 정보를 기다림
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (err) => {
          console.error("Error getting geolocation:", err);
          let errorMessage = "현재 위치를 가져올 수 없습니다. 기본 위치로 지도를 표시합니다.";
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "위치 정보 사용 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.";
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = "위치 정보를 사용할 수 없습니다. 네트워크 연결을 확인해주세요.";
              break;
            case err.TIMEOUT:
              errorMessage = "위치 정보를 가져오는 데 시간이 초과되었습니다. 다시 시도해주세요.";
              break;
            default:
              errorMessage = "알 수 없는 오류로 위치 정보를 가져올 수 없습니다.";
              break;
          }
          setError(errorMessage);
          setLocation({ lat: 33.5563, lng: 126.79581 }); // 에러 발생 시 기본 위치
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // timeout을 30초로 늘림
      );
    } else {
      setError('이 브라우저에서는 위치 정보가 지원되지 않습니다. 기본 위치로 지도를 표시합니다.');
      setLocation({ lat: 33.5563, lng: 126.79581 }); // 지원되지 않을 시 기본 위치
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>현재 위치를 불러오는 중입니다...</div>;
  }

  return (
    <div>
      {error && <div style={{ color: 'red', textAlign: 'center', padding: '10px' }}>{error}</div>}
      {location && (
        <Map
          center={location}
          style={{ width: '100%', height: '100vh' }}
          level={3}
        >
          <MapMarker position={location}>
            <div style={{color:"#000"}}>현재 위치</div>
          </MapMarker>
        </Map>
      )}
      <Button onClick={() => window.history.back()} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
        뒤로가기
      </Button>
    </div>
  );
}

export default MapPage;
