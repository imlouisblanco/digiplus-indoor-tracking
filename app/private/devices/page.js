import { getDevicesLatestData } from "@/app/actions/data";
import { ALLOWED_DEVICES } from "@/utils/CONFIG";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Battery100Icon,
  SignalIcon,
  ClockIcon,
  MapPinIcon,
  CpuChipIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { beacons } from "@/lib/beacons";

const DeviceCard = ({ deviceId, data }) => {
  const getBatteryColor = (battery) => {
    if (battery >= 70) return "bg-gradient-to-r from-[#29f57e] to-emerald-500";
    if (battery >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getBatteryBadgeVariant = (battery) => {
    if (battery >= 70) return "default";
    if (battery >= 30) return "secondary";
    return "destructive";
  };

  const getBatteryIconBg = (battery) => {
    if (battery >= 70) return "bg-gradient-to-br from-[#29f57e] to-emerald-500";
    if (battery >= 30) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getBatteryIconColor = (battery) => {
    if (battery >= 70) return "text-white";
    if (battery >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className={`relative group flex flex-col gap-4 p-6 ${
      data ? "bg-white border-emerald-100" : "bg-gray-50 border-gray-200"
    } border-2 shadow-lg hover:shadow-2xl rounded-2xl transition-all duration-300 hover:-translate-y-1`}>
      
      {/* Header del card */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
            data ? "bg-gradient-to-br from-[#29f57e] via-emerald-400 to-teal-500 shadow-emerald-200" : "bg-gray-300"
          }`}>
            <CpuChipIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className={`font-bold text-xl ${
              data ? "bg-gradient-to-r from-[#29f57e] via-emerald-600 to-teal-700 bg-clip-text text-transparent" : "text-gray-500"
            }`}>
              {deviceId}
            </p>
            <Badge variant={data ? "outline" : "secondary"} className="mt-1 text-xs">
              {data ? "Activo" : "Sin datos"}
            </Badge>
          </div>
        </div>
        {!data && (
          <ExclamationTriangleIcon className="w-6 h-6 text-gray-400" />
        )}
      </div>

      {/* Información del dispositivo */}
      {data ? (
        <div className="space-y-3">
          {/* EUID */}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CpuChipIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Device EUID</p>
              <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">{data.device_euid}</p>
            </div>
          </div>

          {/* Beacon más cercano */}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPinIcon className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Beacon más cercano</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{beacons.find(beacon => beacon.mac === data.closest_beacon)?.name || data.closest_beacon}</p>
            </div>
          </div>

          {/* RSSI */}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <SignalIcon className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">RSSI</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{data.pos_data?.rssi}</p>
            </div>
          </div>

          {/* Batería */}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${getBatteryIconBg(data.battery)}`}>
              <Battery100Icon className={`w-4 h-4 ${getBatteryIconColor(data.battery)}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Batería</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getBatteryColor(data.battery)} transition-all duration-300`}
                    style={{ width: `${data.battery}%` }}
                  />
                </div>
                <Badge variant={getBatteryBadgeVariant(data.battery)} className="font-semibold text-xs">
                  {data.battery}%
                </Badge>
              </div>
            </div>
          </div>

          {/* Última actualización */}
          <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ClockIcon className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Última actualización</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {new Date(data.created_at).toLocaleString('es-CL')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 font-medium">No hay datos disponibles</p>
          <p className="text-xs text-gray-400 text-center">Este dispositivo aún no ha enviado información</p>
        </div>
      )}

      {/* Botón de ver detalles */}
      {data && (
        <Link href={`/private/devices/${deviceId}`} className="mt-2">
          <Button className="w-full bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 group">
            <span>Ver Detalles</span>
            <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export default async function DevicesPage() {
  const latestData = await getDevicesLatestData();
  const devicesWithData = ALLOWED_DEVICES.filter(device => latestData.find(d => d.device_id === device)).sort((a, b) => a.battery - b.battery);
  const devicesWithoutData = ALLOWED_DEVICES.filter(device => !devicesWithData.includes(device));
  
  return (
    <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-gray-100 min-h-screen">
      {/* Header moderno */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#29f57e] via-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <CpuChipIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#29f57e] via-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Dispositivos
            </h2>
            <p className="text-sm text-gray-500 mt-1">Monitoreo y gestión de dispositivos</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm px-4 py-2">
            {devicesWithData.length} activos
          </Badge>
          {devicesWithoutData.length > 0 && (
            <Badge variant="outline" className="text-sm px-4 py-2">
              {devicesWithoutData.length} sin datos
            </Badge>
          )}
        </div>
      </div>

      {/* Grid de dispositivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devicesWithData.map((device, index) =>
          <DeviceCard
            key={`device-with-data-${index}`}
            deviceId={device}
            data={latestData.find(d => d.device_id === device) || null}
          />
        )}
        {devicesWithoutData.map((device, index) =>
          <DeviceCard
            key={`device-without-data-${index}`}
            deviceId={device}
            data={null}
          />
        )}
      </div>
    </div>
  );
}
