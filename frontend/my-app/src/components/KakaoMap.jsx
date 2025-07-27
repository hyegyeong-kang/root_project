import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

function KakaoMap({ district }) {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    if (district) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(`${district}`, function (result, status) {
        if (status === window.kakao.maps.services.Status.OK) {
          const newPos = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          setMarkerPosition(newPos);
          if (map) {
            map.setCenter(newPos);
          }
        }
      });
    }
  }, [district, map]);

  return (
    <Map
      center={{ lat: 37.5665, lng: 126.9780 }}
      style={{ width: '100%', height: '400px' }}
      level={5}
      onCreate={setMap}
    >
      {markerPosition && <MapMarker position={markerPosition} />}
    </Map>
  );
}

export default KakaoMap;
