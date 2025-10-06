'use client'
import dynamic from "next/dynamic";
import { beacons } from "@/lib/beacons";

const Map = dynamic(() => import("./Map"), {
    ssr: false
});

export default function DeviceDetails({ id, data }) {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">
                Device {id}
            </h2>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Data actual</h3>
                    <div className="flex flex-col gap-2">
                        <p>
                            Actualizado el{" "}
                            {new Date(data[0].created_at).toLocaleString("es-CL")}
                        </p>
                        <p>
                            Batería: {data[0].battery} %
                        </p>
                        <p>
                            Beacon más cercano: {data[0].pos_data.mac.toUpperCase()}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>
                            RSSI: {data[0].pos_data.rssi}
                        </p>
                    </div>
                </div>

                <Map data={{
                    ...data[0],
                    position: beacons.find(beacon => beacon.mac.toLowerCase() === data[0].pos_data.mac.toLowerCase()).position,
                    color: beacons.find(beacon => beacon.mac.toLowerCase() === data[0].pos_data.mac.toLowerCase()).color
                }} />
            </section>
            <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold">Log Data</h3>
                <div className="flex flex-col gap-2 max-h-[20rem] overflow-y-auto">
                    {data.map((item, index) =>
                        <div key={index} className="flex flex-col gap-2 border-b border-gray-200 pb-2">
                            <p>
                                {new Date(item.created_at).toLocaleString("es-CL")}
                            </p>
                            <p>
                                {`Batería: ${item.battery} %`}
                            </p>

                            <p>
                                {`Próximo a Beacon ${beacons.find(beacon => beacon.mac.toLowerCase() === item.pos_data.mac.toLowerCase()).mac.toUpperCase()}`}
                            </p>
                            <p>
                                {`RSSI: ${item.pos_data.rssi}`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}