'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import TopBar from './TopBar';
import LeftSidebar from './LeftSidebar';
import Canvas from '../canvas/Canvas';
import AddElementsPanel from '../panels/AddElementsPanel';
import PagesPanel from '../panels/PagesPanel';
import SiteDesignPanel from '../panels/SiteDesignPanel';
import SettingsPanel from '../panels/SettingsPanel';
import MediaPanel from '../panels/MediaPanel';
import styles from './EditorLayout.module.css';

import MobileCanvasEditor from '../editor/MobileCanvasEditor';
import { useMobile } from '@/hooks/useMobile';
import { SiteData } from '@/types/editor';

interface EditorLayoutProps {
    initialData?: SiteData;
    siteId?: string;
}

export default function EditorLayout({ initialData, siteId }: EditorLayoutProps) {
    const { activePanelId, isPreviewMode, setActivePanel, setPreviewMode, setInitialData, setSiteId, siteId: storeSiteId } = useEditorStore();
    const [showSettings, setShowSettings] = useState(false);
    const isMobile = useMobile();
    const hasLoaded = useRef(false);

    // Force load server data on mount or when siteId changes
    useEffect(() => {
        if (!initialData || !siteId) return;
        if (hasLoaded.current && storeSiteId === siteId) return;

        hasLoaded.current = true;

        // The store expects a flat elements dict: Record<string, CanvasElement>
        // But the DB returns elements nested inside pages[].elements[]
        // Extract them into the flat dict format
        let elementsDict: Record<string, any> = {};

        if (initialData.pages) {
            for (const page of initialData.pages) {
                if (Array.isArray(page.elements)) {
                    for (const el of page.elements) {
                        if (el && el.id) {
                            elementsDict[el.id] = {
                                ...el,
                                pageId: el.pageId || page.id,
                            };
                        }
                    }
                }
            }
        }

        // If initialData.elements already has content, merge it (backward compat)
        if (initialData.elements && Object.keys(initialData.elements).length > 0) {
            elementsDict = { ...elementsDict, ...initialData.elements };
        }

        console.log(`[EDITOR] Loading site "${siteId}" with ${Object.keys(elementsDict).length} elements`);

        setSiteId(siteId);
        setInitialData({
            pages: initialData.pages,
            elements: elementsDict,
            theme: initialData.theme
        });
    }, [initialData, siteId, storeSiteId, setInitialData, setSiteId]);

    if (isMobile) {
        return <MobileCanvasEditor />;
    }

    return (
        <div className={styles.editorContainer} suppressHydrationWarning>
            {/* Top Bar */}
            {!isPreviewMode && <TopBar />}

            {/* Exit Preview Button */}
            {isPreviewMode && (
                <button
                    className={styles.exitPreviewBtn}
                    onClick={() => setPreviewMode(false)}
                >
                    ✕ Exit Preview
                </button>
            )}

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Left Sidebar */}
                {!isPreviewMode && <LeftSidebar />}

                {/* Slide-out Panels */}
                {!isPreviewMode && activePanelId === 'add' && <AddElementsPanel />}
                {!isPreviewMode && activePanelId === 'pages' && <PagesPanel />}
                {!isPreviewMode && activePanelId === 'design' && <SiteDesignPanel />}
                {!isPreviewMode && activePanelId === 'media' && <MediaPanel />}

                {/* Canvas */}
                <div className={styles.canvasWrapper}>
                    <Canvas />
                </div>

                {/* Right-side Settings Panel */}
                {!isPreviewMode && showSettings && (
                    <SettingsPanel onClose={() => setShowSettings(false)} />
                )}
            </div>
        </div>
    );
}
