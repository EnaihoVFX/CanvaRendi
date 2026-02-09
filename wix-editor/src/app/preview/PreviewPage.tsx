'use client';

import React, { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import styles from './PreviewPage.module.css';

export default function PreviewPage() {
    const { elements, pages, currentPageId, theme } = useEditorStore();
    const [mounted, setMounted] = useState(false);

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
    const elementsList = Object.values(elements)
        .filter(el => !el.hidden)
        .sort((a, b) => a.zIndex - b.zIndex);

    const renderElement = (element: typeof elementsList[0]) => {
        switch (element.type) {
            case 'text':
            case 'heading':
                const textProps = element.props as { content?: string; fontSize?: number; color?: string };
                return (
                    <div
                        key={element.id}
                        className={styles.previewElement}
                        style={{
                            position: 'absolute',
                            left: element.bounds.x,
                            top: element.bounds.y,
                            width: element.bounds.width,
                            height: element.bounds.height,
                            fontSize: textProps.fontSize || (element.type === 'heading' ? 32 : 16),
                            color: textProps.color || theme.colors.text,
                            fontFamily: element.type === 'heading' ? theme.fonts.heading : theme.fonts.body,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {textProps.content || (element.type === 'heading' ? 'Add a Heading' : 'Add text here')}
                    </div>
                );

            case 'image':
                const imageProps = element.props as { src?: string; alt?: string };
                return (
                    <div
                        key={element.id}
                        className={styles.previewElement}
                        style={{
                            position: 'absolute',
                            left: element.bounds.x,
                            top: element.bounds.y,
                            width: element.bounds.width,
                            height: element.bounds.height,
                            overflow: 'hidden',
                            borderRadius: '8px',
                        }}
                    >
                        {imageProps.src ? (
                            <img
                                src={imageProps.src}
                                alt={imageProps.alt || ''}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div className={styles.imagePlaceholder}>Image</div>
                        )}
                    </div>
                );

            case 'button':
                const buttonProps = element.props as { label?: string; backgroundColor?: string; textColor?: string; link?: string };
                return (
                    <a
                        key={element.id}
                        href={buttonProps.link || '#'}
                        className={styles.previewButton}
                        style={{
                            position: 'absolute',
                            left: element.bounds.x,
                            top: element.bounds.y,
                            width: element.bounds.width,
                            height: element.bounds.height,
                            backgroundColor: buttonProps.backgroundColor || theme.colors.primary,
                            color: buttonProps.textColor || '#FFFFFF',
                        }}
                    >
                        {buttonProps.label || 'Button'}
                    </a>
                );

            case 'box':
                const boxProps = element.props as { backgroundColor?: string; borderRadius?: number };
                return (
                    <div
                        key={element.id}
                        className={styles.previewElement}
                        style={{
                            position: 'absolute',
                            left: element.bounds.x,
                            top: element.bounds.y,
                            width: element.bounds.width,
                            height: element.bounds.height,
                            backgroundColor: boxProps.backgroundColor || '#f5f5f5',
                            borderRadius: boxProps.borderRadius || 8,
                        }}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.previewContainer} style={{ backgroundColor: theme.colors.background }}>
            {/* Preview Header */}
            <header className={styles.previewHeader}>
                <div className={styles.previewInfo}>
                    <span className={styles.previewBadge}>Preview Mode</span>
                    <span className={styles.pageName}>{currentPage?.name || 'Home'}</span>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.editBtn} onClick={() => window.close()}>
                        Back to Editor
                    </button>
                </div>
            </header>

            {/* Page Navigation (if multiple pages) */}
            {pages.length > 1 && (
                <nav className={styles.pageNav}>
                    {pages.map((page) => (
                        <a
                            key={page.id}
                            href={`#${page.slug}`}
                            className={`${styles.navLink} ${page.id === currentPageId ? styles.active : ''}`}
                        >
                            {page.name}
                        </a>
                    ))}
                </nav>
            )}

            {/* Main Content */}
            <main className={styles.previewMain}>
                <div className={styles.previewCanvas}>
                    {elementsList.map(renderElement)}

                    {elementsList.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>No elements to preview</p>
                            <p className={styles.hint}>Add some elements in the editor to see them here</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className={styles.previewFooter}>
                <p>© 2024 {currentPage?.name || 'My Site'}. Built with Wix Editor Clone.</p>
            </footer>
        </div>
    );
}
