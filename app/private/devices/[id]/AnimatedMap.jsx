'use client'

import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Circle, ImageOverlay, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { beacons } from '@/lib/beacons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    PlayIcon,
    PauseIcon,
    ArrowPathIcon,
    ForwardIcon,
    BackwardIcon,
    ClockIcon,
    MapPinIcon,
    SignalIcon,
    Battery100Icon
} from '@heroicons/react/24/outline'

export default function AnimatedMap({ data, deviceId }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1000) // milliseconds between frames
    const intervalRef = useRef(null)

    // Invertir el array para que el más antiguo esté primero
    const sortedData = [...data]

    const currentPoint = sortedData[currentIndex]
    const currentBeacon = beacons.find(
        beacon => beacon.mac.toLowerCase() === currentPoint.pos_data.mac.toLowerCase()
    )

    // Crear path de las posiciones visitadas hasta ahora
    const pathPositions = sortedData
        .slice(0, currentIndex + 1)
        .map(item => {
            const beacon = beacons.find(b => b.mac.toLowerCase() === item.pos_data.mac.toLowerCase())
            return beacon?.position
        })
        .filter(Boolean)

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => {
                    if (prev >= sortedData.length - 1) {
                        setIsPlaying(false)
                        return prev
                    }
                    return prev + 1
                })
            }, speed)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isPlaying, speed, sortedData.length])

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    const handleReset = () => {
        setIsPlaying(false)
        setCurrentIndex(0)
    }

    const handleNext = () => {
        if (currentIndex < sortedData.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    const getBatteryColor = (battery) => {
        if (battery >= 70) return "from-[#29f57e] to-emerald-500"
        if (battery >= 30) return "from-yellow-400 to-yellow-500"
        return "from-red-400 to-red-500"
    }

    const progress = ((currentIndex + 1) / sortedData.length) * 100

    return (
        <div className="space-y-4">
            {/* Controles de reproducción */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                <div className="flex flex-col gap-4">
                    {/* Información del punto actual */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                            <ClockIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium">Fecha</p>
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {new Date(currentPoint.created_at).toLocaleString('es-CL')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                            <MapPinIcon className="w-5 h-5 text-teal-600 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium">Ubicación</p>
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {currentBeacon?.name.toUpperCase()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                            <Battery100Icon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium">Batería</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${getBatteryColor(currentPoint.battery)} transition-all`}
                                            style={{ width: `${currentPoint.battery}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{currentPoint.battery}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                            <SignalIcon className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium">RSSI</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {currentPoint.pos_data.rssi} dBm
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-600">
                                Registro {currentIndex + 1} de {sortedData.length}
                            </span>
                            <Badge variant="outline" className="text-xs">
                                {progress.toFixed(1)}%
                            </Badge>
                        </div>
                        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={sortedData.length - 1}
                            value={currentIndex}
                            onChange={(e) => {
                                setIsPlaying(false)
                                setCurrentIndex(parseInt(e.target.value))
                            }}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #29f57e ${progress}%, #e5e7eb ${progress}%)`
                            }}
                        />
                    </div>

                    {/* Controles de reproducción */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex gap-2">
                            <Button
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                variant="outline"
                                size="sm"
                                className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300"
                            >
                                <BackwardIcon className="w-4 h-4" />
                            </Button>

                            <Button
                                onClick={handlePlayPause}
                                className="bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 hover:shadow-lg hover:shadow-emerald-200"
                                size="sm"
                            >
                                {isPlaying ? (
                                    <><PauseIcon className="w-4 h-4 mr-2" /> Pausar</>
                                ) : (
                                    <><PlayIcon className="w-4 h-4 mr-2" /> Reproducir</>
                                )}
                            </Button>

                            <Button
                                onClick={handleNext}
                                disabled={currentIndex === sortedData.length - 1}
                                variant="outline"
                                size="sm"
                                className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300"
                            >
                                <ForwardIcon className="w-4 h-4" />
                            </Button>

                            <Button
                                onClick={handleReset}
                                variant="outline"
                                size="sm"
                                className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300"
                            >
                                <ArrowPathIcon className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Control de velocidad */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 font-medium">Velocidad:</span>
                            <select
                                value={speed}
                                onChange={(e) => setSpeed(parseInt(e.target.value))}
                                className="text-xs border-2 border-gray-200 focus:border-emerald-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                            >
                                <option value={2000}>0.5x</option>
                                <option value={1000}>1x</option>
                                <option value={500}>2x</option>
                                <option value={250}>4x</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mapa */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden" style={{ height: '500px' }}>
                <MapContainer
                    center={[-33.49541062600386, -70.59621166108582]}
                    zoom={22.4}
                    scrollWheelZoom={false}
                    zoomControl={false}
                    style={{ width: "100%", height: "100%", zIndex: 30 }}
                    className="z-0"
                    doubleClickZoom={false}
                >
                    <TileLayer
                        maxZoom={22.4}
                        minZoom={18}
                        noWrap={true}
                        detectRetina={true}
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
                    />
                    <ImageOverlay
                        url="/gemini_rotated.png"
                        alt="Map"
                        opacity={1}
                        bounds={[
                            [-33.49539976885145, -70.59633963804193],
                            [-33.49532148169527, -70.59614182512233],
                            [-33.49543332046814, -70.59608549873165],
                            [-33.49551272590918, -70.59628934662167]
                        ]}
                    />

                    {/* Mostrar todos los beacons como referencia */}
                    {/* {beacons.map((beacon) => (
                        <Circle
                            key={beacon.mac}
                            center={beacon.position}
                            radius={0.5}
                            color={beacon.color}
                            fillOpacity={0.3}
                            weight={1}
                        />
                    ))} */}

                    {/* Path recorrido (línea) */}
                    {pathPositions.length > 1 && (
                        <Polyline
                            positions={pathPositions}
                            color="#29f57e"
                            weight={3}
                            opacity={0.7}
                            dashArray="5, 10"
                        />
                    )}

                    {/* Posición actual del dispositivo */}
                    {currentBeacon && (
                        <Circle
                            center={currentBeacon.position}
                            radius={1}
                            color="#29f57e"
                            fillColor="#29f57e"
                            fillOpacity={0.8}
                            weight={3}
                            className="animate-pulse"
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    )
}

