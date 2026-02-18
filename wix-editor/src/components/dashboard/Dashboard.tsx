'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FaWindowMaximize, FaFileLines, FaMessage, FaRocket, FaCircleCheck, FaChevronRight, FaRegCircleUser,
    FaRegImage, FaPlus
} from 'react-icons/fa6';
import { useMobile } from '@/hooks/useMobile';
import MobileDashboard from './MobileDashboard';
import { SiteData } from '@/types/editor';

interface DashboardProps {
    initialSites?: SiteData[];
}

export default function Dashboard({ initialSites = [] }: DashboardProps) {
    const router = useRouter();
    const isMobile = useMobile();
    const [isCreating, setIsCreating] = useState(false);
    const [creationStep, setCreationStep] = useState('Initializing Layout Engine...');
    const [creationProgress, setCreationProgress] = useState(0);

    const handleCreateSite = async () => {
        setIsCreating(true);
        setCreationProgress(10);

        // Simulate steps for effect while creating
        const steps = [
            { msg: 'Applying Design System...', prog: 30, time: 1000 },
            { msg: 'Integrating Selected Assets...', prog: 55, time: 2000 },
            { msg: 'Generating Smart Copy...', prog: 75, time: 3000 },
            { msg: 'Finalizing Website...', prog: 90, time: 4000 }
        ];

        let timeouts: NodeJS.Timeout[] = [];
        steps.forEach(step => {
            timeouts.push(setTimeout(() => {
                setCreationStep(step.msg);
                setCreationProgress(step.prog);
            }, step.time));
        });

        try {
            const response = await fetch('/api/create-site', { method: 'POST' });
            if (!response.ok) throw new Error('Failed to create site');
            const { siteId } = await response.json();

            // Wait for animation to finish a bit
            setTimeout(() => {
                setCreationProgress(100);
                router.push(`/editor?siteId=${siteId}`);
            }, 4500);

        } catch (error) {
            console.error('Creation failed', error);
            setIsCreating(false);
            timeouts.forEach(clearTimeout);
        }
    };

    const handleEditSite = (siteId: string) => {
        router.push(`/editor?siteId=${siteId}`);
    };

    if (isMobile) {
        return <MobileDashboard sites={initialSites} />;
    }

    return (
        <>
            <header className="mb-8 flex justify-between items-end">
                <h1 className="text-3xl font-semibold text-gray-900">Good afternoon,<br />welcome to SiteApe</h1>
                <button
                    onClick={handleCreateSite}
                    disabled={isCreating}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaPlus /> Create New Site
                </button>
            </header>

            {isCreating && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mb-6"></div>
                    <h2 className="text-2xl font-serif font-medium text-gray-900 mb-2">{creationStep}</h2>
                    <p className="text-gray-500 text-sm mb-8">Creating your custom site based on your preferences...</p>

                    <div className="w-full max-w-md h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-600 transition-all duration-500 ease-out"
                            style={{ width: `${creationProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-12 gap-6">

                {/* Sites List */}
                <div className="col-span-12">
                    {initialSites.length === 0 ? (
                        <div className="bg-gray-50 rounded-2xl p-12 border border-gray-100 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                <FaWindowMaximize className="text-2xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No websites yet</h3>
                            <p className="text-gray-500 mb-6 max-w-md">Create your first website to get started with SiteApe.</p>
                            <button
                                onClick={handleCreateSite}
                                className="text-purple-600 font-medium hover:text-purple-700 hover:underline"
                            >
                                Create a website
                            </button>
                        </div>
                    ) : (() => {
                        const site = initialSites[0];
                        return (
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition group">
                                <div className="h-56 bg-[#F5F0EB] relative flex items-center justify-center">
                                    {/* Site preview placeholder */}
                                    <div className="w-28 h-28 bg-white/50 rounded-lg flex items-center justify-center text-gray-300">
                                        <FaWindowMaximize className="text-4xl" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                    <button
                                        onClick={() => handleEditSite(site.siteId)}
                                        className="absolute bottom-4 right-4 bg-white text-gray-900 text-sm font-medium px-5 py-2.5 rounded-lg shadow opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all"
                                    >
                                        Edit Site
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900 text-lg">{site.name || 'My Website'}</h3>
                                        <span className="text-xs text-gray-400">{new Date(site.lastSaved).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full">● Unpublished</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>

                {/* Bottom Widgets - Keep existing layout for now */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-2xl p-5 min-h-[150px]">
                            <h3 className="text-gray-500 text-sm font-medium flex items-center gap-2 mb-4">
                                <FaFileLines /> Latest invoices
                            </h3>
                            <div className="space-y-3 opacity-20 filter blur-[2px]">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="border border-gray-200 rounded-2xl p-5 min-h-[150px]">
                            <h3 className="text-gray-500 text-sm font-medium flex items-center gap-2 mb-4">
                                <FaMessage /> Latest chats
                            </h3>
                            <div className="space-y-3 opacity-20 filter blur-[2px]">
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-gray-50/50 rounded-2xl p-5">
                        <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <FaRocket className="text-gray-500" /> Quick actions
                        </h3>

                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between bg-gray-200 hover:bg-gray-300 p-3 rounded-lg text-sm font-medium text-gray-800 transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border border-gray-500 border-dashed"></div>
                                    Add a contact
                                </div>
                                <FaChevronRight className="text-xs text-gray-500" />
                            </button>
                            {/* ... more buttons ... */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
