'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchTrackingData, simulateAlarm } from '../services/trackingService';

export default function IndoorFloorPlan({ onPeopleUpdate, onPersonSelect, selectedFloor: externalSelectedFloor, onFloorChange }) {
  const [people, setPeople] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(externalSelectedFloor || 1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Sincronizar el piso seleccionado con el componente padre
  useEffect(() => {
    if (externalSelectedFloor && externalSelectedFloor !== selectedFloor) {
      setSelectedFloor(externalSelectedFloor);
    }
  }, [externalSelectedFloor]);

  // Notificar al componente padre cuando cambie el piso
  const handleFloorChange = (newFloor) => {
    setSelectedFloor(newFloor);
    if (onFloorChange) {
      onFloorChange(newFloor);
    }
  };

  // Configuración del plano indoor
  const floorPlanConfig = {
    1: {
      name: "Planta Baja",
      rooms: [
        { id: "office1", name: "Oficina Abierta", x: 100, y: 100, width: 200, height: 150, type: "office" },
        { id: "meeting1", name: "Sala de Reuniones", x: 350, y: 100, width: 150, height: 120, type: "meeting" },
        { id: "reception", name: "Recepción", x: 100, y: 300, width: 120, height: 80, type: "reception" },
        { id: "elevator1", name: "Elevador 1", x: 300, y: 300, width: 40, height: 60, type: "elevator" },
        { id: "elevator2", name: "Elevador 2", x: 350, y: 300, width: 40, height: 60, type: "elevator" },
        { id: "parking", name: "Estacionamiento", x: 500, y: 100, width: 300, height: 200, type: "parking" },
        { id: "warehouse", name: "Almacén", x: 500, y: 350, width: 250, height: 150, type: "warehouse" }
      ]
    },
    2: {
      name: "Primer Piso",
      rooms: [
        { id: "executive", name: "Oficina Ejecutiva", x: 100, y: 100, width: 150, height: 120, type: "executive" },
        { id: "conference", name: "Sala de Conferencias", x: 300, y: 100, width: 200, height: 150, type: "conference" },
        { id: "cafe", name: "Cafetería", x: 100, y: 300, width: 120, height: 80, type: "cafe" },
        { id: "elevator1_2", name: "Elevador 1", x: 300, y: 300, width: 40, height: 60, type: "elevator" },
        { id: "elevator2_2", name: "Elevador 2", x: 350, y: 300, width: 40, height: 60, type: "elevator" }
      ]
    },
    3: {
      name: "Segundo Piso",
      rooms: [
        { id: "waiting", name: "Área de Espera", x: 100, y: 100, width: 250, height: 120, type: "waiting" },
        { id: "gate3", name: "Puerta 3", x: 400, y: 100, width: 100, height: 80, type: "gate" },
        { id: "security", name: "Control de Seguridad", x: 100, y: 300, width: 150, height: 100, type: "security" },
        { id: "elevator1_3", name: "Elevador 1", x: 300, y: 300, width: 40, height: 60, type: "elevator" },
        { id: "elevator2_3", name: "Elevador 2", x: 350, y: 300, width: 40, height: 60, type: "elevator" }
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
        // Convertir coordenadas GPS a coordenadas del plano indoor
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

  // Convertir coordenadas GPS a coordenadas del plano indoor
  const convertToIndoorPosition = (gpsPosition, department) => {
    // Simular posiciones dentro de las habitaciones según el departamento
    const roomMap = {
      "Desarrollo": { floor: 1, room: "office1" },
      "Marketing": { floor: 1, room: "office1" },
      "Ventas": { floor: 1, room: "meeting1" },
      "Recursos Humanos": { floor: 2, room: "executive" },
      "Finanzas": { floor: 2, room: "conference" }
    };

    const roomInfo = roomMap[department] || { floor: 1, room: "office1" };
    const room = floorPlanConfig[roomInfo.floor].rooms.find(r => r.id === roomInfo.room);
    
    if (room) {
      return {
        x: room.x + Math.random() * room.width,
        y: room.y + Math.random() * room.height,
        floor: roomInfo.floor,
        roomId: room.id
      };
    }

    return { x: 200, y: 200, floor: 1, roomId: "office1" };
  };

  // Función para simular alarma
  const handleSimulateAlarm = async () => {
    try {
      if (people.length > 0) {
        const randomPerson = people[Math.floor(Math.random() * people.length)];
        await simulateAlarm(randomPerson.id);
        // Refrescar datos después de simular la alarma
        await fetchPersonData();
      }
    } catch (err) {
      console.error("Error al simular alarma:", err);
    }
  };

  // Dibujar el plano en el canvas
  const drawFloorPlan = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const currentFloor = floorPlanConfig[selectedFloor];

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar habitaciones
    currentFloor.rooms.forEach(room => {
      // Color según tipo de habitación
      const colors = {
        office: '#e0f2fe',
        meeting: '#f3e8ff',
        reception: '#fef3c7',
        elevator: '#fecaca',
        parking: '#dcfce7',
        warehouse: '#fef7cd',
        executive: '#e0e7ff',
        conference: '#ecfdf5',
        cafe: '#fef2f2',
        gate: '#f0f9ff',
        security: '#fef2f2'
      };

      ctx.fillStyle = colors[room.type] || '#f1f5f9';
      ctx.fillRect(room.x, room.y, room.width, room.height);
      
      // Borde
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(room.x, room.y, room.width, room.height);

      // Nombre de la habitación
      ctx.fillStyle = '#334155';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(room.name, room.x + room.width / 2, room.y + room.height / 2 + 4);
    });

    // Dibujar personas
    people.filter(p => p.indoorPosition?.floor === selectedFloor).forEach(person => {
      const pos = person.indoorPosition;
      if (!pos) return;

      // Color del marcador según estado
      const markerColor = person.status === 'alarm' ? '#ef4444' : '#22c55e';
      
      // Círculo de la persona
      ctx.fillStyle = markerColor;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI);
      ctx.fill();
      
      // Borde blanco
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inicial del nombre
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(person.name.charAt(0), pos.x, pos.y + 4);

      // Indicador de alarma
      if (person.status === 'alarm') {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(pos.x + 20, pos.y - 20, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('!', pos.x + 20, pos.y - 16);
      }
    });

    // Dibujar leyenda
    drawLegend(ctx);
  };

  // Dibujar leyenda
  const drawLegend = (ctx) => {
    const legendX = 680;
    const legendY = 20;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(legendX, legendY, 200, 120);
    
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX, legendY, 200, 120);

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Leyenda:', legendX + 10, legendY + 20);

    // Persona activa
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(legendX + 20, legendY + 40, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#334155';
    ctx.font = '12px Arial';
    ctx.fillText('Persona Activa', legendX + 35, legendY + 45);

    // Persona en alarma
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(legendX + 20, legendY + 60, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#334155';
    ctx.font = '12px Arial';
    ctx.fillText('Persona en Alarma', legendX + 35, legendY + 65);

    // Habitación
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(legendX + 15, legendY + 75, 16, 16);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(legendX + 15, legendY + 75, 16, 16);
    ctx.fillStyle = '#334155';
    ctx.font = '12px Arial';
    ctx.fillText('Habitación', legendX + 35, legendY + 87);
  };

  // Animar el movimiento de las personas
  const animatePeople = () => {
    setPeople(prevPeople => 
      prevPeople.map(person => {
        if (person.indoorPosition) {
          const room = floorPlanConfig[person.indoorPosition.floor]?.rooms.find(r => r.id === person.indoorPosition.roomId);
          if (room) {
            // Mover dentro de los límites de la habitación
            const newX = person.indoorPosition.x + (Math.random() - 0.5) * 4;
            const newY = person.indoorPosition.y + (Math.random() - 0.5) * 4;
            
            return {
              ...person,
              indoorPosition: {
                ...person.indoorPosition,
                x: Math.max(room.x + 15, Math.min(room.x + room.width - 15, newX)),
                y: Math.max(room.y + 15, Math.min(room.y + room.height - 15, newY))
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

  // Redibujar cuando cambien las personas o el piso
  useEffect(() => {
    if (canvasRef.current) {
      drawFloorPlan();
    }
  }, [people, selectedFloor]);

  // Manejar click en el canvas
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Buscar persona clickeada
    const clickedPerson = people.find(person => {
      if (person.indoorPosition?.floor === selectedFloor) {
        const distance = Math.sqrt(
          Math.pow(x - person.indoorPosition.x, 2) + 
          Math.pow(y - person.indoorPosition.y, 2)
        );
        return distance <= 20;
      }
      return false;
    });

    if (clickedPerson && onPersonSelect) {
      onPersonSelect(clickedPerson);
    }
  };

  if (isLoading && people.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando plano indoor...</p>
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
              Plano Indoor
            </h1>
            <p className="text-gray-600">Monitoreo en tiempo real de personas</p>
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
                onChange={(e) => handleFloorChange(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                {Object.keys(floorPlanConfig).map(floor => (
                  <option key={floor} value={floor}>
                    Piso {floor} - {floorPlanConfig[floor].name}
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
        <canvas
          ref={canvasRef}
          width={900}
          height={600}
          className="border border-gray-300 rounded-lg shadow-lg bg-white cursor-pointer w-full h-full"
          onClick={handleCanvasClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}
