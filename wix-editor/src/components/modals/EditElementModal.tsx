'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { CanvasElement, ElementType } from '@/types/editor';
import { ElementIcons, SettingsIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon } from '../icons/Icons';
import styles from './EditElementModal.module.css';

interface EditElementModalProps {
    isOpen: boolean;
    onClose: () => void;
    element: CanvasElement;
    initialTab?: 'design' | 'layout' | 'animation';
}

interface StyleConfig {
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    fontSize?: number;
    fontWeight?: number;
    shadow?: 'none' | 'sm' | 'md' | 'lg';
    padding?: number;
    opacity?: number;
}

const COLORS = [
    '#116DFF', '#00A3FF', '#00D4AA', '#22C55E',
    '#EAB308', '#F97316', '#EF4444', '#EC4899',
    '#FFFFFF', '#F1F2F4', '#94A3B8', '#64748B',
    '#334155', '#1E293B', '#0F172A', '#000000',
];

export default function EditElementModal({ isOpen, onClose, element, initialTab = 'design' }: EditElementModalProps) {
    const { updateElement } = useEditorStore();
    const modalRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [activeTab, setActiveTab] = useState<'design' | 'layout' | 'animation'>(initialTab);

    // Sync activeTab when initialTab or isOpen changes
    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    const props = element.props as Record<string, any>;

    // Initialize position to center of viewport
    useEffect(() => {
        if (isOpen && position.x === 0 && position.y === 0) {
            setPosition({
                x: window.innerWidth / 2 - 200,
                y: 100
            });
        }
    }, [isOpen, position.x, position.y]);

    // Handle dragging
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (headerRef.current?.contains(e.target as Node)) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    }, [position]);

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            setPosition({
                x: Math.max(0, Math.min(e.clientX - dragStart.x, window.innerWidth - 400)),
                y: Math.max(0, Math.min(e.clientY - dragStart.y, window.innerHeight - 200))
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    if (!isOpen) return null;

    const handleUpdate = (updates: Partial<Record<string, any>>) => {
        updateElement(element.id, {
            props: { ...element.props, ...updates }
        });
    };

    const handleBoundsUpdate = (updates: Partial<typeof element.bounds>) => {
        updateElement(element.id, {
            bounds: { ...element.bounds, ...updates }
        });
    };

    const getElementLabel = (type: ElementType) => {
        const labels: Partial<Record<ElementType, string>> = {
            'text': 'Text',
            'heading': 'Heading',
            'paragraph': 'Paragraph',
            'button': 'Button',
            'image': 'Image',
            'box': 'Box',
            'container': 'Container',
            'section': 'Section',
            'video': 'Video',
            'gallery': 'Gallery',
            'navbar': 'Navigation',
            'footer': 'Footer',
            'form': 'Form',
            'input': 'Input Field',
            'divider': 'Divider',
            'spacer': 'Spacer',
            'icon': 'Icon',
            'social-icons': 'Social Icons',
            'map': 'Google Map',
            'quote': 'Quote',
        };
        return labels[type] || 'Element';
    };

    const renderDesignSettings = () => {
        switch (element.type) {
            // ===== TEXT ELEMENTS =====
            case 'text':
            case 'heading':
            case 'paragraph':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Content</label>
                            <textarea
                                className={styles.textarea}
                                value={props.content || ''}
                                onChange={(e) => handleUpdate({ content: e.target.value })}
                                placeholder="Enter your text..."
                                rows={4}
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Font Size</label>
                            <div className={styles.sliderRow}>
                                <input
                                    type="range"
                                    min="10"
                                    max="72"
                                    value={props.fontSize || (element.type === 'heading' ? 32 : 16)}
                                    onChange={(e) => handleUpdate({ fontSize: parseInt(e.target.value) })}
                                    className={styles.slider}
                                />
                                <span className={styles.sliderValue}>{props.fontSize || (element.type === 'heading' ? 32 : 16)}px</span>
                            </div>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Font Weight</label>
                            <select
                                className={styles.select}
                                value={props.fontWeight || (element.type === 'heading' ? 700 : 400)}
                                onChange={(e) => handleUpdate({ fontWeight: parseInt(e.target.value) })}
                            >
                                <option value={300}>Light</option>
                                <option value={400}>Regular</option>
                                <option value={500}>Medium</option>
                                <option value={600}>Semibold</option>
                                <option value={700}>Bold</option>
                                <option value={800}>Extra Bold</option>
                            </select>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Line Height</label>
                            <div className={styles.sliderRow}>
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="0.1"
                                    value={props.lineHeight || 1.5}
                                    onChange={(e) => handleUpdate({ lineHeight: parseFloat(e.target.value) })}
                                    className={styles.slider}
                                />
                                <span className={styles.sliderValue}>{props.lineHeight || 1.5}</span>
                            </div>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Text Color</label>
                            <div className={styles.colorGrid}>
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        className={`${styles.colorBtn} ${props.color === color ? styles.selected : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleUpdate({ color })}
                                    />
                                ))}
                            </div>
                            <input
                                type="color"
                                className={styles.colorInput}
                                value={props.color || '#000000'}
                                onChange={(e) => handleUpdate({ color: e.target.value })}
                            />
                        </div>
                    </div>
                );

            // ===== IMAGE =====
            case 'image':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Image URL</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.src || ''}
                                onChange={(e) => handleUpdate({ src: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Alt Text</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.alt || ''}
                                onChange={(e) => handleUpdate({ alt: e.target.value })}
                                placeholder="Image description..."
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Object Fit</label>
                            <select
                                className={styles.select}
                                value={props.objectFit || 'cover'}
                                onChange={(e) => handleUpdate({ objectFit: e.target.value })}
                            >
                                <option value="cover">Cover</option>
                                <option value="contain">Contain</option>
                                <option value="fill">Fill</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Border Radius</label>
                            <div className={styles.sliderRow}>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={props.borderRadius || 0}
                                    onChange={(e) => handleUpdate({ borderRadius: parseInt(e.target.value) })}
                                    className={styles.slider}
                                />
                                <span className={styles.sliderValue}>{props.borderRadius || 0}px</span>
                            </div>
                        </div>
                    </div>
                );

            // ===== BUTTON =====
            case 'button':
            case 'submit-button':
            case 'cart-button':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Button Label</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.label || ''}
                                onChange={(e) => handleUpdate({ label: e.target.value })}
                                placeholder="Button text..."
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Link URL</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.link || ''}
                                onChange={(e) => handleUpdate({ link: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Background Color</label>
                            <div className={styles.colorGrid}>
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        className={`${styles.colorBtn} ${props.backgroundColor === color ? styles.selected : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleUpdate({ backgroundColor: color })}
                                    />
                                ))}
                            </div>
                            <input
                                type="color"
                                className={styles.colorInput}
                                value={props.backgroundColor || '#116DFF'}
                                onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Text Color</label>
                            <div className={styles.colorGrid}>
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        className={`${styles.colorBtn} ${props.textColor === color ? styles.selected : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleUpdate({ textColor: color })}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Border Radius</label>
                            <div className={styles.sliderRow}>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={props.borderRadius || 8}
                                    onChange={(e) => handleUpdate({ borderRadius: parseInt(e.target.value) })}
                                    className={styles.slider}
                                />
                                <span className={styles.sliderValue}>{props.borderRadius || 8}px</span>
                            </div>
                        </div>
                    </div>
                );

            // ===== VIDEO =====
            case 'video':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Video URL</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.src || ''}
                                onChange={(e) => handleUpdate({ src: e.target.value })}
                                placeholder="https://example.com/video.mp4"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Poster Image URL</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.poster || ''}
                                onChange={(e) => handleUpdate({ poster: e.target.value })}
                                placeholder="https://example.com/poster.jpg"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Playback Options</label>
                            <div className={styles.checkboxList}>
                                <label className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        checked={props.autoPlay || false}
                                        onChange={(e) => handleUpdate({ autoPlay: e.target.checked })}
                                    />
                                    <span>Auto Play</span>
                                </label>
                                <label className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        checked={props.loop || false}
                                        onChange={(e) => handleUpdate({ loop: e.target.checked })}
                                    />
                                    <span>Loop</span>
                                </label>
                                <label className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        checked={props.muted ?? true}
                                        onChange={(e) => handleUpdate({ muted: e.target.checked })}
                                    />
                                    <span>Muted</span>
                                </label>
                                <label className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        checked={props.controls ?? true}
                                        onChange={(e) => handleUpdate({ controls: e.target.checked })}
                                    />
                                    <span>Show Controls</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            // ===== NAVBAR =====
            case 'navbar':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Logo Text</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.logo || 'Logo'}
                                onChange={(e) => handleUpdate({ logo: e.target.value })}
                                placeholder="Your Logo"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Menu Items</label>
                            <small className={styles.hint}>Format: Label | URL (one per line)</small>
                            <textarea
                                className={styles.textarea}
                                value={(props.items || ['Home', 'About', 'Services', 'Contact'])
                                    .map((item: any) => typeof item === 'string' ? item : `${item.label} | ${item.url || ''}`)
                                    .join('\n')}
                                onChange={(e) => handleUpdate({
                                    items: e.target.value.split('\n').filter((s: string) => s.trim()).map((line: string) => {
                                        if (line.includes('|')) {
                                            const [label, url] = line.split('|');
                                            return { label: label.trim(), url: url.trim() };
                                        }
                                        return { label: line.trim(), url: '' };
                                    })
                                })}
                                placeholder="Home | /&#10;About | /about&#10;Services | /services"
                                rows={6}
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>CTA Button Text</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.ctaText || 'Get Started'}
                                onChange={(e) => handleUpdate({ ctaText: e.target.value })}
                                placeholder="Get Started"
                            />
                        </div>
                    </div>
                );

            // ===== MENU =====
            case 'menu':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Menu Items</label>
                            <small className={styles.hint}>Format: Label | URL (one per line)</small>
                            <textarea
                                className={styles.textarea}
                                value={(props.items || ['Home', 'About', 'Services', 'Contact'])
                                    .map((item: any) => typeof item === 'string' ? item : `${item.label} | ${item.url || ''}`)
                                    .join('\n')}
                                onChange={(e) => handleUpdate({
                                    items: e.target.value.split('\n').filter((s: string) => s.trim()).map((line: string) => {
                                        if (line.includes('|')) {
                                            const [label, url] = line.split('|');
                                            return { label: label.trim(), url: url.trim() };
                                        }
                                        return { label: line.trim(), url: '' };
                                    })
                                })}
                                placeholder="Home | /&#10;About | /about"
                                rows={6}
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Style</label>
                            <select
                                className={styles.select}
                                value={props.style || 'vertical'}
                                onChange={(e) => handleUpdate({ style: e.target.value })}
                            >
                                <option value="vertical">Vertical</option>
                                <option value="horizontal">Horizontal</option>
                            </select>
                        </div>
                    </div>
                );

            // ===== FOOTER =====
            case 'footer':
                const footerCols = Array.isArray(props.columns) ? props.columns : [
                    { title: 'Company', links: ['About Us', 'Careers'] },
                    { title: 'Support', links: ['Help Center', 'Contact'] },
                    { title: 'Legal', links: ['Privacy', 'Terms'] }
                ];

                const updateFooterCol = (index: number, updates: any) => {
                    const newCols = [...footerCols];
                    newCols[index] = { ...newCols[index], ...updates };
                    handleUpdate({ columns: newCols });
                };

                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Copyright Text</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.copyright || '© 2024 Your Company. All rights reserved.'}
                                onChange={(e) => handleUpdate({ copyright: e.target.value })}
                            />
                        </div>

                        {footerCols.map((col, i) => (
                            <div key={i} className={styles.settingGroup} style={{ borderTop: i > 0 ? '1px solid #eee' : 'none', paddingTop: i > 0 ? 12 : 0 }}>
                                <label className={styles.label}>Column {i + 1}</label>
                                <input
                                    type="text"
                                    className={styles.textInput}
                                    value={col.title}
                                    onChange={(e) => updateFooterCol(i, { title: e.target.value })}
                                    placeholder="Column Title"
                                    style={{ marginBottom: 8 }}
                                />
                                <textarea
                                    className={styles.textarea}
                                    value={col.links.map((l: any) => typeof l === 'string' ? l : `${l.label} | ${l.url || ''}`).join('\n')}
                                    onChange={(e) => {
                                        const newLinks = e.target.value.split('\n').filter((s: string) => s.trim()).map((line: string) => {
                                            if (line.includes('|')) {
                                                const [label, url] = line.split('|');
                                                return { label: label.trim(), url: url.trim() };
                                            }
                                            return { label: line.trim(), url: '' };
                                        });
                                        updateFooterCol(i, { links: newLinks });
                                    }}
                                    placeholder="Link Label | /url"
                                    rows={4}
                                />
                            </div>
                        ))}
                    </div>
                );

            // ===== CONTACT FORM =====
            case 'contact-form':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Submit Button Text</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.submitLabel || 'Send Message'}
                                onChange={(e) => handleUpdate({ submitLabel: e.target.value })}
                                placeholder="Send Message"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Form Fields</label>
                            <div className={styles.checkboxList}>
                                <label className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        checked={props.showName !== false}
                                        onChange={(e) => handleUpdate({ showName: e.target.checked })}
                                    />
                                    <span>Name Field</span>
                                </label>
                                <label className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        checked={props.showEmail !== false}
                                        onChange={(e) => handleUpdate({ showEmail: e.target.checked })}
                                    />
                                    <span>Email Field</span>
                                </label>
                                <label className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        checked={props.showPhone || false}
                                        onChange={(e) => handleUpdate({ showPhone: e.target.checked })}
                                    />
                                    <span>Phone Field</span>
                                </label>
                                <label className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        checked={props.showMessage !== false}
                                        onChange={(e) => handleUpdate({ showMessage: e.target.checked })}
                                    />
                                    <span>Message Field</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            // ===== SUBSCRIBE FORM =====
            case 'subscribe-form':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Placeholder Text</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.placeholder || 'Enter your email'}
                                onChange={(e) => handleUpdate({ placeholder: e.target.value })}
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Button Text</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.submitLabel || 'Subscribe'}
                                onChange={(e) => handleUpdate({ submitLabel: e.target.value })}
                                placeholder="Subscribe"
                            />
                        </div>
                    </div>
                );

            // ===== INPUT =====
            case 'input':
            case 'textarea':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Placeholder Text</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.placeholder || ''}
                                onChange={(e) => handleUpdate({ placeholder: e.target.value })}
                                placeholder="Enter placeholder text..."
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Label</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.label || ''}
                                onChange={(e) => handleUpdate({ label: e.target.value })}
                                placeholder="Field label..."
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.checkboxItem}>
                                <input
                                    type="checkbox"
                                    checked={props.required || false}
                                    onChange={(e) => handleUpdate({ required: e.target.checked })}
                                />
                                <span>Required Field</span>
                            </label>
                        </div>
                    </div>
                );

            // ===== DROPDOWN =====
            case 'dropdown':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Options (comma separated)</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={(props.options || ['Option 1', 'Option 2', 'Option 3']).join(', ')}
                                onChange={(e) => handleUpdate({ options: e.target.value.split(',').map((s: string) => s.trim()) })}
                                placeholder="Option 1, Option 2, Option 3"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Label</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.label || ''}
                                onChange={(e) => handleUpdate({ label: e.target.value })}
                                placeholder="Select an option"
                            />
                        </div>
                    </div>
                );

            // ===== CHECKBOX =====
            case 'checkbox':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Label</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.label || 'Checkbox'}
                                onChange={(e) => handleUpdate({ label: e.target.value })}
                                placeholder="Checkbox label..."
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.checkboxItem}>
                                <input
                                    type="checkbox"
                                    checked={props.defaultChecked || false}
                                    onChange={(e) => handleUpdate({ defaultChecked: e.target.checked })}
                                />
                                <span>Checked by Default</span>
                            </label>
                        </div>
                    </div>
                );

            // ===== SOCIAL ICONS =====
            case 'social-icons':
                const selectedIcons = props.icons || ['facebook', 'instagram', 'twitter', 'linkedin'];
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Platforms (comma separated)</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={selectedIcons.join(', ')}
                                onChange={(e) => handleUpdate({ icons: e.target.value.split(',').map((s: string) => s.trim().toLowerCase()) })}
                                placeholder="facebook, instagram, twitter, linkedin"
                            />
                            <small className={styles.hint}>Available: facebook, instagram, twitter, linkedin, youtube, tiktok</small>
                        </div>

                        {selectedIcons.length > 0 && (
                            <div className={styles.settingGroup}>
                                <label className={styles.label}>Links</label>
                                {selectedIcons.map((icon: string) => (
                                    <div key={icon} className={styles.inputGroup} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ width: 80, fontSize: 13, textTransform: 'capitalize' }}>{icon}:</span>
                                        <input
                                            type="text"
                                            className={styles.textInput}
                                            value={props.links?.[icon] || ''}
                                            onChange={(e) => handleUpdate({
                                                links: { ...props.links, [icon]: e.target.value }
                                            })}
                                            placeholder={`https://${icon}.com/...`}
                                            style={{ flex: 1 }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Icon Color</label>
                            <div className={styles.colorGrid}>
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        className={`${styles.colorBtn} ${props.color === color ? styles.selected : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleUpdate({ color })}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            // ===== ICON =====
            case 'icon':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Icon</label>
                            <select
                                className={styles.select}
                                value={props.icon || 'star'}
                                onChange={(e) => handleUpdate({ icon: e.target.value })}
                            >
                                <option value="star">Star</option>
                                <option value="heart">Heart</option>
                                <option value="check">Check</option>
                                <option value="arrow-right">Arrow Right</option>
                                <option value="phone">Phone</option>
                                <option value="email">Email</option>
                                <option value="location">Location</option>
                                <option value="cart">Cart</option>
                                <option value="play">Play</option>
                            </select>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Color</label>
                            <div className={styles.colorGrid}>
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        className={`${styles.colorBtn} ${props.color === color ? styles.selected : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleUpdate({ color })}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );

            // ===== DIVIDER / LINE =====
            case 'divider':
            case 'line':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Style</label>
                            <select
                                className={styles.select}
                                value={props.style || 'solid'}
                                onChange={(e) => handleUpdate({ style: e.target.value })}
                            >
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                            </select>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Direction</label>
                            <select
                                className={styles.select}
                                value={props.direction || 'horizontal'}
                                onChange={(e) => handleUpdate({ direction: e.target.value })}
                            >
                                <option value="horizontal">Horizontal</option>
                                <option value="vertical">Vertical</option>
                            </select>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Color</label>
                            <input
                                type="color"
                                className={styles.colorInput}
                                value={props.color || '#e5e7eb'}
                                onChange={(e) => handleUpdate({ color: e.target.value })}
                            />
                        </div>
                    </div>
                );

            // ===== SHAPE =====
            case 'shape':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Shape Type</label>
                            <select
                                className={styles.select}
                                value={props.shapeType || 'rectangle'}
                                onChange={(e) => handleUpdate({ shapeType: e.target.value })}
                            >
                                <option value="rectangle">Rectangle</option>
                                <option value="circle">Circle</option>
                            </select>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Fill Color</label>
                            <div className={styles.colorGrid}>
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        className={`${styles.colorBtn} ${props.fill === color ? styles.selected : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleUpdate({ fill: color })}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Border Radius</label>
                            <div className={styles.sliderRow}>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={props.borderRadius || 0}
                                    onChange={(e) => handleUpdate({ borderRadius: parseInt(e.target.value) })}
                                    className={styles.slider}
                                />
                                <span className={styles.sliderValue}>{props.borderRadius || 0}px</span>
                            </div>
                        </div>
                    </div>
                );

            // ===== LIST =====
            case 'list':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>List Items (one per line)</label>
                            <textarea
                                className={styles.textarea}
                                value={(props.items || ['Item 1', 'Item 2', 'Item 3']).join('\n')}
                                onChange={(e) => handleUpdate({ items: e.target.value.split('\n').filter((s: string) => s.trim()) })}
                                placeholder="Item 1&#10;Item 2&#10;Item 3"
                                rows={5}
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>List Style</label>
                            <select
                                className={styles.select}
                                value={props.style || 'bullet'}
                                onChange={(e) => handleUpdate({ style: e.target.value })}
                            >
                                <option value="bullet">Bullet Points</option>
                                <option value="numbered">Numbered</option>
                                <option value="check">Checkmarks</option>
                            </select>
                        </div>
                    </div>
                );

            // ===== ACCORDION =====
            case 'accordion':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Accordion Items</label>
                            <small className={styles.hint}>Format: Title | Content (one per line)</small>
                            <textarea
                                className={styles.textarea}
                                value={(props.items || [{ title: 'Question 1', content: 'Answer 1' }, { title: 'Question 2', content: 'Answer 2' }])
                                    .map((item: any) => `${item.title} | ${item.content}`).join('\n')}
                                onChange={(e) => handleUpdate({
                                    items: e.target.value.split('\n').filter((s: string) => s.includes('|')).map((line: string) => {
                                        const [title, ...content] = line.split('|');
                                        return { title: title.trim(), content: content.join('|').trim() };
                                    })
                                })}
                                placeholder="Question 1 | Answer 1&#10;Question 2 | Answer 2"
                                rows={5}
                            />
                        </div>
                    </div>
                );

            // ===== TABS =====
            case 'tabs':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Tab Names (comma separated)</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={(props.tabs || ['Tab 1', 'Tab 2', 'Tab 3']).join(', ')}
                                onChange={(e) => handleUpdate({ tabs: e.target.value.split(',').map((s: string) => s.trim()) })}
                                placeholder="Tab 1, Tab 2, Tab 3"
                            />
                        </div>
                    </div>
                );

            // ===== TABLE =====
            case 'table':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Headers (comma separated)</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={(props.headers || ['Name', 'Role', 'Status']).join(', ')}
                                onChange={(e) => handleUpdate({ headers: e.target.value.split(',').map((s: string) => s.trim()) })}
                                placeholder="Name, Role, Status"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Rows (one per line, comma separated)</label>
                            <textarea
                                className={styles.textarea}
                                value={(props.rows || [['John Doe', 'Admin', 'Active']]).map((r: string[]) => r.join(', ')).join('\n')}
                                onChange={(e) => handleUpdate({
                                    rows: e.target.value.split('\n').filter((s: string) => s.trim()).map((line: string) =>
                                        line.split(',').map((cell: string) => cell.trim())
                                    )
                                })}
                                placeholder="John Doe, Admin, Active&#10;Jane Smith, Editor, Pending"
                                rows={6}
                            />
                        </div>
                    </div>
                );

            // ===== MAP =====
            case 'map':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Location</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.location || ''}
                                onChange={(e) => handleUpdate({ location: e.target.value })}
                                placeholder="New York, NY"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Zoom Level</label>
                            <div className={styles.sliderRow}>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={props.zoom || 14}
                                    onChange={(e) => handleUpdate({ zoom: parseInt(e.target.value) })}
                                    className={styles.slider}
                                />
                                <span className={styles.sliderValue}>{props.zoom || 14}</span>
                            </div>
                        </div>
                    </div>
                );

            // ===== HTML / EMBED =====
            case 'html':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>HTML Code</label>
                            <textarea
                                className={styles.textarea}
                                value={props.code || ''}
                                onChange={(e) => handleUpdate({ code: e.target.value })}
                                placeholder="&lt;div&gt;Your HTML implementation here&lt;/div&gt;"
                                rows={10}
                                style={{ fontFamily: 'monospace', fontSize: '12px' }}
                            />
                        </div>
                    </div>
                );

            case 'embed':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Embed URL</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.src || ''}
                                onChange={(e) => handleUpdate({ src: e.target.value })}
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>
                );

            // ===== GALLERY =====
            case 'gallery':
            case 'slideshow':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Images (one URL per line)</label>
                            <textarea
                                className={styles.textarea}
                                value={(props.images || []).join('\n')}
                                onChange={(e) => handleUpdate({
                                    images: e.target.value.split('\n').filter((s: string) => s.trim())
                                })}
                                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                                rows={6}
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Columns</label>
                            <input
                                type="number"
                                className={styles.numberInput}
                                min={1}
                                max={6}
                                value={props.columns || 3}
                                onChange={(e) => handleUpdate({ columns: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Gap</label>
                            <div className={styles.sliderRow}>
                                <input
                                    type="range"
                                    min="0"
                                    max="32"
                                    value={props.gap || 8}
                                    onChange={(e) => handleUpdate({ gap: parseInt(e.target.value) })}
                                    className={styles.slider}
                                />
                                <span className={styles.sliderValue}>{props.gap || 8}px</span>
                            </div>
                        </div>
                    </div>
                );

            // ===== E-COMMERCE =====
            case 'product-card':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Product Name</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.name || ''}
                                onChange={(e) => handleUpdate({ name: e.target.value })}
                                placeholder="Product Name"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Price</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.price || ''}
                                onChange={(e) => handleUpdate({ price: e.target.value })}
                                placeholder="$99.00"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Rating (1-5)</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                className={styles.numberInput}
                                value={props.rating || 5}
                                onChange={(e) => handleUpdate({ rating: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Button Text</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.buttonText || ''}
                                onChange={(e) => handleUpdate({ buttonText: e.target.value })}
                                placeholder="Add to Cart"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Image URL</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.image || ''}
                                onChange={(e) => handleUpdate({ image: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                );

            case 'price':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Price</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.price || ''}
                                onChange={(e) => handleUpdate({ price: e.target.value })}
                                placeholder="$99.00"
                            />
                        </div>
                    </div>
                );

            case 'cart-button':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Button Label</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.label || ''}
                                onChange={(e) => handleUpdate({ label: e.target.value })}
                                placeholder="Cart (0)"
                            />
                        </div>
                    </div>
                );

            // ===== BLOG =====
            case 'blog-card':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Title</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.title || ''}
                                onChange={(e) => handleUpdate({ title: e.target.value })}
                                placeholder="Blog Post Title"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Date</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.date || ''}
                                onChange={(e) => handleUpdate({ date: e.target.value })}
                                placeholder="Oct 24, 2023"
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Excerpt</label>
                            <textarea
                                className={styles.textarea}
                                value={props.excerpt || ''}
                                onChange={(e) => handleUpdate({ excerpt: e.target.value })}
                                placeholder="Brief description of the post..."
                                rows={3}
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Image URL</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.image || ''}
                                onChange={(e) => handleUpdate({ image: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Link URL</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.link || ''}
                                onChange={(e) => handleUpdate({ link: e.target.value })}
                                placeholder="/blog/post-1"
                            />
                        </div>
                    </div>
                );

            // ===== BOX / CONTAINER / SECTION =====
            case 'box':
            case 'container':
            case 'section':
            case 'strip':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Background Color</label>
                            <div className={styles.colorGrid}>
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        className={`${styles.colorBtn} ${props.backgroundColor === color ? styles.selected : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleUpdate({ backgroundColor: color })}
                                    />
                                ))}
                            </div>
                            <input
                                type="color"
                                className={styles.colorInput}
                                value={props.backgroundColor || '#f5f5f5'}
                                onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Border Radius</label>
                            <div className={styles.sliderRow}>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={props.borderRadius || 8}
                                    onChange={(e) => handleUpdate({ borderRadius: parseInt(e.target.value) })}
                                    className={styles.slider}
                                />
                                <span className={styles.sliderValue}>{props.borderRadius || 8}px</span>
                            </div>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Border</label>
                            <div className={styles.row}>
                                <input
                                    type="number"
                                    className={styles.numberInput}
                                    value={props.borderWidth || 0}
                                    min={0}
                                    max={20}
                                    onChange={(e) => handleUpdate({ borderWidth: parseInt(e.target.value) })}
                                    placeholder="Width"
                                />
                                <input
                                    type="color"
                                    className={styles.colorInput}
                                    value={props.borderColor || '#e5e7eb'}
                                    onChange={(e) => handleUpdate({ borderColor: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Shadow</label>
                            <div className={styles.shadowOptions}>
                                {['none', 'sm', 'md', 'lg'].map((shadow) => (
                                    <button
                                        key={shadow}
                                        className={`${styles.shadowBtn} ${props.shadow === shadow ? styles.selected : ''}`}
                                        onClick={() => handleUpdate({ shadow })}
                                    >
                                        {shadow.charAt(0).toUpperCase() + shadow.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            // ===== QUOTE =====
            case 'quote':
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Quote Text</label>
                            <textarea
                                className={styles.textarea}
                                value={props.content || ''}
                                onChange={(e) => handleUpdate({ content: e.target.value })}
                                placeholder="Enter your quote..."
                                rows={4}
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Author</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={props.author || ''}
                                onChange={(e) => handleUpdate({ author: e.target.value })}
                                placeholder="Author name"
                            />
                        </div>
                    </div>
                );

            // ===== DEFAULT / FALLBACK =====
            default:
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Border Radius</label>
                            <div className={styles.sliderRow}>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={props.borderRadius || 0}
                                    onChange={(e) => handleUpdate({ borderRadius: parseInt(e.target.value) })}
                                    className={styles.slider}
                                />
                                <span className={styles.sliderValue}>{props.borderRadius || 0}px</span>
                            </div>
                        </div>
                        <div className={styles.comingSoon}>
                            <span className={styles.badge}>Basic</span>
                            <p>More specific settings for this element type will be available soon.</p>
                        </div>
                    </div>
                );
        }
    };

    const renderLayoutSettings = () => (
        <div className={styles.settingsSection}>
            <div className={styles.settingGroup}>
                <label className={styles.label}>Position</label>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputLabel}>X</span>
                        <input
                            type="number"
                            className={styles.numberInput}
                            value={element.bounds.x}
                            onChange={(e) => handleBoundsUpdate({ x: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputLabel}>Y</span>
                        <input
                            type="number"
                            className={styles.numberInput}
                            value={element.bounds.y}
                            onChange={(e) => handleBoundsUpdate({ y: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.settingGroup}>
                <label className={styles.label}>Size</label>
                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputLabel}>W</span>
                        <input
                            type="number"
                            className={styles.numberInput}
                            value={element.bounds.width}
                            onChange={(e) => handleBoundsUpdate({ width: parseInt(e.target.value) || 50 })}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <span className={styles.inputLabel}>H</span>
                        <input
                            type="number"
                            className={styles.numberInput}
                            value={element.bounds.height}
                            onChange={(e) => handleBoundsUpdate({ height: parseInt(e.target.value) || 30 })}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.settingGroup}>
                <label className={styles.label}>Rotation</label>
                <div className={styles.sliderRow}>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={element.bounds.rotation || 0}
                        onChange={(e) => handleBoundsUpdate({ rotation: parseInt(e.target.value) })}
                        className={styles.slider}
                    />
                    <span className={styles.sliderValue}>{element.bounds.rotation || 0}°</span>
                </div>
            </div>

            <div className={styles.settingGroup}>
                <label className={styles.label}>Text Alignment</label>
                <div className={styles.alignmentOptions}>
                    {['left', 'center', 'right', 'justify'].map((align) => (
                        <button
                            key={align}
                            className={`${styles.alignBtn} ${props.textAlign === align ? styles.selected : ''}`}
                            onClick={() => handleUpdate({ textAlign: align })}
                            title={align.charAt(0).toUpperCase() + align.slice(1)}
                        >
                            {align === 'left' && <AlignLeftIcon />}
                            {align === 'center' && <AlignCenterIcon />}
                            {align === 'right' && <AlignRightIcon />}
                            {align === 'justify' && <AlignJustifyIcon />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const handleAnimationUpdate = (updates: Partial<any>) => {
        const currentAnimation = element.animation || {
            type: 'none',
            duration: 0.5,
            delay: 0,
            ease: 'ease-out'
        };

        updateElement(element.id, {
            animation: { ...currentAnimation, ...updates }
        });
    };

    const renderAnimationSettings = () => (
        <div className={styles.settingsSection}>
            <div className={styles.settingGroup}>
                <label className={styles.label}>Entrance Animation</label>
                <select
                    className={styles.select}
                    value={element.animation?.type || 'none'}
                    onChange={(e) => handleAnimationUpdate({ type: e.target.value })}
                >
                    <option value="none">None</option>
                    <option value="fade-in">Fade In</option>
                    <option value="slide-up">Slide Up</option>
                    <option value="slide-down">Slide Down</option>
                    <option value="slide-left">Slide Left</option>
                    <option value="slide-right">Slide Right</option>
                    <option value="scale-up">Scale Up</option>
                    <option value="rotate-in">Rotate In</option>
                    <option value="bounce-in">Bounce In</option>
                </select>
            </div>

            {element.animation?.type && element.animation.type !== 'none' && (
                <>
                    <div className={styles.settingGroup}>
                        <label className={styles.label}>Animation Duration</label>
                        <div className={styles.sliderRow}>
                            <input
                                type="range"
                                min="0.1"
                                max="3"
                                step="0.1"
                                value={element.animation?.duration || 0.5}
                                onChange={(e) => handleAnimationUpdate({ duration: parseFloat(e.target.value) })}
                                className={styles.slider}
                            />
                            <span className={styles.sliderValue}>{element.animation?.duration || 0.5}s</span>
                        </div>
                    </div>

                    <div className={styles.settingGroup}>
                        <label className={styles.label}>Animation Delay</label>
                        <div className={styles.sliderRow}>
                            <input
                                type="range"
                                min="0"
                                max="5"
                                step="0.1"
                                value={element.animation?.delay || 0}
                                onChange={(e) => handleAnimationUpdate({ delay: parseFloat(e.target.value) })}
                                className={styles.slider}
                            />
                            <span className={styles.sliderValue}>{element.animation?.delay || 0}s</span>
                        </div>
                    </div>

                    <div className={styles.settingGroup}>
                        <label className={styles.label}>Easing</label>
                        <select
                            className={styles.select}
                            value={element.animation?.ease || 'ease-out'}
                            onChange={(e) => handleAnimationUpdate({ ease: e.target.value })}
                        >
                            <option value="linear">Linear</option>
                            <option value="ease">Ease</option>
                            <option value="ease-in">Ease In</option>
                            <option value="ease-out">Ease Out</option>
                            <option value="ease-in-out">Ease In Out</option>
                        </select>
                    </div>
                </>
            )}

            <div className={styles.comingSoon}>
                <span className={styles.badge}>Preview</span>
                <p>Animations will play automatically when the element scrolls into view on your published site.</p>
            </div>
        </div>
    );

    return (
        <div
            ref={modalRef}
            className={styles.modal}
            style={{
                left: position.x,
                top: position.y,
            }}
            onMouseDown={handleMouseDown}
        >
            <div ref={headerRef} className={styles.header}>
                <div className={styles.headerTitle}>
                    <span className={styles.elementIcon}>
                        {(() => {
                            const Icon = ElementIcons[element.type] || SettingsIcon;
                            return <Icon />;
                        })()}
                    </span>
                    <span>Edit {getElementLabel(element.type)}</span>
                </div>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'design' ? styles.active : ''}`}
                    onClick={() => setActiveTab('design')}
                >
                    Design
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'layout' ? styles.active : ''}`}
                    onClick={() => setActiveTab('layout')}
                >
                    Layout
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'animation' ? styles.active : ''}`}
                    onClick={() => setActiveTab('animation')}
                >
                    Animation
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'design' && renderDesignSettings()}
                {activeTab === 'layout' && renderLayoutSettings()}
                {activeTab === 'animation' && renderAnimationSettings()}
            </div>

            <div className={styles.footer}>
                <button className={styles.cancelBtn} onClick={onClose}>
                    Cancel
                </button>
                <button className={styles.doneBtn} onClick={onClose}>
                    Done
                </button>
            </div>
        </div>
    );
}
