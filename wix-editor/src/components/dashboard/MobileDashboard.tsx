'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    FaLayerGroup, FaBell, FaUsers, FaEye, FaArrowUp,
    FaWandMagicSparkles, FaFileInvoiceDollar, FaUserPlus, FaShareNodes,
    FaChevronDown, FaHouse, FaDesktop, FaBriefcase
} from 'react-icons/fa6';
import styles from './MobileDashboard.module.css';
import { SiteData } from '@/types/editor';

interface MobileDashboardProps {
    sites?: SiteData[];
}

export default function MobileDashboard({ sites = [] }: MobileDashboardProps) {
    const router = useRouter();
    const [activeModal, setActiveModal] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const firstSite = sites[0];

    const handleEditSite = () => {
        if (firstSite) {
            router.push(`/editor?siteId=${firstSite.siteId}`);
        } else {
            router.push('/onboarding');
        }
    };

    const handleCreateInvoice = () => setActiveModal('invoice');
    const handleAddContact = () => setActiveModal('contact');
    const handleAIAssistant = () => setActiveModal('ai');

    const handleShare = () => {
        if (navigator.share) {
            // ... (keep existing share logic)
            navigator.share({
                title: 'Check out my site',
                url: window.location.origin
            }).catch(console.error);
        } else {
            // Fallback
            alert('Share URL copied to clipboard: ' + window.location.origin);
        }
    };

    const closeModal = () => {
        setActiveModal(null);
        setIsLoading(false);
    };

    const simulateAction = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setActiveModal(null);
            // Optional: Show success toast here if we had one
        }, 1500);
    }

    const renderModal = () => {
        if (!activeModal) return null;

        return (
            <div className={styles.modalOverlay} onClick={(e) => {
                if (e.target === e.currentTarget) closeModal();
            }}>
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <h3 className={styles.modalTitle}>
                            {activeModal === 'ai' && 'AI Assistant'}
                            {activeModal === 'invoice' && 'Create Invoice'}
                            {activeModal === 'contact' && 'Add Contact'}
                        </h3>
                        <button onClick={closeModal} className={styles.closeBtn}>&times;</button>
                    </div>

                    <form onSubmit={simulateAction}>
                        {activeModal === 'ai' && (
                            <>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>What do you want to create?</label>
                                    <textarea className={styles.input} rows={4} placeholder="e.g., Write a blog post about coffee roasting techniques..."></textarea>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Tone</label>
                                    <select className={styles.input}>
                                        <option>Professional</option>
                                        <option>Friendly</option>
                                        <option>Casual</option>
                                        <option>Excited</option>
                                    </select>
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                                    {isLoading ? 'Generating...' : 'Generate Content'}
                                </button>
                            </>
                        )}

                        {activeModal === 'invoice' && (
                            <>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Client Name</label>
                                    <input type="text" className={styles.input} placeholder="e.g., Jane Doe" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Amount ($)</label>
                                    <input type="number" className={styles.input} placeholder="0.00" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Description</label>
                                    <input type="text" className={styles.input} placeholder="Services rendered..." />
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                                    {isLoading ? 'Sending...' : 'Send Invoice'}
                                </button>
                            </>
                        )}

                        {activeModal === 'contact' && (
                            <>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Full Name</label>
                                    <input type="text" className={styles.input} placeholder="John Smith" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email</label>
                                    <input type="email" className={styles.input} placeholder="john@example.com" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Phone</label>
                                    <input type="tel" className={styles.input} placeholder="(555) 123-4567" />
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save Contact'}
                                </button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {/* Headers and Main Content */}
            <header className={styles.header}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs shadow-sm">
                        <FaLayerGroup />
                    </div>
                    <span className={`${styles.fontSerifDisplay} font-bold text-lg tracking-tight`}>SiteApe</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative text-gray-500 hover:text-gray-900 transition">
                        <FaBell className="text-xl" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden border border-gray-100">
                        <img src="https://i.pravatar.cc/150?u=marketmuse" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <section className="px-5">
                    <h1 className="text-2xl font-serif font-bold text-gray-900 leading-tight">
                        Good afternoon,<br />MarketMuse
                    </h1>
                </section>

                <section className="px-5">
                    <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Unpublished</span>
                            </div>
                            <button
                                onClick={handleEditSite}
                                className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-full"
                            >
                                Edit
                            </button>
                        </div>

                        <div className="flex justify-center w-full">
                            <div className="w-full h-96 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 relative">
                                {/* Live Site Preview - Draft Mode */}
                                <iframe
                                    src={firstSite ? `/view/${firstSite.siteId}?draft=true` : 'about:blank'}
                                    className="w-full h-full border-0"
                                    style={{ transformOrigin: 'top left', transform: 'scale(1)', width: '100%', height: '100%' }}
                                    title="Site Preview"
                                />
                                {/* Overlay to allow clicking 'Edit' but blocking interaction with iframe if needed */}
                                <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="px-5">
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="font-bold text-gray-900">Overview</h3>
                        <span className="text-xs text-gray-400">Last 7 Days</span>
                    </div>
                    <div className={styles.statsScroll}>
                        <div className={styles.statsCard}>
                            <div className="text-gray-400 text-xs font-medium mb-1"><FaUsers className="mr-1" /> Visitors</div>
                            <div className="text-2xl font-bold text-gray-900">1.2k</div>
                            <div className="text-xs text-emerald-600 font-medium mt-1"><FaArrowUp /> 12%</div>
                        </div>
                        <div className={styles.statsCard}>
                            <div className="text-gray-400 text-xs font-medium mb-1"><FaEye className="mr-1" /> Views</div>
                            <div className="text-2xl font-bold text-gray-900">3.4k</div>
                            <div className="text-xs text-emerald-600 font-medium mt-1"><FaArrowUp /> 5%</div>
                        </div>
                    </div>
                </section>

                <section className="px-5">
                    <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
                    <div className={styles.actionGrid}>
                        <button className={`${styles.actionBtn} ${styles.primary}`} onClick={handleAIAssistant}>
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                                <FaWandMagicSparkles />
                            </div>
                            <div className="font-bold text-gray-900 text-sm">AI Assistant</div>
                            <div className="text-[10px] text-gray-500">Create content</div>
                        </button>

                        <button className={styles.actionBtn} onClick={handleCreateInvoice}>
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 mb-3">
                                <FaFileInvoiceDollar />
                            </div>
                            <div className="font-bold text-gray-900 text-sm">Create Invoice</div>
                            <div className="text-[10px] text-gray-500">Get paid</div>
                        </button>

                        <button className={styles.actionBtn} onClick={handleAddContact}>
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 mb-3">
                                <FaUserPlus />
                            </div>
                            <div className="font-bold text-gray-900 text-sm">Add Contact</div>
                            <div className="text-[10px] text-gray-500">CRM entry</div>
                        </button>

                        <button className={styles.actionBtn} onClick={handleShare}>
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 mb-3">
                                <FaShareNodes />
                            </div>
                            <div className="font-bold text-gray-900 text-sm">Share Site</div>
                            <div className="text-[10px] text-gray-500">Social media</div>
                        </button>
                    </div>
                </section>

                <section className="pb-6 px-5">
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-[10px]">
                                    <FaUsers />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm">Visitor Retention</h3>
                            </div>
                            <button className="text-xs font-medium bg-gray-50 text-gray-500 px-3 py-1.5 rounded-full flex items-center gap-1">
                                6 Months <FaChevronDown className="text-[8px]" />
                            </button>
                        </div>

                        <div className="h-48 flex items-end justify-between gap-2 px-1">
                            {/* Bars */}
                            {[
                                [20, 30, 15], [15, 25, 20], [10, 20, 35],
                                [25, 40, 30], [20, 30, 25], [15, 35, 20], [10, 25, 15]
                            ].map((group, i) => (
                                <div key={i} className={styles.barCol}>
                                    <div className={styles.segment} style={{ height: `${group[0]}%`, background: '#e5e7eb' }}></div>
                                    <div className={styles.segment} style={{ height: `${group[1]}%`, background: '#34d399' }}></div>
                                    <div className={styles.segment} style={{ height: `${group[2]}%`, background: '#1f2937' }}></div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-end justify-between mt-6">
                            <div>
                                <div className="text-3xl font-extrabold text-gray-900 tracking-tight">40%</div>
                                <div className="text-xs text-gray-400 mt-1 font-medium">Return Rate</div>
                            </div>
                            <div className="flex flex-col gap-2 text-[10px] font-bold text-gray-500">
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded bg-gray-800"></span> New Users</div>
                                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded bg-emerald-400"></span> Returning</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <nav className={styles.bottomNav}>
                <button className={`${styles.navItem} ${styles.active}`}>
                    <FaHouse className="text-xl" />
                    <span>Home</span>
                </button>
                <button className={styles.navItem}>
                    <FaDesktop className="text-xl" />
                    <span>Website</span>
                </button>
                <button className={styles.navItem}>
                    <FaUsers className="text-xl" />
                    <span>Contacts</span>
                </button>
                <button className={styles.navItem}>
                    <FaBriefcase className="text-xl" />
                    <span>Tools</span>
                </button>
            </nav>

            {/* Render Modals */}
            {renderModal()}
        </div>
    );
}
