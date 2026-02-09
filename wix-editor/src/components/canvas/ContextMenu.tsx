'use client';

import React from 'react';
import { useEditorStore } from '@/store/editorStore';
import styles from './ContextMenu.module.css';

interface ContextMenuProps {
    x: number;
    y: number;
    elementId: string;
    onClose: () => void;
}

// Icons
const DuplicateIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const DeleteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const HideIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const BringFrontIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <rect x="4" y="4" width="12" height="12" rx="2" fill="white" stroke="currentColor" />
    </svg>
);

const SendBackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="12" height="12" rx="2" />
        <rect x="8" y="8" width="12" height="12" rx="2" fill="white" stroke="currentColor" />
    </svg>
);

export default function ContextMenu({ x, y, elementId, onClose }: ContextMenuProps) {
    const {
        elements,
        duplicateElement,
        deleteElement,
        updateElement,
        bringToFront,
        sendToBack,
        bringForward,
        sendBackward
    } = useEditorStore();

    const element = elements[elementId];
    if (!element) return null;

    // Adjust position to stay within viewport
    const menuWidth = 200;
    const menuHeight = 280;
    const adjustedX = Math.min(x, window.innerWidth - menuWidth - 10);
    const adjustedY = Math.min(y, window.innerHeight - menuHeight - 10);

    const handleAction = (action: () => void) => {
        action();
        onClose();
    };

    return (
        <>
            <div className={styles.overlay} onClick={onClose} />
            <div
                className={styles.menu}
                style={{ left: adjustedX, top: adjustedY }}
                onContextMenu={(e) => e.preventDefault()}
            >
                <button onClick={() => handleAction(() => duplicateElement(elementId))}>
                    <DuplicateIcon />
                    <span>Duplicate</span>
                    <span className={styles.shortcut}>⌘D</span>
                </button>

                <div className={styles.divider} />

                <button onClick={() => handleAction(() => bringToFront(elementId))}>
                    <BringFrontIcon />
                    <span>Bring to Front</span>
                </button>
                <button onClick={() => handleAction(() => bringForward(elementId))}>
                    <BringFrontIcon />
                    <span>Bring Forward</span>
                    <span className={styles.shortcut}>⌘]</span>
                </button>
                <button onClick={() => handleAction(() => sendBackward(elementId))}>
                    <SendBackIcon />
                    <span>Send Backward</span>
                    <span className={styles.shortcut}>⌘[</span>
                </button>
                <button onClick={() => handleAction(() => sendToBack(elementId))}>
                    <SendBackIcon />
                    <span>Send to Back</span>
                </button>

                <div className={styles.divider} />

                <button onClick={() => handleAction(() => updateElement(elementId, { locked: !element.locked }))}>
                    <LockIcon />
                    <span>{element.locked ? 'Unlock' : 'Lock'}</span>
                </button>
                <button onClick={() => handleAction(() => updateElement(elementId, { hidden: !element.hidden }))}>
                    <HideIcon />
                    <span>{element.hidden ? 'Show' : 'Hide'}</span>
                </button>

                <div className={styles.divider} />

                <button className={styles.deleteBtn} onClick={() => handleAction(() => deleteElement(elementId))}>
                    <DeleteIcon />
                    <span>Delete</span>
                    <span className={styles.shortcut}>⌫</span>
                </button>
            </div>
        </>
    );
}
