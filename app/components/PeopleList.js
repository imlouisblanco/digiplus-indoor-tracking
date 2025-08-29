'use client';

import { useState, useEffect } from 'react';

export default function PeopleList({ people, onPersonSelect }) {
  const [selectedPerson, setSelectedPerson] = useState(null);

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
    if (onPersonSelect) {
      onPersonSelect(person);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'alarm':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'alarm':
        return 'Alarma';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Personas en Tiempo Real</h2>
      
      <div className="space-y-3">
        {people.map((person) => (
          <div
            key={person.id}
            onClick={() => handlePersonClick(person)}
            className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedPerson?.id === person.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{person.name}</h3>
                <p className="text-sm text-gray-600">{person.department}</p>
                <p className="text-xs text-gray-500">
                  Última actualización: {person.lastUpdate.toLocaleTimeString()}
                </p>
              </div>
              
              <div className="flex flex-col items-end space-y-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(person.status)}`}>
                  {getStatusText(person.status)}
                </span>
                
                <div className="text-xs text-gray-500">
                  <div>Lat: {person.position[0].toFixed(6)}</div>
                  <div>Lng: {person.position[1].toFixed(6)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {people.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No hay personas siendo trackeadas</p>
        </div>
      )}
    </div>
  );
}
