import { NextResponse } from "next/server";
import { callGeminiWithRetry, cleanJsonResponse, ELEMENT_SCHEMA_CONTEXT } from "@/lib/gemini";
import { themeConfigs } from "@/lib/themes";
import { getTemplateForIndustry } from "@/lib/site-templates";
import { LayoutEngine } from "@/lib/LayoutEngine";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessName, industry, pitch, vibe, features, selectedMedia } = body;

        if (!businessName) {
            return NextResponse.json({ error: "Missing businessName" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
        }

        // ── DEMO GUARD ──
        const { isDemoMode, DEMO_SITE_DATA } = await import('@/data/demoData');
        if (isDemoMode(businessName)) {
            console.log('[API] Demo Guard: returning hardcoded site for', businessName);
            // Ensure unique IDs even in demo mode (though less critical since we usually bypass this API in demo)
            const siteData = JSON.parse(JSON.stringify(DEMO_SITE_DATA));
            return NextResponse.json(siteData);
        }
        // ────────────────

        // Resolve theme
        const vibeKey = (vibe && themeConfigs[vibe]) ? vibe : 'Minimal';
        const config = themeConfigs[vibeKey];
        const theme = {
            colors: config.colors,
            fonts: {
                heading: config.fontHeading,
                body: config.fontBody,
            }
        };

        // Select Reference Template
        const template = getTemplateForIndustry(industry || '');
        // We only pass the structure (sections + elements) to save tokens/confusion
        const referenceStructure = JSON.stringify(template.structure);

        // Build media context
        const mediaContext = (selectedMedia && selectedMedia.length > 0)
            ? `\n\nAvailable image URLs to use (prefer these for image elements):\n${selectedMedia.map((m: any, i: number) => `${i + 1}. ${m.url} — "${m.label}"`).join('\n')}`
            : '\n\nNo specific images were selected. Use placeholder URLs like "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1200&auto=format&fit=crop" for images.';

        // Build features context
        const featuresList = (features && features.length > 0) ? features : ['Contact Form'];
        const featuresContext = featuresList.map((f: string) => {
            switch (f.toLowerCase()) {
                case 'blog':
                case 'blog / news':
                    return 'Blog section — show 3 blog post preview cards with titles, dates, and excerpts';
                case 'online store':
                case 'sell products':
                    return 'Products section — show 3 product cards with names, prices, and images';
                case 'bookings':
                case 'appointments':
                    return 'Booking section — CTA to schedule an appointment with a brief description';
                case 'portfolio':
                    return 'Portfolio section — a grid of 4-6 project/work showcase images';
                case 'testimonials':
                    return 'Testimonials section — 1-2 customer quotes with names and roles';
                case 'contact form':
                    return 'Contact section — a contact form with name, email, message fields';
                default:
                    return `${f} section — create relevant content for this feature`;
            }
        }).join('\n');

        const prompt = `You are a professional web designer building a website. Generate a complete single-page website layout as JSON.

## Reference Template (GOLD STANDARD)
Use the following layout structure as a strict baseline. It matches the "${template.name}" archetype.
Adhere to its layout density, section order, and element positioning.
You MUST:
1. **Preserve the Layout**: Keep the sections and element positions from the template unless they seriously conflict with the content.
2. **Inject Content**: Replace all text with specific, compelling copy for "${businessName}" (${industry}).
3. **Inject Images**: Replace all images with the provided "Available image URLs" or high-quality Unsplash placeholders.
4. **Integrate Features**: The user requested these features: [${featuresList.join(', ')}].
   - If the template already has a section for a feature (e.g., "features" or "contact"), adapt it.
   - If a requested feature is MISSING from the template, ADD a new section for it in an appropriate location (e.g., add a "Blog" section before the footer).
5. **Apply Theme**: Use the "Visual Theme" colors/fonts defined below.

Template Structure:
${referenceStructure}

## Business Context
- **Business Name**: "${businessName}"
- **Industry**: "${industry || 'General Business'}"
- **Pitch/Description**: "${pitch || 'A professional business providing excellent services.'}"
- **Visual Theme**: "${vibeKey}" with these colors: ${JSON.stringify(theme.colors)}
- **Heading Font**: "${theme.fonts.heading}", **Body Font**: "${theme.fonts.body}"

## Requested Feature Details (Use these to guide content generation):
${featuresContext}

${ELEMENT_SCHEMA_CONTEXT}
${mediaContext}

## CRITICAL LAYOUT RULES:
- Canvas width is **1280px**.
- Stack sections vertically. Track cumulative Y position.
- Page height must equal the bottom of the last section.
- Ensure element IDs are unique (prefix with section name).

## OUTPUT FORMAT:
Return ONLY valid JSON(no markdown, no explanation) with this exact structure:
        {
            "pages": [{
                "id": "home",
                "name": "Home",
                "slug": "/",
                "isHomePage": true,
                "minHeight": <total_height>,
                "height": <total_height>,
                "elements": [
                    {
                        "id": "<unique-element-id>",
                        "type": "<element-type>",
                        "bounds": { "x": <number>, "y": <number>, "width": <number>, "height": <number> },
                        "props": { < element - specific properties> },
                "zIndex": <number>,
                "locked": false,
                "hidden": false
      }
    ]
    }],
    "theme": ${JSON.stringify(theme)}
}

CRITICAL: Each element MUST have: id, type, bounds(with x, y, width, height as numbers), props, and zIndex.Elements go INSIDE the page's "elements" array, NOT in a separate object.

Make the content feel real, professional, and specific to the "${industry || 'general'}" industry.Do NOT use generic placeholder text like "Lorem ipsum".Write compelling, industry - specific copy.`;

        let rawText = await callGeminiWithRetry(prompt);
        let text = cleanJsonResponse(rawText);

        try {
            const siteData = JSON.parse(text);

            // Validate basic structure
            if (!siteData.pages || !Array.isArray(siteData.pages) || siteData.pages.length === 0) {
                console.error('[GENERATE_SITE] Invalid structure from Gemini:', Object.keys(siteData));
                return NextResponse.json({ error: "AI generated invalid site structure" }, { status: 500 });
            }

            // Ensure theme is set
            if (!siteData.theme) {
                siteData.theme = theme;
            }

            // Normalize pages — ensure each page has well-formed elements
            for (const page of siteData.pages) {
                // If elements are stored in a top-level "elements" dict instead of page.elements, migrate them
                if ((!page.elements || page.elements.length === 0) && siteData.elements) {
                    const elemObj = siteData.elements;
                    page.elements = Object.entries(elemObj).map(([key, el]: [string, any]) => ({
                        id: el.id || key,
                        type: el.type || 'text',
                        bounds: el.bounds || { x: 0, y: 0, width: 400, height: 100 },
                        props: el.props || {},
                        zIndex: el.zIndex ?? 1,
                        locked: el.locked ?? false,
                        hidden: el.hidden ?? false,
                    }));
                }

                // Process layout to ensure consistency and alignment
                if (page.elements && Array.isArray(page.elements)) {
                    page.elements = LayoutEngine.process(page.elements);
                }


                // Ensure every element has required fields
                if (Array.isArray(page.elements)) {
                    page.elements = page.elements.map((el: any, idx: number) => ({
                        id: el.id || `el - ${page.id} -${idx} `,
                        type: el.type || 'text',
                        bounds: {
                            x: Number(el.bounds?.x) || 0,
                            y: Number(el.bounds?.y) || 0,
                            width: Number(el.bounds?.width) || 400,
                            height: Number(el.bounds?.height) || 100,
                        },
                        props: el.props || {},
                        zIndex: el.zIndex ?? (idx + 1),
                        locked: el.locked ?? false,
                        hidden: el.hidden ?? false,
                    }));
                } else {
                    page.elements = [];
                }

                // Ensure page has height
                if (!page.height && !page.minHeight) {
                    const maxBottom = page.elements.reduce((max: number, el: any) =>
                        Math.max(max, (el.bounds?.y || 0) + (el.bounds?.height || 0)), 0);
                    page.height = Math.max(maxBottom + 100, 2000);
                    page.minHeight = page.height;
                } else {
                    page.height = page.height || page.minHeight || 2000;
                    page.minHeight = page.minHeight || page.height;
                }
            }

            // Remove the top-level elements dict (we've migrated everything into pages)
            delete siteData.elements;

            console.log(`[GENERATE_SITE] Success: ${siteData.pages.length} pages, ${siteData.pages.reduce((sum: number, p: any) => sum + (p.elements?.length || 0), 0)} total elements`);
            return NextResponse.json(siteData);
        } catch (parseError) {
            console.error('[GENERATE_SITE] JSON parse error:', text.substring(0, 500));
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

    } catch (error: any) {
        console.error('[GENERATE_SITE] Error:', error?.message || error);
        const msg = error?.message || 'Internal server error';
        const isQuota = msg.includes('quota') || msg.includes('429') || msg.includes('exhausted');
        return NextResponse.json(
            { error: isQuota ? 'AI service temporarily unavailable (rate limited). Please retry in a moment.' : msg },
            { status: isQuota ? 503 : 500 }
        );
    }
}
