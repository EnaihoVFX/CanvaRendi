import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-white h-screen flex overflow-hidden text-gray-800 font-sans">
            <div className="hidden md:block h-full">
                <Sidebar />
            </div>
            <main className="flex-1 overflow-y-auto bg-white p-8">
                {children}
            </main>
        </div>
    );
}
