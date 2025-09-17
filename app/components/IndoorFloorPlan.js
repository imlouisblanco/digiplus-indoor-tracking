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

  // Configuración del plano indoor basado en la imagen
  const floorPlanConfig = {
    1: {
      name: "Planta Principal",
      rooms: [
        // Living (área grande a la izquierda)
        { id: "living", name: "Living", x: 50, y: 200, width: 300, height: 250, type: "living" },
        
        // Pieza 4 (arriba al centro)
        { id: "pieza4", name: "Pieza 4", x: 400, y: 50, width: 200, height: 120, type: "bedroom" },
        
        // Pieza 3 (centro derecha)
        { id: "pieza3", name: "Pieza 3", x: 550, y: 200, width: 200, height: 150, type: "bedroom" },
        
        // Pieza 2 (derecha)
        { id: "pieza2", name: "Pieza 2", x: 750, y: 200, width: 120, height: 150, type: "bedroom" },
        
        // Pieza 1 (abajo derecha)
        { id: "pieza1", name: "Pieza 1", x: 750, y: 400, width: 120, height: 150, type: "bedroom" },
        
        // Despensa (abajo izquierda)
        { id: "despensa", name: "Despensa", x: 50, y: 480, width: 120, height: 100, type: "pantry" },
        
        // Pieza 5 (centro abajo)
        { id: "pieza5", name: "Pieza 5", x: 400, y: 480, width: 120, height: 100, type: "bedroom" },
        
        // Baño 2 (centro abajo)
        { id: "bano2", name: "Baño 2", x: 550, y: 480, width: 80, height: 100, type: "bathroom" },
        
        // Baño 1 (centro abajo)
        { id: "bano1", name: "Baño 1", x: 650, y: 480, width: 80, height: 100, type: "bathroom" },
        
        // Cocina (abajo centro-derecha)
        { id: "cocina", name: "Cocina", x: 200, y: 580, width: 450, height: 120, type: "kitchen" }
      ],
      doors: [
        // Puertas exteriores
        { x: 620, y: 50, width: 15, height: 30, type: "exterior" },
        { x: 870, y: 350, width: 30, height: 15, type: "exterior" },
        { x: 870, y: 750, width: 30, height: 15, type: "exterior" },
        { x: 200, y: 750, width: 30, height: 15, type: "exterior" }
      ],
      windows: [
        // Ventanas exteriores
        { x: 50, y: 250, width: 15, height: 40, type: "window" },
        { x: 50, y: 350, width: 15, height: 40, type: "window" },
        { x: 870, y: 250, width: 15, height: 40, type: "window" },
        { x: 870, y: 450, width: 15, height: 40, type: "window" },
        { x: 450, y: 50, width: 40, height: 15, type: "window" },
        { x: 250, y: 720, width: 40, height: 15, type: "window" },
        { x: 550, y: 720, width: 40, height: 15, type: "window" }
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
      "Desarrollo": { floor: 1, room: "living" },
      "Marketing": { floor: 1, room: "pieza3" },
      "Ventas": { floor: 1, room: "pieza2" },
      "Recursos Humanos": { floor: 1, room: "pieza1" },
      "Finanzas": { floor: 1, room: "pieza4" },
      "Administración": { floor: 1, room: "pieza5" },
      "Cocina": { floor: 1, room: "cocina" },
      "Limpieza": { floor: 1, room: "despensa" }
    };

    const roomInfo = roomMap[department] || { floor: 1, room: "living" };
    const room = floorPlanConfig[roomInfo.floor].rooms.find(r => r.id === roomInfo.room);
    
    if (room) {
      return {
        x: room.x + Math.random() * room.width,
        y: room.y + Math.random() * room.height,
        floor: roomInfo.floor,
        roomId: room.id
      };
    }

    return { x: 200, y: 200, floor: 1, roomId: "living" };
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
        living: '#e0f2fe',      // Azul claro para living
        bedroom: '#f3e8ff',     // Morado claro para piezas
        kitchen: '#fef3c7',     // Amarillo claro para cocina
        bathroom: '#ecfdf5',    // Verde claro para baños
        pantry: '#fef7cd',      // Amarillo más claro para despensa
        office: '#e0e7ff',      // Azul-morado para oficinas
        meeting: '#f0f9ff',     // Azul muy claro para reuniones
        reception: '#fef2f2'    // Rosa claro para recepción
      };

      ctx.fillStyle = colors[room.type] || '#f1f5f9';
      ctx.fillRect(room.x, room.y, room.width, room.height);
      
      // Borde de la habitación
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(room.x, room.y, room.width, room.height);

      // Nombre de la habitación
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(room.name, room.x + room.width / 2, room.y + room.height / 2 + 5);
    });

    // Dibujar puertas
    if (currentFloor.doors) {
      currentFloor.doors.forEach(door => {
        ctx.fillStyle = '#8b5cf6'; // Color morado para puertas
        ctx.fillRect(door.x, door.y, door.width, door.height);
        
        // Borde de la puerta
        ctx.strokeStyle = '#6d28d9';
        ctx.lineWidth = 1;
        ctx.strokeRect(door.x, door.y, door.width, door.height);
      });
    }

    // Dibujar ventanas
    if (currentFloor.windows) {
      currentFloor.windows.forEach(window => {
        ctx.fillStyle = '#06b6d4'; // Color cyan para ventanas
        ctx.fillRect(window.x, window.y, window.width, window.height);
        
        // Borde de la ventana
        ctx.strokeStyle = '#0891b2';
        ctx.lineWidth = 1;
        ctx.strokeRect(window.x, window.y, window.width, window.height);
      });
    }

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
    //drawLegend(ctx);
  };

  // Dibujar leyenda
  const drawLegend = (ctx) => {
    const legendX = 680;
    const legendY = 20;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(legendX, legendY, 200, 180);
    
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX, legendY, 200, 180);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Leyenda:', legendX + 10, legendY + 20);

    let yOffset = 40;

    // Persona activa
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(legendX + 20, legendY + yOffset, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.font = '11px Arial';
    ctx.fillText('Persona Activa', legendX + 35, legendY + yOffset + 4);
    yOffset += 20;

    // Persona en alarma
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(legendX + 20, legendY + yOffset, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.font = '11px Arial';
    ctx.fillText('Persona en Alarma', legendX + 35, legendY + yOffset + 4);
    yOffset += 20;

    // Living
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(legendX + 15, legendY + yOffset - 8, 16, 12);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(legendX + 15, legendY + yOffset - 8, 16, 12);
    ctx.fillStyle = '#1e293b';
    ctx.font = '11px Arial';
    ctx.fillText('Living', legendX + 35, legendY + yOffset);
    yOffset += 18;

    // Pieza
    ctx.fillStyle = '#f3e8ff';
    ctx.fillRect(legendX + 15, legendY + yOffset - 8, 16, 12);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(legendX + 15, legendY + yOffset - 8, 16, 12);
    ctx.fillStyle = '#1e293b';
    ctx.font = '11px Arial';
    ctx.fillText('Pieza', legendX + 35, legendY + yOffset);
    yOffset += 18;

    // Cocina
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(legendX + 15, legendY + yOffset - 8, 16, 12);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(legendX + 15, legendY + yOffset - 8, 16, 12);
    ctx.fillStyle = '#1e293b';
    ctx.font = '11px Arial';
    ctx.fillText('Cocina', legendX + 35, legendY + yOffset);
    yOffset += 18;

    // Baño
    ctx.fillStyle = '#ecfdf5';
    ctx.fillRect(legendX + 15, legendY + yOffset - 8, 16, 12);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(legendX + 15, legendY + yOffset - 8, 16, 12);
    ctx.fillStyle = '#1e293b';
    ctx.font = '11px Arial';
    ctx.fillText('Baño', legendX + 35, legendY + yOffset);
    yOffset += 18;

    // Puerta
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(legendX + 15, legendY + yOffset - 6, 16, 8);
    ctx.strokeStyle = '#6d28d9';
    ctx.strokeRect(legendX + 15, legendY + yOffset - 6, 16, 8);
    ctx.fillStyle = '#1e293b';
    ctx.font = '11px Arial';
    ctx.fillText('Puerta', legendX + 35, legendY + yOffset);
    yOffset += 18;

    // Ventana
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(legendX + 15, legendY + yOffset - 6, 16, 8);
    ctx.strokeStyle = '#0891b2';
    ctx.strokeRect(legendX + 15, legendY + yOffset - 6, 16, 8);
    ctx.fillStyle = '#1e293b';
    ctx.font = '11px Arial';
    ctx.fillText('Ventana', legendX + 35, legendY + yOffset);
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
      <div className="p-4 border-b shadow-sm bg-white">
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
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 bg-white">
        <canvas
          ref={canvasRef}
          width={900}
          height={800}
          className="border border-gray-300 rounded-lg shadow-lg cursor-pointer w-full h-full"
          onClick={handleCanvasClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}
