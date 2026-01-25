import { useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

function ReviewMap({ places }) {
  if (!places || places.length === 0) return null;

  const defaultState = {
    center: [places[0].latitude, places[0].longitude],
    zoom: 12,
  };

  return (
    <YMaps>
      <Map defaultState={defaultState} width="90%" height="400px">
        {places.map((place, idx) => (
          <Placemark
            key={idx}
            geometry={[place.latitude, place.longitude]}
            properties={{ balloonContent: place.name }}
            options={{ preset: 'islands#redDotIcon' }}
          />
        ))}
      </Map>
    </YMaps>
  );
}
export default ReviewMap;
