"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PeopleList from "@/app/components/PeopleList";
import ControlPanel from "@/app/components/ControlPanel";
import TrackingAreas from "@/app/components/TrackingAreas";
import PersonDetailsModal from "@/app/components/PersonDetailsModal";
import {
  fetchTrackingData,
  simulateAlarm
} from "@/app/services/trackingService";
import IndoorFloorPlan from "@/app/components/IndoorFloorPlan";

// Importación dinámica del plano real para evitar problemas de SSR
const RealFloorPlan = dynamic(() => import("@/app/components/RealFloorPlan"), {
  ssr: false,
  loading: () =>
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">Cargando plano real...</p>
      </div>
    </div>
});

export default function Home() {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedView, setSelectedView] = useState("real");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para actualizar la lista de personas
  const handlePeopleUpdate = updatedPeople => {
    setPeople(updatedPeople);
  };

  // Función para seleccionar una persona
  const handlePersonSelect = person => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPerson(null);
  };

  // Función para refrescar datos manualmente
  const handleRefreshData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchTrackingData();
      if (response.success) {
        setPeople(response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error al refrescar datos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para simular alarma
  const handleSimulateAlarm = async () => {
    try {
      if (people.length > 0) {
        const randomPerson = people[Math.floor(Math.random() * people.length)];
        await simulateAlarm(randomPerson.id);
        // Refrescar datos después de simular la alarma
        await handleRefreshData();
      }
    } catch (err) {
      console.error("Error al simular alarma:", err);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    handleRefreshData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                DigiPlus Indoor Tracking
              </h1>
              <p className="text-gray-600 mt-1">
                Sistema de monitoreo en tiempo real de personas en espacios
                interiores
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                {/* <div className="text-sm text-gray-500">
                  Última actualización
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleTimeString()}
                </div> */}
              </div>

              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          {/* Panel de Control - Columna izquierda */}
          {/* <div className="lg:col-span-1 space-y-6">
            <ControlPanel
              people={people}
              onRefreshData={handleRefreshData}
              onSimulateAlarm={handleSimulateAlarm}
            />

            <PeopleList people={people} onPersonSelect={handlePersonSelect} />
          </div> */}

          {/* Plano Real - Columna central */}
          <div className="">
            <div className="flex justify-end gap-4 mb-4">
              <button
                className={`px-4 py-2 rounded transition-colors ${selectedView ===
                "real"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => setSelectedView("real")}
              >
                Plano Real
              </button>
              <button
                className={`px-4 py-2 rounded transition-colors ${selectedView ===
                "indoor"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                onClick={() => setSelectedView("indoor")}
              >
                Plano Indoor
              </button>
            </div>
            {selectedView === "real"
              ? <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <RealFloorPlan
                    onPeopleUpdate={handlePeopleUpdate}
                    onPersonSelect={handlePersonSelect}
                    selectedFloor={selectedFloor}
                    onFloorChange={setSelectedFloor}
                  />
                </div>
              : <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <IndoorFloorPlan
                    onPeopleUpdate={handlePeopleUpdate}
                    onPersonSelect={handlePersonSelect}
                    selectedFloor={selectedFloor}
                    onFloorChange={setSelectedFloor}
                  />
                </div>}
          </div>

          {/* Áreas de Tracking - Columna derecha */}
          <div className="">
            <TrackingAreas people={people} selectedFloor={selectedFloor} />
          </div>
        </div>

        {/* Modal de detalles de la persona */}
        <PersonDetailsModal
          person={selectedPerson}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </main>
    </div>
  );
}
