import React, { useState, useEffect } from 'react';
import { Map, MapMarker, MapInfoWindow } from 'react-kakao-maps-sdk';
import { Button, FormControl } from 'react-bootstrap';
import { FaMapMarkerAlt, FaUserCircle } from 'react-icons/fa';

const { kakao } = window;

function MapPage({ lat, lon }) {
  const [map, setMap] = useState(); // 지도 인스턴스 상태
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 지도 인스턴스가 생성되거나, lat/lon props가 변경될 때 지도의 중심을 업데이트
  useEffect(() => {
    if (map && lat && lon) {
      const newCenter = new kakao.maps.LatLng(lat, lon);
      map.setCenter(newCenter);
    }
  }, [map, lat, lon]);

  const companyDinnerLocations = [
    {
      id: 1,
      name: "회식1번가",
      lat: 33.5563 + 0.005,
      lng: 126.79581 + 0.005,
      address: "제주특별자치도 제주시 첨단로 242",
      rating: 4.8,
      reviewSummary: "고기 맛집, 단체석 완비!",
      category: "고기",
      imageUrl: "https://source.unsplash.com/random/300x200?korean-bbq"
    },
    {
      id: 2,
      name: "제주맥주 브루어리",
      lat: 33.5563 - 0.003,
      lng: 126.79581 + 0.008,
      address: "제주특별자치도 제주시 한림읍 금능남로 144",
      rating: 4.6,
      reviewSummary: "분위기 좋은 펍, 다양한 수제 맥주!",
      category: "술집",
      imageUrl: "https://source.unsplash.com/random/300x200?brewery"
    },
    {
      id: 3,
      name: "한라산아래첫마을",
      lat: 33.5563 + 0.002,
      lng: 126.79581 - 0.007,
      address: "제주특별자치도 제주시 조천읍 선교로 115-1",
      rating: 4.7,
      reviewSummary: "제주 향토 음식 전문점, 깔끔하고 맛있어요!",
      category: "한식",
      imageUrl: "https://source.unsplash.com/random/300x200?korean-food"
    },
    {
      id: 4,
      name: "오션뷰 뷔페",
      lat: 33.5563 - 0.007,
      lng: 126.79581 - 0.002,
      address: "제주특별자치도 서귀포시 성산읍 일출로 284-12",
      rating: 4.5,
      reviewSummary: "다양한 메뉴, 오션뷰가 최고!",
      category: "뷔페",
      imageUrl: "https://source.unsplash.com/random/300x200?buffet"
    }
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
        <div style={{ marginBottom: '10px' }}>
          <Button variant={filterCategory === 'all' ? 'primary' : 'outline-primary'} onClick={() => setFilterCategory('all')} className="me-2">전체</Button>
          <Button variant={filterCategory === '고기' ? 'primary' : 'outline-primary'} onClick={() => setFilterCategory('고기')} className="me-2">고기</Button>
          <Button variant={filterCategory === '술집' ? 'primary' : 'outline-primary'} onClick={() => setFilterCategory('술집')} className="me-2">술집</Button>
          <Button variant={filterCategory === '한식' ? 'primary' : 'outline-primary'} onClick={() => setFilterCategory('한식')} className="me-2">한식</Button>
          <Button variant={filterCategory === '뷔페' ? 'primary' : 'outline-primary'} onClick={() => setFilterCategory('뷔페')} className="me-2">뷔페</Button>
          <Button variant="outline-secondary" onClick={() => { setFilterCategory('all'); setSearchTerm(''); }}>필터 초기화</Button>
        </div>
        <FormControl
          type="text"
          placeholder="장소 이름 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px', display: 'inline-block' }}
        />
      </div>

      <div style={{ flexGrow: 1, position: 'relative' }}>
        <Map
          center={{ lat: lat, lng: lon }}
          style={{ width: '100%', height: '100%' }}
          level={3}
          onCreate={setMap} // 지도 인스턴스를 state에 저장
        >
          <MapMarker position={{ lat: lat, lng: lon }} clickable={true}>
            <div style={{ color: "#000", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FaUserCircle size={30} color="blue" />
              <span style={{ fontSize: '0.8em' }}>현재 위치</span>
            </div>
          </MapMarker>

          {companyDinnerLocations
            .filter(place => filterCategory === 'all' || place.category === filterCategory)
            .filter(place => place.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((place) => (
              <MapMarker
                key={place.id}
                position={{ lat: place.lat, lng: place.lng }}
                clickable={true}
                onClick={() => setSelectedPlace(place)}
              >
                <div style={{ color: "#000", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <FaMapMarkerAlt size={25} color="red" />
                  <span style={{ fontSize: '0.7em' }}>{place.name}</span>
                </div>
              </MapMarker>
            ))}

          {selectedPlace && (
            <MapInfoWindow
              position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
              removable={true}
              onClose={() => setSelectedPlace(null)}
            >
              <div style={{ padding: "10px", color: "#000", minWidth: '200px' }}>
                <h5 style={{ marginBottom: '5px', color: 'var(--color-primary-amber)' }}>{selectedPlace.name}</h5>
                <p style={{ fontSize: '0.9em', marginBottom: '3px' }}>{selectedPlace.address}</p>
                <p style={{ fontSize: '0.9em', marginBottom: '3px' }}>⭐ {selectedPlace.rating} | {selectedPlace.reviewSummary}</p>
                {selectedPlace.imageUrl && (
                  <img src={selectedPlace.imageUrl} alt={selectedPlace.name} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '5px', marginTop: '5px' }} />
                )}
                <Button variant="outline-primary" size="sm" className="mt-2" onClick={() => alert(`상세 정보: ${selectedPlace.name}`)}>자세히 보기</Button>
              </div>
            </MapInfoWindow>
          )}
        </Map>
        <Button onClick={() => window.history.back()} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
          뒤로가기
        </Button>
      </div>

      <div style={{ height: '400px', overflowY: 'scroll', borderTop: '1px solid #eee', padding: '10px' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>추천 회식 장소 목록</h4>
        {companyDinnerLocations
          .filter(place => filterCategory === 'all' || place.category === filterCategory)
          .filter(place => place.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((place) => (
            <div key={place.id} style={{ display: 'flex', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setSelectedPlace(place)}>
              {place.imageUrl && (
                <img src={place.imageUrl} alt={place.name} style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
              )}
              <div style={{ padding: '10px' }}>
                <h5 style={{ color: 'var(--color-primary-amber)', marginBottom: '5px' }}>{place.name}</h5>
                <p style={{ fontSize: '0.9em', marginBottom: '3px' }}>{place.address}</p>
                <p style={{ fontSize: '0.9em', marginBottom: '3px' }}>⭐ {place.rating} | {place.reviewSummary}</p>
                <Button variant="outline-primary" size="sm" onClick={() => alert(`상세 정보: ${selectedPlace.name}`)}>자세히 보기</Button>
              </div>
            </div>
          ))}
        {companyDinnerLocations.filter(place => filterCategory === 'all' || place.category === filterCategory).filter(place => place.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default MapPage;