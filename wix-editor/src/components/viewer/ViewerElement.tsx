'use client';

import React from 'react';
import { CanvasElement as CanvasElementType, SiteTheme } from '@/types/editor';
import * as Icons from '@/components/icons/Icons';
import styles from '../canvas/CanvasElement.module.css'; // Reuse styles
import DOMPurify from 'isomorphic-dompurify';

interface ViewerElementProps {
    element: CanvasElementType;
    theme: SiteTheme;
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

export default function ViewerElement({ element, theme }: ViewerElementProps) {
    const props = element.props as Record<string, any>;
    const [accordionOpen, setAccordionOpen] = React.useState<number | null>(0);
    const [activeTab, setActiveTab] = React.useState(0);

    switch (element.type) {
        // ===== TEXT ELEMENTS =====
        case 'text':
        case 'heading':
        case 'paragraph':
            return (
                <div
                    className={styles.textContent}
                    style={{
                        fontSize: props.fontSize || (element.type === 'heading' ? 32 : 16),
                        fontWeight: props.fontWeight || (element.type === 'heading' ? 700 : 400),
                        color: props.color || theme.colors.text,
                        fontFamily: element.type === 'heading' ? theme.fonts.heading : theme.fonts.body,
                        textAlign: props.textAlign || 'left',
                        lineHeight: props.lineHeight || 1.5,
                        width: '100%',
                        height: '100%',
                    }}
                >
                    {props.content || (element.type === 'heading' ? 'Heading' : 'Text')}
                </div>
            );

        // ===== IMAGE =====
        case 'image':
            return (
                <div className={styles.imageContent} style={{ borderRadius: props.borderRadius || 0, overflow: 'hidden' }}>
                    {props.src ? (
                        <img
                            src={props.src}
                            alt={props.alt || ''}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: props.objectFit || 'cover',
                            }}
                        />
                    ) : null}
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
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
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
                        width: '100%',
                        height: '100%',
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
                        width: '100%',
                        height: '100%',
                    }}
                />
            );

        // ===== VIDEO =====
        case 'video':
            const getVideoSrc = (url: string) => {
                if (!url) return '';
                if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
                    const id = url.includes('youtu.be/')
                        ? url.split('youtu.be/')[1].split('?')[0]
                        : url.split('v=')[1].split('&')[0];
                    return `https://www.youtube.com/embed/${id}?autoplay=${props.autoPlay ? 1 : 0}&mute=${props.muted ? 1 : 0}&controls=${props.controls ? 1 : 0}&loop=${props.loop ? 1 : 0}`;
                }
                if (url.includes('vimeo.com/')) {
                    const id = url.split('vimeo.com/')[1].split('?')[0];
                    return `https://player.vimeo.com/video/${id}?autoplay=${props.autoPlay ? 1 : 0}&muted=${props.muted ? 1 : 0}&loop=${props.loop ? 1 : 0}`;
                }
                return url;
            };

            const videoSrc = getVideoSrc(props.src as string);
            const isIframe = videoSrc.includes('youtube') || videoSrc.includes('vimeo');

            return (
                <div className={styles.videoContent} style={{ width: '100%', height: '100%' }}>
                    {videoSrc && (
                        isIframe ? (
                            <iframe
                                src={videoSrc}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video
                                src={videoSrc}
                                poster={props.poster as string}
                                autoPlay={props.autoPlay as boolean}
                                loop={props.loop as boolean}
                                muted={props.muted as boolean}
                                controls={props.controls as boolean}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        )
                    )}
                </div>
            );

        // ===== GALLERY =====
        case 'gallery':
        case 'slideshow':
            const images = (props.images as string[]) || [];
            const cols = (props.columns as number) || 3;
            const gap = (props.gap as number) || 8;

            return (
                <div className={styles.galleryContent} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                    <div
                        className={styles.galleryGrid}
                        style={{
                            gridTemplateColumns: `repeat(${cols}, 1fr)`,
                            gap: `${gap}px`,
                            height: '100%'
                        }}
                    >
                        {images.map((src, i) => (
                            <div key={i} className={styles.galleryItem}>
                                <img
                                    src={src}
                                    alt={`Gallery item ${i}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );

        // ===== NAVBAR =====
        case 'navbar':
            const navItems = Array.isArray(props.items) ? props.items : ['Home', 'About', 'Services', 'Contact'];
            return (
                <div className={styles.navbarContent} style={{ width: '100%', height: '100%' }}>
                    <div className={styles.navLogo}>{props.logo || 'Logo'}</div>
                    <div className={styles.navItems}>
                        {navItems.map((item: any, i: number) => {
                            const label = typeof item === 'string' ? item : item.label;
                            const url = typeof item === 'string' ? '' : item.url;
                            return (
                                <a
                                    key={i}
                                    className={styles.navItem}
                                    href={url || '#'}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {label}
                                </a>
                            );
                        })}
                    </div>
                    <div className={styles.navActions}>
                        <button className={styles.navBtn}>{props.ctaText || 'Get Started'}</button>
                    </div>
                </div>
            );

        // ===== MENU =====
        case 'menu':
            const menuItems = Array.isArray(props.items) ? props.items : ['Home', 'About', 'Services', 'Contact'];
            return (
                <div className={`${styles.menuContent} ${props.style === 'horizontal' ? styles.menuHorizontal : ''}`} style={{ width: '100%', height: '100%' }}>
                    {menuItems.map((item: any, i: number) => {
                        const label = typeof item === 'string' ? item : item.label;
                        const url = typeof item === 'string' ? '' : item.url;
                        return (
                            <a
                                key={i}
                                className={styles.menuItem}
                                href={url || '#'}
                                style={{
                                    display: props.style === 'horizontal' ? 'inline-block' : 'block',
                                    textDecoration: 'none'
                                }}
                            >
                                {label}
                            </a>
                        );
                    })}
                </div>
            );

        // ===== FOOTER =====
        case 'footer':
            const footerCols = props.columns as any[] || [
                { title: 'Company', links: ['About Us', 'Careers'] },
                { title: 'Support', links: ['Help Center', 'Contact'] },
                { title: 'Legal', links: ['Privacy', 'Terms'] }
            ];

            return (
                <div className={styles.footerContent} style={{ width: '100%', height: '100%' }}>
                    <div className={styles.footerColumns}>
                        {footerCols.map((col, i) => (
                            <div key={i} className={styles.footerCol}>
                                <strong>{col.title}</strong>
                                {col.links && col.links.map((link: any, j: number) => {
                                    const label = typeof link === 'string' ? link : link.label;
                                    const url = typeof link === 'string' ? '' : link.url;
                                    return (
                                        <a
                                            key={j}
                                            href={url || '#'}
                                            style={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                display: 'block'
                                            }}
                                        >
                                            {label}
                                        </a>
                                    );
                                })}
                            </div>
                        ))}
                        <div className={styles.footerCol}>
                            <strong>Follow Us</strong>
                            <div className={styles.footerSocial}>
                                <Icons.FacebookIcon />
                                <Icons.TwitterIcon />
                                <Icons.InstagramIcon />
                            </div>
                        </div>
                    </div>
                    <div className={styles.footerBottom}>{props.copyright || '© 2024 Your Company. All rights reserved.'}</div>
                </div>
            );

        // ===== CONTACT FORM =====
        case 'contact-form':
            return (
                <div className={styles.formContent} style={{ width: '100%', height: '100%' }}>
                    {props.showName !== false && <input placeholder="Your Name" className={styles.formInput} />}
                    {props.showEmail !== false && <input placeholder="Email Address" className={styles.formInput} />}
                    {props.showPhone && <input placeholder="Phone Number" className={styles.formInput} />}
                    {props.showMessage !== false && <textarea placeholder="Your Message" className={styles.formTextarea} rows={4} />}
                    <button className={styles.formSubmit}>{props.submitLabel || 'Send Message'}</button>
                </div>
            );

        // ===== SUBSCRIBE FORM =====
        case 'subscribe-form':
            return (
                <div className={styles.subscribeForm} style={{ width: '100%', height: '100%' }}>
                    <input placeholder={props.placeholder || 'Enter your email'} className={styles.subscribeInput} />
                    <button className={styles.subscribeBtn}>{props.submitLabel || 'Subscribe'}</button>
                </div>
            );

        // ===== INPUT FIELDS =====
        case 'input':
            return <input placeholder={props.placeholder || 'Enter text...'} className={styles.inputContent} style={{ width: '100%', height: '100%' }} />;

        case 'textarea':
            return <textarea placeholder={props.placeholder || 'Your message...'} className={styles.textareaContent} rows={4} style={{ width: '100%', height: '100%' }} />;

        case 'dropdown':
            return (
                <div className={styles.dropdownContent} style={{ width: '100%', height: '100%' }}>
                    <select style={{ width: '100%', height: '100%' }}>
                        {(props.options || ['Option 1', 'Option 2', 'Option 3']).map((opt: string, i: number) => (
                            <option key={i}>{opt}</option>
                        ))}
                    </select>
                    <Icons.ChevronDownIcon />
                </div>
            );

        case 'checkbox':
            return (
                <label className={styles.checkboxContent} style={{ width: '100%', height: '100%' }}>
                    <input type="checkbox" defaultChecked={props.defaultChecked} />
                    <span className={styles.checkMark}><Icons.CheckIcon /></span>
                    <span>{props.label || 'Checkbox'}</span>
                </label>
            );

        // ===== SOCIAL ICONS =====
        case 'social-icons':
            return (
                <div className={styles.socialIconsContent} style={{ width: '100%', height: '100%' }}>
                    {(props.icons || ['facebook', 'instagram', 'twitter', 'linkedin']).map((iconName: string, i: number) => {
                        const IconComp = SocialIconComponents[iconName] || Icons.SocialIcon;
                        const url = props.links?.[iconName];

                        const IconWrapper = ({ children }: { children: React.ReactNode }) => (
                            <div className={styles.socialIcon} style={{ color: props.color || '#333' }}>
                                {children}
                            </div>
                        );

                        if (url) {
                            return (
                                <a
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <IconWrapper><IconComp /></IconWrapper>
                                </a>
                            );
                        }

                        return (
                            <IconWrapper key={i}><IconComp /></IconWrapper>
                        );
                    })}
                </div>
            );

        // ===== SINGLE ICON =====
        case 'icon':
            const IconComp = SocialIconComponents[props.icon] || IconComponents[props.icon] || Icons.StarIcon;
            return (
                <div className={styles.iconContent} style={{ color: props.color || '#333', width: '100%', height: '100%' }}>
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
                <div className={styles.spacerContent} style={{ width: '100%', height: '100%' }} />
            );

        case 'shape':
            return (
                <div
                    className={styles.shapeContent}
                    style={{
                        backgroundColor: props.fill || '#116DFF',
                        borderRadius: props.shapeType === 'circle' ? '50%' : (props.borderRadius || 0),
                        width: '100%',
                        height: '100%',
                    }}
                />
            );

        // ===== LISTS & TABS =====
        case 'list':
            return (
                <div className={styles.listContent} style={{ width: '100%', height: '100%' }}>
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
                <div className={styles.accordionContent} style={{ width: '100%', height: '100%' }}>
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
                <div className={styles.tabsContent} style={{ width: '100%', height: '100%' }}>
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
                <div className={styles.tableContent} style={{ width: '100%', height: '100%' }}>
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
                <div className={styles.mapContent} style={{ width: '100%', height: '100%' }}>
                    {props.location ? (
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(props.location as string)}&t=&z=${props.zoom || 14}&ie=UTF8&iwloc=&output=embed`}
                            allowFullScreen
                        ></iframe>
                    ) : null}
                </div>
            );

        // ===== EMBED =====
        case 'html':
            return (
                <div className={styles.embedContent} style={{ width: '100%', height: '100%' }}>
                    {props.code ? (
                        <div
                            className={styles.htmlContainer}
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(props.code as string) }}
                        />
                    ) : null}
                </div>
            );

        case 'embed':
            return (
                <div className={styles.embedContent} style={{ width: '100%', height: '100%' }}>
                    {props.src ? (
                        <iframe
                            src={props.src as string}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            title="Embedded Content"
                        />
                    ) : null}
                </div>
            );

        // ===== PRODUCT CARD =====
        case 'product-card':
            return (
                <div className={styles.productCard} style={{ width: '100%', height: '100%' }}>
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
                <div className={styles.priceContent} style={{ width: '100%', height: '100%' }}>
                    <span className={styles.priceValue}>{props.price || '$99'}</span>
                </div>
            );

        // ===== BLOG CARD =====
        case 'blog-card':
            return (
                <div className={styles.blogCard} style={{ width: '100%', height: '100%' }}>
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
                <div className={styles.quoteContent} style={{ width: '100%', height: '100%' }}>
                    <Icons.QuoteIcon />
                    <p className={styles.quoteText}>{props.content || 'Add your inspiring quote here...'}</p>
                    <span className={styles.quoteAuthor}>— {props.author || 'Author Name'}</span>
                </div>
            );

        // ===== TESTIMONIAL =====
        case 'testimonial':
            return (
                <div className={styles.testimonialContent} style={{ width: '100%', height: '100%' }}>
                    <div className={styles.testimonialQuote}>
                        <Icons.QuoteIcon />
                        <p>"{props.quote || 'Add a testimonial quote here...'}"</p>
                    </div>
                    <div className={styles.testimonialAuthor}>
                        {props.avatar ? (
                            <img src={props.avatar as string} alt={props.author as string} className={styles.testimonialAvatar} />
                        ) : (
                            <div className={styles.testimonialAvatarPlaceholder}>
                                <Icons.UserIcon />
                            </div>
                        )}
                        <div className={styles.testimonialInfo}>
                            <strong>{props.author || 'Author Name'}</strong>
                            <span>{props.role || 'Role, Company'}</span>
                        </div>
                    </div>
                </div>
            );

        // ===== TEAM MEMBER =====
        case 'team-member':
            return (
                <div className={styles.teamMemberContent} style={{ width: '100%', height: '100%' }}>
                    <div className={styles.teamMemberImage}>
                        {props.image ? (
                            <img src={props.image as string} alt={props.name as string} />
                        ) : (
                            <div className={styles.teamMemberPlaceholder}>
                                <Icons.UserIcon />
                            </div>
                        )}
                    </div>
                    <div className={styles.teamMemberInfo}>
                        <h3>{props.name || 'Team Member'}</h3>
                        <span className={styles.teamMemberRole}>{props.role || 'Job Title'}</span>
                        <p>{props.bio || 'Short blography about the team member goes here.'}</p>
                        <div className={styles.teamMemberSocial}>
                            <Icons.LinkedInIcon />
                            <Icons.TwitterIcon />
                            <Icons.EmailIcon />
                        </div>
                    </div>
                </div>
            );

        // ===== PROGRESS BAR =====
        case 'progress-bar':
            const progress = Math.min(100, Math.max(0, (props.value as number || 50) / (props.max as number || 100) * 100));
            return (
                <div className={styles.progressBarContent} style={{ width: '100%', height: '100%' }}>
                    {props.showLabel !== false && (
                        <div className={styles.progressBarLabel}>
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                    )}
                    <div
                        className={styles.progressBarTrack}
                        style={{ height: props.height || 8 }}
                    >
                        <div
                            className={styles.progressBarFill}
                            style={{
                                width: `${progress}%`,
                                backgroundColor: props.color || theme.colors.primary
                            }}
                        />
                    </div>
                </div>
            );

        // ===== COUNTDOWN =====
        case 'countdown':
            return (
                <div className={`${styles.countdownContent} ${props.style === 'circles' ? styles.countdownCircles : ''} ${props.style === 'blocks' ? styles.countdownBlocks : ''}`} style={{ width: '100%', height: '100%' }}>
                    {['Days', 'Hours', 'Minutes', 'Seconds'].map((unit, i) => (
                        <div key={unit} className={styles.countdownItem}>
                            <div className={styles.countdownValue}>
                                {['02', '14', '35', '42'][i]}
                            </div>
                            <div className={styles.countdownLabel}>{unit}</div>
                        </div>
                    ))}
                </div>
            );

        // ===== ALERT =====
        case 'alert':
            const alertColors: Record<string, string> = {
                info: '#3b82f6',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444'
            };
            const alertBg: Record<string, string> = {
                info: '#eff6ff',
                success: '#ecfdf5',
                warning: '#fffbeb',
                error: '#fef2f2'
            };
            const alertType = (props.type as string) || 'info';

            return (
                <div
                    className={styles.alertContent}
                    style={{
                        backgroundColor: alertBg[alertType],
                        borderColor: alertColors[alertType],
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <div className={styles.alertIcon} style={{ color: alertColors[alertType] }}>
                        <Icons.AlertIcon />
                    </div>
                    <div className={styles.alertText}>
                        <strong>{props.title || 'Attention'}</strong>
                        <p>{props.message || 'This is an alert message.'}</p>
                    </div>
                </div>
            );

        // ===== BADGE =====
        case 'badge':
            return (
                <div
                    className={styles.badgeContent}
                    style={{
                        backgroundColor: props.color || theme.colors.primary,
                        color: props.textColor || 'white',
                        borderRadius: props.radius || 4
                    }}
                >
                    <Icons.TagIcon />
                    <span>{props.label || 'New'}</span>
                </div>
            );

        // Fallback for other types
        default:
            return (
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: '#666'
                }}>
                    {element.type}
                </div>
            );
    }
}
