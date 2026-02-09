'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
    onClose: () => void;
}

// Icons
const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const GlobalIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const ShareIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
    const { pages, currentPageId, theme, setThemeColor } = useEditorStore();
    const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'social'>('general');

    const currentPage = pages.find(p => p.id === currentPageId);

    return (
        <div className={styles.panel}>
            {/* Header */}
            <div className={styles.header}>
                <h2 className={styles.title}>Site Settings</h2>
                <button className={styles.closeBtn} onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'general' ? styles.active : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    General
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'seo' ? styles.active : ''}`}
                    onClick={() => setActiveTab('seo')}
                >
                    SEO
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'social' ? styles.active : ''}`}
                    onClick={() => setActiveTab('social')}
                >
                    Social
                </button>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {activeTab === 'general' && (
                    <div className={styles.section}>
                        <div className={styles.settingGroup}>
                            <div className={styles.settingIcon}><GlobalIcon /></div>
                            <div className={styles.settingInfo}>
                                <label>Site Name</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    defaultValue="My Website"
                                    placeholder="Enter site name"
                                />
                            </div>
                        </div>

                        <div className={styles.settingGroup}>
                            <div className={styles.settingIcon}><LockIcon /></div>
                            <div className={styles.settingInfo}>
                                <label>Favicon</label>
                                <p className={styles.hint}>Upload a 32x32px ICO or PNG</p>
                                <button className={styles.uploadBtn}>Upload Favicon</button>
                            </div>
                        </div>

                        <div className={styles.divider} />

                        <h3 className={styles.sectionTitle}>Language & Region</h3>
                        <div className={styles.settingGroup}>
                            <div className={styles.settingInfo}>
                                <label>Primary Language</label>
                                <select className={styles.select}>
                                    <option>English</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'seo' && (
                    <div className={styles.section}>
                        <div className={styles.settingGroup}>
                            <div className={styles.settingIcon}><SearchIcon /></div>
                            <div className={styles.settingInfo}>
                                <label>Meta Title</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    defaultValue={currentPage?.name || 'Home'}
                                    placeholder="Page title for search engines"
                                />
                                <p className={styles.hint}>Recommended: 50-60 characters</p>
                            </div>
                        </div>

                        <div className={styles.settingGroup}>
                            <div className={styles.settingInfo}>
                                <label>Meta Description</label>
                                <textarea
                                    className={styles.textarea}
                                    placeholder="Describe your page for search engines..."
                                    rows={3}
                                />
                                <p className={styles.hint}>Recommended: 150-160 characters</p>
                            </div>
                        </div>

                        <div className={styles.divider} />

                        <h3 className={styles.sectionTitle}>Advanced</h3>
                        <div className={styles.toggle}>
                            <label>Allow search engines to index</label>
                            <input type="checkbox" defaultChecked />
                        </div>
                    </div>
                )}

                {activeTab === 'social' && (
                    <div className={styles.section}>
                        <div className={styles.settingGroup}>
                            <div className={styles.settingIcon}><ShareIcon /></div>
                            <div className={styles.settingInfo}>
                                <label>Social Share Image</label>
                                <p className={styles.hint}>Recommended: 1200x630px</p>
                                <button className={styles.uploadBtn}>Upload Image</button>
                            </div>
                        </div>

                        <div className={styles.divider} />

                        <h3 className={styles.sectionTitle}>Social Links</h3>
                        <div className={styles.settingGroup}>
                            <div className={styles.settingInfo}>
                                <label>Facebook</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="https://facebook.com/yourpage"
                                />
                            </div>
                        </div>
                        <div className={styles.settingGroup}>
                            <div className={styles.settingInfo}>
                                <label>Instagram</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="https://instagram.com/yourprofile"
                                />
                            </div>
                        </div>
                        <div className={styles.settingGroup}>
                            <div className={styles.settingInfo}>
                                <label>Twitter/X</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="https://x.com/yourhandle"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
