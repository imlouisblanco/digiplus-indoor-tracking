"use client";

import { useState } from "react";

export default function ControlPanel({
  people,
  onRefreshData,
  onSimulateAlarm
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(3000);

  const activePeople = people.filter(p => p.status === "active").length;
  const alarmPeople = people.filter(p => p.status === "alarm").length;
  const totalPeople = people.length;

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSimulateAlarm = () => {
    if (onSimulateAlarm) {
      onSimulateAlarm();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Panel de Control</h2>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {totalPeople}
          </div>
          <div className="text-sm text-blue-600">Total</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {activePeople}
          </div>
          <div className="text-sm text-green-600">Activos</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {alarmPeople}
          </div>
          <div className="text-sm text-red-600">Alarmas</div>
        </div>
      </div>

      {/* Controles */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intervalo de Actualización (ms)
          </label>
          <input
            type="number"
            value={refreshInterval}
            onChange={e => setRefreshInterval(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1000"
            max="30000"
            step="1000"
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? "Actualizando..." : "Actualizar Datos"}
          </button>

          <button
            onClick={handleSimulateAlarm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Simular Alarma
          </button>
        </div>
      </div>

      {/* Información del sistema */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-2">Estado del Sistema</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            • Conectado al proveedor: <span className="text-green-600">✓</span>
          </div>
          {/* <div>• Última sincronización: {new Date().toLocaleTimeString()}</div> */}
          <div>• Modo: Simulación</div>
        </div>
      </div>
    </div>
  );
}
