import { NextResponse } from "next/server";
import { getImageQueries } from "@/lib/gemini";

/**
 * Curated high-quality Unsplash photo IDs per category.
 * These are real Unsplash photo IDs that produce reliable, professional images.
 * Used as fallback when no Unsplash API key is configured.
 */
const CURATED_PHOTOS: Record<string, Array<{ id: string; url: string; thumb: string; photographer: string; label: string }>> = {
    'restaurant': [
        { id: 'r1', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400&auto=format&fit=crop', photographer: 'Jason Leung', label: 'Restaurant Interior' },
        { id: 'r2', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=400&auto=format&fit=crop', photographer: 'Jay Wennington', label: 'Fine Dining' },
        { id: 'r3', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop', photographer: 'Lily Banse', label: 'Food Plating' },
        { id: 'r4', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400&auto=format&fit=crop', photographer: 'Nick Karvounis', label: 'Bar Area' },
        { id: 'r5', url: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=400&auto=format&fit=crop', photographer: 'Brooke Lark', label: 'Chef Cooking' },
        { id: 'r6', url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400&auto=format&fit=crop', photographer: 'Fábio Alves', label: 'Table Setting' },
    ],
    'coffee': [
        { id: 'c1', url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=400&auto=format&fit=crop', photographer: 'Nathan Dumlao', label: 'Pour Over Coffee' },
        { id: 'c2', url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=400&auto=format&fit=crop', photographer: 'Mike Kenneally', label: 'Cafe Interior' },
        { id: 'c3', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop', photographer: 'Christiana Rivers', label: 'Latte Art' },
        { id: 'c4', url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=400&auto=format&fit=crop', photographer: 'Mike Kenneally', label: 'Coffee Beans' },
        { id: 'c5', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=400&auto=format&fit=crop', photographer: 'Fahmi Fakhrudin', label: 'Coffee Cup' },
        { id: 'c6', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=400&auto=format&fit=crop', photographer: 'Tim Wright', label: 'Barista' },
    ],
    'tech': [
        { id: 't1', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&auto=format&fit=crop', photographer: 'Marvin Meyer', label: 'Team Collaboration' },
        { id: 't2', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop', photographer: 'Alexandre Debiève', label: 'Technology' },
        { id: 't3', url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=400&auto=format&fit=crop', photographer: 'Ales Nesetril', label: 'Modern Workspace' },
        { id: 't4', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop', photographer: 'Carlos Muza', label: 'Analytics Dashboard' },
        { id: 't5', url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=400&auto=format&fit=crop', photographer: 'Austin Distel', label: 'Meeting Room' },
        { id: 't6', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=400&auto=format&fit=crop', photographer: 'Alex Kotliarskyi', label: 'Office Space' },
    ],
    'fitness': [
        { id: 'f1', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop', photographer: 'Danielle Cerullo', label: 'Gym Interior' },
        { id: 'f2', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop', photographer: 'Victor Freitas', label: 'Weight Training' },
        { id: 'f3', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop', photographer: 'Geert Pieters', label: 'Yoga Class' },
        { id: 'f4', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop', photographer: 'Scott Webb', label: 'Workout Session' },
        { id: 'f5', url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop', photographer: 'Bruce Mars', label: 'Personal Trainer' },
        { id: 'f6', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400&auto=format&fit=crop', photographer: 'Humphrey Muleba', label: 'Outdoor Fitness' },
    ],
    'beauty': [
        { id: 'b1', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop', photographer: 'Adam Winger', label: 'Salon Interior' },
        { id: 'b2', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400&auto=format&fit=crop', photographer: 'Shari Sirotnak', label: 'Skincare Products' },
        { id: 'b3', url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=400&auto=format&fit=crop', photographer: 'Christin Hume', label: 'Beauty Treatment' },
        { id: 'b4', url: 'https://images.unsplash.com/photo-1562322140-8baeacacf880?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1562322140-8baeacacf880?q=80&w=400&auto=format&fit=crop', photographer: 'Element5 Digital', label: 'Hair Styling' },
        { id: 'b5', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&auto=format&fit=crop', photographer: 'Jazmin Quaynor', label: 'Makeup Collection' },
        { id: 'b6', url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=400&auto=format&fit=crop', photographer: 'Christin Hume', label: 'Spa Treatment' },
    ],
    'flowers': [
        { id: 'n_bEsN75MrE', url: 'https://plus.unsplash.com/premium_photo-1677005708723-c0dabb815e4b?fm=jpg&q=80&w=1200&auto=format&fit=crop', thumb: 'https://plus.unsplash.com/premium_photo-1677005708723-c0dabb815e4b?fm=jpg&q=80&w=400&auto=format&fit=crop', photographer: 'Unsplash+', label: 'Bouquet in Hands' },
        { id: 'tt_HFMMae1w', url: 'https://images.unsplash.com/photo-1604323990536-e5452c0507c1?fm=jpg&q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1604323990536-e5452c0507c1?fm=jpg&q=80&w=400&auto=format&fit=crop', photographer: 'Tanya Truong', label: 'Basket Flowers' },
        { id: 's3AFTBZ3cnc', url: 'https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?fm=jpg&q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?fm=jpg&q=80&w=400&auto=format&fit=crop', photographer: 'Secret Garden', label: 'Holding Bouquet' },
        { id: 'NFj6pEUdmpY', url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?fm=jpg&q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?fm=jpg&q=80&w=400&auto=format&fit=crop', photographer: 'Leonardo Wong', label: 'Vase Centerpiece' },
        { id: 'zrmCrWCbHPA', url: 'https://plus.unsplash.com/premium_photo-1713823800827-4c10d4d37585?fm=jpg&q=80&w=1200&auto=format&fit=crop', thumb: 'https://plus.unsplash.com/premium_photo-1713823800827-4c10d4d37585?fm=jpg&q=80&w=400&auto=format&fit=crop', photographer: 'Unsplash+', label: 'Wrapped Bouquet' },
        { id: 'oEWdQsbRVZk', url: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?fm=jpg&q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?fm=jpg&q=80&w=400&auto=format&fit=crop', photographer: 'Ksenia Chernaya', label: 'Pink Roses' },
    ],
    'default': [
        { id: 'd1', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop', photographer: 'Nastuh Abootalebi', label: 'Professional Office' },
        { id: 'd2', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop', photographer: 'Jason Goodman', label: 'Team Meeting' },
        { id: 'd3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', photographer: 'Scott Webb', label: 'Professional Portrait' },
        { id: 'd4', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400&auto=format&fit=crop', photographer: 'Helloquence', label: 'Business Planning' },
        { id: 'd5', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop', photographer: 'Brooke Cagle', label: 'Creative Workspace' },
        { id: 'd6', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop', thumb: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&auto=format&fit=crop', photographer: 'Hunters Race', label: 'Handshake' },
    ],
};

interface MediaSearchResult {
    id: string;
    url: string;
    thumbnailUrl: string;
    photographer: string;
    source: string;
    label: string;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { industry, vibe, count = 6 } = body;

        const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

        if (unsplashKey) {
            // Use real Unsplash API
            const queries = getImageQueries(industry || 'default');
            const results: MediaSearchResult[] = [];

            // Search with multiple relevant queries
            for (let i = 0; i < Math.min(queries.length, count); i++) {
                try {
                    const query = `${queries[i]} ${vibe || ''}`.trim();
                    const res = await fetch(
                        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
                        {
                            headers: { Authorization: `Client-ID ${unsplashKey}` },
                        }
                    );
                    const data = await res.json();
                    if (data.results && data.results.length > 0) {
                        const photo = data.results[0];
                        results.push({
                            id: photo.id,
                            url: photo.urls.regular,
                            thumbnailUrl: photo.urls.small,
                            photographer: photo.user.name,
                            source: 'Unsplash',
                            label: queries[i].split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                        });
                    }
                } catch (e) {
                    console.error(`Unsplash search error for query "${queries[i]}":`, e);
                }
            }

            if (results.length > 0) {
                return NextResponse.json({ assets: results, source: 'unsplash' });
            }
            // Fall through to curated if all searches failed
        }

        // Fallback: use curated photo collections or keyword-based placeholders
        const industryLower = (industry || '').toLowerCase();
        const matchedKey = Object.keys(CURATED_PHOTOS).find(k => industryLower.includes(k));

        if (matchedKey) {
            const photos = CURATED_PHOTOS[matchedKey];
            const results: MediaSearchResult[] = photos.slice(0, count).map(p => ({
                id: p.id,
                url: p.url,
                thumbnailUrl: p.thumb,
                photographer: p.photographer,
                source: 'Curated Collection',
                label: p.label,
            }));
            return NextResponse.json({ assets: results, source: 'curated' });
        }

        // If no curated match and no API key, use keyword-based placeholders (better than generic business)
        // usage: https://loremflickr.com/800/600/keyword
        const fallbackResults: MediaSearchResult[] = Array.from({ length: count }).map((_, i) => ({
            id: `placeholder-${i}`,
            url: `https://loremflickr.com/1200/800/${encodeURIComponent(industryLower)}?random=${i}`,
            thumbnailUrl: `https://loremflickr.com/400/300/${encodeURIComponent(industryLower)}?random=${i}`,
            photographer: 'LoremFlickr',
            source: 'Placeholder',
            label: `${industry} Placeholder ${i + 1}`,
        }));

        return NextResponse.json({ assets: fallbackResults, source: 'placeholder' });

    } catch (error) {
        console.error('[MEDIA_SEARCH] Error:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
