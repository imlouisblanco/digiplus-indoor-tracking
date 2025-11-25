'use client'
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import {
    MapPinIcon,
    CpuChipIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

const IndoorKonva = dynamic(() => import("@/app/components/IndoorKonva"), {
    ssr: false
});

const updateInterval = 60000;

const BeaconCard = ({ beacon, devices }) => {
    return (
        <div className="group flex flex-col gap-3 p-4 bg-white border-2 border-gray-100 hover:border-emerald-200 rounded-xl hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${beacon.background} flex items-center justify-center shadow-md`}>
                        <MapPinIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{beacon.name}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                            {devices.length} {devices.length !== 1 ? "dispositivos" : "dispositivo"}
                        </Badge>
                    </div>
                </div>
            </div>

            {devices.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {devices.map(device => (
                        <div key={device.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
                            <CpuChipIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <p className="text-sm font-medium text-gray-700">{device.device_id}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-3 text-center">
                    <p className="text-xs text-gray-400">Sin dispositivos</p>
                </div>
            )}
        </div>
    );
};

export default function Dashboard() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100">
            <main className="mx-auto px-6 py-6 w-full">
                <div className="flex flex-col gap-6">
                    {/* Header moderno */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#29f57e] via-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                <ChartBarIcon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#29f57e] via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                                    Dashboard
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">Monitoreo en tiempo real de dispositivos</p>
                            </div>
                        </div>
                    </div>

                    <IndoorKonva />

                    {/* Contenido principal */}
                    {/* <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6">
                    <div className="w-full xl:col-span-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 p-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <MapPinIcon className="w-5 h-5" />
                                Ubicaciones
                            </h2>
                            <p className="text-sm text-white/90 mt-1">Distribución por beacon</p>
                        </div>
                        <div className="p-4 max-h-[calc(100vh-20rem)] overflow-y-auto">
                            <div className="flex flex-col gap-3">
                                {beacons.map((beacon) => (
                                    <BeaconCard
                                        key={beacon.mac}
                                        beacon={beacon}
                                        devices={currentData?.filter(device => device.closest_beacon === beacon.mac) || []}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-9 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r flex flex-row items-center justify-between from-teal-500 via-[#29f57e] to-emerald-500 p-4">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <ChartBarIcon className="w-5 h-5" />
                                    Vista del Plano
                                </h2>
                                <p className="text-sm text-white/90 mt-1">Visualización en tiempo real</p>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="text-white/90">{experimentalView ? "Vista Experimental" : "Vista Normal"}</span>
                                <Switch checked={experimentalView} onCheckedChange={setExperimentalView} />
                            </div>
                        </div>
                        <div className="h-[calc(100vh-16rem)]">
                            <IndoorMap viewMode={experimentalView ? "experimental" : "normal"} latestData={currentData} lastUpdate={lastUpdate} experimentalView={experimentalView} />
                        </div>
                    </div>
                </div> */}
                </div>
            </main >
        </div >
    );
}
