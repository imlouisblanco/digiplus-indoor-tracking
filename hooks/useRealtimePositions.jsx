import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useRealtimePositions() {
    const [devicesData, setDevicesData] = useState({});

    useEffect(() => {
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