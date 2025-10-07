'use client'
import { useState } from "react";
import dynamic from "next/dynamic";
import { beacons } from "@/lib/beacons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as XLSX from 'xlsx';
import {
    Battery100Icon,
    SignalIcon,
    ClockIcon,
    MapPinIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const Map = dynamic(() => import("./Map"), {
    ssr: false
});

export default function DeviceDetails({ id, data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calcular paginación
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    // Función para exportar a Excel
    const exportToExcel = () => {
        // Preparar datos para exportar
        const exportData = data.map(item => ({
            'Fecha y Hora': new Date(item.created_at).toLocaleString("es-CL"),
            'Batería (%)': item.battery,
            'Beacon más cercano': beacons.find(beacon => beacon.mac.toLowerCase() === item.pos_data.mac.toLowerCase())?.name.toUpperCase() || 'N/A',
            'RSSI': item.pos_data.rssi
        }));

        // Crear libro de trabajo
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Log Data");

        // Descargar archivo
        XLSX.writeFile(wb, `device_${id}_log_data.xlsx`);
    };

    // Función para determinar el color de la batería
    const getBatteryColor = (battery) => {
        if (battery >= 70) return "bg-gradient-to-r from-[#29f57e] to-emerald-500";
        if (battery >= 30) return "bg-yellow-500";
        return "bg-red-500";
    };

    // Función para determinar el color del badge de batería
    const getBatteryBadgeVariant = (battery) => {
        if (battery >= 70) return "default";
        if (battery >= 30) return "secondary";
        return "destructive";
    };

    const currentBeacon = beacons.find(beacon => beacon.mac.toLowerCase() === data[0].pos_data.mac.toLowerCase());

    return (
        <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100 min-h-screen">
            {/* Header con título y badge */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#29f57e] via-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                        <SignalIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#29f57e] via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                            Device {id}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Monitoreo en tiempo real</p>
                    </div>
                </div>

            </div>

            {/* Sección de datos actuales y mapa */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card de datos actuales */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 p-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <ClockIcon className="w-5 h-5" />
                            Datos Actuales
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {/* Última actualización */}
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <ClockIcon className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Última actualización</p>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                    {new Date(data[0].created_at).toLocaleString("es-CL")}
                                </p>
                            </div>
                        </div>

                        {/* Batería */}
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
                            <div className={`w-10 h-10 rounded-lg ${data[0].battery >= 70 ? 'bg-gradient-to-br from-[#29f57e] to-emerald-500' : data[0].battery >= 30 ? 'bg-yellow-100' : 'bg-red-100'} flex items-center justify-center flex-shrink-0`}>
                                <Battery100Icon className={`w-5 h-5 ${data[0].battery >= 70 ? 'text-white' : data[0].battery >= 30 ? 'text-yellow-600' : 'text-red-600'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Nivel de batería</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${getBatteryColor(data[0].battery)} transition-all duration-300`}
                                            style={{ width: `${data[0].battery}%` }}
                                        />
                                    </div>
                                    <Badge variant={getBatteryBadgeVariant(data[0].battery)} className="font-semibold">
                                        {data[0].battery}%
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Beacon más cercano */}
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                                <MapPinIcon className="w-5 h-5 text-teal-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Beacon más cercano</p>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                    {currentBeacon?.name.toUpperCase()}
                                </p>
                            </div>
                        </div>

                        {/* RSSI */}
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                                <SignalIcon className="w-5 h-5 text-cyan-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Intensidad de señal (RSSI)</p>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                    {data[0].pos_data.rssi} dBm
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mapa */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 via-[#29f57e] to-emerald-500 p-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <MapPinIcon className="w-5 h-5" />
                            Ubicación Actual
                        </h3>
                    </div>
                    <div className="h-[calc(100%-60px)]">
                        <Map data={{
                            ...data[0],
                            position: currentBeacon?.position,
                            color: currentBeacon?.color
                        }} />
                    </div>
                </div>
            </section>

            {/* Sección de Log Data con tabla */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 via-[#29f57e] to-teal-500 p-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <ClockIcon className="w-5 h-5" />
                        Historial de Registros
                    </h3>
                    <Button
                        onClick={exportToExcel}
                        className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-md hover:shadow-lg transition-all"
                        size="sm"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                        Exportar a Excel
                    </Button>
                </div>

                <div className="p-6">
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead className="font-semibold text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <ClockIcon className="w-4 h-4" />
                                            Fecha y Hora
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Battery100Icon className="w-4 h-4" />
                                            Batería
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <MapPinIcon className="w-4 h-4" />
                                            Beacon
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <SignalIcon className="w-4 h-4" />
                                            RSSI
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentData.map((item, index) => {
                                    const beacon = beacons.find(b => b.mac.toLowerCase() === item.pos_data.mac.toLowerCase());
                                    return (
                                        <TableRow key={index} className="hover:bg-emerald-50/50 transition-colors">
                                            <TableCell className="font-medium text-gray-700">
                                                {new Date(item.created_at).toLocaleString("es-CL")}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 max-w-[80px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${getBatteryColor(item.battery)} transition-all`}
                                                            style={{ width: `${item.battery}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-700">{item.battery}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-medium hover:bg-emerald-50 transition-colors">
                                                    {beacon?.name.toUpperCase() || 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-700">
                                                {item.pos_data.rssi} dBm
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Controles de paginación mejorados */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                        <div className="text-sm text-gray-600 font-medium">
                            Mostrando <span className="font-bold text-emerald-600">{startIndex + 1}</span> - <span className="font-bold text-emerald-600">{Math.min(endIndex, data.length)}</span> de <span className="font-bold text-gray-900">{data.length}</span> registros
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                variant="outline"
                                size="sm"
                                className="gap-1 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                                Anterior
                            </Button>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
                                <span className="text-sm font-semibold text-gray-700">
                                    Página <span className="text-emerald-600 font-bold">{currentPage}</span> de <span className="text-gray-900">{totalPages}</span>
                                </span>
                            </div>
                            <Button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                variant="outline"
                                size="sm"
                                className="gap-1 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
                            >
                                Siguiente
                                <ChevronRightIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}