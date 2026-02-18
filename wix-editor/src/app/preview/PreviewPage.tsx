'use client';

import React, { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import CanvasElement from '@/components/canvas/CanvasElement';
import styles from './PreviewPage.module.css';

interface DeviceSpec {
    name: string;
    width: number;
    height: number;
    frame: boolean;
    borderRadius?: number;
    bezel?: number;
    dynamicIsland?: boolean;
}

// Device specifications matching Canvas.tsx
const DEVICES: Record<string, DeviceSpec> = {
    desktop: {
        name: 'Desktop',
        width: 1280,
        height: 800,
        frame: false,
    },
    tablet: {
        name: 'iPad Pro 11"',
        width: 834,
        height: 1194,
        frame: true,
        borderRadius: 18,
        bezel: 20,
    },
    mobile: {
        name: 'iPhone 14 Pro',
        width: 393,
        height: 852,
        frame: true,
        borderRadius: 47,
        bezel: 12,
        dynamicIsland: true,
    },
};

type DeviceMode = keyof typeof DEVICES;

// SVG Icons
const DesktopIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
    </svg>
);

const TabletIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" />
    </svg>
);

const MobileIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
    </svg>
);

const BackIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

export default function PreviewPage() {
    const { elements, pages, currentPageId, setCurrentPage, theme } = useEditorStore();
    const [mounted, setMounted] = useState(false);
    const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Loading preview...</p>
            </div>
        );
    }

    const currentPage = pages.find(p => p.id === currentPageId);
    const device = DEVICES[deviceMode];

    // Filter elements by current page ID - exact same logic as Canvas.tsx
    const elementsList = Object.values(elements)
        .filter(el => !el.hidden && el.pageId === currentPageId)
        .sort((a, b) => a.zIndex - b.zIndex);

    // Calculate page height for scrollable content
    const pageHeight = currentPage?.height || 1200;

    const handlePageChange = (pageId: string) => {
        setCurrentPage(pageId);
    };

    const handleBackToEditor = () => {
        // Navigate back to editor or close preview
        if (window.opener) {
            window.close();
        } else {
            window.location.href = '/';
        }
    };

    // Calculate scale for device frames
    const getViewportScale = () => {
        if (deviceMode === 'desktop') return 1;
        if (typeof window === 'undefined') return 0.6;
        const maxWidth = window.innerWidth - 100;
        const maxHeight = window.innerHeight - 200;
        const scaleX = maxWidth / device.width;
        const scaleY = maxHeight / device.height;
        return Math.min(scaleX, scaleY, 0.8);
    };

    const scale = getViewportScale();

    return (
        <div className={styles.previewContainer}>
            {/* Single Unified Header */}
            <header className={styles.previewHeader}>
                {/* Left Section: Back button */}
                <div className={styles.headerLeft}>
                    <button className={styles.backBtn} onClick={handleBackToEditor}>
                        <BackIcon />
                        <span>Back to Editor</span>
                    </button>
                </div>

                {/* Center Section: Page Navigation + Device Selector */}
                <div className={styles.headerCenter}>
                    {/* Page Tabs */}
                    {pages.length > 1 && (
                        <div className={styles.pageTabs}>
                            {pages.map((page) => (
                                <button
                                    key={page.id}
                                    onClick={() => handlePageChange(page.id)}
                                    className={`${styles.pageTab} ${page.id === currentPageId ? styles.active : ''}`}
                                >
                                    {page.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Separator */}
                    {pages.length > 1 && <div className={styles.separator} />}

                    {/* Device Selector */}
                    <div className={styles.deviceSelector}>
                        <button
                            className={`${styles.deviceBtn} ${deviceMode === 'desktop' ? styles.active : ''}`}
                            onClick={() => setDeviceMode('desktop')}
                            title="Desktop (1280×800)"
                        >
                            <DesktopIcon />
                        </button>
                        <button
                            className={`${styles.deviceBtn} ${deviceMode === 'tablet' ? styles.active : ''}`}
                            onClick={() => setDeviceMode('tablet')}
                            title="Tablet (834×1194)"
                        >
                            <TabletIcon />
                        </button>
                        <button
                            className={`${styles.deviceBtn} ${deviceMode === 'mobile' ? styles.active : ''}`}
                            onClick={() => setDeviceMode('mobile')}
                            title="Mobile (393×852)"
                        >
                            <MobileIcon />
                        </button>
                    </div>
                </div>

                {/* Right Section: Device info */}
                <div className={styles.headerRight}>
                    <span className={styles.deviceInfo}>
                        {device.name} • {device.width}×{device.height}
                    </span>
                </div>
            </header>

            {/* Main Preview Area */}
            <main className={styles.previewMain}>
                {/* Device Frame Container */}
                <div
                    className={styles.deviceFrameContainer}
                    style={{
                        transform: deviceMode !== 'desktop' ? `scale(${scale})` : 'none',
                        transformOrigin: 'top center',
                    }}
                >
                    {/* Device Frame (for mobile/tablet) */}
                    {device.frame ? (
                        <div
                            className={styles.deviceFrame}
                            style={{
                                width: device.width + (device.bezel || 0) * 2,
                                height: device.height + (device.bezel || 0) * 2,
                                borderRadius: device.borderRadius,
                                padding: device.bezel,
                            }}
                        >
                            {/* Dynamic Island for iPhone */}
                            {(device as typeof DEVICES.mobile).dynamicIsland && (
                                <div className={styles.dynamicIsland} />
                            )}

                            {/* Home Indicator */}
                            <div className={styles.homeIndicator} />

                            {/* Scrollable Viewport */}
                            <div
                                className={styles.deviceViewport}
                                style={{
                                    width: device.width,
                                    height: device.height,
                                    borderRadius: (device.borderRadius || 0) - (device.bezel || 0),
                                    backgroundColor: theme.colors.background,
                                }}
                            >
                                <div
                                    className={styles.scrollableContent}
                                    style={{ height: pageHeight }}
                                >
                                    {/* Use the actual CanvasElement component for exact rendering */}
                                    {elementsList.map(element => (
                                        <CanvasElement
                                            key={element.id}
                                            element={element}
                                            isSelected={false}
                                            isPreview={true}
                                        />
                                    ))}

                                    {elementsList.length === 0 && (
                                        <div className={styles.emptyState}>
                                            <p>No elements on this page</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Desktop - No frame, just the viewport */
                        <div
                            className={styles.desktopViewport}
                            style={{
                                width: device.width,
                                maxHeight: device.height,
                                backgroundColor: theme.colors.background,
                            }}
                        >
                            <div
                                className={styles.scrollableContent}
                                style={{ minHeight: pageHeight }}
                            >
                                {/* Use the actual CanvasElement component for exact rendering */}
                                {elementsList.map(element => (
                                    <CanvasElement
                                        key={element.id}
                                        element={element}
                                        isSelected={false}
                                        isPreview={true}
                                    />
                                ))}

                                {elementsList.length === 0 && (
                                    <div className={styles.emptyState}>
                                        <p>No elements on this page</p>
                                        <p className={styles.hint}>Add elements in the editor to preview them here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
