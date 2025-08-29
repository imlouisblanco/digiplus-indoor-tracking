'use client';

import { useEffect, useRef } from 'react';
import { useLeafletContext } from '@react-leaflet/core';

export default function CustomMarker({ person, onClick }) {
  const context = useLeafletContext();
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
      // Agregar clase CSS personalizada según el estado
      const markerElement = markerRef.current.getElement();
      if (markerElement) {
        markerElement.classList.add('custom-marker');
        markerElement.classList.add(person.status === 'alarm' ? 'alarm' : 'active');
      }
    }
  }, [person.status]);

  const getMarkerIcon = (status) => {
    const size = 32;
    const color = status === 'alarm' ? '#ef4444' : '#22c55e';
    
    return L.divIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        " 
        onmouseover="this.style.transform='scale(1.2)'"
        onmouseout="this.style.transform='scale(1)'"
        >
          ${person.name.charAt(0)}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2]
    });
  };

  return (
    <div
      ref={markerRef}
      className={`custom-marker ${person.status === 'alarm' ? 'alarm' : 'active'}`}
      onClick={() => onClick && onClick(person)}
    >
      {/* El marcador se renderiza a través de la función getMarkerIcon */}
    </div>
  );
}
