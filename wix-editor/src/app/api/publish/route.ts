import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { siteId } = body;

        if (!siteId) {
            return NextResponse.json(
                { error: 'Missing siteId' },
                { status: 400 }
            );
        }

        const publishedUrl = await storage.publishSite(siteId);

        return NextResponse.json({ success: true, url: publishedUrl });
    } catch (error) {
        console.error('Failed to publish site:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
