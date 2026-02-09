'use client';

import React, { useState } from 'react';
import styles from './LinkModal.module.css';

interface LinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (link: string, newTab: boolean) => void;
    currentLink?: string;
}

export default function LinkModal({ isOpen, onClose, onSubmit, currentLink }: LinkModalProps) {
    const [link, setLink] = useState(currentLink || '');
    const [openInNewTab, setOpenInNewTab] = useState(true);
    const [linkType, setLinkType] = useState<'url' | 'page' | 'email' | 'phone'>('url');

    if (!isOpen) return null;

    const handleSubmit = () => {
        let finalLink = link.trim();

        if (linkType === 'email' && !finalLink.startsWith('mailto:')) {
            finalLink = `mailto:${finalLink}`;
        } else if (linkType === 'phone' && !finalLink.startsWith('tel:')) {
            finalLink = `tel:${finalLink}`;
        } else if (linkType === 'url' && !finalLink.startsWith('http')) {
            finalLink = `https://${finalLink}`;
        }

        onSubmit(finalLink, openInNewTab);
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Add Link</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.content}>
                    <div className={styles.linkTypes}>
                        <button
                            className={`${styles.typeBtn} ${linkType === 'url' ? styles.active : ''}`}
                            onClick={() => setLinkType('url')}
                        >
                            🔗 URL
                        </button>
                        <button
                            className={`${styles.typeBtn} ${linkType === 'page' ? styles.active : ''}`}
                            onClick={() => setLinkType('page')}
                        >
                            📄 Page
                        </button>
                        <button
                            className={`${styles.typeBtn} ${linkType === 'email' ? styles.active : ''}`}
                            onClick={() => setLinkType('email')}
                        >
                            ✉️ Email
                        </button>
                        <button
                            className={`${styles.typeBtn} ${linkType === 'phone' ? styles.active : ''}`}
                            onClick={() => setLinkType('phone')}
                        >
                            📞 Phone
                        </button>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            {linkType === 'url' && 'Web Address'}
                            {linkType === 'page' && 'Page'}
                            {linkType === 'email' && 'Email Address'}
                            {linkType === 'phone' && 'Phone Number'}
                        </label>
                        <input
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder={
                                linkType === 'url' ? 'https://example.com' :
                                    linkType === 'email' ? 'email@example.com' :
                                        linkType === 'phone' ? '+1 (555) 123-4567' :
                                            'Select a page'
                            }
                            className={styles.input}
                        />
                    </div>

                    {linkType === 'url' && (
                        <label className={styles.checkbox}>
                            <input
                                type="checkbox"
                                checked={openInNewTab}
                                onChange={(e) => setOpenInNewTab(e.target.checked)}
                            />
                            <span>Open link in a new tab</span>
                        </label>
                    )}
                </div>

                <div className={styles.footer}>
                    <button className={styles.removeBtn} onClick={() => { onSubmit('', false); onClose(); }}>
                        Remove Link
                    </button>
                    <div className={styles.footerRight}>
                        <button className={styles.cancelBtn} onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className={styles.submitBtn}
                            onClick={handleSubmit}
                            disabled={!link.trim()}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
