"use client";
import dynamic from "next/dynamic";
const IndoorMap = dynamic(() => import("@/app/components/IndoorMap"), {
  ssr: false
});

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b">
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
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="mx-auto px-4 py-6 w-full">
        <div className="flex flex-col gap-6">
          <IndoorMap />
        </div>
      </main>
    </div>
  );
}
