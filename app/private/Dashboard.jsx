'use client'
import dynamic from "next/dynamic";

const IndoorMap = dynamic(() => import("@/app/components/IndoorMap"), {
    ssr: false
});

export default function Dashboard({ latestData }) {
    return (
        <div className="min-h-screen w-full">
            {/* Main Content */}
            <main className="mx-auto px-4 py-6 w-full">
                <div className="flex flex-col gap-6">
                    <IndoorMap latestData={latestData} />
                </div>
            </main>
        </div>
    );
}
