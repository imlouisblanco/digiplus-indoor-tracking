'use client';

import { useState } from 'react';

export default function TrackingAreas({ people, selectedFloor }) {
  const [selectedArea, setSelectedArea] = useState(null);

  // Configuración de las áreas de tracking basadas en la imagen real
  const trackingAreas = {
    1: {
      name: "Planta Baja",
      areas: [
        { id: "office1", name: "Oficina Abierta", x: 0.15, y: 0.25, width: 0.25, height: 0.3, type: "office" },
        { id: "meeting1", name: "Sala de Reuniones", x: 0.45, y: 0.25, width: 0.2, height: 0.25, type: "meeting" },
        { id: "reception", name: "Recepción", x: 0.15, y: 0.6, width: 0.15, height: 0.15, type: "reception" },
        { id: "elevator1", name: "Elevador 1", x: 0.35, y: 0.6, width: 0.08, height: 0.12, type: "elevator" },
        { id: "elevator2", name: "Elevador 2", x: 0.45, y: 0.6, width: 0.08, height: 0.12, type: "elevator" },
        { id: "parking", name: "Estacionamiento", x: 0.65, y: 0.15, width: 0.3, height: 0.4, type: "parking" },
        { id: "warehouse", name: "Almacén", x: 0.65, y: 0.6, width: 0.25, height: 0.3, type: "warehouse" }
      ]
    },
    2: {
      name: "Primer Piso",
      areas: [
        { id: "executive", name: "Oficina Ejecutiva", x: 0.15, y: 0.25, width: 0.2, height: 0.25, type: "executive" },
        { id: "conference", name: "Sala de Conferencias", x: 0.4, y: 0.25, width: 0.25, height: 0.3, type: "conference" },
        { id: "cafe", name: "Cafetería", x: 0.15, y: 0.6, width: 0.15, height: 0.15, type: "cafe" },
        { id: "elevator1_2", name: "Elevador 1", x: 0.35, y: 0.6, width: 0.08, height: 0.12, type: "elevator" },
        { id: "elevator2_2", name: "Elevador 2", x: 0.45, y: 0.6, width: 0.08, height: 0.12, type: "elevator" }
      ]
    },
    3: {
      name: "Segundo Piso",
      areas: [
        { id: "waiting", name: "Área de Espera", x: 0.15, y: 0.25, width: 0.3, height: 0.25, type: "waiting" },
        { id: "gate3", name: "Puerta 3", x: 0.5, y: 0.25, width: 0.12, height: 0.15, type: "gate" },
        { id: "security", name: "Control de Seguridad", x: 0.15, y: 0.6, width: 0.2, height: 0.25, type: "security" },
        { id: "elevator1_3", name: "Elevador 1", x: 0.35, y: 0.6, width: 0.08, height: 0.12, type: "elevator" },
        { id: "elevator2_3", name: "Elevador 2", x: 0.45, y: 0.6, width: 0.08, height: 0.12, type: "elevator" }
      ]
    }
  };

  // Obtener personas en el piso seleccionado
  const peopleInFloor = people.filter(p => p.indoorPosition?.floor === selectedFloor);

  // Agrupar personas por área
  const peopleByArea = peopleInFloor.reduce((acc, person) => {
    const areaId = person.indoorPosition?.areaId;
    if (areaId) {
      if (!acc[areaId]) {
        acc[areaId] = [];
      }
      acc[areaId].push(person);
    }
    return acc;
  }, {});

  // Obtener información del área seleccionada
  const currentArea = selectedArea ? trackingAreas[selectedFloor]?.areas.find(a => a.id === selectedArea) : null;

  const getAreaTypeIcon = (type) => {
    const icons = {
      office: '🏢',
      meeting: '💼',
      reception: '👋',
      elevator: '🛗',
      parking: '🚗',
      warehouse: '📦',
      executive: '👔',
      conference: '🎯',
      cafe: '☕',
      gate: '🚪',
      security: '🔒',
      waiting: '🪑'
    };
    return icons[type] || '🏠';
  };

  const getAreaTypeColor = (type) => {
    const colors = {
      office: 'bg-blue-50 border-blue-200',
      meeting: 'bg-purple-50 border-purple-200',
      reception: 'bg-yellow-50 border-yellow-200',
      elevator: 'bg-red-50 border-red-200',
      parking: 'bg-green-50 border-green-200',
      warehouse: 'bg-orange-50 border-orange-200',
      executive: 'bg-indigo-50 border-indigo-200',
      conference: 'bg-emerald-50 border-emerald-200',
      cafe: 'bg-pink-50 border-pink-200',
      gate: 'bg-cyan-50 border-cyan-200',
      security: 'bg-red-50 border-red-200',
      waiting: 'bg-gray-50 border-gray-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Áreas de Tracking</h2>
      
      {/* Resumen del piso */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">
          Piso {selectedFloor} - {trackingAreas[selectedFloor]?.name}
        </h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Total Áreas:</span>
            <span className="ml-2 text-blue-600">{trackingAreas[selectedFloor]?.areas.length}</span>
          </div>
          <div>
            <span className="font-medium">Personas Activas:</span>
            <span className="ml-2 text-green-600">{peopleInFloor.filter(p => p.status === 'active').length}</span>
          </div>
          <div>
            <span className="font-medium">Alarmas:</span>
            <span className="ml-2 text-red-600">{peopleInFloor.filter(p => p.status === 'alarm').length}</span>
          </div>
        </div>
      </div>

      {/* Lista de áreas */}
      <div className="space-y-3 mb-4">
        {trackingAreas[selectedFloor]?.areas.map(area => {
          const peopleInArea = peopleByArea[area.id] || [];
          const activePeople = peopleInArea.filter(p => p.status === 'active').length;
          const alarmPeople = peopleInArea.filter(p => p.status === 'alarm').length;
          
          return (
            <div
              key={area.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${getAreaTypeColor(area.type)} ${
                selectedArea === area.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedArea(area.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getAreaTypeIcon(area.type)}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{area.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{area.type}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">{peopleInArea.length}</div>
                  <div className="text-xs text-gray-500">personas</div>
                  {alarmPeople > 0 && (
                    <div className="text-xs text-red-600 font-medium">
                      {alarmPeople} alarma{alarmPeople > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detalles del área seleccionada */}
      {selectedArea && currentArea && (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-800 mb-3">
            {currentArea.name} - Detalles
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="font-medium">Tipo:</span>
              <span className="ml-2 capitalize">{currentArea.type}</span>
            </div>
            <div>
              <span className="font-medium">Posición:</span>
              <span className="ml-2">({(currentArea.x * 100).toFixed(1)}%, {(currentArea.y * 100).toFixed(1)}%)</span>
            </div>
            <div>
              <span className="font-medium">Dimensiones:</span>
              <span className="ml-2">{(currentArea.width * 100).toFixed(1)}% x {(currentArea.height * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="font-medium">Área:</span>
              <span className="ml-2">{((currentArea.width * currentArea.height) * 10000).toFixed(1)}%²</span>
            </div>
          </div>

          {/* Personas en el área */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              Personas en esta área ({peopleByArea[selectedArea]?.length || 0})
            </h4>
            
            {peopleByArea[selectedArea]?.length > 0 ? (
              <div className="space-y-2">
                {peopleByArea[selectedArea].map(person => (
                  <div
                    key={person.id}
                    className={`p-2 rounded border-l-4 ${
                      person.status === 'alarm' 
                        ? 'bg-red-50 border-red-400' 
                        : 'bg-green-50 border-green-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-800">{person.name}</span>
                        <span className="text-sm text-gray-600 ml-2">({person.department})</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className={`font-medium ${
                          person.status === 'alarm' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {person.status === 'alarm' ? 'ALARMA' : 'ACTIVO'}
                        </div>
                        <div className="text-gray-500">Batería: {Math.round(person.battery)}%</div>
                      </div>
                    </div>
                    
                    {/* Posición específica en el área */}
                    <div className="mt-1 text-xs text-gray-500">
                      Posición: ({(person.indoorPosition.x * 100).toFixed(1)}%, {(person.indoorPosition.y * 100).toFixed(1)}%)
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay personas en esta área</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
