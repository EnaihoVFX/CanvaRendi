'use client';

import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { useEditorStore } from '@/store/editorStore';
import CanvasElement from './CanvasElement';
import GridOverlay from './GridOverlay';
import ContextMenu from './ContextMenu';
import styles from './Canvas.module.css';
import { Page } from '@/types/editor';

interface DeviceSpec {
    name: string;
    width: number;
    height: number;
    frame: boolean;
    borderRadius?: number;
    bezel?: number;
    notch?: boolean;
    dynamicIsland?: boolean;
}

// Real device specifications
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
        notch: true,
        dynamicIsland: true,
    },
};

export default function Canvas() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const {
        selectedElementId,
        selectElement,
        addElement,
        isPreviewMode,
        isDragging,
        deleteElement,
        duplicateElement,
        undo,
        redo,
        theme,
        zoom,
        deviceMode,
        getElementsForCurrentPage,
        getCurrentPage,
        setPageHeight
    } = useEditorStore();

    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId: string } | null>(null);
    const [isResizingPage, setIsResizingPage] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const resizeStartY = useRef<number>(0);
    const resizeStartHeight = useRef<number>(0);

    // Prevent hydration mismatch by only accessing localStorage state after mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Get current page and elements for current page
    const currentPage: Page | null = getCurrentPage();
    const elementsList = getElementsForCurrentPage()
        .filter(el => !el.hidden)
        .sort((a, b) => a.zIndex - b.zIndex);

    // Get current device specs
    const device = DEVICES[deviceMode] || DEVICES.desktop;
    const canvasWidth = device.width;

    // Page content height (what can actually be scrolled through)
    const pageContentHeight = currentPage?.height || 1200;

    // Viewport height (device screen size for mobile/tablet, or page height for desktop)
    const viewportHeight = device.height;

    // Canvas height: for desktop use page height, for devices use device height as viewport
    const canvasHeight = deviceMode === 'desktop' ? pageContentHeight : viewportHeight;

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isPreviewMode) return;

            // Don't trigger shortcuts when editing text
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement ||
                (e.target instanceof HTMLElement && e.target.contentEditable === 'true')) {
                return;
            }

            // Delete selected element
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
                e.preventDefault();
                deleteElement(selectedElementId);
            }

            // Duplicate (Cmd+D)
            if ((e.metaKey || e.ctrlKey) && e.key === 'd' && selectedElementId) {
                e.preventDefault();
                duplicateElement(selectedElementId);
            }

            // Undo (Cmd+Z)
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }

            // Redo (Cmd+Shift+Z)
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                redo();
            }

            // Escape to deselect
            if (e.key === 'Escape') {
                selectElement(null);
                setContextMenu(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElementId, isPreviewMode, deleteElement, duplicateElement, undo, redo, selectElement]);

    // Page resize handlers
    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        if (!currentPage || isPreviewMode) return;
        e.preventDefault();
        setIsResizingPage(true);
        resizeStartY.current = e.clientY;
        resizeStartHeight.current = currentPage.height || 1200;
    }, [currentPage, isPreviewMode]);

    useEffect(() => {
        if (!isResizingPage) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!currentPage) return;
            const scale = (zoom / 100) * (deviceMode === 'desktop' ? 0.75 : 0.6);
            const deltaY = (e.clientY - resizeStartY.current) / scale;
            const minHeight = currentPage.minHeight || 600;
            const newHeight = Math.max(minHeight, resizeStartHeight.current + deltaY);
            setPageHeight(currentPage.id, Math.round(newHeight));
        };

        const handleMouseUp = () => {
            setIsResizingPage(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizingPage, currentPage, deviceMode, zoom, setPageHeight]);

    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains(styles.canvasInner)) {
            selectElement(null);
        }
        setContextMenu(null);
    }, [selectElement]);

    const handleContextMenu = useCallback((e: React.MouseEvent, elementId: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, elementId });
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();

        const data = e.dataTransfer.getData('element-type');
        if (!data) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const scale = zoom / 100;
        const x = (e.clientX - rect.left) / scale - 75;
        const y = (e.clientY - rect.top) / scale - 25;

        const elementData = JSON.parse(data);

        if (!currentPage) return;

        // Adjust default width for device
        let defaultWidth = elementData.defaultWidth || 150;
        if (deviceMode !== 'desktop' && defaultWidth > canvasWidth - 40) {
            defaultWidth = canvasWidth - 40;
        }

        addElement({
            type: elementData.type,
            pageId: currentPage.id,
            bounds: {
                x: Math.max(0, Math.min(x, canvasWidth - defaultWidth)),
                y: Math.max(0, y),
                width: defaultWidth,
                height: elementData.defaultHeight || 50,
            },
            props: elementData.defaultProps || {},
            locked: false,
            hidden: false,
        });
    }, [addElement, zoom, deviceMode, canvasWidth]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }, []);

    // Calculate scale to fit in viewport while maintaining aspect ratio
    const viewportScale = deviceMode === 'desktop' ? 0.75 : 0.6;
    const effectiveScale = (zoom / 100) * viewportScale;

    // Calculate frame dimensions including bezels
    const bezel = device.bezel || 0;
    const totalWidth = canvasWidth + bezel * 2;
    const totalHeight = canvasHeight + bezel * 2;
    const scaledWidth = totalWidth * effectiveScale;
    const scaledHeight = totalHeight * effectiveScale;

    return (
        <div className={`${styles.canvasContainer} ${deviceMode !== 'desktop' ? styles.deviceModeContainer : ''}`}>
            {/* Centered Content Wrapper */}
            <div style={{
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0
            }}>
                {/* Device Label */}
                <div className={styles.deviceLabel}>
                    <span className={styles.deviceName}>{device.name}</span>
                    <span className={styles.deviceSize}>{canvasWidth} × {canvasHeight}</span>
                </div>

                {/* Scaled Frame Wrapper with extra padding for resize handle */}
                <div style={{
                    width: scaledWidth,
                    height: scaledHeight + (deviceMode === 'desktop' ? 40 : 0),
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: 40 // Add some bottom breathing room
                }}>
                    {/* Device Frame Wrapper */}
                    <div
                        className={`${styles.deviceFrame} ${deviceMode !== 'desktop' ? styles.hasFrame : ''}`}
                        style={{
                            transform: `scale(${effectiveScale})`,
                            transformOrigin: 'top center',
                            width: totalWidth,
                            height: totalHeight,
                        }}
                    >
                        {/* Phone/Tablet Frame */}
                        {device.frame && (
                            <div
                                className={styles.frameOuter}
                                style={{
                                    width: totalWidth,
                                    height: totalHeight,
                                    borderRadius: device.borderRadius || 0,
                                    padding: bezel,
                                }}
                            >
                                {/* Dynamic Island (iPhone 14 Pro) */}
                                {device.dynamicIsland && (
                                    <div className={styles.dynamicIsland} />
                                )}

                                {/* Home Indicator */}
                                <div className={styles.homeIndicator} />

                                {/* Side Buttons */}
                                <div className={styles.sideButtonLeft} />
                                <div className={styles.sideButtonRight1} />
                                <div className={styles.sideButtonRight2} />
                                <div className={styles.sideButtonRight3} />
                            </div>
                        )}

                        {/* Actual Canvas - acts as scrollable viewport for mobile/tablet */}
                        <div
                            className={`${styles.canvas} ${isPreviewMode ? styles.previewMode : ''} ${deviceMode !== 'desktop' ? styles.deviceCanvas : ''}`}
                            ref={canvasRef}
                            onClick={handleCanvasClick}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            style={{
                                width: canvasWidth,
                                height: canvasHeight,
                                backgroundColor: theme.colors.background,
                                borderRadius: device.frame ? (device.borderRadius || 0) - bezel : 8,
                                position: device.frame ? 'absolute' : 'relative',
                                top: device.frame ? bezel : undefined,
                                left: device.frame ? bezel : undefined,
                                overflowY: deviceMode !== 'desktop' ? 'auto' : 'visible',
                                overflowX: 'hidden',
                            }}
                        >
                            {/* Inner content area - uses full page height for scrolling */}
                            <div
                                className={styles.canvasInner}
                                style={{
                                    minHeight: deviceMode !== 'desktop' ? pageContentHeight : '100%',
                                }}
                            >
                                {/* Grid overlay */}
                                {!isPreviewMode && <GridOverlay />}

                                {/* Canvas Elements - Only render after client mount to prevent hydration mismatch */}
                                {isMounted && elementsList.map((element) => (
                                    <CanvasElement
                                        key={element.id}
                                        element={element}
                                        isSelected={selectedElementId === element.id}
                                        isPreview={isPreviewMode}
                                        onContextMenu={(e) => handleContextMenu(e, element.id)}
                                    />
                                ))}

                                {/* Empty state */}
                                {isMounted && elementsList.length === 0 && !isDragging && (
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyIcon}>+</div>
                                        <p className={styles.emptyText}>Drag elements here</p>
                                    </div>
                                )}

                                {/* Drop zone indicator */}
                                {isDragging && (
                                    <div className={styles.dropZone}>
                                        <span>Drop here</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Page resize handle - OUTSIDE scaled wrapper for proper visibility */}
                    {deviceMode === 'desktop' && !isPreviewMode && isMounted && (
                        <div
                            className={`${styles.pageResizeHandle} ${isResizingPage ? styles.resizing : ''}`}
                            onMouseDown={handleResizeStart}
                            style={{
                                position: 'absolute',
                                bottom: '-30px', // Position slightly below the visual content
                                left: 0,
                                zIndex: 10
                            }}
                        >
                            <div className={styles.resizeHandleBar} />
                            <span className={styles.resizeHandleLabel}>
                                Drag to expand page ({Math.round(canvasHeight)}px)
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    elementId={contextMenu.elementId}
                    onClose={() => setContextMenu(null)}
                />
            )}
        </div>
    );
}
