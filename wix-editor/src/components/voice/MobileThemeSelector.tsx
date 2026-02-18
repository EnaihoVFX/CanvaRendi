'use client';

import React from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import styles from './MobileThemeSelector.module.css';

interface MobileThemeSelectorProps {
    selectedTheme: string;
    onSelect: (theme: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function MobileThemeSelector({ selectedTheme, onSelect, onNext, onBack }: MobileThemeSelectorProps) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.stepIndicator}>Step 2 of 2</div>
                <h1 className={styles.title}>Select sites you love</h1>
                <p className={styles.subtitle}>Which of these website structures resonates with you? This helps SiteApe understand how to organize your content.</p>
            </header>

            <div className={styles.siteGrid}>

                {/* 1. Editorial */}
                <div
                    className={`${styles.siteCard} ${selectedTheme === 'Editorial' ? styles.selected : ''}`}
                    onClick={() => onSelect('Editorial')}
                >
                    <div className={styles.browserChrome}>
                        <div className={`${styles.dot} ${styles.r}`}></div>
                        <div className={`${styles.dot} ${styles.y}`}></div>
                        <div className={`${styles.dot} ${styles.g}`}></div>
                    </div>
                    <div className={`${styles.miniSite} ${styles.layoutEditorial}`}>
                        <div className={styles.hero}>
                            <div className={styles.hLine}></div>
                            <div className={styles.subLine}></div>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.img}></div><div className={styles.img}></div><div className={styles.img}></div>
                        </div>
                    </div>
                    <div style={{ padding: 16 }}>
                        <strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>The Editorial</strong>
                        <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Focus on headlines and imagery. Best for blogs and brands.</p>
                    </div>
                </div>

                {/* 2. Converter/SaaS */}
                <div
                    className={`${styles.siteCard} ${selectedTheme === 'SaaS' ? styles.selected : ''}`}
                    onClick={() => onSelect('SaaS')}
                >
                    <div className={styles.browserChrome}>
                        <div className={`${styles.dot} ${styles.r}`}></div>
                        <div className={`${styles.dot} ${styles.y}`}></div>
                        <div className={`${styles.dot} ${styles.g}`}></div>
                    </div>
                    <div className={`${styles.miniSite} ${styles.layoutSaas}`}>
                        <div className={styles.nav}><div className={styles.navLogo}></div></div>
                        <div className={styles.hero}>
                            <div className={styles.hLine}></div><div className={styles.hLine} style={{ width: '40%' }}></div>
                            <div className={styles.btn} style={{ marginTop: 10 }}></div>
                        </div>
                        <div className={styles.logos}>
                            <div className={styles.logoDot}></div><div className={styles.logoDot}></div><div className={styles.logoDot}></div>
                        </div>
                    </div>
                    <div style={{ padding: 16 }}>
                        <strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>The Converter</strong>
                        <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Centered value prop with trust signals. Best for apps/services.</p>
                    </div>
                </div>

                {/* 3. Split */}
                <div
                    className={`${styles.siteCard} ${selectedTheme === 'Split' ? styles.selected : ''}`}
                    onClick={() => onSelect('Split')}
                >
                    <div className={styles.browserChrome}>
                        <div className={`${styles.dot} ${styles.r}`}></div>
                        <div className={`${styles.dot} ${styles.y}`}></div>
                        <div className={`${styles.dot} ${styles.g}`}></div>
                    </div>
                    <div className={`${styles.miniSite} ${styles.layoutSplit}`}>
                        <div className={styles.left}>
                            <div className={styles.hLine}></div>
                            <div className={styles.pLine}></div><div className={styles.pLine} style={{ width: '60%' }}></div>
                            <div className={styles.btn}></div>
                        </div>
                        <div className={styles.right}>
                            <div className={styles.floatingCard}>
                                <div className={styles.cardCircle}></div>
                                <div className={styles.cardLine}></div>
                                <div className={styles.cardLine} style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>
                    <div style={{ padding: 16 }}>
                        <strong style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>The Modern Split</strong>
                        <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Image and text balance. Dynamic and professional.</p>
                    </div>
                </div>

            </div>

            <div className={styles.actionBar}>
                <button className={styles.btnBack} onClick={onBack}>Back</button>
                <button className={styles.btnNext} onClick={onNext}>
                    Generate Site <FaWandMagicSparkles style={{ marginLeft: 8 }} />
                </button>
            </div>
        </div>
    );
}
