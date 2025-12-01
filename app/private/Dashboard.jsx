'use client'
import dynamic from "next/dynamic";
import { ChartBarIcon } from '@heroicons/react/24/outline';

const IndoorKonva = dynamic(() => import("@/app/components/IndoorKonva"), {
    ssr: false
});

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
                </div>
            </main >
        </div >
    );
}
