'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import styles from './TopBar.module.css';

// SVG Icons
const UndoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 7v6h6" />
        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
);

const RedoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 7v6h-6" />
        <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
    </svg>
);

const DesktopIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
    </svg>
);

const TabletIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" />
    </svg>
);

const MobileIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

const ZoomInIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
        <path d="M11 8v6M8 11h6" />
    </svg>
);

const ZoomOutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
        <path d="M8 11h6" />
    </svg>
);

export default function TopBar() {
    const {
        pages,
        currentPageId,
        setCurrentPage,
        setPreviewMode,
        isPreviewMode,
        deviceMode,
        setDeviceMode,
        undo,
        redo,
        canUndo,
        canRedo,
        zoom,
        setZoom,
        togglePanel
    } = useEditorStore();

    const [showPageDropdown, setShowPageDropdown] = useState(false);
    const [showSaveToast, setShowSaveToast] = useState(false);

    const currentPage = pages.find(p => p.id === currentPageId);

    const handleSave = () => {
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 2000);
    };

    const handlePreview = () => {
        window.open('/preview', '_blank');
    };

    const handlePublish = () => {
        alert('🎉 Site published successfully!\n\nIn a real implementation, this would deploy your site to a live URL.');
    };

    const handlePageChange = (pageId: string) => {
        setCurrentPage(pageId);
        setShowPageDropdown(false);
    };

    return (
        <header className={styles.topBar}>
            {/* Left Section - Menus & Page Selector */}
            <div className={styles.leftSection}>
                <div className={styles.menuGroup}>
                    <button className={styles.menuBtn}>Site</button>
                    <button
                        className={styles.menuBtn}
                        onClick={() => togglePanel('design')}
                    >
                        Settings
                    </button>
                    <button className={styles.menuBtn}>Dev Mode</button>
                    <button className={styles.menuBtn}>Help</button>
                </div>

                <div className={styles.divider} />

                <div className={styles.pageDropdownContainer}>
                    <button
                        className={styles.pageSelector}
                        onClick={() => setShowPageDropdown(!showPageDropdown)}
                    >
                        <span>{currentPage?.name || 'Home'}</span>
                        <ChevronDownIcon />
                    </button>

                    {showPageDropdown && (
                        <div className={styles.pageDropdown}>
                            <div className={styles.dropdownHeader}>Switch Page</div>
                            {pages.map((page) => (
                                <button
                                    key={page.id}
                                    className={`${styles.pageOption} ${page.id === currentPageId ? styles.active : ''}`}
                                    onClick={() => handlePageChange(page.id)}
                                >
                                    <span className={styles.pageIcon}>{page.isHomePage ? '🏠' : '📄'}</span>
                                    <span>{page.name}</span>
                                </button>
                            ))}
                            <div className={styles.dropdownDivider} />
                            <button
                                className={styles.pageOption}
                                onClick={() => {
                                    togglePanel('pages');
                                    setShowPageDropdown(false);
                                }}
                            >
                                <span className={styles.pageIcon}>⚙️</span>
                                <span>Manage Pages</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Center Section - Device Mode Toggle & Zoom */}
            <div className={styles.centerSection}>
                <div className={styles.viewModeToggle}>
                    <button
                        className={`${styles.viewModeBtn} ${deviceMode === 'desktop' ? styles.active : ''}`}
                        onClick={() => setDeviceMode('desktop')}
                        title="Desktop (1280×800)"
                    >
                        <DesktopIcon />
                    </button>
                    <button
                        className={`${styles.viewModeBtn} ${deviceMode === 'tablet' ? styles.active : ''}`}
                        onClick={() => setDeviceMode('tablet')}
                        title="iPad Pro (834×1194)"
                    >
                        <TabletIcon />
                    </button>
                    <button
                        className={`${styles.viewModeBtn} ${deviceMode === 'mobile' ? styles.active : ''}`}
                        onClick={() => setDeviceMode('mobile')}
                        title="iPhone 14 Pro (393×852)"
                    >
                        <MobileIcon />
                    </button>
                </div>

                <div className={styles.zoomControls}>
                    <button
                        className={styles.zoomBtn}
                        onClick={() => setZoom(zoom - 10)}
                        disabled={zoom <= 25}
                        title="Zoom Out"
                    >
                        <ZoomOutIcon />
                    </button>
                    <span className={styles.zoomValue}>{zoom}%</span>
                    <button
                        className={styles.zoomBtn}
                        onClick={() => setZoom(zoom + 10)}
                        disabled={zoom >= 200}
                        title="Zoom In"
                    >
                        <ZoomInIcon />
                    </button>
                </div>
            </div>

            {/* Right Section - Actions */}
            <div className={styles.rightSection}>
                <button
                    className={`${styles.iconBtn} ${!canUndo() ? styles.disabled : ''}`}
                    onClick={undo}
                    disabled={!canUndo()}
                    title="Undo (⌘Z)"
                >
                    <UndoIcon />
                </button>
                <button
                    className={`${styles.iconBtn} ${!canRedo() ? styles.disabled : ''}`}
                    onClick={redo}
                    disabled={!canRedo()}
                    title="Redo (⌘⇧Z)"
                >
                    <RedoIcon />
                </button>

                <div className={styles.divider} />

                <button className={styles.saveBtn} onClick={handleSave}>
                    Save
                </button>
                <button className={styles.previewBtn} onClick={handlePreview}>
                    Preview
                </button>
                <button className={styles.publishBtn} onClick={handlePublish}>
                    Publish
                </button>
            </div>

            {/* Save Toast */}
            {showSaveToast && (
                <div className={styles.saveToast}>
                    ✓ Changes saved
                </div>
            )}
        </header>
    );
}
