'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useEditorStore } from '@/store/editorStore';
import { CanvasElement } from '@/types/editor';
import ImageModal from '../modals/ImageModal';
import LinkModal from '../modals/LinkModal';
import EditElementModal from '../modals/EditElementModal';
import styles from './ElementToolbar.module.css';

interface ElementToolbarProps {
    element: CanvasElement;
    screenPosition?: { x: number; y: number };
}

// Icons
const DesignIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    </svg>
);

const LayoutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
    </svg>
);

const AnimateIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
    </svg>
);

const LinkIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const DuplicateIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const DeleteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const MoreIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
    </svg>
);

const BringForwardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <rect x="4" y="4" width="12" height="12" rx="2" fill="white" stroke="currentColor" />
    </svg>
);

const SendBackwardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="12" height="12" rx="2" />
        <rect x="8" y="8" width="12" height="12" rx="2" fill="white" stroke="currentColor" />
    </svg>
);

export default function ElementToolbar({ element, screenPosition }: ElementToolbarProps) {
    const { duplicateElement, deleteElement, updateElement, bringForward, sendBackward, bringToFront, sendToBack } = useEditorStore();
    const [showImageModal, setShowImageModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editModalTab, setEditModalTab] = useState<'design' | 'layout' | 'animation'>('design');
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const openEditModal = (tab: 'design' | 'layout' | 'animation') => {
        setEditModalTab(tab);
        setShowEditModal(true);
    };

    const getElementLabel = () => {
        switch (element.type) {
            case 'text': return 'Edit Text';
            case 'heading': return 'Edit Heading';
            case 'image': return 'Change Image';
            case 'button': return 'Edit Button';
            case 'box': return 'Edit Box';
            case 'section': return 'Edit Section';
            default: return 'Edit';
        }
    };

    const handlePrimaryAction = () => {
        if (element.type === 'image') {
            setShowImageModal(true);
        } else {
            // For all other elements, open the edit modal with design tab
            openEditModal('design');
        }
    };

    const handleImageSubmit = (src: string, alt: string) => {
        updateElement(element.id, {
            props: { ...element.props, src, alt }
        });
    };

    const handleLinkSubmit = (link: string, newTab: boolean) => {
        updateElement(element.id, {
            props: { ...element.props, link, openInNewTab: newTab }
        });
    };

    // Calculate position - use screenPosition if available, otherwise fall back to element bounds
    const toolbarLeft = screenPosition ? screenPosition.x : element.bounds.x;
    const toolbarTop = screenPosition ? screenPosition.y - 50 : element.bounds.y - 50;

    const toolbarContent = (
        <>
            <div
                className={styles.toolbar}
                style={{
                    position: 'fixed',
                    left: toolbarLeft,
                    top: Math.max(10, toolbarTop), // Ensure at least 10px from top
                }}
            >
                <button className={styles.primaryBtn} onClick={handlePrimaryAction}>
                    {getElementLabel()}
                </button>

                <div className={styles.divider} />

                <button className={styles.iconBtn} title="Design" onClick={() => openEditModal('design')}>
                    <DesignIcon />
                </button>

                <button className={styles.iconBtn} title="Layout" onClick={() => openEditModal('layout')}>
                    <LayoutIcon />
                </button>

                <button className={styles.iconBtn} title="Animation" onClick={() => openEditModal('animation')}>
                    <AnimateIcon />
                </button>

                <button
                    className={styles.iconBtn}
                    title="Add Link"
                    onClick={() => setShowLinkModal(true)}
                >
                    <LinkIcon />
                </button>

                <div className={styles.divider} />

                <button
                    className={styles.iconBtn}
                    title="Duplicate"
                    onClick={() => duplicateElement(element.id)}
                >
                    <DuplicateIcon />
                </button>

                <button
                    className={styles.iconBtn}
                    title="Delete"
                    onClick={() => deleteElement(element.id)}
                >
                    <DeleteIcon />
                </button>

                <div className={styles.moreContainer}>
                    <button
                        className={styles.iconBtn}
                        title="More"
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                    >
                        <MoreIcon />
                    </button>

                    {showMoreMenu && (
                        <div className={styles.moreMenu}>
                            <button onClick={() => { bringToFront(element.id); setShowMoreMenu(false); }}>
                                <BringForwardIcon /> Bring to Front
                            </button>
                            <button onClick={() => { bringForward(element.id); setShowMoreMenu(false); }}>
                                <BringForwardIcon /> Bring Forward
                            </button>
                            <button onClick={() => { sendBackward(element.id); setShowMoreMenu(false); }}>
                                <SendBackwardIcon /> Send Backward
                            </button>
                            <button onClick={() => { sendToBack(element.id); setShowMoreMenu(false); }}>
                                <SendBackwardIcon /> Send to Back
                            </button>
                            <div className={styles.menuDivider} />
                            <button onClick={() => { duplicateElement(element.id); setShowMoreMenu(false); }}>
                                <DuplicateIcon /> Duplicate
                            </button>
                            <button className={styles.deleteOption} onClick={() => { deleteElement(element.id); setShowMoreMenu(false); }}>
                                <DeleteIcon /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Modal */}
            <ImageModal
                isOpen={showImageModal}
                onClose={() => setShowImageModal(false)}
                onSubmit={handleImageSubmit}
                currentSrc={(element.props as { src?: string }).src}
                currentAlt={(element.props as { alt?: string }).alt}
            />

            {/* Link Modal */}
            <LinkModal
                isOpen={showLinkModal}
                onClose={() => setShowLinkModal(false)}
                onSubmit={handleLinkSubmit}
                currentLink={(element.props as { link?: string }).link}
            />

            {/* Edit Element Modal */}
            <EditElementModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                element={element}
                initialTab={editModalTab}
            />
        </>
    );

    // Render to body via portal to escape canvas overflow:hidden
    if (typeof document !== 'undefined') {
        return createPortal(toolbarContent, document.body);
    }

    return null;
}
