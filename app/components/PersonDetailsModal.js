"use client";

import { useEffect } from "react";

export default function PersonDetailsModal({ person, isOpen, onClose }) {
  // Cerrar modal con ESC
  useEffect(
    () => {
      const handleEscape = event => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        // Prevenir scroll del body
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    },
    [isOpen, onClose]
  );

  // Cerrar modal al hacer click fuera
  const handleBackdropClick = event => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !person) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {person.name}
            </h2>
            <p className="text-gray-600 mt-1">
              Información detallada de la persona
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Departamento
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  {person.department}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  ID de Tarjeta
                </label>
                <p className="text-lg text-gray-900 font-mono">
                  {person.cardId}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Estado
                </label>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${person.status ===
                  "alarm"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-green-100 text-green-800 border border-green-200"}`}
                >
                  {person.status === "alarm" ? "🚨 ALARMA" : "✅ ACTIVO"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Nivel de Batería
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${person.battery >
                      50
                        ? "bg-green-500"
                        : person.battery > 20
                          ? "bg-yellow-500"
                          : "bg-red-500"}`}
                      style={{ width: `${Math.round(person.battery)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                    {Math.round(person.battery)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información de ubicación */}
          {person.indoorPosition &&
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Ubicación en el Plano
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {person.indoorPosition.floor}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700">
                        Piso
                      </label>
                      <p className="text-lg font-semibold text-blue-800">
                        Piso {person.indoorPosition.floor}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-green-700">
                        Área
                      </label>
                      <p className="text-lg font-semibold text-green-800">
                        {person.indoorPosition.areaId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-700">
                        Coordenada X
                      </label>
                      <p className="text-lg font-semibold text-purple-800">
                        {(person.indoorPosition.x * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-orange-700">
                        Coordenada Y
                      </label>
                      <p className="text-lg font-semibold text-orange-800">
                        {(person.indoorPosition.y * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

          {/* Información adicional */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Información del Sistema
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Última Actualización
                </label>
                <p className="text-lg font-semibold text-gray-800">
                  {person.lastUpdate.toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado de Sincronización
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-lg font-semibold text-gray-800">
                    Sincronizado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del modal */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              // Aquí podrías agregar funcionalidad adicional
              console.log("Acción adicional para:", person.name);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Acciones
          </button>
        </div>
      </div>
    </div>
  );
}
