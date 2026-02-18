'use client';

import React from 'react';
import { Page, CanvasElement, SiteTheme } from '@/types/editor';
import ViewerElement from './ViewerElement';

interface ViewerCanvasProps {
    page: Page;
    elements: CanvasElement[];
    theme: SiteTheme;
}

export default function ViewerCanvas({ page, elements, theme }: ViewerCanvasProps) {
    // Sort elements by zIndex
    const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    // Scale state for responsive viewing
    const [scale, setScale] = React.useState(1);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleResize = () => {
            // Standard desktop width
            const targetWidth = 1280;
            const windowWidth = window.innerWidth;

            // Only scale down if window is smaller than target (mobile/tablet responsiveness)
            // For larger screens, we stay at scale 1 and center the content (or allow full width elements to expand)
            if (windowWidth < targetWidth) {
                setScale(windowWidth / targetWidth);
            } else {
                setScale(1);
            }
        };

        // Initial calc
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            backgroundColor: theme.colors.background,
            overflowX: 'hidden',
        }}>
            <div
                ref={containerRef}
                style={{
                    // This wrapper sets the REAL layout size in the DOM
                    width: 1280 * scale,
                    height: (page.height || 1200) * scale,
                    margin: '0 auto',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    // This inner container holds the original coordinate system
                    width: 1280,
                    height: page.height || 1200,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    // We don't limit overflow here, so full-width elements can extend out
                }}>
                    {sortedElements.map((element) => {
                        // Check if element is intended to be full width
                        const isFullWidth = element.bounds.x === 0 && element.bounds.width >= 1280;

                        const style: React.CSSProperties = {
                            position: 'absolute',
                            top: element.bounds.y,
                            zIndex: element.zIndex,
                            height: element.bounds.height,
                        };

                        if (isFullWidth) {
                            // Full width logic: Break out of the 1280px container
                            style.left = '50%';
                            style.width = `calc(100vw / ${scale})`; // Counteract parent scale
                            style.transform = `translateX(-50%) ${element.bounds.rotation ? `rotate(${element.bounds.rotation}deg)` : ''}`;
                            style.maxWidth = 'none';
                        } else {
                            // Standard positioning
                            style.left = element.bounds.x;
                            style.width = element.bounds.width;
                            style.transform = element.bounds.rotation ? `rotate(${element.bounds.rotation}deg)` : undefined;
                        }

                        return (
                            <div
                                key={element.id}
                                style={style}
                            >
                                <ViewerElement element={element} theme={theme} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
