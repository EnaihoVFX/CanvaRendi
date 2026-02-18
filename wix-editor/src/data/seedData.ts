
import { Page, CanvasElement, SiteTheme, Section } from '@/types/editor';

export const beanAndBrewTheme: SiteTheme = {
    colors: {
        primary: '#C08B5C', // Warm Roasted Gold/Tan
        secondary: '#2C1810', // Deep Espresso
        accent: '#D4A373', // Latte
        background: '#FAFAF5', // Creamy Off-White
        text: '#2C1810', // Dark Brown for text
    },
    fonts: {
        heading: 'Playfair Display',
        body: 'Inter',
    },
};

const homePageId = 'home';

// --- Hero Section Elements ---
const heroTitleId = 'hero-title';
const heroSubId = 'hero-sub';
const heroBtnPrimaryId = 'hero-btn-primary';
const heroBtnSecondaryId = 'hero-btn-secondary';
const heroImageId = 'hero-image';
const heroOverlayBoxId = 'hero-overlay-box'; // Optional box to improve text readability if needed, or just design element

const heroElements: CanvasElement[] = [
    {
        id: heroTitleId,
        type: 'heading',
        pageId: homePageId,
        bounds: { x: 80, y: 180, width: 600, height: 200 },
        zIndex: 20,
        props: {
            content: 'Artisan Coffee,\nRoasted Locally.',
            fontSize: 96, // Larger, more impactful
            fontFamily: 'Playfair Display',
            fontWeight: 800,
            color: '#2C1810',
            textAlign: 'left',
            lineHeight: 1.05,
            letterSpacing: -2,
        },
        locked: false,
        hidden: false,
    },
    {
        id: heroSubId,
        type: 'paragraph',
        pageId: homePageId,
        bounds: { x: 85, y: 400, width: 480, height: 100 },
        zIndex: 20,
        props: {
            content: 'Experience the rich, bold flavors of ethically sourced beans, roasted small-batch right here in Seattle. Every cup is crafted with passion and precision.',
            fontSize: 20,
            fontFamily: 'Inter',
            fontWeight: 400,
            color: '#5D4037', // Softer brown
            textAlign: 'left',
            lineHeight: 1.6,
        },
        locked: false,
        hidden: false,
    },
    {
        id: heroBtnPrimaryId,
        type: 'button',
        pageId: homePageId,
        bounds: { x: 80, y: 530, width: 220, height: 64 },
        zIndex: 20,
        props: {
            label: 'Order Online',
            backgroundColor: '#2C1810', // Espresso
            textColor: '#FFFFFF',
            borderRadius: 0, // Sharp, premium feel
            borderWidth: 0,
            borderColor: 'transparent',
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 1,
        },
        locked: false,
        hidden: false,
    },
    {
        id: heroBtnSecondaryId,
        type: 'button',
        pageId: homePageId,
        bounds: { x: 330, y: 530, width: 200, height: 64 },
        zIndex: 20,
        props: {
            label: 'View Menu',
            backgroundColor: 'transparent',
            textColor: '#2C1810',
            borderRadius: 0,
            borderWidth: 2,
            borderColor: '#2C1810',
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 1,
        },
        locked: false,
        hidden: false,
    },
    {
        id: heroImageId,
        type: 'image',
        pageId: homePageId,
        bounds: { x: 650, y: 80, width: 650, height: 750 }, // Overlapping section bottom
        zIndex: 10,
        props: {
            src: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop',
            alt: 'Pour Over Coffee',
            objectFit: 'cover',
            borderRadius: 0,
        },
        locked: false,
        hidden: false,
    },
];

// --- Story Section Elements (New) ---
const storyTitleId = 'story-title';
const storyTextId = 'story-text';
const storyImageId = 'story-image';

const storyElements: CanvasElement[] = [
    {
        id: storyImageId,
        type: 'image',
        pageId: homePageId,
        bounds: { x: 0, y: 850, width: 700, height: 600 }, // Full left side
        zIndex: 5,
        props: {
            src: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1974&auto=format&fit=crop', // Cozy cafe
            alt: 'Our Cafe Interior',
            objectFit: 'cover',
            borderRadius: 0,
        },
        locked: false,
        hidden: false,
    },
    {
        id: storyTitleId,
        type: 'heading',
        pageId: homePageId,
        bounds: { x: 800, y: 950, width: 500, height: 80 },
        zIndex: 10,
        props: {
            content: 'Our Story',
            fontSize: 56,
            fontFamily: 'Playfair Display',
            fontWeight: 700,
            color: '#2C1810',
            textAlign: 'left',
        },
        locked: false,
        hidden: false,
    },
    {
        id: storyTextId,
        type: 'paragraph',
        pageId: homePageId,
        bounds: { x: 800, y: 1050, width: 500, height: 300 },
        zIndex: 10,
        props: {
            content: 'Founded in 2018, Bean & Brew began with a simple mission: to serve the perfect cup. We source our beans directly from sustainable farms in Ethiopia and Colombia, roasting them in-house to unlock their full potential.\n\nOur flagship store in downtown Seattle is designed to be your sanctuary—a place to pause, sip, and savor.',
            fontSize: 18,
            fontFamily: 'Inter',
            fontWeight: 400,
            color: '#4B5563',
            textAlign: 'left',
            lineHeight: 1.8,
        },
        locked: false,
        hidden: false,
    },
];


// --- Testimonial Section Elements ---
const testimonialTextId = 'testimonial-text';
const testimonialAuthorId = 'testimonial-author';
const testimonialQuoteId = 'testimonial-quote';

const testimonialElements: CanvasElement[] = [
    {
        id: testimonialQuoteId,
        type: 'text',
        pageId: homePageId,
        bounds: { x: 600, y: 1550, width: 100, height: 100 },
        zIndex: 10,
        props: {
            content: '“',
            fontSize: 120,
            fontFamily: 'Playfair Display',
            fontWeight: 400,
            color: '#D4A373', // Latte color
            textAlign: 'center',
            lineHeight: 1,
        },
        locked: false,
        hidden: false,
    },
    {
        id: testimonialTextId,
        type: 'paragraph',
        pageId: homePageId,
        bounds: { x: 300, y: 1680, width: 700, height: 150 },
        zIndex: 10,
        props: {
            content: 'The best morning brew in the city. Absolutely love the atmosphere! The baristas know exactly how to pull the perfect shot.',
            fontSize: 32,
            fontFamily: 'Playfair Display',
            fontWeight: 500, // Slightly lighter weight for elegance
            color: '#FFFFFF', // White text on dark bg
            textAlign: 'center',
            lineHeight: 1.5,
        },
        locked: false,
        hidden: false,
    },
    {
        id: testimonialAuthorId,
        type: 'text',
        pageId: homePageId,
        bounds: { x: 450, y: 1850, width: 400, height: 40 },
        zIndex: 10,
        props: {
            content: 'SARAH JENKINS — LOCAL GUIDE',
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: 700,
            letterSpacing: 2,
            color: '#D4A373', // Latte accent
            textAlign: 'center',
        },
        locked: false,
        hidden: false,
    },
];

// --- Combine Elements ---
const allElementsList = [...heroElements, ...storyElements, ...testimonialElements];
export const beanAndBrewElements: Record<string, CanvasElement> = {};
allElementsList.forEach(el => {
    beanAndBrewElements[el.id] = el;
});

// --- Sections ---
const heroSection: Section = {
    id: 'hero-section',
    name: 'Hero',
    height: 850, // Taller hero
    backgroundColor: '#FAFAF5', // Creamy
    elements: heroElements.map(e => e.id),
};

const storySection: Section = {
    id: 'story-section',
    name: 'Our Story',
    height: 600,
    backgroundColor: '#FFFFFF',
    elements: storyElements.map(e => e.id),
};

const testimonialSection: Section = {
    id: 'testimonial-section',
    name: 'Testimonials',
    height: 500,
    backgroundColor: '#2C1810', // Dark Espresso
    elements: testimonialElements.map(e => e.id),
};

// --- Pages ---
export const beanAndBrewPages: Page[] = [
    {
        id: homePageId,
        name: 'Home',
        slug: '/',
        isHomePage: true,
        sections: [heroSection, storySection, testimonialSection],
        minHeight: 1950,
        height: 2000,
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
                height: 400,
                backgroundColor: '#FAFAF5',
                elements: [],
            }
        ],
        minHeight: 600,
        height: 800,
    },
];
