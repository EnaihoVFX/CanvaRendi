'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { ElementType } from '@/types/editor';
import * as Icons from '@/components/icons/Icons';
import styles from './AddElementsPanel.module.css';

// Comprehensive Element Categories - All Wix element types
const categories = [
    {
        id: 'text',
        name: 'Text',
        icon: Icons.TextIcon,
        items: [
            { type: 'heading' as ElementType, name: 'Heading', icon: Icons.HeadingIcon, defaultWidth: 400, defaultHeight: 60, props: { content: 'Add a Heading', fontSize: 48, fontWeight: 700, textAlign: 'left' } },
            { type: 'heading' as ElementType, name: 'Subheading', icon: Icons.HeadingIcon, defaultWidth: 350, defaultHeight: 45, props: { content: 'Add a Subheading', fontSize: 28, fontWeight: 600, textAlign: 'left' } },
            { type: 'paragraph' as ElementType, name: 'Paragraph', icon: Icons.TextIcon, defaultWidth: 400, defaultHeight: 100, props: { content: 'Add your text here. Click to start editing. You can drag the corners to resize.', fontSize: 16, lineHeight: 1.6 } },
            { type: 'text' as ElementType, name: 'Small Text', icon: Icons.TextIcon, defaultWidth: 300, defaultHeight: 40, props: { content: 'Small text for captions', fontSize: 13, color: '#666666' } },
        ],
    },
    {
        id: 'image',
        name: 'Image',
        icon: Icons.ImageIcon,
        items: [
            { type: 'image' as ElementType, name: 'Image', icon: Icons.ImageIcon, defaultWidth: 350, defaultHeight: 250, props: { objectFit: 'cover' } },
            { type: 'image' as ElementType, name: 'Circle Image', icon: Icons.CircleIcon, defaultWidth: 200, defaultHeight: 200, props: { objectFit: 'cover', borderRadius: 100 } },
            { type: 'image' as ElementType, name: 'Rounded Image', icon: Icons.ImageIcon, defaultWidth: 300, defaultHeight: 200, props: { objectFit: 'cover', borderRadius: 16 } },
        ],
    },
    {
        id: 'button',
        name: 'Button',
        icon: Icons.ButtonIcon,
        items: [
            { type: 'button' as ElementType, name: 'Primary Button', icon: Icons.ButtonIcon, defaultWidth: 180, defaultHeight: 50, props: { label: 'Get Started', backgroundColor: '#116DFF', textColor: '#FFFFFF', borderRadius: 8 } },
            { type: 'button' as ElementType, name: 'Secondary Button', icon: Icons.ButtonIcon, defaultWidth: 160, defaultHeight: 48, props: { label: 'Learn More', backgroundColor: '#FFFFFF', textColor: '#116DFF', borderColor: '#116DFF', borderWidth: 2, borderRadius: 8 } },
            { type: 'button' as ElementType, name: 'Pill Button', icon: Icons.ButtonIcon, defaultWidth: 150, defaultHeight: 44, props: { label: 'Sign Up', backgroundColor: '#10B981', textColor: '#FFFFFF', borderRadius: 50 } },
            { type: 'button' as ElementType, name: 'Ghost Button', icon: Icons.ButtonIcon, defaultWidth: 140, defaultHeight: 44, props: { label: 'Explore', backgroundColor: 'transparent', textColor: '#20303C', borderColor: '#20303C', borderWidth: 1, borderRadius: 4 } },
            { type: 'button' as ElementType, name: 'Icon Button', icon: Icons.ArrowRightIcon, defaultWidth: 50, defaultHeight: 50, props: { label: '→', backgroundColor: '#116DFF', textColor: '#FFFFFF', borderRadius: 50 } },
        ],
    },
    {
        id: 'box',
        name: 'Box & Container',
        icon: Icons.BoxIcon,
        items: [
            { type: 'box' as ElementType, name: 'Container', icon: Icons.ContainerIcon, defaultWidth: 400, defaultHeight: 300, props: { backgroundColor: '#F9FAFB', borderRadius: 12 } },
            { type: 'box' as ElementType, name: 'Card', icon: Icons.BoxIcon, defaultWidth: 320, defaultHeight: 380, props: { backgroundColor: '#FFFFFF', borderRadius: 16, shadow: 'lg', borderColor: '#E5E7EB', borderWidth: 1 } },
            { type: 'box' as ElementType, name: 'Feature Box', icon: Icons.BoxIcon, defaultWidth: 280, defaultHeight: 200, props: { backgroundColor: '#EEF2FF', borderRadius: 12 } },
            { type: 'box' as ElementType, name: 'Glass Card', icon: Icons.BoxIcon, defaultWidth: 300, defaultHeight: 250, props: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, shadow: 'lg', backdropBlur: true } },
        ],
    },
    {
        id: 'strip',
        name: 'Strip & Section',
        icon: Icons.SectionIcon,
        items: [
            { type: 'section' as ElementType, name: 'Full Width Strip', icon: Icons.SectionIcon, defaultWidth: 980, defaultHeight: 400, props: { backgroundColor: '#FFFFFF' } },
            { type: 'section' as ElementType, name: 'Hero Section', icon: Icons.SectionIcon, defaultWidth: 980, defaultHeight: 600, props: { backgroundColor: '#1a1a2e' } },
            { type: 'section' as ElementType, name: 'Color Strip', icon: Icons.SectionIcon, defaultWidth: 980, defaultHeight: 300, props: { backgroundColor: '#116DFF' } },
            { type: 'section' as ElementType, name: 'Gradient Strip', icon: Icons.SectionIcon, defaultWidth: 980, defaultHeight: 350, props: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' } },
        ],
    },
    {
        id: 'gallery',
        name: 'Gallery',
        icon: Icons.GalleryIcon,
        items: [
            { type: 'gallery' as ElementType, name: 'Grid Gallery', icon: Icons.GalleryIcon, defaultWidth: 600, defaultHeight: 400, props: { columns: 3, gap: 16, style: 'grid' } },
            { type: 'slideshow' as ElementType, name: 'Slideshow', icon: Icons.SlideshowIcon, defaultWidth: 600, defaultHeight: 400, props: { autoPlay: true, transition: 'slide' } },
            { type: 'gallery' as ElementType, name: 'Masonry Gallery', icon: Icons.GalleryIcon, defaultWidth: 600, defaultHeight: 450, props: { style: 'masonry', gap: 12 } },
        ],
    },
    {
        id: 'video',
        name: 'Video',
        icon: Icons.VideoIcon,
        items: [
            { type: 'video' as ElementType, name: 'Video Player', icon: Icons.VideoIcon, defaultWidth: 560, defaultHeight: 315, props: { controls: true } },
            { type: 'video' as ElementType, name: 'Background Video', icon: Icons.VideoIcon, defaultWidth: 800, defaultHeight: 450, props: { autoPlay: true, loop: true, muted: true } },
            { type: 'embed' as ElementType, name: 'YouTube Embed', icon: Icons.YouTubeIcon, defaultWidth: 560, defaultHeight: 315, props: { platform: 'youtube' } },
        ],
    },
    {
        id: 'navigation',
        name: 'Navigation',
        icon: Icons.MenuIcon,
        items: [
            { type: 'navbar' as ElementType, name: 'Navigation Bar', icon: Icons.NavbarIcon, defaultWidth: 980, defaultHeight: 70, props: { style: 'horizontal', items: ['Home', 'About', 'Services', 'Contact'] } },
            { type: 'menu' as ElementType, name: 'Menu', icon: Icons.MenuIcon, defaultWidth: 200, defaultHeight: 200, props: { style: 'vertical', items: ['Home', 'About', 'Services', 'Contact'] } },
            { type: 'footer' as ElementType, name: 'Footer', icon: Icons.FooterIcon, defaultWidth: 980, defaultHeight: 200, props: { columns: 4 } },
        ],
    },
    {
        id: 'form',
        name: 'Forms & Input',
        icon: Icons.FormIcon,
        items: [
            { type: 'contact-form' as ElementType, name: 'Contact Form', icon: Icons.FormIcon, defaultWidth: 400, defaultHeight: 350, props: { fields: ['name', 'email', 'message'], submitLabel: 'Send Message' } },
            { type: 'subscribe-form' as ElementType, name: 'Subscribe Form', icon: Icons.EmailIcon, defaultWidth: 350, defaultHeight: 80, props: { placeholder: 'Enter your email', submitLabel: 'Subscribe' } },
            { type: 'input' as ElementType, name: 'Text Input', icon: Icons.InputIcon, defaultWidth: 300, defaultHeight: 50, props: { placeholder: 'Enter text...', type: 'text' } },
            { type: 'textarea' as ElementType, name: 'Text Area', icon: Icons.TextareaIcon, defaultWidth: 350, defaultHeight: 120, props: { placeholder: 'Your message...' } },
            { type: 'dropdown' as ElementType, name: 'Dropdown', icon: Icons.DropdownIcon, defaultWidth: 250, defaultHeight: 45, props: { options: ['Option 1', 'Option 2', 'Option 3'] } },
            { type: 'checkbox' as ElementType, name: 'Checkbox', icon: Icons.CheckboxIcon, defaultWidth: 200, defaultHeight: 30, props: { label: 'I agree to terms' } },
        ],
    },
    {
        id: 'social',
        name: 'Social',
        icon: Icons.SocialIcon,
        items: [
            { type: 'social-icons' as ElementType, name: 'Social Bar', icon: Icons.SocialIcon, defaultWidth: 200, defaultHeight: 40, props: { icons: ['facebook', 'instagram', 'twitter', 'linkedin'], style: 'filled' } },
            { type: 'icon' as ElementType, name: 'Facebook', icon: Icons.FacebookIcon, defaultWidth: 40, defaultHeight: 40, props: { icon: 'facebook', color: '#1877F2' } },
            { type: 'icon' as ElementType, name: 'Instagram', icon: Icons.InstagramIcon, defaultWidth: 40, defaultHeight: 40, props: { icon: 'instagram', color: '#E4405F' } },
            { type: 'icon' as ElementType, name: 'Twitter/X', icon: Icons.TwitterIcon, defaultWidth: 40, defaultHeight: 40, props: { icon: 'twitter', color: '#1DA1F2' } },
            { type: 'icon' as ElementType, name: 'LinkedIn', icon: Icons.LinkedInIcon, defaultWidth: 40, defaultHeight: 40, props: { icon: 'linkedin', color: '#0A66C2' } },
            { type: 'icon' as ElementType, name: 'YouTube', icon: Icons.YouTubeIcon, defaultWidth: 40, defaultHeight: 40, props: { icon: 'youtube', color: '#FF0000' } },
        ],
    },
    {
        id: 'decorative',
        name: 'Decorative',
        icon: Icons.ShapeIcon,
        items: [
            { type: 'divider' as ElementType, name: 'Line Divider', icon: Icons.DividerIcon, defaultWidth: 400, defaultHeight: 2, props: { style: 'solid', color: '#E5E7EB' } },
            { type: 'divider' as ElementType, name: 'Dotted Divider', icon: Icons.DividerIcon, defaultWidth: 400, defaultHeight: 2, props: { style: 'dotted', color: '#9CA3AF' } },
            { type: 'spacer' as ElementType, name: 'Spacer', icon: Icons.SpacerIcon, defaultWidth: 100, defaultHeight: 50, props: {} },
            { type: 'shape' as ElementType, name: 'Rectangle', icon: Icons.RectangleIcon, defaultWidth: 200, defaultHeight: 150, props: { shapeType: 'rectangle', fill: '#116DFF', borderRadius: 0 } },
            { type: 'shape' as ElementType, name: 'Circle', icon: Icons.CircleIcon, defaultWidth: 150, defaultHeight: 150, props: { shapeType: 'circle', fill: '#10B981' } },
            { type: 'shape' as ElementType, name: 'Rounded Rect', icon: Icons.RectangleIcon, defaultWidth: 200, defaultHeight: 150, props: { shapeType: 'rectangle', fill: '#8B5CF6', borderRadius: 24 } },
            { type: 'line' as ElementType, name: 'Horizontal Line', icon: Icons.LineIcon, defaultWidth: 300, defaultHeight: 2, props: { direction: 'horizontal', color: '#20303C' } },
            { type: 'line' as ElementType, name: 'Vertical Line', icon: Icons.LineIcon, defaultWidth: 2, defaultHeight: 200, props: { direction: 'vertical', color: '#20303C' } },
        ],
    },
    {
        id: 'list',
        name: 'Lists & Tabs',
        icon: Icons.ListIcon,
        items: [
            { type: 'list' as ElementType, name: 'Bullet List', icon: Icons.ListIcon, defaultWidth: 300, defaultHeight: 150, props: { style: 'bullet', items: ['Item 1', 'Item 2', 'Item 3'] } },
            { type: 'list' as ElementType, name: 'Numbered List', icon: Icons.ListIcon, defaultWidth: 300, defaultHeight: 150, props: { style: 'numbered', items: ['First', 'Second', 'Third'] } },
            { type: 'accordion' as ElementType, name: 'Accordion', icon: Icons.AccordionIcon, defaultWidth: 400, defaultHeight: 250, props: { items: [{ title: 'Question 1', content: 'Answer 1' }, { title: 'Question 2', content: 'Answer 2' }] } },
            { type: 'tabs' as ElementType, name: 'Tabs', icon: Icons.TabsIcon, defaultWidth: 500, defaultHeight: 300, props: { tabs: ['Tab 1', 'Tab 2', 'Tab 3'] } },
            { type: 'table' as ElementType, name: 'Table', icon: Icons.TableIcon, defaultWidth: 500, defaultHeight: 200, props: { rows: 4, columns: 3 } },
        ],
    },
    {
        id: 'embed',
        name: 'Embed & Map',
        icon: Icons.MapIcon,
        items: [
            { type: 'map' as ElementType, name: 'Google Map', icon: Icons.MapIcon, defaultWidth: 450, defaultHeight: 300, props: { location: 'New York, NY', zoom: 14 } },
            { type: 'html' as ElementType, name: 'HTML Embed', icon: Icons.EmbedIcon, defaultWidth: 400, defaultHeight: 300, props: { code: '' } },
            { type: 'embed' as ElementType, name: 'iFrame', icon: Icons.EmbedIcon, defaultWidth: 500, defaultHeight: 350, props: { src: '' } },
        ],
    },
    {
        id: 'ecommerce',
        name: 'E-Commerce',
        icon: Icons.CartIcon,
        items: [
            { type: 'product-card' as ElementType, name: 'Product Card', icon: Icons.ProductIcon, defaultWidth: 280, defaultHeight: 380, props: { showImage: true, showPrice: true, showButton: true } },
            { type: 'price' as ElementType, name: 'Price Tag', icon: Icons.PriceIcon, defaultWidth: 120, defaultHeight: 50, props: { price: '$99', currency: 'USD' } },
            { type: 'cart-button' as ElementType, name: 'Add to Cart', icon: Icons.CartIcon, defaultWidth: 160, defaultHeight: 48, props: { label: 'Add to Cart', icon: 'cart' } },
        ],
    },
    {
        id: 'blog',
        name: 'Blog & Content',
        icon: Icons.BlogIcon,
        items: [
            { type: 'blog-card' as ElementType, name: 'Blog Post Card', icon: Icons.BlogIcon, defaultWidth: 350, defaultHeight: 400, props: { showImage: true, showDate: true, showAuthor: true } },
            { type: 'quote' as ElementType, name: 'Quote Block', icon: Icons.QuoteIcon, defaultWidth: 450, defaultHeight: 150, props: { content: '"Add your inspiring quote here..."', author: 'Author Name' } },
        ],
    },
    {
        id: 'icons',
        name: 'Icons',
        icon: Icons.StarIcon,
        items: [
            { type: 'icon' as ElementType, name: 'Arrow Right', icon: Icons.ArrowRightIcon, defaultWidth: 36, defaultHeight: 36, props: { icon: 'arrow-right', color: '#20303C' } },
            { type: 'icon' as ElementType, name: 'Check Mark', icon: Icons.CheckIcon, defaultWidth: 36, defaultHeight: 36, props: { icon: 'check', color: '#10B981' } },
            { type: 'icon' as ElementType, name: 'Star', icon: Icons.StarIcon, defaultWidth: 36, defaultHeight: 36, props: { icon: 'star', color: '#F59E0B' } },
            { type: 'icon' as ElementType, name: 'Heart', icon: Icons.HeartIcon, defaultWidth: 36, defaultHeight: 36, props: { icon: 'heart', color: '#EF4444' } },
            { type: 'icon' as ElementType, name: 'Phone', icon: Icons.PhoneIcon, defaultWidth: 36, defaultHeight: 36, props: { icon: 'phone', color: '#116DFF' } },
            { type: 'icon' as ElementType, name: 'Email', icon: Icons.EmailIcon, defaultWidth: 36, defaultHeight: 36, props: { icon: 'email', color: '#116DFF' } },
            { type: 'icon' as ElementType, name: 'Location', icon: Icons.LocationIcon, defaultWidth: 36, defaultHeight: 36, props: { icon: 'location', color: '#EF4444' } },
        ],
    },
];

export default function AddElementsPanel() {
    const { setActivePanel, setDragging, addElement } = useEditorStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategory, setExpandedCategory] = useState<string | null>('text');

    const handleDragStart = (e: React.DragEvent, item: typeof categories[0]['items'][0]) => {
        e.dataTransfer.setData('element-type', JSON.stringify({
            type: item.type,
            defaultWidth: item.defaultWidth,
            defaultHeight: item.defaultHeight,
            defaultProps: item.props,
        }));
        e.dataTransfer.effectAllowed = 'copy';
        setDragging(true);
    };

    const handleDragEnd = () => {
        setDragging(false);
    };

    const handleClick = (item: typeof categories[0]['items'][0]) => {
        // Add element to center of canvas on click
        addElement({
            type: item.type,
            bounds: {
                x: 200,
                y: 150,
                width: item.defaultWidth,
                height: item.defaultHeight,
            },
            props: item.props || {},
            locked: false,
            hidden: false,
        });
    };

    const filteredCategories = searchQuery
        ? categories.map(cat => ({
            ...cat,
            items: cat.items.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cat.name.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        })).filter(cat => cat.items.length > 0)
        : categories;

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h2 className={styles.title}>Add Elements</h2>
                <button
                    className={styles.closeBtn}
                    onClick={() => setActivePanel(null)}
                >
                    <Icons.CloseIcon />
                </button>
            </div>

            <div className={styles.searchWrapper}>
                <div className={styles.searchIcon}>
                    <Icons.SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search elements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.categories}>
                {filteredCategories.map((category) => {
                    const CategoryIcon = category.icon;
                    return (
                        <div key={category.id} className={styles.category}>
                            <button
                                className={`${styles.categoryHeader} ${expandedCategory === category.id ? styles.expanded : ''}`}
                                onClick={() => setExpandedCategory(
                                    expandedCategory === category.id ? null : category.id
                                )}
                            >
                                <span className={styles.categoryIcon}>
                                    <CategoryIcon />
                                </span>
                                <span className={styles.categoryName}>{category.name}</span>
                                <span className={styles.itemCount}>{category.items.length}</span>
                                <span className={styles.chevron}>
                                    <Icons.ChevronRightIcon />
                                </span>
                            </button>

                            {expandedCategory === category.id && (
                                <div className={styles.categoryItems}>
                                    {category.items.map((item, idx) => {
                                        const ItemIcon = item.icon;
                                        return (
                                            <div
                                                key={idx}
                                                className={styles.elementItem}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, item)}
                                                onDragEnd={handleDragEnd}
                                                onClick={() => handleClick(item)}
                                                title={`Drag or click to add ${item.name}`}
                                            >
                                                <div className={styles.elementPreview}>
                                                    <ItemIcon />
                                                </div>
                                                <span className={styles.elementName}>{item.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={styles.footer}>
                <p className={styles.hint}>Drag or click to add</p>
            </div>
        </div>
    );
}
