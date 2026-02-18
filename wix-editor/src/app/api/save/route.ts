import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { siteId, pages, elements, theme } = body;

        if (!siteId || !pages) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Using Drizzle-based storage which is async and takes full SiteData
        // We need to construct the full object expected by storage.saveSite
        await storage.saveSite({
            siteId,
            name: 'My Site', // Default
            pages,
            elements: elements || {}, // Kept for compat, but storage uses page.elements
            theme: theme || { colors: { background: '#fff', text: '#000', primary: '#000', secondary: '#ccc' }, fonts: { heading: 'sans-serif', body: 'sans-serif' } }, // Fallback
            lastSaved: new Date().toISOString()
        });

        return NextResponse.json({ success: true, siteId });


    } catch (error) {
        console.error('Failed to save site:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
