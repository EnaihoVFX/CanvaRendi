'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { CanvasElement as CanvasElementType } from '@/types/editor';
import ElementToolbar from '../panels/ElementToolbar';
import * as Icons from '@/components/icons/Icons';
import styles from './CanvasElement.module.css';

interface CanvasElementProps {
    element: CanvasElementType;
    isSelected: boolean;
    isPreview: boolean;
    onContextMenu?: (e: React.MouseEvent) => void;
}

// Social Icon Components
const SocialIconComponents: Record<string, React.FC> = {
    facebook: Icons.FacebookIcon,
    instagram: Icons.InstagramIcon,
    twitter: Icons.TwitterIcon,
    linkedin: Icons.LinkedInIcon,
    youtube: Icons.YouTubeIcon,
    tiktok: Icons.TikTokIcon,
};

// Generic Icon Components
const IconComponents: Record<string, React.FC> = {
    'arrow-right': Icons.ArrowRightIcon,
    check: Icons.CheckIcon,
    star: Icons.StarIcon,
    heart: Icons.HeartIcon,
    phone: Icons.PhoneIcon,
    email: Icons.EmailIcon,
    location: Icons.LocationIcon,
    cart: Icons.CartIcon,
    play: Icons.PlayIcon,
};

export default function CanvasElement({ element, isSelected, isPreview, onContextMenu }: CanvasElementProps) {
    const { selectElement, updateElement, deleteElement, hoveredElementId, setHoveredElement, theme } = useEditorStore();

    const elementRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [accordionOpen, setAccordionOpen] = useState<number | null>(0);
    const [activeTab, setActiveTab] = useState(0);
    const [screenPosition, setScreenPosition] = useState({ x: 0, y: 0 });

    const isHovered = hoveredElementId === element.id;

    // Calculate screen position for toolbar when selected
    useEffect(() => {
        if (isSelected && elementRef.current) {
            const updatePosition = () => {
                const rect = elementRef.current?.getBoundingClientRect();
                if (rect) {
                    setScreenPosition({ x: rect.left, y: rect.top });
                }
            };
            updatePosition();
            // Update on scroll/resize
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isSelected, element.bounds]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isPreview && !element.locked) {
            selectElement(element.id);
        }
    }, [element.id, element.locked, selectElement, isPreview]);

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (['text', 'heading', 'paragraph', 'button'].includes(element.type)) {
            setIsEditing(true);
        }
    }, [element.type]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (isPreview || element.locked || isEditing) return;
        e.stopPropagation();

        setIsDragging(true);
        setDragStart({
            x: e.clientX - element.bounds.x,
            y: e.clientY - element.bounds.y,
        });
    }, [element.bounds.x, element.bounds.y, element.locked, isPreview, isEditing]);

    const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
        if (isPreview || element.locked) return;
        e.stopPropagation();

        setIsResizing(true);
        setResizeHandle(handle);
        setDragStart({ x: e.clientX, y: e.clientY });
    }, [element.locked, isPreview]);

    const handleRightClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (!isPreview && onContextMenu) {
            selectElement(element.id);
            onContextMenu(e);
        }
    }, [element.id, isPreview, onContextMenu, selectElement]);

    useEffect(() => {
        if (!isDragging && !isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                updateElement(element.id, {
                    bounds: {
                        ...element.bounds,
                        x: Math.max(0, e.clientX - dragStart.x),
                        y: Math.max(0, e.clientY - dragStart.y),
                    },
                });
            }

            if (isResizing && resizeHandle) {
                const dx = e.clientX - dragStart.x;
                const dy = e.clientY - dragStart.y;

                let newBounds = { ...element.bounds };

                if (resizeHandle.includes('e')) {
                    newBounds.width = Math.max(50, element.bounds.width + dx);
                }
                if (resizeHandle.includes('w')) {
                    newBounds.x = element.bounds.x + dx;
                    newBounds.width = Math.max(50, element.bounds.width - dx);
                }
                if (resizeHandle.includes('s')) {
                    newBounds.height = Math.max(30, element.bounds.height + dy);
                }
                if (resizeHandle.includes('n')) {
                    newBounds.y = element.bounds.y + dy;
                    newBounds.height = Math.max(30, element.bounds.height - dy);
                }

                updateElement(element.id, { bounds: newBounds });
                setDragStart({ x: e.clientX, y: e.clientY });
            }
        };

        const handleMouseUp = () => {
            if (isDragging || isResizing) {
                useEditorStore.getState().saveToHistory();
            }
            setIsDragging(false);
            setIsResizing(false);
            setResizeHandle(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, dragStart, element, resizeHandle, updateElement]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (!isEditing) {
                deleteElement(element.id);
            }
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            selectElement(null);
        }
    }, [deleteElement, element.id, isEditing, selectElement]);

    const handleContentChange = useCallback((newContent: string) => {
        if (['text', 'heading', 'paragraph'].includes(element.type)) {
            updateElement(element.id, {
                props: { ...element.props, content: newContent },
            });
        } else if (element.type === 'button') {
            updateElement(element.id, {
                props: { ...element.props, label: newContent },
            });
        }
    }, [element, updateElement]);

    const renderContent = () => {
        const props = element.props as Record<string, any>;

        switch (element.type) {
            // ===== TEXT ELEMENTS =====
            case 'text':
            case 'heading':
            case 'paragraph':
                return (
                    <div
                        className={styles.textContent}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                            handleContentChange(e.currentTarget.textContent || '');
                            setIsEditing(false);
                        }}
                        style={{
                            fontSize: props.fontSize || (element.type === 'heading' ? 32 : 16),
                            fontWeight: props.fontWeight || (element.type === 'heading' ? 700 : 400),
                            color: props.color || theme.colors.text,
                            fontFamily: element.type === 'heading' ? theme.fonts.heading : theme.fonts.body,
                            textAlign: props.textAlign || 'left',
                            lineHeight: props.lineHeight || 1.5,
                        }}
                    >
                        {props.content || (element.type === 'heading' ? 'Add a Heading' : 'Add text here')}
                    </div>
                );

            // ===== IMAGE =====
            case 'image':
                return (
                    <div className={styles.imageContent} style={{ borderRadius: props.borderRadius || 0 }}>
                        {props.src ? (
                            <img
                                src={props.src}
                                alt={props.alt || ''}
                                draggable={false}
                                style={{
                                    objectFit: props.objectFit || 'cover',
                                    borderRadius: props.borderRadius || 0,
                                    pointerEvents: 'none' // Also add pointer-events: none to ensure clicks pass through to the container for selection
                                }}
                            />
                        ) : (
                            <div className={styles.imagePlaceholder}>
                                <Icons.ImageIcon />
                                <span>Click to add image</span>
                            </div>
                        )}
                    </div>
                );

            // ===== BUTTON =====
            case 'button':
            case 'submit-button':
            case 'cart-button':
                return (
                    <button
                        className={styles.buttonContent}
                        style={{
                            backgroundColor: props.backgroundColor || theme.colors.primary,
                            color: props.textColor || '#FFFFFF',
                            borderRadius: props.borderRadius || 8,
                            border: props.borderWidth ? `${props.borderWidth}px solid ${props.borderColor || 'transparent'}` : 'none',
                        }}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                            handleContentChange(e.currentTarget.textContent || '');
                            setIsEditing(false);
                        }}
                    >
                        {element.type === 'cart-button' && <span className={styles.btnIcon}><Icons.CartIcon /></span>}
                        {props.label || 'Button'}
                    </button>
                );

            // ===== BOX / CONTAINER =====
            case 'box':
            case 'container':
                return (
                    <div
                        className={styles.boxContent}
                        style={{
                            backgroundColor: props.backgroundColor || '#f5f5f5',
                            borderRadius: props.borderRadius || 8,
                            border: props.borderWidth ? `${props.borderWidth}px solid ${props.borderColor || '#e5e7eb'}` : 'none',
                            boxShadow: props.shadow === 'lg' ? '0 10px 40px rgba(0,0,0,0.15)' :
                                props.shadow === 'md' ? '0 4px 20px rgba(0,0,0,0.1)' :
                                    props.shadow === 'sm' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                        }}
                    />
                );

            // ===== SECTION / STRIP =====
            case 'section':
            case 'strip':
                return (
                    <div
                        className={styles.sectionContent}
                        style={{
                            backgroundColor: props.backgroundColor || '#f9fafb',
                            background: props.background || props.backgroundColor || '#f9fafb',
                        }}
                    />
                );

            // ===== VIDEO =====
            case 'video':
                return (
                    <div className={styles.videoContent}>
                        {props.src ? (
                            <video
                                src={props.src}
                                poster={props.poster}
                                autoPlay={props.autoPlay}
                                loop={props.loop}
                                muted={props.muted}
                                controls={props.controls}
                            />
                        ) : (
                            <div className={styles.videoPlaceholder}>
                                <Icons.PlayIcon />
                                <span>Video</span>
                            </div>
                        )}
                    </div>
                );

            // ===== GALLERY =====
            case 'gallery':
            case 'slideshow':
                return (
                    <div className={styles.galleryContent}>
                        <div className={styles.galleryGrid}>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className={styles.galleryItem}>
                                    <Icons.ImageIcon />
                                </div>
                            ))}
                        </div>
                        <span className={styles.galleryLabel}>Gallery ({props.columns || 3} columns)</span>
                    </div>
                );

            // ===== NAVBAR =====
            case 'navbar':
                return (
                    <div className={styles.navbarContent}>
                        <div className={styles.navLogo}>Logo</div>
                        <div className={styles.navItems}>
                            {(props.items || ['Home', 'About', 'Services', 'Contact']).map((item: string, i: number) => (
                                <span key={i} className={styles.navItem}>{item}</span>
                            ))}
                        </div>
                        <div className={styles.navActions}>
                            <button className={styles.navBtn}>Get Started</button>
                        </div>
                    </div>
                );

            // ===== MENU =====
            case 'menu':
                return (
                    <div className={styles.menuContent}>
                        {(props.items || ['Home', 'About', 'Services', 'Contact']).map((item: string, i: number) => (
                            <div key={i} className={styles.menuItem}>{item}</div>
                        ))}
                    </div>
                );

            // ===== FOOTER =====
            case 'footer':
                return (
                    <div className={styles.footerContent}>
                        <div className={styles.footerColumns}>
                            <div className={styles.footerCol}>
                                <strong>Company</strong>
                                <span>About Us</span>
                                <span>Careers</span>
                            </div>
                            <div className={styles.footerCol}>
                                <strong>Support</strong>
                                <span>Help Center</span>
                                <span>Contact</span>
                            </div>
                            <div className={styles.footerCol}>
                                <strong>Legal</strong>
                                <span>Privacy</span>
                                <span>Terms</span>
                            </div>
                            <div className={styles.footerCol}>
                                <strong>Follow Us</strong>
                                <div className={styles.footerSocial}>
                                    <Icons.FacebookIcon />
                                    <Icons.TwitterIcon />
                                    <Icons.InstagramIcon />
                                </div>
                            </div>
                        </div>
                        <div className={styles.footerBottom}>© 2024 Your Company. All rights reserved.</div>
                    </div>
                );

            // ===== CONTACT FORM =====
            case 'contact-form':
                return (
                    <div className={styles.formContent}>
                        <input placeholder="Your Name" className={styles.formInput} />
                        <input placeholder="Email Address" className={styles.formInput} />
                        <textarea placeholder="Your Message" className={styles.formTextarea} rows={4} />
                        <button className={styles.formSubmit}>{props.submitLabel || 'Send Message'}</button>
                    </div>
                );

            // ===== SUBSCRIBE FORM =====
            case 'subscribe-form':
                return (
                    <div className={styles.subscribeForm}>
                        <input placeholder={props.placeholder || 'Enter your email'} className={styles.subscribeInput} />
                        <button className={styles.subscribeBtn}>{props.submitLabel || 'Subscribe'}</button>
                    </div>
                );

            // ===== INPUT FIELDS =====
            case 'input':
                return <input placeholder={props.placeholder || 'Enter text...'} className={styles.inputContent} />;

            case 'textarea':
                return <textarea placeholder={props.placeholder || 'Your message...'} className={styles.textareaContent} rows={4} />;

            case 'dropdown':
                return (
                    <div className={styles.dropdownContent}>
                        <select>
                            {(props.options || ['Option 1', 'Option 2', 'Option 3']).map((opt: string, i: number) => (
                                <option key={i}>{opt}</option>
                            ))}
                        </select>
                        <Icons.ChevronDownIcon />
                    </div>
                );

            case 'checkbox':
                return (
                    <label className={styles.checkboxContent}>
                        <input type="checkbox" />
                        <span className={styles.checkMark}><Icons.CheckIcon /></span>
                        <span>{props.label || 'Checkbox'}</span>
                    </label>
                );

            // ===== SOCIAL ICONS =====
            case 'social-icons':
                return (
                    <div className={styles.socialIconsContent}>
                        {(props.icons || ['facebook', 'instagram', 'twitter', 'linkedin']).map((iconName: string, i: number) => {
                            const IconComp = SocialIconComponents[iconName] || Icons.SocialIcon;
                            return (
                                <div key={i} className={styles.socialIcon} style={{ color: props.color || '#333' }}>
                                    <IconComp />
                                </div>
                            );
                        })}
                    </div>
                );

            // ===== SINGLE ICON =====
            case 'icon':
                const IconComp = SocialIconComponents[props.icon] || IconComponents[props.icon] || Icons.StarIcon;
                return (
                    <div className={styles.iconContent} style={{ color: props.color || '#333' }}>
                        <IconComp />
                    </div>
                );

            // ===== DECORATIVE ELEMENTS =====
            case 'divider':
            case 'line':
                return (
                    <div
                        className={styles.dividerContent}
                        style={{
                            borderStyle: props.style || 'solid',
                            borderColor: props.color || '#e5e7eb',
                            width: props.direction === 'vertical' ? '2px' : '100%',
                            height: props.direction === 'vertical' ? '100%' : '2px',
                        }}
                    />
                );

            case 'spacer':
                return (
                    <div className={styles.spacerContent}>
                        <Icons.SpacerIcon />
                    </div>
                );

            case 'shape':
                return (
                    <div
                        className={styles.shapeContent}
                        style={{
                            backgroundColor: props.fill || '#116DFF',
                            borderRadius: props.shapeType === 'circle' ? '50%' : (props.borderRadius || 0),
                        }}
                    />
                );

            // ===== LISTS & TABS =====
            case 'list':
                return (
                    <div className={styles.listContent}>
                        {(props.items || ['Item 1', 'Item 2', 'Item 3']).map((item: string, i: number) => (
                            <div key={i} className={styles.listItem}>
                                <span className={styles.listBullet}>
                                    {props.style === 'numbered' ? `${i + 1}.` : <Icons.CheckIcon />}
                                </span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                );

            case 'accordion':
                return (
                    <div className={styles.accordionContent}>
                        {(props.items || [{ title: 'Question 1', content: 'Answer 1' }, { title: 'Question 2', content: 'Answer 2' }]).map((item: any, i: number) => (
                            <div key={i} className={`${styles.accordionItem} ${accordionOpen === i ? styles.open : ''}`}>
                                <div
                                    className={styles.accordionHeader}
                                    onClick={(e) => { e.stopPropagation(); setAccordionOpen(accordionOpen === i ? null : i); }}
                                >
                                    <span>{item.title}</span>
                                    <Icons.ChevronDownIcon />
                                </div>
                                {accordionOpen === i && (
                                    <div className={styles.accordionBody}>{item.content}</div>
                                )}
                            </div>
                        ))}
                    </div>
                );

            case 'tabs':
                return (
                    <div className={styles.tabsContent}>
                        <div className={styles.tabsHeader}>
                            {(props.tabs || ['Tab 1', 'Tab 2', 'Tab 3']).map((tab: string, i: number) => (
                                <div
                                    key={i}
                                    className={`${styles.tab} ${activeTab === i ? styles.activeTab : ''}`}
                                    onClick={(e) => { e.stopPropagation(); setActiveTab(i); }}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>
                        <div className={styles.tabsBody}>
                            Content for {(props.tabs || ['Tab 1', 'Tab 2', 'Tab 3'])[activeTab]}
                        </div>
                    </div>
                );

            case 'table':
                return (
                    <div className={styles.tableContent}>
                        <table>
                            <thead>
                                <tr>
                                    {Array.from({ length: props.columns || 3 }).map((_, i) => (
                                        <th key={i}>Header {i + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: (props.rows || 3) - 1 }).map((_, r) => (
                                    <tr key={r}>
                                        {Array.from({ length: props.columns || 3 }).map((_, c) => (
                                            <td key={c}>Cell {r + 1}-{c + 1}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            // ===== MAP =====
            case 'map':
                return (
                    <div className={styles.mapContent}>
                        <div className={styles.mapPlaceholder}>
                            <Icons.MapIcon />
                            <span>{props.location || 'Google Map'}</span>
                        </div>
                    </div>
                );

            // ===== EMBED =====
            case 'html':
            case 'embed':
                return (
                    <div className={styles.embedContent}>
                        <Icons.EmbedIcon />
                        <span>HTML/Embed</span>
                        <span className={styles.embedHint}>Paste your code here</span>
                    </div>
                );

            // ===== PRODUCT CARD =====
            case 'product-card':
                return (
                    <div className={styles.productCard}>
                        <div className={styles.productImage}>
                            <Icons.ImageIcon />
                        </div>
                        <div className={styles.productInfo}>
                            <h4>Product Name</h4>
                            <div className={styles.productRating}>
                                <Icons.StarIcon />
                                <Icons.StarIcon />
                                <Icons.StarIcon />
                                <Icons.StarIcon />
                                <Icons.StarIcon />
                            </div>
                            <p className={styles.productPrice}>$99.00</p>
                            <button className={styles.productBtn}>
                                <Icons.CartIcon />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                );

            // ===== PRICE =====
            case 'price':
                return (
                    <div className={styles.priceContent}>
                        <span className={styles.priceValue}>{props.price || '$99'}</span>
                    </div>
                );

            // ===== BLOG CARD =====
            case 'blog-card':
                return (
                    <div className={styles.blogCard}>
                        <div className={styles.blogImage}>
                            <Icons.ImageIcon />
                        </div>
                        <div className={styles.blogInfo}>
                            <span className={styles.blogDate}>Jan 15, 2024</span>
                            <h4>Blog Post Title</h4>
                            <p>Short description of the blog post goes here...</p>
                            <a className={styles.blogLink}>Read More <Icons.ArrowRightIcon /></a>
                        </div>
                    </div>
                );

            // ===== QUOTE =====
            case 'quote':
                return (
                    <div className={styles.quoteContent}>
                        <Icons.QuoteIcon />
                        <p className={styles.quoteText}>{props.content || 'Add your inspiring quote here...'}</p>
                        <span className={styles.quoteAuthor}>— {props.author || 'Author Name'}</span>
                    </div>
                );

            default:
                return <div className={styles.defaultContent}>{element.type}</div>;
        }
    };

    if (element.hidden && !isPreview) {
        return null;
    }

    return (
        <>
            <div
                ref={elementRef}
                className={`
                    ${styles.element}
                    ${isSelected ? styles.selected : ''}
                    ${isHovered && !isSelected ? styles.hovered : ''}
                    ${isDragging ? styles.dragging : ''}
                    ${isPreview ? styles.preview : ''}
                    ${element.locked ? styles.locked : ''}
                `}
                style={{
                    left: element.bounds.x,
                    top: element.bounds.y,
                    width: element.bounds.width,
                    height: element.bounds.height,
                    zIndex: element.zIndex,
                    transform: element.bounds.rotation ? `rotate(${element.bounds.rotation}deg)` : undefined,
                    opacity: element.hidden ? 0.5 : 1,
                }}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleMouseDown}
                onMouseEnter={() => !isPreview && setHoveredElement(element.id)}
                onMouseLeave={() => setHoveredElement(null)}
                onKeyDown={handleKeyDown}
                onContextMenu={handleRightClick}
                tabIndex={isSelected ? 0 : -1}
            >
                {renderContent()}

                {/* Locked indicator */}
                {element.locked && isSelected && (
                    <div className={styles.lockedBadge}><Icons.LockIcon /></div>
                )}

                {/* Resize handles */}
                {isSelected && !isPreview && !element.locked && (
                    <>
                        <div className={`${styles.handle} ${styles.handleN}`} onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
                        <div className={`${styles.handle} ${styles.handleE}`} onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
                        <div className={`${styles.handle} ${styles.handleS}`} onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
                        <div className={`${styles.handle} ${styles.handleW}`} onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
                        <div className={`${styles.handle} ${styles.handleNE}`} onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
                        <div className={`${styles.handle} ${styles.handleSE}`} onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />
                        <div className={`${styles.handle} ${styles.handleSW}`} onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
                        <div className={`${styles.handle} ${styles.handleNW}`} onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
                    </>
                )}
            </div>

            {/* Floating Toolbar */}
            {isSelected && !isPreview && (
                <ElementToolbar element={element} screenPosition={screenPosition} />
            )}
        </>
    );
}
