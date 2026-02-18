import { Page, CanvasElement } from "@/types/editor";

export interface SiteTemplate {
    id: string;
    name: string;
    industryKeywords: string[];
    description: string;
    structure: Partial<Page>;
}

// Helper for consistent navigation across templates
const createNavbar = (pageId: string, color = '#000000'): CanvasElement[] => [
    { id: 'nav-logo', type: 'heading', bounds: { x: 60, y: 30, width: 200, height: 40 }, props: { content: 'Brand.', fontSize: 24, fontWeight: 800, color }, zIndex: 10, locked: true, hidden: false, pageId },
    { id: 'nav-link-1', type: 'text', bounds: { x: 800, y: 40, width: 100, height: 30 }, props: { content: 'Features', fontSize: 16, fontWeight: 500, textAlign: 'right', color }, zIndex: 10, locked: true, hidden: false, pageId },
    { id: 'nav-link-2', type: 'text', bounds: { x: 920, y: 40, width: 100, height: 30 }, props: { content: 'Pricing', fontSize: 16, fontWeight: 500, textAlign: 'right', color }, zIndex: 10, locked: true, hidden: false, pageId },
    { id: 'nav-cta', type: 'button', bounds: { x: 1050, y: 25, width: 140, height: 45 }, props: { label: 'Login', backgroundColor: 'transparent', textColor: color, borderWidth: 1, borderColor: color, borderRadius: 6 }, zIndex: 10, locked: true, hidden: false, pageId }
];

// ----------------------------------------------------------------------
// 1. SaaS / Tech Startup Template
// ----------------------------------------------------------------------
const saasTemplate: SiteTemplate = {
    id: 'saas-tech',
    name: 'Modern SaaS',
    industryKeywords: ['tech', 'software', 'app', 'startup', 'saas', 'digital', 'crypto', 'ai'],
    description: 'High-conversion layout with trust signals, feature cards, and clear CTAs.',
    structure: {
        sections: [
            { id: 'nav', name: 'Navigation', height: 80, backgroundColor: '#ffffff', elements: [] },
            { id: 'hero', name: 'Hero', height: 750, backgroundColor: '#ffffff', elements: [] },
            { id: 'logos', name: 'Trusted By', height: 180, backgroundColor: '#f9fafb', elements: [] },

            { id: 'features', name: 'Features', height: 900, backgroundColor: '#ffffff', elements: [] },
            { id: 'cta', name: 'Call to Action', height: 400, backgroundColor: '#111827', elements: [] },
            { id: 'footer', name: 'Footer', height: 300, backgroundColor: '#000000', elements: [] }
        ],
        elements: [
            ...createNavbar('home'),

            // Hero
            { id: 'hero-pill', type: 'box', bounds: { x: 515, y: 145, width: 250, height: 32 }, props: { backgroundColor: '#eef2ff', borderRadius: 16 }, zIndex: 0, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-badge', type: 'text', bounds: { x: 515, y: 151, width: 250, height: 30 }, props: { content: '✨ v2.0 is now available', fontSize: 13, color: '#4f46e5', textAlign: 'center', fontWeight: 600 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-title', type: 'heading', bounds: { x: 240, y: 200, width: 800, height: 140 }, props: { content: 'Automate your workflow with AI insights', fontSize: 64, textAlign: 'center', fontWeight: 800, lineHeight: 1.1, color: '#111827' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-sub', type: 'paragraph', bounds: { x: 340, y: 360, width: 600, height: 60 }, props: { content: 'Stop wasting time on manual tasks. Our platform helps you scale efficiently with minimal effort.', fontSize: 20, color: '#4b5563', textAlign: 'center', lineHeight: 1.5 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-btn-1', type: 'button', bounds: { x: 470, y: 450, width: 160, height: 55 }, props: { label: 'Get Started', backgroundColor: '#4f46e5', textColor: '#ffffff', borderRadius: 8, fontWeight: 600 }, zIndex: 2, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-btn-2', type: 'button', bounds: { x: 650, y: 450, width: 160, height: 55 }, props: { label: 'View Demo', backgroundColor: '#ffffff', textColor: '#1f2937', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', fontWeight: 600 }, zIndex: 2, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-img', type: 'image', bounds: { x: 140, y: 550, width: 1000, height: 600 }, props: { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop', objectFit: 'cover', borderRadius: 12, shadow: 'xl' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // Logos
            { id: 'logo-title', type: 'text', bounds: { x: 0, y: 880, width: 1280, height: 30 }, props: { content: 'TRUSTED BY INNOVATIVE TEAMS', fontSize: 12, color: '#9ca3af', textAlign: 'center', letterSpacing: 2, fontWeight: 600 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            // Real Logos (Clearbit)
            { id: 'logo-1', type: 'image', bounds: { x: 140, y: 940, width: 150, height: 50 }, props: { src: 'https://logo.clearbit.com/stripe.com', objectFit: 'contain' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'logo-2', type: 'image', bounds: { x: 390, y: 940, width: 150, height: 50 }, props: { src: 'https://logo.clearbit.com/google.com', objectFit: 'contain' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'logo-3', type: 'image', bounds: { x: 640, y: 940, width: 150, height: 50 }, props: { src: 'https://logo.clearbit.com/airbnb.com', objectFit: 'contain' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'logo-4', type: 'image', bounds: { x: 890, y: 930, width: 150, height: 70 }, props: { src: 'https://logo.clearbit.com/uber.com', objectFit: 'contain' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // Features (Cards)
            { id: 'feat-head', type: 'heading', bounds: { x: 0, y: 1060, width: 1280, height: 50 }, props: { content: 'Everything you need', fontSize: 42, textAlign: 'center', fontWeight: 700 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // F1
            { id: 'feat-1-box', type: 'box', bounds: { x: 140, y: 1180, width: 480, height: 280 }, props: { backgroundColor: '#ffffff', borderRadius: 16, borderColor: '#e5e7eb', borderWidth: 1, shadow: 'sm' }, zIndex: 0, locked: false, hidden: false, pageId: 'home' },
            { id: 'feat-1-icon', type: 'box', bounds: { x: 180, y: 1220, width: 50, height: 50 }, props: { backgroundColor: '#e0e7ff', borderRadius: 10 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' }, // Icon placeholder
            { id: 'feat-1-title', type: 'heading', bounds: { x: 180, y: 1290, width: 400, height: 30 }, props: { content: 'Real-time Analytics', fontSize: 24, fontWeight: 700 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'feat-1-desc', type: 'paragraph', bounds: { x: 180, y: 1330, width: 380, height: 100 }, props: { content: 'Track your performance in real-time with our advanced dashboard. Data updates seamlessly.', fontSize: 16, color: '#6b7280', lineHeight: 1.6 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // F2
            { id: 'feat-2-box', type: 'box', bounds: { x: 660, y: 1180, width: 480, height: 280 }, props: { backgroundColor: '#ffffff', borderRadius: 16, borderColor: '#e5e7eb', borderWidth: 1, shadow: 'sm' }, zIndex: 0, locked: false, hidden: false, pageId: 'home' },
            { id: 'feat-2-icon', type: 'box', bounds: { x: 700, y: 1220, width: 50, height: 50 }, props: { backgroundColor: '#dcfce7', borderRadius: 10 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'feat-2-title', type: 'heading', bounds: { x: 700, y: 1290, width: 400, height: 30 }, props: { content: 'Team Collaboration', fontSize: 24, fontWeight: 700 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'feat-2-desc', type: 'paragraph', bounds: { x: 700, y: 1330, width: 380, height: 100 }, props: { content: 'Work together seamlessly with built-in commenting, sharing, and permission controls.', fontSize: 16, color: '#6b7280', lineHeight: 1.6 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // CTA
            { id: 'cta-title', type: 'heading', bounds: { x: 340, y: 2100, width: 600, height: 60 }, props: { content: 'Ready to get started?', fontSize: 48, textAlign: 'center', color: '#ffffff', fontWeight: 700 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'cta-btn', type: 'button', bounds: { x: 565, y: 2200, width: 150, height: 55 }, props: { label: 'Sign Up Now', backgroundColor: '#4f46e5', textColor: '#ffffff', borderRadius: 8 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' }
        ]
    }
};

// ----------------------------------------------------------------------
// 2. Portfolio / Creative
// ----------------------------------------------------------------------
const portfolioTemplate: SiteTemplate = {
    id: 'portfolio-creative',
    name: 'Visual Portfolio',
    industryKeywords: ['design', 'photography', 'art', 'portfolio', 'creative', 'fashion', 'architecture', 'model'],
    description: 'Image-heavy, editorial layout with generous whitespace.',
    structure: {
        sections: [
            { id: 'nav', name: 'Navigation', height: 100, backgroundColor: '#ffffff', elements: [] },
            { id: 'hero', name: 'Hero', height: 800, backgroundColor: '#ffffff', elements: [] },
            { id: 'work', name: 'Selected Work', height: 1600, backgroundColor: '#ffffff', elements: [] },
            { id: 'status', name: 'Status', height: 400, backgroundColor: '#000000', elements: [] },
            { id: 'footer', name: 'Footer', height: 100, backgroundColor: '#000000', elements: [] }
        ],
        elements: [
            ...createNavbar('home'),

            // Asymmetric Hero
            { id: 'hero-title', type: 'heading', bounds: { x: 100, y: 250, width: 600, height: 300 }, props: { content: 'Building digital experiences that matter.', fontSize: 80, fontWeight: 300, lineHeight: 1.05, letterSpacing: -2 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-img', type: 'image', bounds: { x: 750, y: 150, width: 430, height: 650 }, props: { src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200&auto=format&fit=crop', objectFit: 'cover' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-scroll', type: 'text', bounds: { x: 100, y: 600, width: 200, height: 30 }, props: { content: '( SCROLL TO EXPLORE )', fontSize: 12, letterSpacing: 1 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // Work (Better Spacing)
            // P1
            { id: 'work-1-img', type: 'image', bounds: { x: 100, y: 1000, width: 600, height: 700 }, props: { src: '', objectFit: 'cover', backgroundColor: '#f3f4f6' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'work-1-cat', type: 'text', bounds: { x: 740, y: 1000, width: 200, height: 30 }, props: { content: 'BRANDING / 2024', fontSize: 12, letterSpacing: 1, color: '#6b7280' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'work-1-title', type: 'heading', bounds: { x: 740, y: 1040, width: 400, height: 50 }, props: { content: 'Project Alpha', fontSize: 32, fontWeight: 400 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'work-1-desc', type: 'paragraph', bounds: { x: 740, y: 1100, width: 350, height: 100 }, props: { content: 'A complete rebrand for a fintech startup focusing on trust and security.', fontSize: 16, color: '#4b5563', lineHeight: 1.6 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // P2 (Offset)
            { id: 'work-2-img', type: 'image', bounds: { x: 580, y: 1800, width: 600, height: 450 }, props: { src: '', objectFit: 'cover', backgroundColor: '#f3f4f6' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'work-2-title', type: 'heading', bounds: { x: 580, y: 2270, width: 400, height: 30 }, props: { content: 'Studio Beta', fontSize: 24, fontWeight: 400 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // Status
            { id: 'status-title', type: 'heading', bounds: { x: 140, y: 2600, width: 1000, height: 80 }, props: { content: 'Currently accepting new projects for Q3 2024.', fontSize: 48, textAlign: 'center', fontWeight: 300, color: '#ffffff' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'status-btn', type: 'button', bounds: { x: 540, y: 2720, width: 200, height: 60 }, props: { label: 'Get in Touch', backgroundColor: '#ffffff', textColor: '#000000', borderRadius: 30 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
        ]
    }
}

// ----------------------------------------------------------------------
// 3. Restaurant / Food
// ----------------------------------------------------------------------
const restaurantTemplate: SiteTemplate = {
    id: 'restaurant-food',
    name: 'Modern Restaurant',
    industryKeywords: ['restaurant', 'food', 'cafe', 'coffee', 'bakery', 'bar', 'dining'],
    description: 'Immersive visuals with elegant typography and menu layouts.',
    structure: {
        sections: [
            { id: 'hero', name: 'Hero', height: 900, backgroundColor: '#1c1917', elements: [] },
            { id: 'intro', name: 'Intro', height: 600, backgroundColor: '#fff7ed', elements: [] },
            { id: 'menu', name: 'Menu Highlights', height: 800, backgroundColor: '#ffffff', elements: [] },
            { id: 'info', name: 'Location & Hours', height: 600, backgroundColor: '#1c1917', elements: [] },
            { id: 'footer', name: 'Footer', height: 200, backgroundColor: '#000000', elements: [] }
        ],
        elements: [
            ...createNavbar('home', '#ffffff'),

            // Full bleed hero with stronger overlay
            { id: 'hero-img', type: 'image', bounds: { x: 0, y: 0, width: 1280, height: 900 }, props: { src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1200&auto=format&fit=crop', objectFit: 'cover' }, zIndex: 0, locked: true, hidden: false, pageId: 'home' },
            { id: 'hero-overlay', type: 'box', bounds: { x: 0, y: 0, width: 1280, height: 900 }, props: { backgroundColor: 'rgba(0,0,0,0.5)' }, zIndex: 1, locked: true, hidden: false, pageId: 'home' },

            // Centered Hero Content
            { id: 'hero-pre', type: 'text', bounds: { x: 440, y: 350, width: 400, height: 30 }, props: { content: 'EST. 1998', fontSize: 14, textAlign: 'center', color: '#fbbf24', letterSpacing: 4, fontWeight: 600 }, zIndex: 2, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-title', type: 'heading', bounds: { x: 190, y: 390, width: 900, height: 120 }, props: { content: 'Taste the Authentic.', fontSize: 96, textAlign: 'center', color: '#ffffff', fontFamily: 'Playfair Display', fontStyle: 'italic' }, zIndex: 2, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-btn', type: 'button', bounds: { x: 565, y: 550, width: 150, height: 50 }, props: { label: 'Book a Table', backgroundColor: '#d97706', textColor: '#ffffff', borderRadius: 2 }, zIndex: 2, locked: false, hidden: false, pageId: 'home' },

            // Intro with Border
            { id: 'intro-border', type: 'box', bounds: { x: 140, y: 950, width: 1000, height: 500 }, props: { backgroundColor: 'transparent', borderColor: '#d97706', borderWidth: 1 }, zIndex: 1, locked: true, hidden: false, pageId: 'home' },
            { id: 'intro-title', type: 'heading', bounds: { x: 340, y: 1050, width: 600, height: 60 }, props: { content: 'A Culinary Journey', fontSize: 48, textAlign: 'center', fontFamily: 'Playfair Display', color: '#1c1917' }, zIndex: 2, locked: false, hidden: false, pageId: 'home' },
            { id: 'intro-text', type: 'paragraph', bounds: { x: 440, y: 1140, width: 400, height: 150 }, props: { content: 'We believe in the power of fresh, locally sourced ingredients. Our chef creates a narrative with every dish, ensuring that your evening is not just a meal, but a memory.', fontSize: 18, textAlign: 'center', lineHeight: 1.8, color: '#4b5563' }, zIndex: 2, locked: false, hidden: false, pageId: 'home' },

            // Menu (Simple List)
            { id: 'menu-1-title', type: 'heading', bounds: { x: 300, y: 1600, width: 400, height: 30 }, props: { content: 'Truffle Pasta', fontSize: 24, fontFamily: 'Playfair Display' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'menu-1-dots', type: 'text', bounds: { x: 300, y: 1615, width: 680, height: 30 }, props: { content: '...........................................................................................', color: '#e5e7eb' }, zIndex: 0, locked: false, hidden: false, pageId: 'home' },
            { id: 'menu-1-price', type: 'text', bounds: { x: 900, y: 1600, width: 80, height: 30 }, props: { content: '$28', fontSize: 24, textAlign: 'right', fontFamily: 'Playfair Display' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
        ]
    }
}

// ----------------------------------------------------------------------
// 4. Local Service (Plumber, Florist, etc)
// ----------------------------------------------------------------------
const serviceTemplate: SiteTemplate = {
    id: 'local-service',
    name: 'Local Service',
    industryKeywords: ['plumber', 'electrician', 'cleaning', 'florist', 'landscaping', 'mechanic', 'flowers'],
    description: 'Trust-focused layout with clear value propositions and immediate contact form.',
    structure: {
        sections: [
            { id: 'nav', name: 'Navigation', height: 80, backgroundColor: '#ffffff', elements: [] },
            { id: 'hero', name: 'Hero', height: 750, backgroundColor: '#f0fdf4', elements: [] },
            { id: 'steps', name: 'How It Works', height: 600, backgroundColor: '#ffffff', elements: [] },
            { id: 'contact', name: 'Quick Contact', height: 600, backgroundColor: '#166534', elements: [] },
            { id: 'footer', name: 'Footer', height: 250, backgroundColor: '#111827', elements: [] }
        ],
        elements: [
            ...createNavbar('home'),

            // Split Hero
            { id: 'hero-tag', type: 'text', bounds: { x: 100, y: 200, width: 300, height: 30 }, props: { content: 'AVAILABLE 24/7 FOR EMERGENCIES', fontSize: 12, fontWeight: 700, color: '#15803d', letterSpacing: 1 }, zIndex: 2, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-title', type: 'heading', bounds: { x: 100, y: 240, width: 550, height: 160 }, props: { content: 'Reliable Service You Can Trust.', fontSize: 64, fontWeight: 800, lineHeight: 1.1, color: '#111827' }, zIndex: 2, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-sub', type: 'paragraph', bounds: { x: 100, y: 420, width: 480, height: 80 }, props: { content: 'Professional, affordable, and always on time. We handle the hard work so you don\'t have to worry about a thing.', fontSize: 20, color: '#374151', lineHeight: 1.5 }, zIndex: 2, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-btn', type: 'button', bounds: { x: 100, y: 530, width: 220, height: 60 }, props: { label: 'Get a Free Quote', backgroundColor: '#15803d', textColor: '#ffffff', borderRadius: 8, fontWeight: 600, fontSize: 18 }, zIndex: 2, locked: false, hidden: false, pageId: 'home' },
            // Image with rounded corners and shadow
            { id: 'hero-img', type: 'image', bounds: { x: 700, y: 150, width: 480, height: 550 }, props: { src: '', objectFit: 'cover', borderRadius: 24, shadow: '2xl', backgroundColor: '#d1fae5' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // Steps (Cards)
            { id: 'steps-title', type: 'heading', bounds: { x: 0, y: 900, width: 1280, height: 50 }, props: { content: 'How It Works', textAlign: 'center', fontWeight: 700, fontSize: 36 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            // Step 1
            { id: 'step-1-box', type: 'box', bounds: { x: 140, y: 1000, width: 300, height: 250 }, props: { backgroundColor: '#f9fafb', borderRadius: 12 }, zIndex: 0, locked: false, hidden: false, pageId: 'home' },
            { id: 'step-1-num', type: 'heading', bounds: { x: 170, y: 1030, width: 50, height: 50 }, props: { content: '01', fontSize: 42, color: '#dcfce7', fontWeight: 800 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'step-1-t', type: 'heading', bounds: { x: 170, y: 1100, width: 200, height: 30 }, props: { content: 'Book Online', fontWeight: 600, fontSize: 22 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'step-1-d', type: 'paragraph', bounds: { x: 170, y: 1140, width: 240, height: 80 }, props: { content: 'Choose a time that works for you using our simple form.', color: '#4b5563' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // Contact Form Container
            { id: 'contact-container', type: 'box', bounds: { x: 340, y: 1550, width: 600, height: 450 }, props: { backgroundColor: '#ffffff', borderRadius: 16, shadow: 'xl' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'contact-head', type: 'heading', bounds: { x: 390, y: 1600, width: 500, height: 40 }, props: { content: 'Request a Service', textAlign: 'center', fontWeight: 700 }, zIndex: 2, locked: false, hidden: false, pageId: 'home' },
            { id: 'contact-form', type: 'contact-form', bounds: { x: 390, y: 1670, width: 500, height: 300 }, props: { submitLabel: 'Send Request', submitColor: '#15803d' }, zIndex: 2, locked: false, hidden: false, pageId: 'home' },
        ]
    }
}

// ----------------------------------------------------------------------
// 5. Retail / E-commerce
// ----------------------------------------------------------------------
const retailTemplate: SiteTemplate = {
    id: 'retail-store',
    name: 'Online Store',
    industryKeywords: ['store', 'shop', 'retail', 'fashion', 'clothing', 'jewelry', 'boutique'],
    description: 'Product-focused layout with collection grids and newsletter capture.',
    structure: {
        sections: [
            { id: 'nav', name: 'Navigation', height: 80, backgroundColor: '#ffffff', elements: [] },
            { id: 'hero', name: 'Hero', height: 750, backgroundColor: '#ffffff', elements: [] },
            { id: 'new-arrivals', name: 'New Arrivals', height: 1000, backgroundColor: '#ffffff', elements: [] },
            { id: 'newsletter', name: 'Newsletter', height: 450, backgroundColor: '#111827', elements: [] },
            { id: 'footer', name: 'Footer', height: 300, backgroundColor: '#000000', elements: [] }
        ],
        elements: [
            ...createNavbar('home'),

            // Hero with side content
            { id: 'hero-bg', type: 'box', bounds: { x: 20, y: 100, width: 1240, height: 650 }, props: { backgroundColor: '#f3f4f6', borderRadius: 24 }, zIndex: 0, locked: true, hidden: false, pageId: 'home' },
            { id: 'hero-title', type: 'heading', bounds: { x: 100, y: 300, width: 500, height: 140 }, props: { content: 'Summer Collection 2024', fontSize: 72, fontWeight: 800, lineHeight: 1 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-sub', type: 'paragraph', bounds: { x: 100, y: 460, width: 400, height: 60 }, props: { content: 'Discover the new trends that redefine your style.', fontSize: 20, color: '#4b5563' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-btn', type: 'button', bounds: { x: 100, y: 550, width: 180, height: 55 }, props: { label: 'Shop Now', backgroundColor: '#000000', textColor: '#ffffff', borderRadius: 40 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'hero-img', type: 'image', bounds: { x: 700, y: 150, width: 500, height: 550 }, props: { src: '', objectFit: 'cover', borderRadius: 16 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // New Arrivals (Grid)
            { id: 'new-title', type: 'heading', bounds: { x: 0, y: 880, width: 1280, height: 40 }, props: { content: 'New Arrivals', textAlign: 'center', fontSize: 32, fontWeight: 600 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // Product 1
            { id: 'prod-1-img', type: 'image', bounds: { x: 140, y: 980, width: 300, height: 400 }, props: { src: '', objectFit: 'cover', backgroundColor: '#f9fafb' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'prod-1-name', type: 'heading', bounds: { x: 140, y: 1400, width: 300, height: 30 }, props: { content: 'Classic Tee', fontWeight: 600, fontSize: 18 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'prod-1-price', type: 'paragraph', bounds: { x: 140, y: 1430, width: 300, height: 30 }, props: { content: '$49.00', color: '#6b7280' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // Product 2
            { id: 'prod-2-img', type: 'image', bounds: { x: 490, y: 980, width: 300, height: 400 }, props: { src: '', objectFit: 'cover', backgroundColor: '#f9fafb' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'prod-2-name', type: 'heading', bounds: { x: 490, y: 1400, width: 300, height: 30 }, props: { content: 'Linen Shirt', fontWeight: 600, fontSize: 18 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'prod-2-price', type: 'paragraph', bounds: { x: 490, y: 1430, width: 300, height: 30 }, props: { content: '$89.00', color: '#6b7280' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // Product 3
            { id: 'prod-3-img', type: 'image', bounds: { x: 840, y: 980, width: 300, height: 400 }, props: { src: '', objectFit: 'cover', backgroundColor: '#f9fafb' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'prod-3-name', type: 'heading', bounds: { x: 840, y: 1400, width: 300, height: 30 }, props: { content: 'Urban Jacket', fontWeight: 600, fontSize: 18 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'prod-3-price', type: 'paragraph', bounds: { x: 840, y: 1430, width: 300, height: 30 }, props: { content: '$129.00', color: '#6b7280' }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },

            // Newsletter
            { id: 'news-title', type: 'heading', bounds: { x: 340, y: 1950, width: 600, height: 50 }, props: { content: 'Join Our Newsletter', color: '#ffffff', textAlign: 'center', fontSize: 36 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
            { id: 'news-desc', type: 'paragraph', bounds: { x: 340, y: 2010, width: 600, height: 50 }, props: { content: 'Get 10% off your first order when you sign up today.', color: '#9ca3af', textAlign: 'center', fontSize: 18 }, zIndex: 1, locked: false, hidden: false, pageId: 'home' },
        ]
    }
}

export const siteTemplates: SiteTemplate[] = [
    saasTemplate,
    portfolioTemplate,
    restaurantTemplate,
    serviceTemplate,
    retailTemplate
];

export function getTemplateForIndustry(industry: string): SiteTemplate {
    const normalize = (s: string) => s.toLowerCase().trim();
    const target = normalize(industry);

    // Exact or partial match
    const match = siteTemplates.find(t =>
        t.industryKeywords.some(k => target.includes(k))
    );

    // Default to Service if no match (safe generic business choice)
    return match || saasTemplate;
}