import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Try to get published site first
        let site: any = await storage.getPublishedSite(id);

        // If not found, try getting draft (requires auth check in real app, but storage deals with it)
        if (!site) {
            try {
                site = await storage.getSite(id);
            } catch (e) {
                // Ignore, likely unauthorized or not found
            }
        }

        if (!site) {
            return NextResponse.json(
                { error: 'Site not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, site });
    } catch (error) {
        console.error('Failed to get site:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
