import { NextResponse } from "next/server";
import { callGeminiWithRetry, cleanJsonResponse } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessName, industry, pitch, contentType } = body;

        if (!businessName || !contentType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
        }

        // ── DEMO GUARD ──
        const { isDemoMode, DEMO_HEADLINE, DEMO_TESTIMONIAL, DEMO_BUSINESS_NAME } = await import('@/data/demoData');
        if (isDemoMode(businessName)) {
            console.log('[API] Demo Guard: returning hardcoded content for', businessName);
            if (contentType === 'hero-headline') return NextResponse.json({ contentType, content: DEMO_HEADLINE });
            if (contentType === 'testimonial') return NextResponse.json({ contentType, content: DEMO_TESTIMONIAL });
            if (contentType === 'tagline') return NextResponse.json({ contentType, content: 'Bringing beauty to life.' });
            return NextResponse.json({ contentType, content: 'Demo Content' });
        }
        // ────────────────

        const contentPrompts: Record<string, string> = {
            'hero-headline': `Write a powerful, concise headline (max 8 words) for a ${industry || 'business'} called "${businessName}". ${pitch ? `Business description: ${pitch}` : ''} The headline should be catchy and capture the essence of the brand. Return ONLY the headline text, no quotes.`,

            'hero-subtext': `Write a compelling 2-sentence description for a ${industry || 'business'} called "${businessName}". ${pitch ? `Business description: ${pitch}` : ''} It should expand on what the business offers and why customers should care. Return ONLY the text, no quotes.`,

            'about-text': `Write a 3-paragraph "About Us" text for a ${industry || 'business'} called "${businessName}". ${pitch ? `Business description: ${pitch}` : ''} Include: founding story or mission, what makes them unique, and their commitment to customers. Each paragraph should be 2-3 sentences. Return ONLY the text.`,

            'testimonial': `Generate a realistic customer testimonial for a ${industry || 'business'} called "${businessName}". Return JSON: { "quote": "the testimonial text (2-3 sentences)", "author": "First Last", "role": "Customer / Local Guide / etc" }`,

            'cta-labels': `Generate 2 call-to-action button labels for a ${industry || 'business'} called "${businessName}". The first should be the primary action (e.g., "Order Now", "Get Started", "Book a Session"), the second should be secondary (e.g., "Learn More", "View Menu", "See Our Work"). Return JSON: { "primary": "...", "secondary": "..." }`,

            'tagline': `Write a short tagline (max 6 words) for a ${industry || 'business'} called "${businessName}". ${pitch ? `Business description: ${pitch}` : ''} Return ONLY the tagline text, no quotes.`,
        };

        const contentPrompt = contentPrompts[contentType];
        if (!contentPrompt) {
            return NextResponse.json({ error: `Unknown contentType: ${contentType}` }, { status: 400 });
        }

        let text = (await callGeminiWithRetry(contentPrompt)).trim();

        // For JSON content types, parse and return structured
        if (contentType === 'testimonial' || contentType === 'cta-labels') {
            text = cleanJsonResponse(text);
            try {
                const parsed = JSON.parse(text);
                return NextResponse.json({ contentType, content: parsed });
            } catch {
                return NextResponse.json({ contentType, content: text });
            }
        }

        return NextResponse.json({ contentType, content: text });

    } catch (error: any) {
        console.error('[GENERATE_CONTENT] Error:', error?.message || error);
        const msg = error?.message || 'Internal server error';
        const isQuota = msg.includes('quota') || msg.includes('429') || msg.includes('exhausted');
        return NextResponse.json(
            { error: isQuota ? 'AI service temporarily unavailable (rate limited). Please retry in a moment.' : msg },
            { status: isQuota ? 503 : 500 }
        );
    }
}
