import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useRealtimePositions() {
    const [devicesData, setDevicesData] = useState({});

    useEffect(() => {
        // Cargar datos iniciales
        const loadInitialData = async () => {
            try {
                const { data, error } = await supabase
                    .from('data')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(100)

                if (error) {
                    console.error('[Error loading initial data]', error);
                    return;
                }

                console.log('[Initial data]', data);

                if (data && data.length > 0) {
                    // Convertir array a objeto indexado por device_id
                    // Solo guardar el primer registro de cada device_id (el más reciente, ya que están ordenados desc)
                    const initialData = {};
                    data.forEach(item => {
                        if (!initialData[item.device_id]) {
                            initialData[item.device_id] = item;
                        }
                    });
                    setDevicesData(initialData);
                    console.log('[Initial data loaded]', initialData);
                }
            } catch (error) {
                console.error('[Error loading initial data]', error);
            }
        };

        // Cargar datos iniciales primero
        loadInitialData();

        // Establecer suscripción a cambios en tiempo real
        const channel = supabase
            .channel('rt-devices-data')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'data'
                },
                (payload) => {
                    const newData = payload.new;
                    console.log('[New Data]', newData);

                    if (!newData || !newData.device_id) return;

                    setDevicesData((prev) => {
                        const prevDevice = prev[newData.device_id];
                        const prevPos = prevDevice?.pos_data;

                        const ALPHA = 0.25;        // suavizado (0.1 muy suave, 0.5 rápido)
                        const MIN_MOVE = 0.01;      // metros: ignorar cambios menores

                        let filteredPos = newData.pos_data;

                        if (prevPos && newData.pos_data) {
                            const dx = newData.pos_data.x - prevPos.x;
                            const dy = newData.pos_data.y - prevPos.y;
                            const dist = Math.hypot(dx, dy);

                            if (dist < MIN_MOVE) {
                                // muy poca diferencia → consideramos que es ruido
                                filteredPos = prevPos;
                            } else {
                                // suavizar el cambio
                                filteredPos = {
                                    x: prevPos.x + ALPHA * dx,
                                    y: prevPos.y + ALPHA * dy,
                                };
                            }
                        }
                        return {
                            ...prev,
                            [newData.device_id]: {
                                ...newData,
                                pos_data: filteredPos
                            }
                        };
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'data'
                },
                (payload) => {
                    const newData = payload.new;
                    console.log('[Updated Data]', newData);

                    if (!newData || !newData.device_id) return;

                    setDevicesData((prev) => {
                        const prevDevice = prev[newData.device_id];
                        const prevPos = prevDevice?.pos_data;

                        const ALPHA = 0.25;        // suavizado (0.1 muy suave, 0.5 rápido)
                        const MIN_MOVE = 0.1;      // metros: ignorar cambios menores

                        let filteredPos = newData.pos_data;

                        if (prevPos && newData.pos_data) {
                            const dx = newData.pos_data.x - prevPos.x;
                            const dy = newData.pos_data.y - prevPos.y;
                            const dist = Math.hypot(dx, dy);

                            if (dist < MIN_MOVE) {
                                // muy poca diferencia → consideramos que es ruido
                                filteredPos = prevPos;
                            } else {
                                // suavizar el cambio
                                filteredPos = {
                                    x: prevPos.x + ALPHA * dx,
                                    y: prevPos.y + ALPHA * dy,
                                };
                            }
                        }
                        return {
                            ...prev,
                            [newData.device_id]: {
                                ...newData,
                                pos_data: filteredPos
                            }
                        };
                    });
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    return { devicesData };
}