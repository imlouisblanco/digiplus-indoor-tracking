'use client'
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TimeFilter from "@/app/components/TimeFilter";
import * as XLSX from 'xlsx';
import {
    Battery100Icon,
    ClockIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowDownTrayIcon,
    FilmIcon
} from '@heroicons/react/24/outline';
import { getDeviceDataByDate } from "@/app/actions/data";

const Map = dynamic(() => import("./Map"), {
    ssr: false
});

const AnimatedMap = dynamic(() => import("./AnimatedMap"), {
    ssr: false
});

export default function DeviceDetails({ id, data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [timeFilter, setTimeFilter] = useState('12h');
    const [historyData, setHistoryData] = useState([]);
    const itemsPerPage = 10;

    const fetchHistoryData = async (startDate, endDate) => {
        const data = await getDeviceDataByDate({ deviceId: id, startDate: startDate, endDate: endDate });
        setHistoryData(data);
    };

    useEffect(() => {
        let startDate = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);
        let endDate = new Date();
        if (timeFilter === '12h') {
            startDate = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);
            endDate = new Date();
        } else if (timeFilter === '24h') {
            startDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
            endDate = new Date();
        } else if (timeFilter === '48h') {
            startDate = new Date(new Date().getTime() - 48 * 60 * 60 * 1000);
            endDate = new Date();
        }
        fetchHistoryData(startDate, endDate);
    }, [timeFilter]);


    // Calcular paginación con datos filtrados
    const totalPages = Math.ceil(historyData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = historyData.slice(startIndex, endIndex);

    // Reset página cuando cambia el filtro
    const handleFilterChange = (filter) => {
        setTimeFilter(filter);
        setCurrentPage(1);
    };

    // Función para exportar a Excel
    const exportToExcel = () => {
        // Preparar datos para exportar
        const exportData = historyData.map(item => ({
            'Fecha y Hora': new Date(item.created_at).toLocaleString("es-CL"),
            'Batería (%)': item.battery,
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

    return (
        <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100 min-h-screen">
            {/* Header con título y badge */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#29f57e] via-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#29f57e] via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                            Dispositivo {id}
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

                    </div>
                </div>
            </section>

            {/* Filtros de tiempo */}
            {/* <TimeFilter
                timeFilter={timeFilter}
                onFilterChange={handleFilterChange}
                filteredCount={historyData.length}
            /> */}

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sección de animación del recorrido */}
                {/* <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 via-[#29f57e] to-pink-600 p-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <FilmIcon className="w-5 h-5" />
                            Recorrido Histórico
                        </h3>
                        <p className="text-sm text-white/90 mt-1">Visualización animada de movimientos</p>
                    </div>
                    <div className="p-6">
                        {historyData.length > 0 ? (
                            <AnimatedMap data={historyData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))} deviceId={id} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                    <ClockIcon className="w-10 h-10 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">No hay registros en este período</p>
                                <p className="text-sm text-gray-400">Selecciona otro rango de tiempo</p>
                            </div>
                        )}
                    </div>
                </div> */}

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
                        {historyData.length > 0 ? (
                            <>
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


                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentData.map((item, index) => {
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
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Controles de paginación mejorados */}
                                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                                    <div className="text-sm text-gray-600 font-medium">
                                        Mostrando <span className="font-bold text-emerald-600">{startIndex + 1}</span> - <span className="font-bold text-emerald-600">{Math.min(endIndex, historyData.length)}</span> de <span className="font-bold text-gray-900">{historyData.length}</span> registros
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
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                    <ClockIcon className="w-10 h-10 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">No hay registros en este período para visualizar el recorrido</p>
                                <p className="text-sm text-gray-400">Selecciona otro rango de tiempo</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}