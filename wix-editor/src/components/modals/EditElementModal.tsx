'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { CanvasElement, ElementType } from '@/types/editor';
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
                            <label className={styles.label}>Menu Items (comma separated)</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={(props.items || ['Home', 'About', 'Services', 'Contact']).join(', ')}
                                onChange={(e) => handleUpdate({ items: e.target.value.split(',').map((s: string) => s.trim()) })}
                                placeholder="Home, About, Services, Contact"
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
                            <label className={styles.label}>Menu Items (comma separated)</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={(props.items || ['Home', 'About', 'Services', 'Contact']).join(', ')}
                                onChange={(e) => handleUpdate({ items: e.target.value.split(',').map((s: string) => s.trim()) })}
                                placeholder="Home, About, Services, Contact"
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
                                        checked={props.showName ?? true}
                                        onChange={(e) => handleUpdate({ showName: e.target.checked })}
                                    />
                                    <span>Name Field</span>
                                </label>
                                <label className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        checked={props.showEmail ?? true}
                                        onChange={(e) => handleUpdate({ showEmail: e.target.checked })}
                                    />
                                    <span>Email Field</span>
                                </label>
                                <label className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        checked={props.showPhone ?? false}
                                        onChange={(e) => handleUpdate({ showPhone: e.target.checked })}
                                    />
                                    <span>Phone Field</span>
                                </label>
                                <label className={styles.checkboxItem}>
                                    <input
                                        type="checkbox"
                                        checked={props.showMessage ?? true}
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
                return (
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Platforms (comma separated)</label>
                            <input
                                type="text"
                                className={styles.textInput}
                                value={(props.icons || ['facebook', 'instagram', 'twitter', 'linkedin']).join(', ')}
                                onChange={(e) => handleUpdate({ icons: e.target.value.split(',').map((s: string) => s.trim().toLowerCase()) })}
                                placeholder="facebook, instagram, twitter, linkedin"
                            />
                            <small className={styles.hint}>Available: facebook, instagram, twitter, linkedin, youtube, tiktok</small>
                        </div>
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
                            <label className={styles.label}>Columns</label>
                            <input
                                type="number"
                                className={styles.numberInput}
                                min={1}
                                max={10}
                                value={props.columns || 3}
                                onChange={(e) => handleUpdate({ columns: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className={styles.settingGroup}>
                            <label className={styles.label}>Rows</label>
                            <input
                                type="number"
                                className={styles.numberInput}
                                min={2}
                                max={20}
                                value={props.rows || 3}
                                onChange={(e) => handleUpdate({ rows: parseInt(e.target.value) })}
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

            // ===== GALLERY =====
            case 'gallery':
            case 'slideshow':
                return (
                    <div className={styles.settingsSection}>
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
                            {align === 'left' && '⬅'}
                            {align === 'center' && '⬌'}
                            {align === 'right' && '➡'}
                            {align === 'justify' && '☰'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAnimationSettings = () => (
        <div className={styles.settingsSection}>
            <div className={styles.settingGroup}>
                <label className={styles.label}>Entrance Animation</label>
                <select
                    className={styles.select}
                    value={props.animation || 'none'}
                    onChange={(e) => handleUpdate({ animation: e.target.value })}
                >
                    <option value="none">None</option>
                    <option value="fadeIn">Fade In</option>
                    <option value="slideUp">Slide Up</option>
                    <option value="slideDown">Slide Down</option>
                    <option value="slideLeft">Slide Left</option>
                    <option value="slideRight">Slide Right</option>
                    <option value="zoomIn">Zoom In</option>
                    <option value="bounce">Bounce</option>
                    <option value="flip">Flip</option>
                </select>
            </div>

            <div className={styles.settingGroup}>
                <label className={styles.label}>Animation Duration</label>
                <div className={styles.sliderRow}>
                    <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={props.animationDuration || 0.5}
                        onChange={(e) => handleUpdate({ animationDuration: parseFloat(e.target.value) })}
                        className={styles.slider}
                    />
                    <span className={styles.sliderValue}>{props.animationDuration || 0.5}s</span>
                </div>
            </div>

            <div className={styles.settingGroup}>
                <label className={styles.label}>Animation Delay</label>
                <div className={styles.sliderRow}>
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={props.animationDelay || 0}
                        onChange={(e) => handleUpdate({ animationDelay: parseFloat(e.target.value) })}
                        className={styles.slider}
                    />
                    <span className={styles.sliderValue}>{props.animationDelay || 0}s</span>
                </div>
            </div>

            <div className={styles.comingSoon}>
                <span className={styles.badge}>Coming Soon</span>
                <p>Scroll animations, hover effects, and more advanced animation controls will be available soon.</p>
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
                        {element.type === 'text' && '📝'}
                        {element.type === 'heading' && '📰'}
                        {element.type === 'button' && '🔘'}
                        {element.type === 'image' && '🖼'}
                        {element.type === 'box' && '📦'}
                        {element.type === 'section' && '📋'}
                        {!['text', 'heading', 'button', 'image', 'box', 'section'].includes(element.type) && '⚙️'}
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
