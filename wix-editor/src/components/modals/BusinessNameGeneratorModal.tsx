'use client';

import React, { useState, useEffect } from 'react';
import { FaBolt, FaWandMagicSparkles, FaXmark, FaCheck } from 'react-icons/fa6';
import styles from './BusinessNameGeneratorModal.module.css';

interface BusinessNameGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (name: string) => void;
    initialIndustry?: string;
}

export default function BusinessNameGeneratorModal({ isOpen, onClose, onSelect, initialIndustry = '' }: BusinessNameGeneratorModalProps) {
    const [keywords, setKeywords] = useState(initialIndustry);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedNames, setGeneratedNames] = useState<string[]>([]);
    const [selectedName, setSelectedName] = useState<string | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setKeywords(initialIndustry);
            setGeneratedNames([]);
            setSelectedName(null);
        }
    }, [isOpen, initialIndustry]);

    const handleGenerate = () => {
        if (!keywords.trim()) return;

        setIsGenerating(true);
        // Simulate AI delay
        setTimeout(() => {
            const bases = keywords.split(' ').map(s => s.trim()).filter(Boolean);
            const base = bases[0] || 'Brand';

            // Mock AI Name Generation Logic
            const suffixes = ['ify', 'ly', 'hub', 'lab', 'works', 'studio', 'co', 'flow'];
            const prefixes = ['The', 'My', 'Go', 'Pure', 'Urban', 'Nova', 'Zen'];
            const newNames = [
                `${base}ify`,
                `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${base}`,
                `${base} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`,
                `${base}Station`,
                `The ${base} Collective`,
                `${base} & Co.`,
            ];

            setGeneratedNames(newNames);
            setIsGenerating(false);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <FaXmark />
                </button>

                <div className={styles.header}>
                    <div className={styles.iconWrapper}>
                        <FaWandMagicSparkles />
                    </div>
                    <h3>AI Name Generator</h3>
                    <p>Describe your business or enter keywords to generate unique name ideas.</p>
                </div>

                <div className={styles.body}>
                    <div className={styles.inputGroup}>
                        <label>Keywords / Vibe</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="e.g. Coffee, Sustainable, Modern"
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                            <button
                                className={styles.generateBtn}
                                onClick={handleGenerate}
                                disabled={isGenerating || !keywords.trim()}
                            >
                                {isGenerating ? 'Thinking...' : <><FaBolt /> Generate</>}
                            </button>
                        </div>
                    </div>

                    {generatedNames.length > 0 && (
                        <div className={styles.resultsGrid}>
                            {generatedNames.map((name, idx) => (
                                <button
                                    key={idx}
                                    className={`${styles.resultCard} ${selectedName === name ? styles.selected : ''}`}
                                    onClick={() => setSelectedName(name)}
                                >
                                    {name}
                                    {selectedName === name && <FaCheck className={styles.checkIcon} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button
                        className={styles.useBtn}
                        disabled={!selectedName}
                        onClick={() => {
                            if (selectedName) {
                                onSelect(selectedName);
                                onClose();
                            }
                        }}
                    >
                        Use Selected Name
                    </button>
                </div>
            </div>
        </div>
    );
}
