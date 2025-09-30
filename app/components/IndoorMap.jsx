'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const IndoorMap = ({ latestData, lastUpdate }) => {
    return (
        <div className="h-full w-full xl:col-span-9">
            <MapContainer center={[-33.49541062600386, -70.59621166108582]} zoom={22} scrollWheelZoom={false}
                zoomControl={false}
                style={{ width: "100%", height: "100%", minHeight: "40rem", zIndex: 30 }}
                className="z-0"
            >
                <TileLayer
                    maxZoom={22}
                    minZoom={18}
                    noWrap={true}
                    detectRetina={true}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
                />
                <ImageOverlay
                    url="/plano.png"
                    alt="Map"
                    opacity={0.75}
                    bounds={[
                        [-33.49539976885145, -70.59633963804193],
                        [-33.49532148169527, -70.59614182512233],
                        [-33.49543332046814, -70.59608549873165],
                        [-33.49551272590918, -70.59628934662167]
                    ]}
                />
                {latestData.map(device => (
                    <Circle className='animate-pulse' key={device.id} color={device.color} fillOpacity={1} center={device.position} radius={0.5}>
                        <Popup>
                            <div className='flex flex-col'>
                                <div className='flex flex-row items-center gap-2'><p className='font-bold'>Device ID:</p><p>{device.device_id}</p></div>
                                <div className='flex flex-row items-center gap-2'><p className='font-bold'>Closest Beacon:</p><p>{device.closest_beacon}</p></div>
                                <div className='flex flex-row items-center gap-2'><p className='font-bold'>Closest Beacon RSSI:</p><p>{device.pos_data.rssi}</p></div>
                                <div className='flex flex-row items-center gap-2'><p className='font-bold'>Battery:</p><p>{device.battery} %</p></div>
                                <div className='flex flex-row items-center gap-2'><p className='font-bold'>Device EUID:</p><p>{device.device_euid}</p></div>
                                <div className='flex flex-row items-center gap-2'><p className='font-bold'>Updated at:</p><p>{new Date(device.created_at).toLocaleString('es-CL')}</p></div>
                            </div>
                        </Popup>
                    </Circle>
                ))}

                <div className='absolute right-1 top-1 z-[999] bg-white p-2 rounded-lg'>
                    <p className='text-xs text-gray-500'>Última actualización: {lastUpdate.toLocaleString('es-CL')}</p>
                </div>
            </MapContainer>
        </div>
    )
}

export default IndoorMap