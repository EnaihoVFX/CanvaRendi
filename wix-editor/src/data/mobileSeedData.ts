
import { Page, CanvasElement, SiteTheme, Section } from '@/types/editor';

// Reuse the same theme, or tweak if necessary
export const mobileBeanTheme: SiteTheme = {
    colors: {
        primary: '#C08B5C',
        secondary: '#2C1810',
        accent: '#D4A373',
        background: '#FAFAF5',
        text: '#2C1810',
    },
    fonts: {
        heading: 'Playfair Display',
        body: 'Inter',
    },
};

const homePageId = 'home';

// --- Hero Section Elements (Mobile) ---
const heroElements: CanvasElement[] = [
    {
        id: 'hero-image-mobile',
        type: 'image',
        pageId: homePageId,
        bounds: { x: 0, y: 0, width: 375, height: 350 },
        zIndex: 5,
        props: {
            src: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop',
            alt: 'Pour Over Coffee',
            objectFit: 'cover',
            borderRadius: 0,
        },
        locked: false,
        hidden: false,
    },
    {
        id: 'hero-title-mobile',
        type: 'heading',
        pageId: homePageId,
        bounds: { x: 20, y: 370, width: 335, height: 120 },
        zIndex: 20,
        props: {
            content: 'Artisan Coffee,\nRoasted Locally.',
            fontSize: 42,
            fontFamily: 'Playfair Display',
            fontWeight: 800,
            color: '#2C1810',
            textAlign: 'left',
            lineHeight: 1.1,
            letterSpacing: -1,
        },
        locked: false,
        hidden: false,
    },
    {
        id: 'hero-sub-mobile',
        type: 'paragraph',
        pageId: homePageId,
        bounds: { x: 20, y: 500, width: 335, height: 100 },
        zIndex: 20,
        props: {
            content: 'Experience the rich, bold flavors of ethically sourced beans, roasted small-batch right here in Seattle.',
            fontSize: 16,
            fontFamily: 'Inter',
            fontWeight: 400,
            color: '#5D4037',
            textAlign: 'left',
            lineHeight: 1.5,
        },
        locked: false,
        hidden: false,
    },
    {
        id: 'hero-btn-primary-mobile',
        type: 'button',
        pageId: homePageId,
        bounds: { x: 20, y: 620, width: 335, height: 56 },
        zIndex: 20,
        props: {
            label: 'Order Online',
            backgroundColor: '#2C1810',
            textColor: '#FFFFFF',
            borderRadius: 0,
            borderWidth: 0,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: 1,
        },
        locked: false,
        hidden: false,
    },
    {
        id: 'hero-btn-secondary-mobile',
        type: 'button',
        pageId: homePageId,
        bounds: { x: 20, y: 690, width: 335, height: 56 },
        zIndex: 20,
        props: {
            label: 'View Menu',
            backgroundColor: 'transparent',
            textColor: '#2C1810',
            borderRadius: 0,
            borderWidth: 2,
            borderColor: '#2C1810',
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: 1,
        },
        locked: false,
        hidden: false,
    },
];

// --- Story Section Elements (Mobile) ---
// Starts around Y = 800
const storyElements: CanvasElement[] = [
    {
        id: 'story-image-mobile',
        type: 'image',
        pageId: homePageId,
        bounds: { x: 0, y: 800, width: 375, height: 300 },
        zIndex: 5,
        props: {
            src: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1974&auto=format&fit=crop',
            alt: 'Our Cafe Interior',
            objectFit: 'cover',
            borderRadius: 0,
        },
        locked: false,
        hidden: false,
    },
    {
        id: 'story-title-mobile',
        type: 'heading',
        pageId: homePageId,
        bounds: { x: 20, y: 1130, width: 335, height: 60 },
        zIndex: 10,
        props: {
            content: 'Our Story',
            fontSize: 36,
            fontFamily: 'Playfair Display',
            fontWeight: 700,
            color: '#2C1810',
            textAlign: 'left',
        },
        locked: false,
        hidden: false,
    },
    {
        id: 'story-text-mobile',
        type: 'paragraph',
        pageId: homePageId,
        bounds: { x: 20, y: 1200, width: 335, height: 250 },
        zIndex: 10,
        props: {
            content: 'Founded in 2018, Bean & Brew began with a simple mission: to serve the perfect cup. We source our beans directly from sustainable farms, roasting them in-house.\n\nOur flagship store is your sanctuary—a place to pause, sip, and savor.',
            fontSize: 16,
            fontFamily: 'Inter',
            fontWeight: 400,
            color: '#4B5563',
            textAlign: 'left',
            lineHeight: 1.6,
        },
        locked: false,
        hidden: false,
    },
];

// --- Testimonial Section Elements (Mobile) ---
// Starts around Y = 1500
const testimonialElements: CanvasElement[] = [
    {
        id: 'testimonial-quote-mobile',
        type: 'text',
        pageId: homePageId,
        bounds: { x: 20, y: 1550, width: 50, height: 60 },
        zIndex: 10,
        props: {
            content: '“',
            fontSize: 80,
            fontFamily: 'Playfair Display',
            fontWeight: 400,
            color: '#D4A373',
            textAlign: 'left',
            lineHeight: 1,
        },
        locked: false,
        hidden: false,
    },
    {
        id: 'testimonial-text-mobile',
        type: 'paragraph',
        pageId: homePageId,
        bounds: { x: 20, y: 1620, width: 335, height: 150 },
        zIndex: 10,
        props: {
            content: 'The best morning brew in the city. Absolutely love the atmosphere!',
            fontSize: 24,
            fontFamily: 'Playfair Display',
            fontWeight: 500,
            color: '#FFFFFF',
            textAlign: 'left',
            lineHeight: 1.4,
        },
        locked: false,
        hidden: false,
    },
    {
        id: 'testimonial-author-mobile',
        type: 'text',
        pageId: homePageId,
        bounds: { x: 20, y: 1780, width: 335, height: 40 },
        zIndex: 10,
        props: {
            content: 'SARAH JENKINS — LOCAL GUIDE',
            fontSize: 12,
            fontFamily: 'Inter',
            fontWeight: 700,
            letterSpacing: 2,
            color: '#D4A373',
            textAlign: 'left',
        },
        locked: false,
        hidden: false,
    },
];

const allElementsList = [...heroElements, ...storyElements, ...testimonialElements];
export const mobileBeanElements: Record<string, CanvasElement> = {};
allElementsList.forEach(el => {
    mobileBeanElements[el.id] = el;
});

// --- Sections ---
const heroSection: Section = {
    id: 'hero-section',
    name: 'Hero',
    height: 800,
    backgroundColor: '#FAFAF5',
    elements: heroElements.map(e => e.id),
};

const storySection: Section = {
    id: 'story-section',
    name: 'Our Story',
    height: 700,
    backgroundColor: '#FFFFFF',
    elements: storyElements.map(e => e.id),
};

const testimonialSection: Section = {
    id: 'testimonial-section',
    name: 'Testimonials',
    height: 400,
    backgroundColor: '#2C1810',
    elements: testimonialElements.map(e => e.id),
};

export const mobileBeanPages: Page[] = [
    {
        id: homePageId,
        name: 'Home',
        slug: '/',
        isHomePage: true,
        sections: [heroSection, storySection, testimonialSection],
        minHeight: 1900,
        height: 1900,
    },
    {
        id: 'menu',
        name: 'Menu',
        slug: '/menu',
        isHomePage: false,
        sections: [
            {
                id: 'menu-hero',
                name: 'Menu Header',
                height: 300,
                backgroundColor: '#FAFAF5',
                elements: [],
            }
        ],
        minHeight: 600,
        height: 600,
    },
];
