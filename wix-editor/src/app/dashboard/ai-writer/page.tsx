'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    FaArrowLeft, FaLayerGroup, FaRotateRight, FaCopy, FaCheck, FaGoogle, FaEnvelopeOpenText, FaPaperclip, FaArrowUp, FaChevronDown, FaFilePdf
} from 'react-icons/fa6';
import { FaInstagram } from 'react-icons/fa';

export default function AiWriterPage() {
    return (
        <div className="bg-white h-screen flex flex-col overflow-hidden text-gray-800 font-sans">
            <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 md:px-10 flex-shrink-0 bg-white/90 backdrop-blur-sm z-20">
                <div className="flex-1">
                    <Link href="/dashboard/products" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition group">
                        <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center mr-3 transition">
                            <FaArrowLeft className="text-gray-600 group-hover:text-black" />
                        </div>
                        Back to Products
                    </Link>
                </div>

                <div className="text-center flex-1 flex flex-col items-center">
                    <h1 className="font-serif text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <FaLayerGroup className="text-sm" /> SiteApe
                    </h1>
                    <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase mt-0.5">Product Assistant</span>
                </div>

                <div className="flex-1 flex justify-end items-center gap-3">
                    <span className="hidden md:inline text-xs text-gray-400 font-medium tracking-wide">SiteApe Intelligence v1.0</span>
                    <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-gray-600">ONLINE</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-48 relative scroll-smooth">
                <div className="max-w-2xl mx-auto space-y-10 pt-8">

                    <div className="text-center space-y-4 opacity-50 hover:opacity-100 transition duration-500">
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Session Started</p>
                    </div>

                    <div className="flex justify-end">
                        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[16px_16px_4px_16px] px-5 py-3 max-w-lg shadow-sm">
                            <p className="text-[15px] text-gray-700 leading-relaxed">
                                I need a description for the <strong>Leather Weekend Bag</strong>. It's high-end, durable, and good for short trips.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 animate-fade-in-up">
                        <div className="w-8 h-8 rounded-lg bg-black flex-shrink-0 flex items-center justify-center text-white text-xs shadow-md mt-1">
                            <FaLayerGroup />
                        </div>
                        <div className="bg-[#F5F0EB] rounded-[16px_16px_16px_4px] px-6 py-5 max-w-xl shadow-sm">
                            <h3 className="font-serif text-xl font-medium mb-3 text-gray-900">The Ultimate Weekend Companion</h3>
                            <p className="text-[15px] text-gray-700 leading-relaxed mb-4">
                                Escape the ordinary with our handcrafted Leather Weekend Bag. Designed for the modern traveler, this bag blends rugged durability with sophisticated style. Constructed from full-grain leather that ages beautifully, it features a spacious interior perfect for 3-day getaways.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs text-gray-600">Full-Grain Leather</span>
                                <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs text-gray-600">Water Resistant</span>
                                <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs text-gray-600">Carry-on Size</span>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200/50 mt-2">
                                <button className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-black transition">
                                    <FaCopy /> Copy
                                </button>
                                <button className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-black transition">
                                    <FaRotateRight /> Regenerate
                                </button>
                                <button className="ml-auto bg-black text-white text-xs font-medium px-4 py-2 rounded hover:bg-gray-800 transition shadow-sm">
                                    Save to Product
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white via-80% to-transparent z-30">
                <div className="max-w-2xl mx-auto">

                    <div className="flex justify-center gap-2 mb-4 overflow-x-auto no-scrollbar">
                        <button className="whitespace-nowrap px-4 py-1.5 bg-white border border-gray-200 hover:border-gray-400 hover:shadow-sm rounded-full text-xs font-medium text-gray-600 transition flex items-center">
                            <FaGoogle className="mr-1" /> SEO Optimization
                        </button>
                        <button className="whitespace-nowrap px-4 py-1.5 bg-white border border-gray-200 hover:border-gray-400 hover:shadow-sm rounded-full text-xs font-medium text-gray-600 transition flex items-center">
                            <FaInstagram className="mr-1" /> Social Captions
                        </button>
                        <button className="whitespace-nowrap px-4 py-1.5 bg-white border border-gray-200 hover:border-gray-400 hover:shadow-sm rounded-full text-xs font-medium text-gray-600 transition flex items-center">
                            <FaEnvelopeOpenText className="mr-1" /> Email Teaser
                        </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-within:border-gray-300 transition-all duration-300 relative group/input">

                        <textarea
                            className="w-full bg-transparent border-none rounded-2xl p-4 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:ring-0 resize-none min-h-[60px] outline-none"
                            placeholder="Ask WebApe to write something..."
                            rows={1}
                        ></textarea>

                        <div className="flex items-center justify-between px-3 pb-3">

                            <div className="relative group">
                                <button className="flex items-center gap-2 bg-[#F5F0EB] hover:bg-gray-100 border border-transparent hover:border-gray-200 text-gray-900 text-xs font-medium px-3 py-1.5 rounded-lg transition">
                                    <span className="w-4 h-4 rounded bg-gray-300 overflow-hidden flex-shrink-0">
                                        <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50" className="w-full h-full object-cover" />
                                    </span>
                                    Leather Weekend Bag
                                    <FaChevronDown className="text-[10px] ml-1 text-gray-400" />
                                </button>

                                <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl p-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Context</div>

                                    <button className="w-full text-left flex items-center gap-3 px-3 py-2 bg-[#F5F0EB] rounded-lg text-sm text-gray-900 font-medium">
                                        <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                                            <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=50" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="leading-none">Leather Weekend Bag</div>
                                            <div className="text-[10px] text-gray-500 mt-1">Active Item</div>
                                        </div>
                                        <FaCheck className="text-xs ml-auto text-black" />
                                    </button>

                                    <button className="w-full text-left flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600 transition mt-1">
                                        <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                                            <FaFilePdf />
                                        </div>
                                        <div>
                                            <div className="leading-none">Shopify Setup Guide</div>
                                            <div className="text-[10px] text-gray-400 mt-1">Digital Product</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition rounded-full hover:bg-gray-50" title="Attach file">
                                    <FaPaperclip />
                                </button>
                                <button className="w-8 h-8 bg-black hover:bg-gray-800 text-white rounded-lg flex items-center justify-center transition shadow-md">
                                    <FaArrowUp className="text-xs" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-[10px] text-gray-400 mt-3">
                        WebApe can make mistakes. Please review before publishing.
                    </p>
                </div>
            </div>

        </div>
    );
}
