"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { fetchTrackingData, simulateAlarm } from "../services/trackingService";

// Importación dinámica de react-leaflet para evitar problemas de SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then(mod => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then(mod => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), {
  ssr: false
});

const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), {
  ssr: false
});

export default function TrackingMap({ onPeopleUpdate, onPersonSelect }) {
  const [people, setPeople] = useState([]);
  const [mapCenter] = useState([19.4326, -99.1332]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  // Función para obtener datos del proveedor
  const fetchPersonData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchTrackingData();
      if (response.success) {
        setPeople(response.data);
        if (onPeopleUpdate) {
          onPeopleUpdate(response.data);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Error al obtener datos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para simular alarma
  const handleSimulateAlarm = async () => {
    try {
      // Simular alarma en una persona aleatoria
      const randomPerson = people[Math.floor(Math.random() * people.length)];
      if (randomPerson) {
        await simulateAlarm(randomPerson.id);
        // Refrescar datos después de simular la alarma
        await fetchPersonData();
      }
    } catch (err) {
      console.error("Error al simular alarma:", err);
    }
  };

  // Configurar actualizaciones automáticas
  useEffect(() => {
    // Cargar datos iniciales
    fetchPersonData();

    // Configurar intervalo de actualización
    intervalRef.current = setInterval(fetchPersonData, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Función para centrar el mapa en una persona específica
  const centerOnPerson = person => {
    if (onPersonSelect) {
      onPersonSelect(person);
    }
  };

  const getMarkerIcon = status => {
    if (status === "alarm") {
      return "🔴"; // Rojo para alarmas
    }
    return "🟢"; // Verde para estado normal
  };

  const getMarkerColor = status => {
    if (status === "alarm") {
      return "red";
    }
    return "green";
  };

  if (isLoading && people.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos de tracking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <div className="bg-white p-4 border-b shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Sistema de Tracking en Tiempo Real
            </h1>
            <p className="text-gray-600">Monitoreo de personas en el lugar</p>
          </div>

          <div className="flex items-center space-x-4">
            {error &&
              <div className="text-red-600 text-sm bg-red-50 px-3 py-1 rounded">
                Error: {error}
              </div>}

            <button
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
            </button>
          </div>
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={18}
        style={{
          height: "600px",
          width: "100%",
          minWidth: "600px"
        }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        {people.map(person =>
          <Marker
            key={person.id}
            position={person.position}
            eventHandlers={{
              click: () => centerOnPerson(person)
            }}
          >
            <Popup>
              <div className="text-center min-w-[200px]">
                <div className="text-2xl mb-2">
                  {getMarkerIcon(person.status)}
                </div>
                <h3 className="font-bold text-lg">
                  {person.name}
                </h3>
                <p className="text-gray-600">
                  {person.department}
                </p>
                <p className="text-sm text-gray-500">
                  Tarjeta: {person.cardId}
                </p>
                <p className="text-sm text-gray-500">
                  Batería: {Math.round(person.battery)}%
                </p>
                <p className="text-sm text-gray-500">
                  Última actualización: {person.lastUpdate.toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-500">
                  Coordenadas: {person.position[0].toFixed(6)},{" "}
                  {person.position[1].toFixed(6)}
                </p>
                <div
                  className={`mt-2 px-2 py-1 rounded text-xs font-medium ${person.status ===
                  "alarm"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"}`}
                >
                  {person.status === "alarm" ? "ALARMA" : "ACTIVO"}
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
