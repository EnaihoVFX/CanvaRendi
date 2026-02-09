'use client';

import React, { useState, useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import styles from './PagesPanel.module.css';

// Icons
const HomeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
);

const PageIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3,6 5,6 21,6" />
        <path d="M19,6v14a2,2 0,0 1-2,2H7a2,2 0,0 1-2-2V6m3,0V4a2,2 0,0 1,2-2h4a2,2 0,0 1,2,2v2" />
    </svg>
);

const EditIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

export default function PagesPanel() {
    const { pages, currentPageId, setCurrentPage, addPage, deletePage, renamePage, setActivePanel, setPageHeight, getCurrentPage } = useEditorStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newPageName, setNewPageName] = useState('');
    const [editingPageId, setEditingPageId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    // Local state for height input to prevent update-on-every-keystroke issues
    const currentPage = getCurrentPage();
    const currentHeight = currentPage?.height;
    const [heightInputValue, setHeightInputValue] = useState<string>('1200');

    // Sync height input from store when page changes or height changes externally
    useEffect(() => {
        if (currentHeight !== undefined) {
            const numHeight = typeof currentHeight === 'string' ? parseInt(currentHeight, 10) : currentHeight;
            setHeightInputValue(String(numHeight || 1200));
        }
    }, [currentHeight, currentPageId]);

    const handleAddPage = () => {
        if (newPageName.trim()) {
            addPage(newPageName.trim());
            setNewPageName('');
            setIsAdding(false);
        }
    };

    const handleRename = (pageId: string) => {
        if (editName.trim()) {
            renamePage(pageId, editName.trim());
            setEditingPageId(null);
            setEditName('');
        }
    };

    const startEditing = (pageId: string, currentName: string) => {
        setEditingPageId(pageId);
        setEditName(currentName);
    };

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h2 className={styles.title}>Pages</h2>
                <button
                    className={styles.closeBtn}
                    onClick={() => setActivePanel(null)}
                >
                    ×
                </button>
            </div>

            <div className={styles.content}>
                {/* Main Pages Section */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTitle}>Main Pages</span>
                        <button
                            className={styles.addBtn}
                            onClick={() => setIsAdding(true)}
                            title="Add Page"
                        >
                            <PlusIcon />
                        </button>
                    </div>

                    <div className={styles.pageList}>
                        {pages.map((page) => (
                            <div
                                key={page.id}
                                className={`${styles.pageItem} ${currentPageId === page.id ? styles.active : ''}`}
                            >
                                {editingPageId === page.id ? (
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onBlur={() => handleRename(page.id)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRename(page.id)}
                                        className={styles.editInput}
                                        autoFocus
                                    />
                                ) : (
                                    <>
                                        <button
                                            className={styles.pageBtn}
                                            onClick={() => setCurrentPage(page.id)}
                                        >
                                            {page.isHomePage ? <HomeIcon /> : <PageIcon />}
                                            <span className={styles.pageName}>{page.name}</span>
                                        </button>

                                        <div className={styles.pageActions}>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => startEditing(page.id, page.name)}
                                                title="Rename"
                                            >
                                                <EditIcon />
                                            </button>
                                            {!page.isHomePage && pages.length > 1 && (
                                                <button
                                                    className={styles.actionBtn}
                                                    onClick={() => deletePage(page.id)}
                                                    title="Delete"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}

                        {/* Add new page input */}
                        {isAdding && (
                            <div className={styles.addPageRow}>
                                <PageIcon />
                                <input
                                    type="text"
                                    value={newPageName}
                                    onChange={(e) => setNewPageName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddPage();
                                        if (e.key === 'Escape') setIsAdding(false);
                                    }}
                                    placeholder="Page name"
                                    className={styles.addInput}
                                    autoFocus
                                />
                                <button
                                    className={styles.confirmBtn}
                                    onClick={handleAddPage}
                                >
                                    Add
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Page Settings */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTitle}>Page Settings</span>
                    </div>

                    <div className={styles.settingsList}>
                        <div className={styles.settingItem}>
                            <span>Page URL</span>
                            <span className={styles.settingValue}>
                                {pages.find(p => p.id === currentPageId)?.slug || '/'}
                            </span>
                        </div>
                        <div className={styles.settingItem}>
                            <span>Page Height</span>
                            <div className={styles.heightControl}>
                                <input
                                    type="number"
                                    value={heightInputValue}
                                    onChange={(e) => setHeightInputValue(e.target.value)}
                                    onBlur={() => {
                                        const height = parseInt(heightInputValue, 10) || 1200;
                                        setPageHeight(currentPageId, height);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const height = parseInt(heightInputValue, 10) || 1200;
                                            setPageHeight(currentPageId, height);
                                            (e.target as HTMLInputElement).blur();
                                        }
                                    }}
                                    className={styles.heightInput}
                                    min={currentPage?.minHeight || 600}
                                />
                                <span className={styles.heightUnit}>px</span>
                            </div>
                        </div>
                        <div className={styles.settingItem}>
                            <span>Min Height</span>
                            <span className={styles.settingValue}>
                                {getCurrentPage()?.minHeight || 600}px
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
