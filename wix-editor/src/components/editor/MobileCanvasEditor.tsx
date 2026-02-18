
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    FaChevronLeft, FaLayerGroup, FaArrowRotateLeft, FaBars, FaRocket,
    FaChartPie, FaQuoteLeft, FaWandMagicSparkles, FaMicrophone,
    FaStop, FaArrowUp, FaCheck
} from 'react-icons/fa6';
import styles from './MobileCanvasEditor.module.css';
import { useEditorStore } from '@/store/editorStore';
import { CanvasElement } from '@/types/editor';
import ViewerElement from '../viewer/ViewerElement';

// Suggestions Data
const suggestions: Record<string, string[]> = {
    'heading': ['Make it punchier', 'Fix grammar', 'Change font', 'Make larger'],
    'paragraph': ['Rewrite this', 'Shorten text', 'Fix grammar', 'Change font'],
    'image': ['Swap image', 'Generate new image', 'Remove overlay', 'Add shadow'],
    'button': ['Change color', 'Make round', 'Edit link', 'Outline style'],
    'section': ['Change background', 'Move down', 'Delete section'],
    'global': ['Change Theme', 'Add Contact Form', 'Regenerate Site']
};

export default function MobileCanvasEditor() {
    const router = useRouter();
    const {
        getCurrentPage,
        elements,
        selectedElementId,
        selectElement,
        updateElement,
        undo,
        canUndo,
        theme,
        layoutMode,
        resetToMobileSeed,
        resetToDesktopSeed
    } = useEditorStore();

    const [isListening, setIsListening] = useState(false);
    const [aiInputValue, setAiInputValue] = useState('');
    const [showChips, setShowChips] = useState(true);

    const BASE_WIDTH = layoutMode === 'mobile' ? 375 : 1280;
    const [scale, setScale] = useState(0.3); // Initial safe guess

    useEffect(() => {
        const handleResize = () => {
            // Calculate scale to fit the viewport width (with small buffer)
            const viewportWidth = window.innerWidth;
            // Subtracting a small amount for padding if needed, or just full width
            const newScale = viewportWidth / BASE_WIDTH;
            setScale(newScale);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [BASE_WIDTH]); // Re-run when BASE_WIDTH changes

    const currentPage = getCurrentPage();
    const selectedElement = selectedElementId ? elements[selectedElementId] : null;
    const selectedType = selectedElement ? selectedElement.type : 'global';

    // Refs for animation
    const chipContainerRef = useRef<HTMLDivElement>(null);

    const handleSelect = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();

        // Deselect if clicking the same element
        if (selectedElementId === id) {
            deselectAll();
            return;
        }

        selectElement(id);

        // Animation for chips
        setShowChips(false);
        setTimeout(() => setShowChips(true), 100);
    };

    const deselectAll = () => {
        selectElement(null);

        setShowChips(false);
        setTimeout(() => setShowChips(true), 100);
    };

    const toggleVoice = () => {
        setIsListening(!isListening);
        if (!isListening) {
            setAiInputValue('');
        }
    };

    const [isGenerating, setIsGenerating] = useState(false);

    const handleAiSubmit = async (prompt: string) => {
        if (!selectedElementId || !selectedElement) {
            alert("Please select an element first.");
            return;
        }

        setIsGenerating(true);
        setAiInputValue(prompt);

        try {
            const response = await fetch('/api/ai/edit-element', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    element: selectedElement,
                    prompt: prompt
                })
            });

            const data = await response.json();

            if (data.element) {
                updateElement(selectedElementId, data.element);
            } else {
                console.error("AI Error:", data.error);
                alert("AI failed to generate changes. Please try again.");
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("Network error. Please try again.");
        } finally {
            setIsGenerating(false);
            setAiInputValue('');
        }
    };

    const handleChipClick = (action: string) => {
        handleAiSubmit(action);
    };

    // Keep handlePublish as is
    const handlePublish = () => {
        // Mock publish
        alert('Site Published!');
        router.push('/dashboard');
    };

    if (!currentPage) return <div className="p-8 text-center">Loading site...</div>;

    return (
        <div className="bg-gray-200 min-h-screen relative overflow-hidden font-sans">
            {/* --- TOP BAR --- */}
            <div className={styles.topBar}>
                <button
                    onClick={() => router.back()}
                    className={`${styles.uiElement} ${styles.glassPill} w-10 h-10 rounded-full flex items-center justify-center text-gray-600 active:scale-95 transition`}
                >
                    <FaChevronLeft />
                </button>

                <div className={`${styles.uiElement} ${styles.glassPill} px-4 py-2 rounded-full flex items-center gap-2`}>
                    <FaLayerGroup className="text-emerald-600" />
                    <span className={`${styles.fontSerifDisplay} font-bold text-sm text-gray-900`}>SiteApe</span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => canUndo() && undo()}
                        disabled={!canUndo()}
                        className={`${styles.uiElement} ${styles.glassPill} w-10 h-10 rounded-full flex items-center justify-center text-gray-600 active:scale-95 transition ${!canUndo() ? 'opacity-50' : ''}`}
                    >
                        <FaArrowRotateLeft />
                    </button>
                    <button
                        onClick={() => {
                            if (layoutMode === 'mobile') {
                                if (confirm('Switch to Desktop Layout? This will reset your changes.')) resetToDesktopSeed();
                            } else {
                                if (confirm('Switch to Mobile Optimization? This will reset your changes.')) resetToMobileSeed();
                            }
                        }}
                        className={`${styles.uiElement} ${styles.glassPill} px-3 h-10 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 active:scale-95 transition whitespace-nowrap`}
                    >
                        {layoutMode === 'mobile' ? 'Mobile Layout' : 'Desktop Layout'}
                    </button>
                    <button
                        onClick={handlePublish}
                        className={`${styles.uiElement} bg-black text-white px-4 h-10 rounded-full text-xs font-bold shadow-lg active:scale-95 transition`}
                    >
                        Publish
                    </button>
                </div>
            </div>

            {/* --- CANVAS VIEWPORT --- */}
            <div className={styles.canvasViewport} onClick={deselectAll}>
                <div className={styles.websiteContent} style={{ minHeight: '100vh', height: currentPage.height * scale, overflow: 'hidden' }}>

                    {/* CONTAINER TRANSFORM for SCALING */}
                    <div style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        width: BASE_WIDTH,
                        height: currentPage.height,
                        position: 'relative'
                    }}>
                        {/* Background Sections */}
                        {currentPage.sections.map(section => (
                            <div
                                key={section.id}
                                style={{
                                    height: section.height,
                                    backgroundColor: section.backgroundColor,
                                    width: '100%',
                                }}
                                className={`${styles.editable} ${selectedElementId === section.id ? styles.selected : ''}`}
                                data-type={section.name}
                                onClick={(e) => handleSelect(e, section.id)}
                            />
                        ))}

                        {/* Elements Overlay - Using ORIGINAL BOUNDS */}
                        {Object.values(elements).filter(el => el.pageId === currentPage.id).map(element => (
                            <div
                                key={element.id}
                                className={`${styles.editable} ${selectedElementId === element.id ? styles.selected : ''}`}
                                data-type={element.type}
                                onClick={(e) => handleSelect(e, element.id)}
                                style={{
                                    position: 'absolute',
                                    left: element.bounds.x,
                                    top: element.bounds.y,
                                    width: element.bounds.width,
                                    height: element.bounds.height,
                                    zIndex: element.zIndex
                                }}
                            >
                                <div style={{ width: '100%', height: '100%' }}>
                                    <ViewerElement element={element} theme={theme} />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* --- BOTTOM PANEL --- */}
            <div className={styles.bottomPanel}>

                {/* Chip Container */}
                <div
                    ref={chipContainerRef}
                    className={`${styles.chipContainer} ${showChips ? styles.visible : ''}`}
                >
                    {(suggestions[selectedType] || suggestions['global']).map((text, i) => (
                        <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); handleChipClick(text); }}
                            className={`${styles.uiElement} ${styles.chip}`}
                        >
                            {text === 'Rewrite this' && <FaWandMagicSparkles className="text-emerald-500 mr-1 inline" />}
                            {text}
                        </button>
                    ))}
                </div>

                {/* AI Input Container */}
                <div className={styles.aiContainer}>
                    <div className="w-12 h-1 bg-gray-300/50 rounded-full mx-auto mt-2 mb-2"></div>

                    <div className="px-5 mt-1">
                        <div className="bg-white border border-gray-200 rounded-2xl p-2 flex items-center gap-2 shadow-sm relative">

                            {/* Voice Visualizer Overlay */}
                            <div id="voice-viz" className={`${styles.voiceVizContainer} ${isListening ? styles.active : ''}`}>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mr-2">Listening</span>
                                <div className={`${styles.bar} h-3`}></div>
                                <div className={`${styles.bar} h-5`} style={{ animationDelay: '0.1s' }}></div>
                                <div className={`${styles.bar} h-2`} style={{ animationDelay: '0.2s' }}></div>
                                <div className={`${styles.bar} h-6`} style={{ animationDelay: '0.3s' }}></div>
                                <div className={`${styles.bar} h-3`} style={{ animationDelay: '0.4s' }}></div>
                            </div>

                            <button
                                onClick={toggleVoice}
                                className={`${styles.uiElement} w-10 h-10 ${isListening ? 'bg-emerald-600' : 'bg-black'} text-white rounded-xl flex-shrink-0 flex items-center justify-center shadow-md active:scale-95 transition-all z-30`}
                            >
                                {isListening ? <FaStop /> : <FaMicrophone />}
                            </button>

                            <input
                                type="text"
                                value={aiInputValue}
                                onChange={(e) => setAiInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isGenerating) {
                                        handleAiSubmit(aiInputValue);
                                    }
                                }}
                                disabled={isGenerating}
                                placeholder={isGenerating ? "SiteApe is thinking..." : (selectedElement ? `Edit ${selectedType}...` : "Ask SiteApe to change...")}
                                className={`${styles.uiElement} flex-1 bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 outline-none px-2 h-10`}
                            />
                            <button
                                onClick={() => !isGenerating && handleAiSubmit(aiInputValue)}
                                disabled={isGenerating || !aiInputValue.trim()}
                                className={`${styles.uiElement} w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <FaArrowUp />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
