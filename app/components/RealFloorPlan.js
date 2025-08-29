'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchTrackingData, simulateAlarm } from '../services/trackingService';
import Image from 'next/image';

export default function RealFloorPlan({ onPeopleUpdate, onPersonSelect, selectedFloor, onFloorChange }) {
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredPerson, setHoveredPerson] = useState(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

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

  // Función para obtener datos del proveedor
  const fetchPersonData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchTrackingData();
      if (response.success) {
        // Convertir coordenadas GPS a coordenadas del plano real
        const indoorPeople = response.data.map(person => ({
          ...person,
          indoorPosition: convertToIndoorPosition(person.position, person.department)
        }));
        
        setPeople(indoorPeople);
        if (onPeopleUpdate) {
          onPeopleUpdate(indoorPeople);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Error al obtener datos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Convertir coordenadas GPS a coordenadas del plano real
  const convertToIndoorPosition = (gpsPosition, department) => {
    // Simular posiciones dentro de las áreas según el departamento
    const areaMap = {
      "Desarrollo": { floor: 1, area: "office1" },
      "Marketing": { floor: 1, area: "office1" },
      "Ventas": { floor: 1, area: "meeting1" },
      "Recursos Humanos": { floor: 2, area: "executive" },
      "Finanzas": { floor: 2, area: "conference" }
    };

    const areaInfo = areaMap[department] || { floor: 1, area: "office1" };
    const area = trackingAreas[areaInfo.floor].areas.find(a => a.id === areaInfo.area);
    
    if (area) {
      return {
        x: area.x + Math.random() * area.width,
        y: area.y + Math.random() * area.height,
        floor: areaInfo.floor,
        areaId: area.id
      };
    }

    return { x: 0.25, y: 0.4, floor: 1, areaId: "office1" };
  };

  // Función para simular alarma
  const handleSimulateAlarm = async () => {
    try {
      if (people.length > 0) {
        const randomPerson = people[Math.floor(Math.random() * people.length)];
        await simulateAlarm(randomPerson.id);
        await fetchPersonData();
      }
    } catch (err) {
      console.error("Error al simular alarma:", err);
    }
  };

  // Animar el movimiento de las personas
  const animatePeople = () => {
    setPeople(prevPeople => 
      prevPeople.map(person => {
        if (person.indoorPosition) {
          const area = trackingAreas[person.indoorPosition.floor]?.areas.find(a => a.id === person.indoorPosition.areaId);
          if (area) {
            // Mover dentro de los límites del área
            const newX = person.indoorPosition.x + (Math.random() - 0.5) * 0.02;
            const newY = person.indoorPosition.y + (Math.random() - 0.5) * 0.02;
            
            return {
              ...person,
              indoorPosition: {
                ...person.indoorPosition,
                x: Math.max(area.x, Math.min(area.x + area.width, newX)),
                y: Math.max(area.y, Math.min(area.y + area.height, newY))
              }
            };
          }
        }
        return person;
      })
    );
  };

  // Configurar actualizaciones automáticas
  useEffect(() => {
    fetchPersonData();
    
    // Configurar intervalo de actualización
    const interval = setInterval(fetchPersonData, 5000);
    const animationInterval = setInterval(animatePeople, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(animationInterval);
    };
  }, []);

  // Manejar click en el plano
  const handlePlaneClick = (event) => {
    if (!containerRef.current || !imageRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();
    
    // Calcular coordenadas relativas a la imagen
    const x = (event.clientX - imageRect.left) / imageRect.width;
    const y = (event.clientY - imageRect.top) / imageRect.height;

    // Buscar persona clickeada
    const clickedPerson = people.find(person => {
      if (person.indoorPosition?.floor === selectedFloor) {
        const distance = Math.sqrt(
          Math.pow(x - person.indoorPosition.x, 2) + 
          Math.pow(y - person.indoorPosition.y, 2)
        );
        return distance <= 0.05; // Radio de click más grande para coordenadas relativas
      }
      return false;
    });

    if (clickedPerson && onPersonSelect) {
      onPersonSelect(clickedPerson);
    }
  };

  // Obtener coordenadas absolutas para el CSS
  const getAbsolutePosition = (relativeX, relativeY) => {
    if (!containerRef.current) return { left: 0, top: 0 };
    
    const container = containerRef.current;
    const left = relativeX * 100;
    const top = relativeY * 100;
    
    return { left: `${left}%`, top: `${top}%` };
  };

  if (isLoading && people.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando plano real...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="bg-white p-4 border-b shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Plano Real
            </h1>
            <p className="text-gray-600">Monitoreo en tiempo real sobre imagen del plano</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {error && (
              <div className="text-red-600 text-sm bg-red-50 px-3 py-1 rounded">
                Error: {error}
              </div>
            )}
            
            {/* Selector de piso */}
            {/* <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Piso:</label>
              <select
                value={selectedFloor}
                onChange={(e) => onFloorChange(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                {Object.keys(trackingAreas).map(floor => (
                  <option key={floor} value={floor}>
                    Piso {floor} - {trackingAreas[floor].name}
                  </option>
                ))}
              </select>
            </div> */}

            {/* <button
              onClick={fetchPersonData}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Actualizando..." : "Actualizar Datos"}
            </button>
            
            <button
              onClick={handleSimulateAlarm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Simular Alarma
            </button> */}
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div 
          ref={containerRef}
          className="relative border border-gray-300 rounded-lg shadow-lg bg-white overflow-hidden"
          style={{ minHeight: '600px' }}
          onClick={handlePlaneClick}
        >
          {/* Imagen del plano real */}
          <Image
            ref={imageRef}
            src="/Traxmate-seamless-eveywhere.large_-2048x1452.png.webp"
            alt="Plano del edificio"
            width={800}
            height={600}
            className="w-full h-auto cursor-pointer"
            onLoad={() => setImageLoaded(true)}
            priority
          />

          {/* Marcadores de personas */}
          {imageLoaded && people
            .filter(p => p.indoorPosition?.floor === selectedFloor)
            .map(person => {
              const pos = person.indoorPosition;
              if (!pos) return null;

              const absolutePos = getAbsolutePosition(pos.x, pos.y);
              const isHovered = hoveredPerson?.id === person.id;
              
              return (
                <div
                  key={person.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  style={absolutePos}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onPersonSelect) onPersonSelect(person);
                  }}
                  onMouseEnter={() => setHoveredPerson(person)}
                  onMouseLeave={() => setHoveredPerson(null)}
                >
                  {/* Marcador de persona */}
                  <div className={`relative transition-all duration-200 ${
                    person.status === 'alarm' ? 'animate-pulse' : ''
                  } ${isHovered ? 'scale-125' : 'scale-100'}`}>
                    {/* Círculo principal */}
                    <div 
                      className={`w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                        person.status === 'alarm' ? 'bg-red-500' : 'bg-green-500'
                      } ${isHovered ? 'shadow-2xl' : 'shadow-lg'}`}
                    >
                      <span className="text-white font-bold text-base">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                    
                    {/* Indicador de alarma */}
                    {person.status === 'alarm' && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center animate-bounce">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    )}
                    
                    {/* Tooltip con información */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                        <div className="bg-black text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                          <div className="font-bold text-center">{person.name}</div>
                          <div className="text-center text-gray-300">{person.department}</div>
                          <div className="text-center text-gray-300">Batería: {Math.round(person.battery)}%</div>
                          <div className={`text-center font-medium ${
                            person.status === 'alarm' ? 'text-red-300' : 'text-green-300'
                          }`}>
                            {person.status === 'alarm' ? '🚨 ALARMA' : '✅ ACTIVO'}
                          </div>
                        </div>
                        <div className="w-3 h-3 bg-black transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -mt-1"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {/* Leyenda */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg border z-20">
            <h3 className="font-bold text-gray-800 mb-2 text-sm">Leyenda</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Persona Activa</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Persona en Alarma</span>
              </div>
            </div>
          </div>

          {/* Información del piso actual */}
          {/* <div className="absolute top-4 right-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg border z-20">
            <div className="text-sm">
              <div className="font-bold text-gray-800">{trackingAreas[selectedFloor]?.name}</div>
              <div className="text-gray-600">
                {people.filter(p => p.indoorPosition?.floor === selectedFloor).length} personas
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
