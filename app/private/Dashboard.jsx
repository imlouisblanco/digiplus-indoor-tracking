'use client'
import dynamic from "next/dynamic";
import { beacons } from "@/lib/beacons";
import { useState, useEffect } from "react";
import { getDevicesLatestData } from "@/app/actions/data";

const IndoorMap = dynamic(() => import("@/app/components/IndoorMap"), {
    ssr: false
});

const updateInterval = 60000;

const BeaconCard = ({ beacon, devices }) => {
    return (
        <div key={beacon.mac} className="flex flex-col gap-2 p-4 border border-gray-300 rounded-lg">
            <div className="flex flex-col gap-2 border-b border-gray-300 pb-2">
                <div className="flex flex-row gap-2 items-center">
                    <span className={`w-4 h-4 rounded-full ${beacon.background}`}></span>
                    <p className="text-sm font-bold">Beacon {beacon.mac} </p>
                </div>
                <p className="text-xs text-black">({devices.length} {devices.length > 1 ? "dispositivos" : "dispositivo"})</p>

            </div>
            <div className="flex flex-col gap-2">
                {devices.map(device => (
                    <div key={device.id} className="flex flex-row gap-2">
                        <p className="text-sm text-gray-500">{device.device_id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Dashboard({ latestData }) {
    const [currentData, setCurrentData] = useState(latestData);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    const updateData = async () => {
        const newData = await getDevicesLatestData();
        setCurrentData(newData);
        setLastUpdate(new Date());
    }

    useEffect(() => {
        setInterval(async () => {
            updateData();
        }, updateInterval);
    }, []);



    return (
        <div className="min-h-screen w-full">
            <main className="mx-auto px-4 py-6 w-full bg-white rounded-lg shadow-md">
                <div className="flex flex-col gap-6">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <div className="flex flex-col xl:grid xl:grid-cols-12">
                        <div className="w-full xl:col-span-3 border border-gray-300 p-4 rounded-tl-lg rounded-bl-lg shadow-md">
                            <h2 className="text-lg font-bold">Plano Indoor</h2>
                            <p className="text-sm text-gray-500">Monitoreo en tiempo real de personas</p>
                            <div className="flex flex-col gap-2 mt-4">
                                {beacons.map((beacon) => (
                                    <BeaconCard key={beacon.mac} beacon={beacon} devices={currentData?.filter(device => device.closest_beacon === beacon.mac)} />
                                ))}
                            </div>
                        </div>
                        <IndoorMap latestData={currentData} lastUpdate={lastUpdate} />
                    </div>
                </div>
            </main>
        </div>
    );
}
