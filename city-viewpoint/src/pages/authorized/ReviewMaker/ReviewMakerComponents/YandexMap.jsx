import React from 'react';
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

export default function YandexMap({ points, setPoints, center }) {
    const mapCenter = Array.isArray(center)
        ? center
        : [center?.lat || center?.latitude || 55.75, center?.lng || center?.longitude || 37.61];

    const handleMapClick = (e) => {
        const coords = e.get('coords');
        setPoints((prev) => [...prev, coords]);
    };

    return (
        <div style={{ marginTop: '30px', width: '100%' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#3a6b00' }}>
                Отметьте интересные места на карте
            </h2>
            <div style={{ width: '100%', height: '450px', borderRadius: '15px', overflow: 'hidden', border: '2px solid #a3c644' }}>
                <YMaps query={{ lang: 'ru_RU' }}>
                    <Map
                        key={`${mapCenter[0]}-${mapCenter[1]}`}
                        state={{ center: mapCenter, zoom: 12 }}
                        width="100%"
                        height="100%"
                        onClick={handleMapClick}
                        instanceRef={(ref) => {
                            if (ref) {
                                ref.container.fitToViewport();
                            }
                        }}
                    >
                        {points.map((coords, idx) => (
                            <Placemark
                                key={idx}
                                geometry={coords}
                                options={{ preset: 'islands#greenDotIcon' }}
                            />
                        ))}
                    </Map>
                </YMaps>
            </div>
        </div>
    );
}
