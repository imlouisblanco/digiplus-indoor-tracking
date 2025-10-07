'use client'

import { MapContainer, TileLayer, Marker, Popup, Circle, ImageOverlay } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function Map({ data }) {
    return (
        <div>
            <MapContainer center={[-33.49541062600386, -70.59621166108582]} zoom={22.4} scrollWheelZoom={false}
                zoomControl={false}
                style={{ width: "100%", height: "100%", minHeight: "40rem", zIndex: 30 }}
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
                <Circle center={data.position} radius={0.5} color={data.color} fillOpacity={1}>
                    {/* <Popup>
                        <div className='w-[280px] max-w-[80vw]'>
                            <p className='font-bold'>{data.device_id || data.device_euid || 'Dispositivo'}</p>
                            <p className='text-sm'>{data.battery} %</p>
                        </div>
                    </Popup> */}
                </Circle>
            </MapContainer>
        </div>
    );
}