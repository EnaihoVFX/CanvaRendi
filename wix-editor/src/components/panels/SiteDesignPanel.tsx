'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import styles from './SiteDesignPanel.module.css';

// Color swatches for quick selection
const colorSwatches = [
    '#116DFF', '#0057E5', '#003BA3',
    '#FF6B6B', '#FF4757', '#C0392B',
    '#4ECB71', '#27AE60', '#145A32',
    '#9B59B6', '#8E44AD', '#6C3483',
    '#F39C12', '#E67E22', '#D35400',
    '#1ABC9C', '#16A085', '#0E6655',
    '#34495E', '#2C3E50', '#1B2631',
    '#ECF0F1', '#BDC3C7', '#95A5A6',
];

const fontOptions = [
    'DM Sans',
    'Inter',
    'Roboto',
    'Open Sans',
    'Playfair Display',
    'Montserrat',
    'Poppins',
    'Lato',
    'Oswald',
    'Raleway',
];

export default function SiteDesignPanel() {
    const { theme, setThemeColor, setThemeFont, setActivePanel } = useEditorStore();
    const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'background'>('colors');

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h2 className={styles.title}>Site Design</h2>
                <button
                    className={styles.closeBtn}
                    onClick={() => setActivePanel(null)}
                >
                    ×
                </button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'colors' ? styles.active : ''}`}
                    onClick={() => setActiveTab('colors')}
                >
                    Colors
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'fonts' ? styles.active : ''}`}
                    onClick={() => setActiveTab('fonts')}
                >
                    Fonts
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'background' ? styles.active : ''}`}
                    onClick={() => setActiveTab('background')}
                >
                    Background
                </button>
            </div>

            <div className={styles.content}>
                {/* Colors Tab */}
                {activeTab === 'colors' && (
                    <div className={styles.colorsSection}>
                        <div className={styles.colorGroup}>
                            <label className={styles.label}>Primary Color</label>
                            <div className={styles.colorRow}>
                                <div
                                    className={styles.colorPreview}
                                    style={{ backgroundColor: theme.colors.primary }}
                                />
                                <input
                                    type="text"
                                    value={theme.colors.primary}
                                    onChange={(e) => setThemeColor('primary', e.target.value)}
                                    className={styles.colorInput}
                                />
                                <input
                                    type="color"
                                    value={theme.colors.primary}
                                    onChange={(e) => setThemeColor('primary', e.target.value)}
                                    className={styles.colorPicker}
                                />
                            </div>
                        </div>

                        <div className={styles.colorGroup}>
                            <label className={styles.label}>Secondary Color</label>
                            <div className={styles.colorRow}>
                                <div
                                    className={styles.colorPreview}
                                    style={{ backgroundColor: theme.colors.secondary }}
                                />
                                <input
                                    type="text"
                                    value={theme.colors.secondary}
                                    onChange={(e) => setThemeColor('secondary', e.target.value)}
                                    className={styles.colorInput}
                                />
                                <input
                                    type="color"
                                    value={theme.colors.secondary}
                                    onChange={(e) => setThemeColor('secondary', e.target.value)}
                                    className={styles.colorPicker}
                                />
                            </div>
                        </div>

                        <div className={styles.colorGroup}>
                            <label className={styles.label}>Accent Color</label>
                            <div className={styles.colorRow}>
                                <div
                                    className={styles.colorPreview}
                                    style={{ backgroundColor: theme.colors.accent }}
                                />
                                <input
                                    type="text"
                                    value={theme.colors.accent}
                                    onChange={(e) => setThemeColor('accent', e.target.value)}
                                    className={styles.colorInput}
                                />
                                <input
                                    type="color"
                                    value={theme.colors.accent}
                                    onChange={(e) => setThemeColor('accent', e.target.value)}
                                    className={styles.colorPicker}
                                />
                            </div>
                        </div>

                        <div className={styles.colorGroup}>
                            <label className={styles.label}>Text Color</label>
                            <div className={styles.colorRow}>
                                <div
                                    className={styles.colorPreview}
                                    style={{ backgroundColor: theme.colors.text }}
                                />
                                <input
                                    type="text"
                                    value={theme.colors.text}
                                    onChange={(e) => setThemeColor('text', e.target.value)}
                                    className={styles.colorInput}
                                />
                                <input
                                    type="color"
                                    value={theme.colors.text}
                                    onChange={(e) => setThemeColor('text', e.target.value)}
                                    className={styles.colorPicker}
                                />
                            </div>
                        </div>

                        <div className={styles.swatchesSection}>
                            <label className={styles.label}>Quick Colors</label>
                            <div className={styles.swatches}>
                                {colorSwatches.map((color) => (
                                    <button
                                        key={color}
                                        className={styles.swatch}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setThemeColor('primary', color)}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Fonts Tab */}
                {activeTab === 'fonts' && (
                    <div className={styles.fontsSection}>
                        <div className={styles.fontGroup}>
                            <label className={styles.label}>Heading Font</label>
                            <select
                                className={styles.fontSelect}
                                value={theme.fonts.heading}
                                onChange={(e) => setThemeFont('heading', e.target.value)}
                            >
                                {fontOptions.map((font) => (
                                    <option key={font} value={font} style={{ fontFamily: font }}>
                                        {font}
                                    </option>
                                ))}
                            </select>
                            <div className={styles.fontPreview} style={{ fontFamily: theme.fonts.heading }}>
                                The quick brown fox
                            </div>
                        </div>

                        <div className={styles.fontGroup}>
                            <label className={styles.label}>Body Font</label>
                            <select
                                className={styles.fontSelect}
                                value={theme.fonts.body}
                                onChange={(e) => setThemeFont('body', e.target.value)}
                            >
                                {fontOptions.map((font) => (
                                    <option key={font} value={font} style={{ fontFamily: font }}>
                                        {font}
                                    </option>
                                ))}
                            </select>
                            <div className={styles.fontPreview} style={{ fontFamily: theme.fonts.body, fontSize: '14px' }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </div>
                        </div>

                        <div className={styles.fontPairings}>
                            <label className={styles.label}>Popular Pairings</label>
                            <button
                                className={styles.pairingBtn}
                                onClick={() => {
                                    setThemeFont('heading', 'Playfair Display');
                                    setThemeFont('body', 'Open Sans');
                                }}
                            >
                                <span style={{ fontFamily: 'Playfair Display', fontSize: '16px' }}>Playfair</span>
                                <span style={{ fontFamily: 'Open Sans', fontSize: '12px' }}>Open Sans</span>
                            </button>
                            <button
                                className={styles.pairingBtn}
                                onClick={() => {
                                    setThemeFont('heading', 'Montserrat');
                                    setThemeFont('body', 'Roboto');
                                }}
                            >
                                <span style={{ fontFamily: 'Montserrat', fontSize: '16px' }}>Montserrat</span>
                                <span style={{ fontFamily: 'Roboto', fontSize: '12px' }}>Roboto</span>
                            </button>
                            <button
                                className={styles.pairingBtn}
                                onClick={() => {
                                    setThemeFont('heading', 'Oswald');
                                    setThemeFont('body', 'Lato');
                                }}
                            >
                                <span style={{ fontFamily: 'Oswald', fontSize: '16px' }}>Oswald</span>
                                <span style={{ fontFamily: 'Lato', fontSize: '12px' }}>Lato</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Background Tab */}
                {activeTab === 'background' && (
                    <div className={styles.backgroundSection}>
                        <div className={styles.colorGroup}>
                            <label className={styles.label}>Page Background</label>
                            <div className={styles.colorRow}>
                                <div
                                    className={styles.colorPreview}
                                    style={{ backgroundColor: theme.colors.background }}
                                />
                                <input
                                    type="text"
                                    value={theme.colors.background}
                                    onChange={(e) => setThemeColor('background', e.target.value)}
                                    className={styles.colorInput}
                                />
                                <input
                                    type="color"
                                    value={theme.colors.background}
                                    onChange={(e) => setThemeColor('background', e.target.value)}
                                    className={styles.colorPicker}
                                />
                            </div>
                        </div>

                        <div className={styles.presetBackgrounds}>
                            <label className={styles.label}>Preset Backgrounds</label>
                            <div className={styles.presetGrid}>
                                <button
                                    className={styles.presetBtn}
                                    style={{ background: '#FFFFFF' }}
                                    onClick={() => setThemeColor('background', '#FFFFFF')}
                                />
                                <button
                                    className={styles.presetBtn}
                                    style={{ background: '#F8F9FA' }}
                                    onClick={() => setThemeColor('background', '#F8F9FA')}
                                />
                                <button
                                    className={styles.presetBtn}
                                    style={{ background: '#1A1A2E' }}
                                    onClick={() => setThemeColor('background', '#1A1A2E')}
                                />
                                <button
                                    className={styles.presetBtn}
                                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                                    onClick={() => setThemeColor('background', '#667eea')}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
