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
                (payload) => {
                    const p = payload.new;
                    console.log('[New Data]', p);
                    setDevicesData(prev => ({
                        ...prev,
                        [p.device_id]: p
                    }));
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
                    const p = payload.new;
                    console.log('[Updated Data]', p);
                    setDevicesData(prev => ({
                        ...prev,
                        [p.device_id]: p
                    }));
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    return { devicesData };
}