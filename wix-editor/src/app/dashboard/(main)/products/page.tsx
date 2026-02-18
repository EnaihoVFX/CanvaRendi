'use client';

import React from 'react';
import {
    FaFileImport, FaPlus, FaLayerGroup, FaWandMagicSparkles, FaMagnifyingGlass, FaEllipsis, FaImage
} from 'react-icons/fa6';

export default function ProductsPage() {
    return (
        <div>
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your inventory and digital downloads</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg transition flex items-center">
                        <FaFileImport className="mr-2" /> Import
                    </button>
                    <button className="bg-black hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm flex items-center">
                        <FaPlus className="mr-2" /> Add product
                    </button>
                </div>
            </header>

            <div className="bg-[#F5F0EB] rounded-2xl p-6 mb-8 flex items-start md:items-center justify-between gap-6 border border-gray-100 relative overflow-hidden group cursor-pointer transition hover:shadow-sm">
                <div className="flex gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white shadow-sm flex-shrink-0">
                        <FaLayerGroup />
                    </div>
                    <div>
                        <h3 className="text-gray-900 font-serif font-bold text-base mb-1">SiteApe Intelligence</h3>
                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-lg">
                            Save time by letting SiteApe write compelling descriptions for your new inventory. Just upload a photo and we'll do the rest.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => window.location.href = '/dashboard/ai-writer'}
                    className="flex-shrink-0 text-gray-900 text-sm font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition relative z-10"
                >
                    Try AI Writer
                </button>

                <FaWandMagicSparkles className="absolute right-10 top-1/2 transform -translate-y-1/2 text-6xl text-gray-900 opacity-[0.03] group-hover:opacity-[0.06] transition" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:w-96">
                    <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                    <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition" />
                </div>

                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <button className="px-4 py-1.5 text-xs font-medium bg-white text-gray-900 rounded shadow-sm">All</button>
                    <button className="px-4 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition">Active</button>
                    <button className="px-4 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition">Draft</button>
                    <button className="px-4 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition">Archived</button>
                </div>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">
                                <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-0" />
                            </th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Inventory</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">

                        <tr className="hover:bg-gray-50 transition group">
                            <td className="px-6 py-4">
                                <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-0" />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1603513492128-ba6fe53e630f?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" alt="Product" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">E-commerce Consultation</div>
                                        <div className="text-xs text-gray-500">Services</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-gray-500">∞</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">$250.00</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-gray-400 hover:text-gray-900 transition"><FaEllipsis /></button>
                            </td>
                        </tr>

                        <tr className="hover:bg-gray-50 transition group">
                            <td className="px-6 py-4">
                                <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-0" />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" alt="Product" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Shopify Setup Guide</div>
                                        <div className="text-xs text-gray-500">Digital</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-gray-500">∞</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">$29.99</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-gray-400 hover:text-gray-900 transition"><FaEllipsis /></button>
                            </td>
                        </tr>

                        <tr className="hover:bg-gray-50 transition group">
                            <td className="px-6 py-4">
                                <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-0" />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                        <FaImage />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Premium Packaging Kit</div>
                                        <div className="text-xs text-gray-500">Physical</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    Draft
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm text-gray-900">45 in stock</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">$85.00</div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-gray-400 hover:text-gray-900 transition"><FaEllipsis /></button>
                            </td>
                        </tr>

                        <tr className="hover:bg-gray-50 transition group">
                            <td className="px-6 py-4">
                                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4 opacity-50 filter blur-[1px]">
                                    <div className="w-10 h-10 rounded bg-gray-100"></div>
                                    <div className="space-y-1">
                                        <div className="h-3 w-32 bg-gray-100 rounded"></div>
                                        <div className="h-2 w-16 bg-gray-50 rounded"></div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 w-12 bg-gray-100 rounded-full"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-3 w-8 bg-gray-100 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-3 w-12 bg-gray-100 rounded"></div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="h-2 w-2 bg-gray-100 rounded-full inline-block"></div>
                            </td>
                        </tr>

                    </tbody>
                </table>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Showing 1-4 of 12 products</span>
                    <div className="flex gap-1">
                        <button className="p-1 px-2 text-xs font-medium text-gray-400 cursor-not-allowed">Prev</button>
                        <button className="p-1 px-2 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded shadow-sm">1</button>
                        <button className="p-1 px-2 text-xs font-medium text-gray-500 hover:bg-gray-200 rounded transition">2</button>
                        <button className="p-1 px-2 text-xs font-medium text-gray-500 hover:text-gray-900 transition">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
