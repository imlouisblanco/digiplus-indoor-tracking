'use client'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClockIcon } from '@heroicons/react/24/outline'

export default function TimeFilter({
    timeFilter,
    onFilterChange,
    filteredCount
}) {
    const filters = [
        { value: '5m', label: 'Últimos 5 minutos' },
        { value: '20m', label: 'Últimos 20 minutos' },
        { value: '1h', label: 'Última hora' },
        { value: '12h', label: 'Últimas 12 horas' },
        // { value: '24h', label: 'Últimas 24 horas' },
        // { value: '48h', label: 'Últimas 48 horas' }
    ]

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-700">Filtrar por período:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {filters.map((filter) => (
                        <Button
                            key={filter.value}
                            onClick={() => onFilterChange(filter.value)}
                            variant={timeFilter === filter.value ? 'default' : 'outline'}
                            size="sm"
                            className={timeFilter === filter.value
                                ? 'bg-gradient-to-r from-[#29f57e] via-emerald-500 to-teal-600 text-white shadow-md'
                                : 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300'
                            }
                        >
                            {filter.label}
                        </Button>
                    ))}
                    <Badge variant="outline" className="flex items-center gap-1 px-3">
                        {filteredCount} registros
                    </Badge>
                </div>
            </div>
        </div>
    )
}

