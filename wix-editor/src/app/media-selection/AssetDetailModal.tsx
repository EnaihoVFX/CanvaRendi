'use client';

import React from 'react';
import { FaArrowLeft, FaCheck, FaRotateRight, FaUpload, FaWandMagicSparkles, FaBrain, FaCircleInfo } from 'react-icons/fa6';
import styles from './AssetDetailModal.module.css';

interface AssetDetailModalProps {
    asset: any;
    onClose: () => void;
    onKeep: () => void;
    onDiscard?: () => void;
}

export default function AssetDetailModal({ asset, onClose, onKeep, onDiscard }: AssetDetailModalProps) {
    if (!asset) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>

                {/* Nav */}
                <nav className={styles.nav}>
                    <button onClick={onClose} className={styles.btnBack}>
                        <FaArrowLeft /> Back to selection
                    </button>
                </nav>

                <div className={styles.detailContent}>
                    {/* Preview Area */}
                    <div className={styles.previewArea}>
                        <div className={styles.assetWrapper}>
                            {asset.type === 'image' && (
                                <img src={asset.src} className={styles.assetImage} alt="Asset Preview" />
                            )}
                            {(asset.type === 'text' || asset.type === 'logo') && (
                                <div
                                    className={styles.assetTextPreview}
                                    style={{ backgroundColor: asset.bg || '#fff', color: asset.color || '#000' }}
                                >
                                    {asset.content}
                                </div>
                            )}
                            {asset.type === 'palette' && (
                                <div style={{ display: 'flex', width: 300, height: 200 }}>
                                    {asset.colors?.map((c: string) => (
                                        <div key={c} style={{ flex: 1, background: c }}></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Panel */}
                    <aside className={styles.infoPanel}>

                        <div className={styles.assetMetaHeader}>
                            <span className={styles.assetType}>Selected for: {asset.label || 'Details'}</span>
                            <h1 className={styles.assetTitle}>
                                {asset.type === 'image' ? 'Visual Asset' : asset.label || 'Asset Detail'}
                            </h1>
                            <div className={styles.tagRow}>
                                <span className={`${styles.badge} ${styles.badgeAi}`}><FaWandMagicSparkles /> AI Generated</span>
                                <span className={`${styles.badge} ${styles.badgeStatus}`}><FaCheck /> High Quality</span>
                            </div>
                        </div>

                        <div className={styles.infoBlock}>
                            <span className={styles.infoLabel}>Asset Description</span>
                            <p className={styles.infoText}>
                                This asset has been curated based on your selected design preference. It matches the tone and style of your brand.
                            </p>
                        </div>

                        <div className={styles.aiReasoning}>
                            <div className={styles.aiTitle}>
                                <FaBrain /> AI Analysis
                            </div>

                            <div className={styles.scoreRow}>
                                <span>Quality Score</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div className={styles.progressMini}><div className={styles.progressFill} style={{ width: '98%' }}></div></div>
                                    <span style={{ fontWeight: 600 }}>98%</span>
                                </div>
                            </div>

                            <div className={styles.scoreRow}>
                                <span>Brand Match</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div className={styles.progressMini}><div className={styles.progressFill} style={{ width: '92%' }}></div></div>
                                    <span style={{ fontWeight: 600 }}>92%</span>
                                </div>
                            </div>

                            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 12, borderTop: '1px solid #e5e7eb', paddingTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <FaCircleInfo />
                                Optimal for high-conversion placement.
                            </p>
                        </div>

                        <div className={styles.actionsFooter}>
                            <button className={styles.btnPrimary} onClick={onKeep}>
                                <FaCheck /> Keep Asset
                            </button>

                            {/* <button className={styles.btnSecondary}>
                                <FaUpload /> Upload Replacement
                            </button> */}

                            <button className={styles.btnSecondary}>
                                <FaRotateRight /> Generate Variation
                            </button>

                            <button className={styles.btnDangerText} onClick={onDiscard || onClose}>Remove / Don't Select</button>
                        </div>

                    </aside>
                </div>

            </div>
        </div>
    );
}
