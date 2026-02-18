'use client';

import React, { useState } from 'react';
import { UploadIcon } from '../icons/Icons';
import styles from './ImageModal.module.css';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (imageUrl: string, altText: string) => void;
    currentSrc?: string;
    currentAlt?: string;
}

const sampleImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400',
];

export default function ImageModal({ isOpen, onClose, onSubmit, currentSrc, currentAlt }: ImageModalProps) {
    const [imageUrl, setImageUrl] = useState(currentSrc || '');
    const [altText, setAltText] = useState(currentAlt || '');
    const [activeTab, setActiveTab] = useState<'url' | 'upload' | 'stock'>('url');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (imageUrl.trim()) {
            onSubmit(imageUrl.trim(), altText.trim());
            onClose();
        }
    };

    const selectStockImage = (url: string) => {
        setImageUrl(url);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Add Image</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'url' ? styles.active : ''}`}
                        onClick={() => setActiveTab('url')}
                    >
                        URL
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'upload' ? styles.active : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        Upload
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'stock' ? styles.active : ''}`}
                        onClick={() => setActiveTab('stock')}
                    >
                        Free Images
                    </button>
                </div>

                <div className={styles.content}>
                    {activeTab === 'url' && (
                        <div className={styles.urlSection}>
                            <label className={styles.label}>Image URL</label>
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className={styles.input}
                            />

                            <label className={styles.label}>Alt Text (for accessibility)</label>
                            <input
                                type="text"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                placeholder="Describe the image"
                                className={styles.input}
                            />

                            {imageUrl && (
                                <div className={styles.preview}>
                                    <img src={imageUrl} alt={altText || 'Preview'} onError={() => { }} />
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'upload' && (
                        <div className={styles.uploadSection}>
                            <div className={styles.dropZone}>
                                <span className={styles.uploadIcon}><UploadIcon /></span>
                                <p>Drag image here or click to upload</p>
                                <span className={styles.uploadHint}>PNG, JPG, GIF up to 10MB</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'stock' && (
                        <div className={styles.stockSection}>
                            <p className={styles.stockHint}>Click to select a free stock image</p>
                            <div className={styles.stockGrid}>
                                {sampleImages.map((url, idx) => (
                                    <button
                                        key={idx}
                                        className={`${styles.stockImage} ${imageUrl === url ? styles.selected : ''}`}
                                        onClick={() => selectStockImage(url)}
                                    >
                                        <img src={url} alt={`Stock image ${idx + 1}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={!imageUrl.trim()}
                    >
                        Add Image
                    </button>
                </div>
            </div>
        </div>
    );
}
