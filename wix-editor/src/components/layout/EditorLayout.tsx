'use client';

import React, { useState } from 'react';
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

export default function EditorLayout() {
    const { activePanelId, isPreviewMode, setActivePanel, setPreviewMode } = useEditorStore();
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className={styles.editorContainer}>
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
