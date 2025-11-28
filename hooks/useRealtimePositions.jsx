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
                    .select('*');

                if (error) {
                    console.error('[Error loading initial data]', error);
                    return;
                }

                if (data && data.length > 0) {
                    // Convertir array a objeto indexado por device_id
                    const initialData = {};
                    data.forEach(item => {
                        initialData[item.device_id] = item;
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
                (p) => {
                    // const p = payload.new;
                    // console.log('[New Data]', p);
                    // setDevicesData(prev => ({
                    //     ...prev,
                    //     [p.device_id]: p
                    // }));
                    setDevicesData((prev) => {
                        const prevDevice = prev[p.device_id];
                        const prevPos = prevDevice?.pos_data;

                        const ALPHA = 0.25;        // suavizado (0.1 muy suave, 0.5 rápido)
                        const MIN_MOVE = 0.1;      // metros: ignorar cambios menores

                        let filteredPos = p.pos_data;

                        if (prevPos) {
                            const dx = p.pos_data.x - prevPos.x;
                            const dy = p.pos_data.y - prevPos.y;
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
                            [p.device_id]: {
                                ...prevDevice,
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
                (p) => {
                    setDevicesData((prev) => {
                        const prevDevice = prev[p.device_id];
                        const prevPos = prevDevice?.pos_data;

                        const ALPHA = 0.25;        // suavizado (0.1 muy suave, 0.5 rápido)
                        const MIN_MOVE = 0.1;      // metros: ignorar cambios menores

                        let filteredPos = p.pos_data;

                        if (prevPos) {
                            const dx = p.pos_data.x - prevPos.x;
                            const dy = p.pos_data.y - prevPos.y;
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
                            [p.device_id]: {
                                ...prevDevice,
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