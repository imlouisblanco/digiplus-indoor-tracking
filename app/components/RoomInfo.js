'use client';

import { useState } from 'react';

export default function RoomInfo({ people, selectedFloor, floorPlanConfig }) {
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Obtener personas en el piso seleccionado
  const peopleInFloor = people.filter(p => p.indoorPosition?.floor === selectedFloor);

  // Agrupar personas por habitación
  const peopleByRoom = peopleInFloor.reduce((acc, person) => {
    const roomId = person.indoorPosition?.roomId;
    if (roomId) {
      if (!acc[roomId]) {
        acc[roomId] = [];
      }
      acc[roomId].push(person);
    }
    return acc;
  }, {});

  // Obtener información de la habitación seleccionada
  const currentRoom = selectedRoom ? floorPlanConfig[selectedFloor]?.rooms.find(r => r.id === selectedRoom) : null;

  const getRoomTypeIcon = (type) => {
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
      security: '🔒'
    };
    return icons[type] || '🏠';
  };

  const getRoomTypeColor = (type) => {
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
      security: 'bg-red-50 border-red-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Información de Habitaciones</h2>
      
      {/* Resumen del piso */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">
          Piso {selectedFloor} - {floorPlanConfig[selectedFloor]?.name}
        </h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Total Habitaciones:</span>
            <span className="ml-2 text-blue-600">{floorPlanConfig[selectedFloor]?.rooms.length}</span>
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

      {/* Lista de habitaciones */}
      <div className="space-y-3 mb-4">
        {floorPlanConfig[selectedFloor]?.rooms.map(room => {
          const peopleInRoom = peopleByRoom[room.id] || [];
          const activePeople = peopleInRoom.filter(p => p.status === 'active').length;
          const alarmPeople = peopleInRoom.filter(p => p.status === 'alarm').length;
          
          return (
            <div
              key={room.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${getRoomTypeColor(room.type)} ${
                selectedRoom === room.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedRoom(room.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getRoomTypeIcon(room.type)}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{room.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{room.type}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">{peopleInRoom.length}</div>
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

      {/* Detalles de la habitación seleccionada */}
      {selectedRoom && currentRoom && (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-800 mb-3">
            {currentRoom.name} - Detalles
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="font-medium">Tipo:</span>
              <span className="ml-2 capitalize">{currentRoom.type}</span>
            </div>
            <div>
              <span className="font-medium">Dimensiones:</span>
              <span className="ml-2">{currentRoom.width} x {currentRoom.height}</span>
            </div>
            <div>
              <span className="font-medium">Coordenadas:</span>
              <span className="ml-2">({currentRoom.x}, {currentRoom.y})</span>
            </div>
            <div>
              <span className="font-medium">Área:</span>
              <span className="ml-2">{currentRoom.width * currentRoom.height} px²</span>
            </div>
          </div>

          {/* Personas en la habitación */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">
              Personas en esta habitación ({peopleByRoom[selectedRoom]?.length || 0})
            </h4>
            
            {peopleByRoom[selectedRoom]?.length > 0 ? (
              <div className="space-y-2">
                {peopleByRoom[selectedRoom].map(person => (
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay personas en esta habitación</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
