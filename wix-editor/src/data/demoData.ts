/**
 * DEMO FLOW DATA — "Daisy Rose Garden"
 * 
 * When a user enters "Daisy Rose Garden" as their business name,
 * the entire pipeline uses this hardcoded data instead of AI/API calls.
 * This guarantees a flawless, deterministic demo experience.
 */

// ─── Demo Trigger ───────────────────────────────────────────────
export const DEMO_BUSINESS_NAME = 'Daisy Rose Garden';

export function isDemoMode(name: string): boolean {
    return name.trim().toLowerCase() === DEMO_BUSINESS_NAME.toLowerCase();
}

// ─── Onboarding Pre-fill ────────────────────────────────────────
export const DEMO_ONBOARDING = {
    industry: 'Flower Shop',
    vibe: 'Playful',
    pitch: 'A charming boutique flower shop specializing in hand-crafted bouquets, wedding florals, and seasonal arrangements. We bring joy through the art of flowers — from everyday blooms to breathtaking event designs.',
    features: ['Portfolio', 'Testimonials', 'Contact Form', 'Bookings'],
};

// ─── Rosy Theme ─────────────────────────────────────────────────
export const DEMO_THEME = {
    colors: {
        primary: '#be185d',     // Deep rose
        secondary: '#fce7f3',   // Soft pink bg
        accent: '#f9a8d4',      // Pink accent
        background: '#fff1f2',  // Rose white
        text: '#4a0e2b',        // Dark rose text
    },
    fonts: {
        heading: 'Playfair Display',
        body: 'Inter',
    },
};

// ─── Curated Media Assets ───────────────────────────────────────
// These match the MediaAsset interface used by media-selection page
export const DEMO_MEDIA_ASSETS = [
    {
        id: 'demo-img-0',
        type: 'image' as const,
        src: 'https://plus.unsplash.com/premium_photo-1677005708723-c0dabb815e4b?fm=jpg&q=80&w=1200&auto=format&fit=crop',
        label: 'Hero — Bouquet in Hands',
        desc: 'Found on Unsplash — by Unsplash+',
        source: 'Unsplash',
    },
    {
        id: 'demo-img-1',
        type: 'image' as const,
        src: 'https://images.unsplash.com/photo-1604323990536-e5452c0507c1?fm=jpg&q=80&w=1200&auto=format&fit=crop',
        label: 'Basket of Flowers',
        desc: 'Found on Unsplash — by Tanya Truong',
        source: 'Unsplash',
    },
    {
        id: 'demo-img-2',
        type: 'image' as const,
        src: 'https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?fm=jpg&q=80&w=1200&auto=format&fit=crop',
        label: 'Holding a Bouquet',
        desc: 'Found on Unsplash — by Secret Garden',
        source: 'Unsplash',
    },
    {
        id: 'demo-img-3',
        type: 'image' as const,
        src: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?fm=jpg&q=80&w=1200&auto=format&fit=crop',
        label: 'Vase Centerpiece',
        desc: 'Found on Unsplash — by Leonardo Wong',
        source: 'Unsplash',
    },
    {
        id: 'demo-img-4',
        type: 'image' as const,
        src: 'https://plus.unsplash.com/premium_photo-1713823800827-4c10d4d37585?fm=jpg&q=80&w=1200&auto=format&fit=crop',
        label: 'Wrapped Bouquet',
        desc: 'Found on Unsplash — by Unsplash+',
        source: 'Unsplash',
    },
    {
        id: 'demo-img-5',
        type: 'image' as const,
        src: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?fm=jpg&q=80&w=1200&auto=format&fit=crop',
        label: 'Pink Roses',
        desc: 'Found on Unsplash — by Ksenia Chernaya',
        source: 'Unsplash',
    },
];

// ─── AI-Generated Content (Pre-picked) ─────────────────────────
export const DEMO_HEADLINE = 'Flowers That Speak From the Heart';

export const DEMO_TESTIMONIAL = {
    quote: 'Daisy Rose Garden made my wedding day absolutely magical. The arrangements were beyond anything I imagined — every single bloom was perfect.',
    author: 'Sophia Chen',
    role: 'Bride, June 2025',
};

// ─── Media Selection Assets (formatted for the MediaAsset interface) ──
export const DEMO_HEADLINE_ASSET = {
    id: 'ai-headline',
    type: 'text' as const,
    content: DEMO_HEADLINE,
    label: 'Hero Headline',
    desc: 'AI-generated headline for your hero section.',
    source: 'AI Generated',
    bg: '#fce7f3',
};

export const DEMO_TESTIMONIAL_ASSET = {
    id: 'ai-testimonial',
    type: 'text' as const,
    content: `"${DEMO_TESTIMONIAL.quote}" - ${DEMO_TESTIMONIAL.author}, ${DEMO_TESTIMONIAL.role}`,
    label: 'Testimonials',
    desc: 'AI-generated customer testimonial.',
    source: 'AI Generated',
    bg: '#fff1f2',
};

export const DEMO_LOGO_ASSET = {
    id: 'brand-logo',
    type: 'logo' as const,
    content: DEMO_BUSINESS_NAME,
    label: 'Brand Logo',
    desc: 'Your business name as a brand mark.',
    source: 'AI Generated',
    bg: '#fce7f3',
};

// ─── Image URLs shorthand ───────────────────────────────────────
const IMG = {
    hero: DEMO_MEDIA_ASSETS[0].src,      // Bouquet in hands
    basket: DEMO_MEDIA_ASSETS[1].src,     // Basket of flowers
    holding: DEMO_MEDIA_ASSETS[2].src,    // Holding bouquet
    vase: DEMO_MEDIA_ASSETS[3].src,       // Vase centerpiece
    wrapped: DEMO_MEDIA_ASSETS[4].src,    // Wrapped bouquet
    roses: DEMO_MEDIA_ASSETS[5].src,      // Pink roses
};

// ─── Complete Hardcoded Site Data ────────────────────────────────
// This is the JSON that would normally come from /api/generate-site
// Hand-crafted for pixel-perfect results with a rosy flower shop aesthetic

export const DEMO_SITE_DATA = {
    pages: [
        {
            id: 'home',
            name: 'Home',
            slug: '/',
            isHomePage: true,
            height: 4800,
            minHeight: 4800,
            elements: [
                // ═══════════════════════════════════════════════
                // NAVIGATION (y: 0–80)
                // ═══════════════════════════════════════════════
                {
                    id: 'nav-bg', type: 'box',
                    bounds: { x: 0, y: 0, width: 1280, height: 80 },
                    props: { backgroundColor: '#fff1f2' },
                    zIndex: 9, locked: true, hidden: false,
                },
                {
                    id: 'nav-logo', type: 'heading',
                    bounds: { x: 60, y: 22, width: 280, height: 40 },
                    props: { content: '🌸 Daisy Rose Garden', fontSize: 22, fontWeight: 700, color: '#be185d', fontFamily: 'Playfair Display' },
                    zIndex: 10, locked: true, hidden: false,
                },
                {
                    id: 'nav-link-1', type: 'text',
                    bounds: { x: 750, y: 30, width: 100, height: 24 },
                    props: { content: 'Our Flowers', fontSize: 15, fontWeight: 500, color: '#4a0e2b', textAlign: 'right' },
                    zIndex: 10, locked: true, hidden: false,
                },
                {
                    id: 'nav-link-2', type: 'text',
                    bounds: { x: 870, y: 30, width: 100, height: 24 },
                    props: { content: 'Weddings', fontSize: 15, fontWeight: 500, color: '#4a0e2b', textAlign: 'right' },
                    zIndex: 10, locked: true, hidden: false,
                },
                {
                    id: 'nav-cta', type: 'button',
                    bounds: { x: 1050, y: 18, width: 160, height: 44 },
                    props: { label: 'Order Flowers', backgroundColor: '#be185d', textColor: '#ffffff', borderRadius: 24, fontWeight: 600, fontSize: 14 },
                    zIndex: 10, locked: true, hidden: false,
                },

                // ═══════════════════════════════════════════════
                // HERO SECTION (y: 80–880)
                // ═══════════════════════════════════════════════
                {
                    id: 'hero-bg', type: 'box',
                    bounds: { x: 0, y: 80, width: 1280, height: 800 },
                    props: { backgroundColor: '#fff1f2' },
                    zIndex: 0, locked: true, hidden: false,
                },
                // Left content
                {
                    id: 'hero-badge', type: 'text',
                    bounds: { x: 100, y: 260, width: 280, height: 28 },
                    props: { content: '🌷 HANDCRAFTED WITH LOVE', fontSize: 12, fontWeight: 700, color: '#be185d', letterSpacing: 2 },
                    zIndex: 2, locked: false, hidden: false,
                },
                {
                    id: 'hero-title', type: 'heading',
                    bounds: { x: 100, y: 300, width: 520, height: 180 },
                    props: { content: 'Flowers That Speak From the Heart', fontSize: 60, fontWeight: 700, lineHeight: 1.1, color: '#4a0e2b', fontFamily: 'Playfair Display' },
                    zIndex: 2, locked: false, hidden: false,
                },
                {
                    id: 'hero-sub', type: 'paragraph',
                    bounds: { x: 100, y: 500, width: 460, height: 70 },
                    props: { content: 'From everyday bouquets to breathtaking wedding florals — we bring joy through the timeless art of flowers. Hand-arranged, locally sourced, delivered with care.', fontSize: 18, color: '#831843', lineHeight: 1.6 },
                    zIndex: 2, locked: false, hidden: false,
                },
                {
                    id: 'hero-btn-1', type: 'button',
                    bounds: { x: 100, y: 600, width: 200, height: 56 },
                    props: { label: 'Shop Bouquets', backgroundColor: '#be185d', textColor: '#ffffff', borderRadius: 28, fontWeight: 600, fontSize: 16 },
                    zIndex: 2, locked: false, hidden: false,
                },
                {
                    id: 'hero-btn-2', type: 'button',
                    bounds: { x: 320, y: 600, width: 200, height: 56 },
                    props: { label: 'Book a Consult', backgroundColor: 'transparent', textColor: '#be185d', borderRadius: 28, borderWidth: 2, borderColor: '#be185d', fontWeight: 600, fontSize: 16 },
                    zIndex: 2, locked: false, hidden: false,
                },
                // Hero image (right side — bouquet in hands)
                {
                    id: 'hero-img', type: 'image',
                    bounds: { x: 680, y: 140, width: 530, height: 660 },
                    props: { src: IMG.hero, objectFit: 'cover', borderRadius: 280, shadow: '2xl' },
                    zIndex: 1, locked: false, hidden: false,
                },
                // Decorative floating accent
                {
                    id: 'hero-accent-1', type: 'box',
                    bounds: { x: 640, y: 200, width: 60, height: 60 },
                    props: { backgroundColor: '#f9a8d4', borderRadius: 30 },
                    zIndex: 0, locked: false, hidden: false,
                },
                {
                    id: 'hero-accent-2', type: 'box',
                    bounds: { x: 1180, y: 700, width: 40, height: 40 },
                    props: { backgroundColor: '#fbcfe8', borderRadius: 20 },
                    zIndex: 0, locked: false, hidden: false,
                },

                // ═══════════════════════════════════════════════
                // "WHY US" / TRUST SECTION (y: 880–1380)
                // ═══════════════════════════════════════════════
                {
                    id: 'why-bg', type: 'box',
                    bounds: { x: 0, y: 880, width: 1280, height: 500 },
                    props: { backgroundColor: '#ffffff' },
                    zIndex: 0, locked: true, hidden: false,
                },
                {
                    id: 'why-title', type: 'heading',
                    bounds: { x: 0, y: 930, width: 1280, height: 50 },
                    props: { content: 'Why Daisy Rose Garden?', fontSize: 40, textAlign: 'center', fontWeight: 700, color: '#4a0e2b', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'why-sub', type: 'paragraph',
                    bounds: { x: 340, y: 990, width: 600, height: 40 },
                    props: { content: 'Three reasons our customers keep coming back for more.', fontSize: 16, textAlign: 'center', color: '#9d174d' },
                    zIndex: 1, locked: false, hidden: false,
                },
                // Card 1
                {
                    id: 'why-card-1', type: 'box',
                    bounds: { x: 100, y: 1070, width: 340, height: 250 },
                    props: { backgroundColor: '#fff1f2', borderRadius: 20 },
                    zIndex: 0, locked: false, hidden: false,
                },
                {
                    id: 'why-icon-1', type: 'text',
                    bounds: { x: 100, y: 1090, width: 340, height: 50 },
                    props: { content: '💐', fontSize: 36, textAlign: 'center' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'why-t-1', type: 'heading',
                    bounds: { x: 130, y: 1150, width: 280, height: 30 },
                    props: { content: 'Farm-Fresh Daily', fontSize: 22, fontWeight: 700, textAlign: 'center', color: '#4a0e2b', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'why-d-1', type: 'paragraph',
                    bounds: { x: 130, y: 1190, width: 280, height: 100 },
                    props: { content: 'Every stem is hand-selected from local farms each morning, ensuring maximum freshness and vibrant colors.', fontSize: 14, textAlign: 'center', color: '#831843', lineHeight: 1.6 },
                    zIndex: 1, locked: false, hidden: false,
                },
                // Card 2
                {
                    id: 'why-card-2', type: 'box',
                    bounds: { x: 470, y: 1070, width: 340, height: 250 },
                    props: { backgroundColor: '#fce7f3', borderRadius: 20 },
                    zIndex: 0, locked: false, hidden: false,
                },
                {
                    id: 'why-icon-2', type: 'text',
                    bounds: { x: 470, y: 1090, width: 340, height: 50 },
                    props: { content: '✨', fontSize: 36, textAlign: 'center' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'why-t-2', type: 'heading',
                    bounds: { x: 500, y: 1150, width: 280, height: 30 },
                    props: { content: 'Custom Designs', fontSize: 22, fontWeight: 700, textAlign: 'center', color: '#4a0e2b', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'why-d-2', type: 'paragraph',
                    bounds: { x: 500, y: 1190, width: 280, height: 100 },
                    props: { content: 'From intimate bouquets to grand event installations, our designers craft arrangements tailored to your vision.', fontSize: 14, textAlign: 'center', color: '#831843', lineHeight: 1.6 },
                    zIndex: 1, locked: false, hidden: false,
                },
                // Card 3
                {
                    id: 'why-card-3', type: 'box',
                    bounds: { x: 840, y: 1070, width: 340, height: 250 },
                    props: { backgroundColor: '#fff1f2', borderRadius: 20 },
                    zIndex: 0, locked: false, hidden: false,
                },
                {
                    id: 'why-icon-3', type: 'text',
                    bounds: { x: 840, y: 1090, width: 340, height: 50 },
                    props: { content: '🚚', fontSize: 36, textAlign: 'center' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'why-t-3', type: 'heading',
                    bounds: { x: 870, y: 1150, width: 280, height: 30 },
                    props: { content: 'Same-Day Delivery', fontSize: 22, fontWeight: 700, textAlign: 'center', color: '#4a0e2b', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'why-d-3', type: 'paragraph',
                    bounds: { x: 870, y: 1190, width: 280, height: 100 },
                    props: { content: 'Order by 2 PM and receive your beautiful blooms the very same day — wrapped and ready to delight.', fontSize: 14, textAlign: 'center', color: '#831843', lineHeight: 1.6 },
                    zIndex: 1, locked: false, hidden: false,
                },

                // ═══════════════════════════════════════════════
                // PORTFOLIO / GALLERY (y: 1380–2280)
                // ═══════════════════════════════════════════════
                {
                    id: 'gallery-bg', type: 'box',
                    bounds: { x: 0, y: 1380, width: 1280, height: 900 },
                    props: { backgroundColor: '#fce7f3' },
                    zIndex: 0, locked: true, hidden: false,
                },
                {
                    id: 'gallery-title', type: 'heading',
                    bounds: { x: 0, y: 1420, width: 1280, height: 50 },
                    props: { content: 'Our Arrangements', fontSize: 40, textAlign: 'center', fontWeight: 700, color: '#4a0e2b', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'gallery-sub', type: 'paragraph',
                    bounds: { x: 340, y: 1480, width: 600, height: 30 },
                    props: { content: 'A glimpse of our most-loved creations.', fontSize: 16, textAlign: 'center', color: '#9d174d' },
                    zIndex: 1, locked: false, hidden: false,
                },
                // Row 1 — 3 images
                {
                    id: 'gallery-img-1', type: 'image',
                    bounds: { x: 100, y: 1540, width: 360, height: 300 },
                    props: { src: IMG.basket, objectFit: 'cover', borderRadius: 16 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'gallery-label-1', type: 'text',
                    bounds: { x: 100, y: 1850, width: 360, height: 24 },
                    props: { content: 'Spring Basket Arrangement', fontSize: 14, fontWeight: 600, textAlign: 'center', color: '#4a0e2b' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'gallery-img-2', type: 'image',
                    bounds: { x: 480, y: 1540, width: 320, height: 300 },
                    props: { src: IMG.roses, objectFit: 'cover', borderRadius: 16 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'gallery-label-2', type: 'text',
                    bounds: { x: 480, y: 1850, width: 320, height: 24 },
                    props: { content: 'Classic Rose Collection', fontSize: 14, fontWeight: 600, textAlign: 'center', color: '#4a0e2b' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'gallery-img-3', type: 'image',
                    bounds: { x: 820, y: 1540, width: 360, height: 300 },
                    props: { src: IMG.vase, objectFit: 'cover', borderRadius: 16 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'gallery-label-3', type: 'text',
                    bounds: { x: 820, y: 1850, width: 360, height: 24 },
                    props: { content: 'Elegant Vase Centerpiece', fontSize: 14, fontWeight: 600, textAlign: 'center', color: '#4a0e2b' },
                    zIndex: 1, locked: false, hidden: false,
                },
                // Row 2 — 2 images centered
                {
                    id: 'gallery-img-4', type: 'image',
                    bounds: { x: 200, y: 1900, width: 400, height: 300 },
                    props: { src: IMG.wrapped, objectFit: 'cover', borderRadius: 16 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'gallery-label-4', type: 'text',
                    bounds: { x: 200, y: 2210, width: 400, height: 24 },
                    props: { content: 'Gift-Wrapped Bouquet', fontSize: 14, fontWeight: 600, textAlign: 'center', color: '#4a0e2b' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'gallery-img-5', type: 'image',
                    bounds: { x: 680, y: 1900, width: 400, height: 300 },
                    props: { src: IMG.holding, objectFit: 'cover', borderRadius: 16 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'gallery-label-5', type: 'text',
                    bounds: { x: 680, y: 2210, width: 400, height: 24 },
                    props: { content: 'Bridal Bouquet', fontSize: 14, fontWeight: 600, textAlign: 'center', color: '#4a0e2b' },
                    zIndex: 1, locked: false, hidden: false,
                },

                // ═══════════════════════════════════════════════
                // TESTIMONIAL SECTION (y: 2280–2900)
                // ═══════════════════════════════════════════════
                {
                    id: 'testimonial-bg', type: 'box',
                    bounds: { x: 0, y: 2280, width: 1280, height: 620 },
                    props: { backgroundColor: '#ffffff' },
                    zIndex: 0, locked: true, hidden: false,
                },
                {
                    id: 'testimonial-title', type: 'heading',
                    bounds: { x: 0, y: 2330, width: 1280, height: 50 },
                    props: { content: 'What Our Customers Say', fontSize: 40, textAlign: 'center', fontWeight: 700, color: '#4a0e2b', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                // Testimonial 1
                {
                    id: 'testi-card-1', type: 'box',
                    bounds: { x: 100, y: 2420, width: 530, height: 280 },
                    props: { backgroundColor: '#fff1f2', borderRadius: 20 },
                    zIndex: 0, locked: false, hidden: false,
                },
                {
                    id: 'testi-stars-1', type: 'text',
                    bounds: { x: 140, y: 2450, width: 200, height: 24 },
                    props: { content: '⭐⭐⭐⭐⭐', fontSize: 18 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'testi-quote-1', type: 'paragraph',
                    bounds: { x: 140, y: 2490, width: 450, height: 100 },
                    props: { content: '"Daisy Rose Garden made my wedding day absolutely magical. The arrangements were beyond anything I imagined — every single bloom was perfect."', fontSize: 16, fontStyle: 'italic', color: '#831843', lineHeight: 1.6 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'testi-author-1', type: 'text',
                    bounds: { x: 140, y: 2610, width: 300, height: 24 },
                    props: { content: '— Sophia Chen, Bride', fontSize: 14, fontWeight: 600, color: '#be185d' },
                    zIndex: 1, locked: false, hidden: false,
                },
                // Testimonial 2
                {
                    id: 'testi-card-2', type: 'box',
                    bounds: { x: 660, y: 2420, width: 530, height: 280 },
                    props: { backgroundColor: '#fce7f3', borderRadius: 20 },
                    zIndex: 0, locked: false, hidden: false,
                },
                {
                    id: 'testi-stars-2', type: 'text',
                    bounds: { x: 700, y: 2450, width: 200, height: 24 },
                    props: { content: '⭐⭐⭐⭐⭐', fontSize: 18 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'testi-quote-2', type: 'paragraph',
                    bounds: { x: 700, y: 2490, width: 450, height: 100 },
                    props: { content: '"I send flowers from Daisy Rose every month to my mother. She always calls me in tears of joy. The quality and creativity are unmatched in the city."', fontSize: 16, fontStyle: 'italic', color: '#831843', lineHeight: 1.6 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'testi-author-2', type: 'text',
                    bounds: { x: 700, y: 2610, width: 300, height: 24 },
                    props: { content: '— James Parker, Loyal Customer', fontSize: 14, fontWeight: 600, color: '#be185d' },
                    zIndex: 1, locked: false, hidden: false,
                },
                // Testimonial 3
                {
                    id: 'testi-card-3', type: 'box',
                    bounds: { x: 300, y: 2720, width: 680, height: 160 },
                    props: { backgroundColor: '#fff1f2', borderRadius: 20 },
                    zIndex: 0, locked: false, hidden: false,
                },
                {
                    id: 'testi-stars-3', type: 'text',
                    bounds: { x: 340, y: 2740, width: 200, height: 24 },
                    props: { content: '⭐⭐⭐⭐⭐', fontSize: 18 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'testi-quote-3', type: 'paragraph',
                    bounds: { x: 340, y: 2770, width: 600, height: 60 },
                    props: { content: '"Their subscription service is a game-changer. Fresh flowers every Friday on my desk — my coworkers are jealous!"', fontSize: 16, fontStyle: 'italic', color: '#831843', lineHeight: 1.5 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'testi-author-3', type: 'text',
                    bounds: { x: 340, y: 2840, width: 300, height: 24 },
                    props: { content: '— Mia Rodriguez, Subscriber', fontSize: 14, fontWeight: 600, color: '#be185d' },
                    zIndex: 1, locked: false, hidden: false,
                },

                // ═══════════════════════════════════════════════
                // SERVICES / OCCASIONS (y: 2900–3700)
                // ═══════════════════════════════════════════════
                {
                    id: 'services-bg', type: 'box',
                    bounds: { x: 0, y: 2900, width: 1280, height: 800 },
                    props: { backgroundColor: '#fce7f3' },
                    zIndex: 0, locked: true, hidden: false,
                },
                {
                    id: 'services-title', type: 'heading',
                    bounds: { x: 0, y: 2950, width: 1280, height: 50 },
                    props: { content: 'For Every Occasion', fontSize: 40, textAlign: 'center', fontWeight: 700, color: '#4a0e2b', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'services-sub', type: 'paragraph',
                    bounds: { x: 290, y: 3010, width: 700, height: 40 },
                    props: { content: 'Whether it\'s a birthday surprise, wedding celebration, or just because — we have the perfect arrangement.', fontSize: 16, textAlign: 'center', color: '#9d174d' },
                    zIndex: 1, locked: false, hidden: false,
                },
                // Service 1 — Weddings
                {
                    id: 'svc-card-1', type: 'box',
                    bounds: { x: 80, y: 3090, width: 270, height: 340 },
                    props: { backgroundColor: '#ffffff', borderRadius: 20, shadow: 'sm' },
                    zIndex: 0, locked: false, hidden: false,
                },
                {
                    id: 'svc-emoji-1', type: 'text',
                    bounds: { x: 80, y: 3110, width: 270, height: 50 },
                    props: { content: '💒', fontSize: 40, textAlign: 'center' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'svc-t-1', type: 'heading',
                    bounds: { x: 100, y: 3170, width: 230, height: 28 },
                    props: { content: 'Weddings', fontSize: 22, fontWeight: 700, textAlign: 'center', color: '#4a0e2b', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'svc-d-1', type: 'paragraph',
                    bounds: { x: 100, y: 3210, width: 230, height: 80 },
                    props: { content: 'Full bridal packages — from bouquets and boutonnieres to ceremony arches and reception centerpieces.', fontSize: 13, textAlign: 'center', color: '#831843', lineHeight: 1.5 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'svc-btn-1', type: 'button',
                    bounds: { x: 130, y: 3320, width: 170, height: 40 },
                    props: { label: 'Learn More', backgroundColor: 'transparent', textColor: '#be185d', borderRadius: 20, borderWidth: 1, borderColor: '#be185d', fontSize: 13 },
                    zIndex: 1, locked: false, hidden: false,
                },
                // Service 2 — Birthdays
                {
                    id: 'svc-card-2', type: 'box',
                    bounds: { x: 380, y: 3090, width: 270, height: 340 },
                    props: { backgroundColor: '#ffffff', borderRadius: 20, shadow: 'sm' },
                    zIndex: 0, locked: false, hidden: false,
                },
                {
                    id: 'svc-emoji-2', type: 'text',
                    bounds: { x: 380, y: 3110, width: 270, height: 50 },
                    props: { content: '🎂', fontSize: 40, textAlign: 'center' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'svc-t-2', type: 'heading',
                    bounds: { x: 400, y: 3170, width: 230, height: 28 },
                    props: { content: 'Birthdays', fontSize: 22, fontWeight: 700, textAlign: 'center', color: '#4a0e2b', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'svc-d-2', type: 'paragraph',
                    bounds: { x: 400, y: 3210, width: 230, height: 80 },
                    props: { content: 'Surprise them with a burst of color. Choose from curated birthday collections or build your own.', fontSize: 13, textAlign: 'center', color: '#831843', lineHeight: 1.5 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'svc-btn-2', type: 'button',
                    bounds: { x: 430, y: 3320, width: 170, height: 40 },
                    props: { label: 'Shop Birthday', backgroundColor: 'transparent', textColor: '#be185d', borderRadius: 20, borderWidth: 1, borderColor: '#be185d', fontSize: 13 },
                    zIndex: 1, locked: false, hidden: false,
                },
                // Service 3 — Sympathy
                {
                    id: 'svc-card-3', type: 'box',
                    bounds: { x: 680, y: 3090, width: 270, height: 340 },
                    props: { backgroundColor: '#ffffff', borderRadius: 20, shadow: 'sm' },
                    zIndex: 0, locked: false, hidden: false,
                },
                {
                    id: 'svc-emoji-3', type: 'text',
                    bounds: { x: 680, y: 3110, width: 270, height: 50 },
                    props: { content: '🕊️', fontSize: 40, textAlign: 'center' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'svc-t-3', type: 'heading',
                    bounds: { x: 700, y: 3170, width: 230, height: 28 },
                    props: { content: 'Sympathy', fontSize: 22, fontWeight: 700, textAlign: 'center', color: '#4a0e2b', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'svc-d-3', type: 'paragraph',
                    bounds: { x: 700, y: 3210, width: 230, height: 80 },
                    props: { content: 'Thoughtful and elegant arrangements to express your compassion during difficult times.', fontSize: 13, textAlign: 'center', color: '#831843', lineHeight: 1.5 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'svc-btn-3', type: 'button',
                    bounds: { x: 730, y: 3320, width: 170, height: 40 },
                    props: { label: 'View Options', backgroundColor: 'transparent', textColor: '#be185d', borderRadius: 20, borderWidth: 1, borderColor: '#be185d', fontSize: 13 },
                    zIndex: 1, locked: false, hidden: false,
                },
                // Service 4 — Subscriptions
                {
                    id: 'svc-card-4', type: 'box',
                    bounds: { x: 980, y: 3090, width: 270, height: 340 },
                    props: { backgroundColor: '#ffffff', borderRadius: 20, shadow: 'sm' },
                    zIndex: 0, locked: false, hidden: false,
                },
                {
                    id: 'svc-emoji-4', type: 'text',
                    bounds: { x: 980, y: 3110, width: 270, height: 50 },
                    props: { content: '📦', fontSize: 40, textAlign: 'center' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'svc-t-4', type: 'heading',
                    bounds: { x: 1000, y: 3170, width: 230, height: 28 },
                    props: { content: 'Subscriptions', fontSize: 22, fontWeight: 700, textAlign: 'center', color: '#4a0e2b', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'svc-d-4', type: 'paragraph',
                    bounds: { x: 1000, y: 3210, width: 230, height: 80 },
                    props: { content: 'Fresh flowers delivered weekly or monthly. The gift that keeps on giving — starting at $35/month.', fontSize: 13, textAlign: 'center', color: '#831843', lineHeight: 1.5 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'svc-btn-4', type: 'button',
                    bounds: { x: 1030, y: 3320, width: 170, height: 40 },
                    props: { label: 'Subscribe', backgroundColor: '#be185d', textColor: '#ffffff', borderRadius: 20, fontSize: 13 },
                    zIndex: 1, locked: false, hidden: false,
                },

                // ═══════════════════════════════════════════════
                // BOOKING / CTA (y: 3700–4200)
                // ═══════════════════════════════════════════════
                {
                    id: 'cta-bg', type: 'box',
                    bounds: { x: 0, y: 3700, width: 1280, height: 500 },
                    props: { backgroundColor: '#be185d' },
                    zIndex: 0, locked: true, hidden: false,
                },
                {
                    id: 'cta-title', type: 'heading',
                    bounds: { x: 240, y: 3810, width: 800, height: 70 },
                    props: { content: 'Ready to Brighten Someone\'s Day?', fontSize: 48, textAlign: 'center', fontWeight: 700, color: '#ffffff', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'cta-sub', type: 'paragraph',
                    bounds: { x: 340, y: 3900, width: 600, height: 40 },
                    props: { content: 'Book a free consultation or order online for same-day delivery.', fontSize: 18, textAlign: 'center', color: '#fce7f3' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'cta-btn-1', type: 'button',
                    bounds: { x: 410, y: 3980, width: 220, height: 56 },
                    props: { label: 'Book Consultation', backgroundColor: '#ffffff', textColor: '#be185d', borderRadius: 28, fontWeight: 600, fontSize: 16 },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'cta-btn-2', type: 'button',
                    bounds: { x: 660, y: 3980, width: 220, height: 56 },
                    props: { label: 'Shop Now', backgroundColor: 'transparent', textColor: '#ffffff', borderRadius: 28, borderWidth: 2, borderColor: '#ffffff', fontWeight: 600, fontSize: 16 },
                    zIndex: 1, locked: false, hidden: false,
                },

                // ═══════════════════════════════════════════════
                // CONTACT SECTION (y: 4200–4600)
                // ═══════════════════════════════════════════════
                {
                    id: 'contact-bg', type: 'box',
                    bounds: { x: 0, y: 4200, width: 1280, height: 400 },
                    props: { backgroundColor: '#fff1f2' },
                    zIndex: 0, locked: true, hidden: false,
                },
                {
                    id: 'contact-title', type: 'heading',
                    bounds: { x: 0, y: 4240, width: 1280, height: 50 },
                    props: { content: 'Get in Touch', fontSize: 36, textAlign: 'center', fontWeight: 700, color: '#4a0e2b', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'contact-form', type: 'contact-form',
                    bounds: { x: 340, y: 4310, width: 600, height: 260 },
                    props: { submitLabel: 'Send Message', submitColor: '#be185d' },
                    zIndex: 1, locked: false, hidden: false,
                },

                // ═══════════════════════════════════════════════
                // FOOTER (y: 4600–4800)
                // ═══════════════════════════════════════════════
                {
                    id: 'footer-bg', type: 'box',
                    bounds: { x: 0, y: 4600, width: 1280, height: 200 },
                    props: { backgroundColor: '#4a0e2b' },
                    zIndex: 0, locked: true, hidden: false,
                },
                {
                    id: 'footer-logo', type: 'heading',
                    bounds: { x: 100, y: 4640, width: 300, height: 40 },
                    props: { content: '🌸 Daisy Rose Garden', fontSize: 20, fontWeight: 700, color: '#f9a8d4', fontFamily: 'Playfair Display' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'footer-tagline', type: 'text',
                    bounds: { x: 100, y: 4680, width: 400, height: 24 },
                    props: { content: 'Bringing beauty to life, one petal at a time.', fontSize: 13, color: '#fbcfe8' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'footer-hours', type: 'text',
                    bounds: { x: 600, y: 4640, width: 300, height: 24 },
                    props: { content: 'Mon–Sat: 8AM – 7PM  |  Sun: 10AM – 4PM', fontSize: 13, color: '#f9a8d4' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'footer-address', type: 'text',
                    bounds: { x: 600, y: 4670, width: 300, height: 24 },
                    props: { content: '127 Blossom Lane, Roseville, CA 95678', fontSize: 13, color: '#fbcfe8' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'footer-phone', type: 'text',
                    bounds: { x: 600, y: 4700, width: 300, height: 24 },
                    props: { content: '📞 (916) 555-ROSE', fontSize: 13, color: '#f9a8d4' },
                    zIndex: 1, locked: false, hidden: false,
                },
                {
                    id: 'footer-copy', type: 'text',
                    bounds: { x: 0, y: 4760, width: 1280, height: 20 },
                    props: { content: '© 2025 Daisy Rose Garden. All rights reserved.', fontSize: 12, textAlign: 'center', color: '#9d174d' },
                    zIndex: 1, locked: false, hidden: false,
                },
            ],
        },
    ],
    theme: DEMO_THEME,
};
