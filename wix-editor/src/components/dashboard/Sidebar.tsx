'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FaChevronDown, FaHouse, FaDesktop, FaUser, FaGlobe, FaFileInvoiceDollar, FaWandMagicSparkles,
    FaBullhorn, FaDollarSign, FaBagShopping, FaLayerGroup, FaCrown, FaSliders, FaCircleQuestion
} from 'react-icons/fa6';

import { UserButton, useUser } from '@clerk/nextjs';

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();

    const isActive = (path: string) => pathname === path;

    const linkClasses = (path: string) => `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(path)
        ? 'bg-[#F5F0EB] text-gray-900 shadow-sm border border-gray-100'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`;

    const iconClasses = (path: string) => `w-6 ${isActive(path) ? 'text-gray-800' : 'text-gray-400'}`;

    return (
        <aside className="w-64 flex-shrink-0 flex flex-col border-r border-gray-100 bg-white h-full overflow-y-auto">
            <div className="p-4 mb-2">
                <div className="flex items-center justify-between w-full text-sm font-medium hover:bg-gray-50 p-2 rounded-lg transition group">
                    <div className="flex items-center gap-3">
                        <UserButton afterSignOutUrl="/sign-in" />
                        <div className="flex flex-col">
                            <span className="text-gray-900 font-medium truncate max-w-[120px]">
                                {user?.fullName || user?.firstName || 'User'}
                            </span>
                            <span className="text-xs text-gray-400 truncate max-w-[120px]">
                                {user?.primaryEmailAddress?.emailAddress}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                <Link href="/dashboard" className={linkClasses('/dashboard')}>
                    <FaHouse className={iconClasses('/dashboard')} /> Home
                </Link>
                <Link href="#" className={linkClasses('#website')}>
                    <FaDesktop className={iconClasses('#website')} /> Website
                </Link>
                <Link href="#" className={linkClasses('#contacts')}>
                    <FaUser className={iconClasses('#contacts')} /> Contacts
                </Link>
                <Link href="#" className={linkClasses('#discoverability')}>
                    <FaGlobe className={iconClasses('#discoverability')} /> Discoverability
                </Link>
                <Link href="#" className={linkClasses('#invoices')}>
                    <FaFileInvoiceDollar className={iconClasses('#invoices')} /> Invoices
                </Link>
                <Link href="#" className={linkClasses('#studio')}>
                    <FaWandMagicSparkles className={iconClasses('#studio')} /> Studio
                </Link>

                <div className="pt-4 pb-1 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Business</div>
                <Link href="#" className={linkClasses('#marketing')}>
                    <FaBullhorn className={iconClasses('#marketing')} /> Marketing
                </Link>
                <Link href="#" className={linkClasses('#finance')}>
                    <FaDollarSign className={iconClasses('#finance')} /> Finance
                </Link>
                <Link href="/dashboard/products" className={linkClasses('/dashboard/products')}>
                    <FaBagShopping className={iconClasses('/dashboard/products')} /> Sales / Products
                </Link>
            </nav>

            <div className="p-3 mt-auto">

                <Link href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
                    <FaSliders className="w-6" /> Settings
                </Link>
                <Link href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
                    <FaCircleQuestion className="w-6" /> Help
                </Link>
            </div>
        </aside>
    );
}
