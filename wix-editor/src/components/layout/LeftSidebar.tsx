'use client';

import React from 'react';
import { useEditorStore } from '@/store/editorStore';
import { PanelId } from '@/types/editor';
import styles from './LeftSidebar.module.css';

// SVG Icons
const AddIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
    </svg>
);

const PagesIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
    </svg>
);

const DesignIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const AppsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v8M8 12h8" />
    </svg>
);

const MediaIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
    </svg>
);

const CmsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
);

interface SidebarItem {
    id: PanelId;
    icon: React.ReactNode;
    label: string;
}

const sidebarItems: SidebarItem[] = [
    { id: 'add', icon: <AddIcon />, label: 'Add Elements' },
    { id: 'pages', icon: <PagesIcon />, label: 'Pages & Menu' },
    { id: 'design', icon: <DesignIcon />, label: 'Site Design' },
    { id: 'apps', icon: <AppsIcon />, label: 'Add Apps' },
    { id: 'media', icon: <MediaIcon />, label: 'Media' },
    { id: 'cms', icon: <CmsIcon />, label: 'CMS' },
];

export default function LeftSidebar() {
    const { activePanelId, togglePanel } = useEditorStore();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.iconList}>
                {sidebarItems.map((item) => (
                    <button
                        key={item.id}
                        className={`${styles.sidebarBtn} ${activePanelId === item.id ? styles.active : ''}`}
                        onClick={() => togglePanel(item.id)}
                        title={item.label}
                    >
                        {item.icon}
                        <span className={styles.tooltip}>{item.label}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
}
