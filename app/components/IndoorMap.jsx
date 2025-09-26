'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const devices = [
    {
        id: 1,
        name: 'Device 1',
        position: [-33.49542270354646, -70.59629176833604],
        status: 'active',
        lastUpdate: new Date(),
        department: 'Department 1',
        cardId: 'CARD001',
        color: 'yellow',
        battery: 85
    },
    {
        id: 2,
        name: 'Device 2',
        position: [-33.49546296547426, -70.59627098121722],
        status: 'active',
        lastUpdate: new Date(),
        department: 'Department 2',
        cardId: 'CARD002',
        color: 'blue',
        battery: 85
    },
    {
        id: 3,
        name: 'Device 3',
        position: [-33.49541062600386, -70.59621166108582],
        status: 'active',
        lastUpdate: new Date(),
        department: 'Department 3',
        cardId: 'CARD003',
        color: 'green',
        battery: 85
    },
    {
        id: 4,
        name: 'Device 4',
        position: [-33.49535560029184, -70.59616369286202],
        status: 'active',
        lastUpdate: new Date(),
        department: 'Department 4',
        cardId: 'CARD004',
        color: 'red',
        battery: 85
    }
]

const IndoorMap = ({ latestData }) => {
    return (
        <div className="h-full w-full">
            <MapContainer center={[-33.49541062600386, -70.59621166108582]} zoom={22} scrollWheelZoom={false}
                zoomControl={false}
                style={{ width: "100%", height: "100%", minHeight: "50rem", zIndex: 30 }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                    url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    maxZoom={22}
                />
                <ImageOverlay
                    url="/plano.png"
                    alt="Map"
                    opacity={0.75}
                    bounds={[
                        [-33.495555, -70.596400],
                        [-33.495555, -70.596220],
                        [-33.495440, -70.596220],
                        [-33.495430, -70.596200]
                    ]}
                    className="-rotate-25"
                    style={{ transform: 'rotate(-25deg)' }}
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
            </MapContainer>
        </div>
    )
}

export default IndoorMap