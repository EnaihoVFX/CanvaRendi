'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useEditorStore } from '@/store/editorStore';
import styles from './MediaPanel.module.css';

// Icons
const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const UploadIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const LinkIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const ImageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
    </svg>
);

// Stock images for demo
const stockImages = [
    { id: '1', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop', alt: 'Portrait' },
    { id: '2', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=200&fit=crop', alt: 'Nature' },
    { id: '3', src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop', alt: 'Business' },
    { id: '4', src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop', alt: 'Technology' },
    { id: '5', src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop', alt: 'Workspace' },
    { id: '6', src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=200&fit=crop', alt: 'Office' },
];

export default function MediaPanel() {
    const { addElement, setActivePanel } = useEditorStore();
    const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'stock'>('upload');
    const [urlInput, setUrlInput] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClose = () => {
        setActivePanel(null);
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        processFiles(files);
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        processFiles(files);
    }, []);

    const processFiles = (files: File[]) => {
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target?.result as string;
                setUploadedFiles(prev => [...prev, { name: file.name, url }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const addImageToCanvas = (src: string, alt: string = 'Image') => {
        addElement({
            type: 'image',
            bounds: { x: 100, y: 100, width: 300, height: 200 },
            props: { src, alt },
            locked: false,
            hidden: false,
        });
        handleClose();
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            addImageToCanvas(urlInput, 'Image from URL');
        }
    };

    return (
        <div className={styles.panel}>
            {/* Header */}
            <div className={styles.header}>
                <h2 className={styles.title}>Add Media</h2>
                <button className={styles.closeBtn} onClick={handleClose}>
                    <CloseIcon />
                </button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'upload' ? styles.active : ''}`}
                    onClick={() => setActiveTab('upload')}
                >
                    <UploadIcon /> Upload
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'url' ? styles.active : ''}`}
                    onClick={() => setActiveTab('url')}
                >
                    <LinkIcon /> URL
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'stock' ? styles.active : ''}`}
                    onClick={() => setActiveTab('stock')}
                >
                    <ImageIcon /> Free Images
                </button>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {activeTab === 'upload' && (
                    <div className={styles.uploadSection}>
                        <div
                            className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <UploadIcon />
                            <p className={styles.dropText}>Drag & drop images here</p>
                            <p className={styles.orText}>or</p>
                            <button className={styles.browseBtn}>Browse Files</button>
                            <p className={styles.hint}>Supports: JPG, PNG, GIF, SVG, WebP</p>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            className={styles.fileInput}
                        />

                        {/* Uploaded Files */}
                        {uploadedFiles.length > 0 && (
                            <div className={styles.uploadedSection}>
                                <h3 className={styles.sectionTitle}>Uploaded</h3>
                                <div className={styles.imageGrid}>
                                    {uploadedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className={styles.imageItem}
                                            onClick={() => addImageToCanvas(file.url, file.name)}
                                        >
                                            <img src={file.url} alt={file.name} />
                                            <span className={styles.imageName}>{file.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'url' && (
                    <div className={styles.urlSection}>
                        <label className={styles.label}>Image URL</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="https://example.com/image.jpg"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                        />
                        <button
                            className={styles.submitBtn}
                            onClick={handleUrlSubmit}
                            disabled={!urlInput.trim()}
                        >
                            Add Image
                        </button>

                        {urlInput && (
                            <div className={styles.preview}>
                                <p className={styles.previewLabel}>Preview:</p>
                                <img
                                    src={urlInput}
                                    alt="Preview"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'stock' && (
                    <div className={styles.stockSection}>
                        <p className={styles.stockInfo}>Click an image to add it to your page</p>
                        <div className={styles.stockGrid}>
                            {stockImages.map((image) => (
                                <div
                                    key={image.id}
                                    className={styles.stockItem}
                                    onClick={() => addImageToCanvas(image.src, image.alt)}
                                >
                                    <img src={image.src} alt={image.alt} />
                                    <span className={styles.stockLabel}>{image.alt}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
