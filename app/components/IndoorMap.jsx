'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { beacons } from '@/lib/beacons'

const IndoorMap = ({ latestData, lastUpdate, viewMode }) => {
    // Group devices by exact same position to cluster overlapping points
    const positionKey = (pos) => JSON.stringify(pos)
    const groupsMap = latestData.reduce((map, device) => {
        const key = positionKey(device.position)
        if (!map.has(key)) map.set(key, [])
        map.get(key).push(device)
        return map
    }, new Map())

    const groups = Array.from(groupsMap.values())
    return (
        <div className="h-full w-full xl:col-span-9">
            <MapContainer center={[-33.4154354, -70.5885278]} zoom={22.2} scrollWheelZoom={false}
                zoomControl={false}
                style={{ width: "100%", height: "100%", minHeight: "40rem", zIndex: 30 }}
                className="z-0"
                doubleClickZoom={false}
            >
                <TileLayer
                    maxZoom={23}
                    minZoom={18}
                    noWrap={true}
                    detectRetina={true}
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
                />
                <ImageOverlay
                    url="/amsa.png"
                    alt="Map"
                    opacity={1}
                    bounds={[
                        [-33.49539976885145, -70.59633963804193],
                        [-33.49532148169527, -70.59614182512233],
                        [-33.49543332046814, -70.59608549873165],
                        [-33.49551272590918, -70.59628934662167]
                    ]}
                />
                {viewMode === "normal" ? groups.map((devicesAtPosition) => {
                    const position = devicesAtPosition[0].position
                    const key = devicesAtPosition.map(d => d.id).join('-')

                    if (devicesAtPosition.length === 1) {
                        const device = devicesAtPosition[0]
                        return (
                            <Circle key={key} color={device.color} fillOpacity={1} center={position} radius={0.5}>
                                <Popup>
                                    <div className='w-[280px] max-w-[80vw]'>
                                        <Tabs defaultValue={`device-${device.id}`}>
                                            <TabsList className="w-full overflow-x-auto flex flex-nowrap whitespace-nowrap bg-blue-600 text-white rounded-md">
                                                <TabsTrigger value={`device-${device.id}`} className='flex-1 truncate text-white data-[state=active]:bg-white data-[state=active]:text-blue-600'>
                                                    {device.device_id || device.device_euid || 'Dispositivo'}
                                                </TabsTrigger>
                                            </TabsList>
                                            <TabsContent value={`device-${device.id}`}>
                                                <div className='flex flex-col gap-1'>
                                                    <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>ID:</p><p>{device.device_id}</p></div>
                                                    <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>Beacon más cercano:</p><p>{beacons.find(beacon => beacon.mac.toLowerCase() === device.closest_beacon.toLowerCase())?.name.toUpperCase() || 'N/A'}</p></div>
                                                    <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>Beacon más cercano RSSI:</p><p>{device.pos_data.rssi}</p></div>
                                                    <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>Batería:</p><p>{device.battery} %</p></div>
                                                    <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>EUID:</p><p>{device.device_euid}</p></div>
                                                    <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>Actualizado el:</p><p>{new Date(device.created_at).toLocaleString('es-CL')}</p></div>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </div>
                                </Popup>
                            </Circle>
                        )
                    }

                    const count = devicesAtPosition.length
                    const icon = L.divIcon({
                        className: 'group-marker',
                        html: `<div style="background:#2563eb;color:white;border-radius:9999px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid white;">${count}</div>`,
                        iconSize: [28, 28],
                        iconAnchor: [14, 14]
                    })

                    return (
                        <Marker key={key} position={position} icon={icon}>
                            <Popup>
                                <div className='w-[320px] max-w-[85vw]'>
                                    <p className='font-bold mb-2'>Dispositivos en esta posición: {count}</p>
                                    <Tabs defaultValue={`device-${devicesAtPosition[0].id}`}>
                                        <TabsList className='w-full overflow-x-auto flex flex-nowrap whitespace-nowrap bg-blue-600 text-white rounded-md'>
                                            {devicesAtPosition.map((device) => (
                                                <TabsTrigger key={device.id} value={`device-${device.id}`} className='truncate max-w-[8rem] text-white data-[state=active]:bg-white data-[state=active]:text-blue-600'>
                                                    {device.device_id || device.device_euid || device.id}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                        {devicesAtPosition.map((device) => (
                                            <TabsContent key={device.id} value={`device-${device.id}`}>
                                                <div className='flex flex-col gap-1'>
                                                    <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>ID:</p><p>{device.device_id}</p></div>
                                                    <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>Beacon más cercano:</p><p>{beacons.find(beacon => beacon.mac.toLowerCase() === device.closest_beacon.toLowerCase())?.name.toUpperCase() || 'N/A'}</p></div>
                                                    <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>Beacon más cercano RSSI:</p><p>{device.pos_data.rssi}</p></div>
                                                    <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>Batería:</p><p>{device.battery} %</p></div>
                                                    <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>EUID:</p><p>{device.device_euid}</p></div>
                                                    <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>Actualizado el:</p><p>{new Date(device.created_at).toLocaleString('es-CL')}</p></div>
                                                </div>
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                </div>
                            </Popup>
                        </Marker>
                    )
                }) : latestData.map((device) => {
                    return (
                        <Circle key={device.id} center={device.estimated_position} radius={0.5} color={'white'} fillOpacity={1} fillColor='rgba(37, 99, 235, 1)' opacity={1}>
                            <Popup>
                                <div className='w-[320px] max-w-[85vw] '>
                                    <div className='flex flex-col gap-1'>
                                        <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>ID:</p><p>{device.device_id}</p></div>
                                        <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>Beacon más cercano:</p><p>{beacons.find(beacon => beacon.mac.toLowerCase() === device.closest_beacon.toLowerCase())?.name.toUpperCase() || 'N/A'}</p></div>
                                        <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>Beacon más cercano RSSI:</p><p>{device.pos_data.rssi}</p></div>
                                        <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>Batería:</p><p>{device.battery} %</p></div>
                                        <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>EUID:</p><p>{device.device_euid}</p></div>
                                        <div className='flex flex-row items-center gap-2 max-h-6'><p className='font-bold'>Actualizado el:</p><p>{new Date(device.created_at).toLocaleString('es-CL')}</p></div>
                                    </div>
                                </div>
                            </Popup>
                        </Circle>
                    )
                })}
            </MapContainer>
        </div>
    );
}

export default IndoorMap