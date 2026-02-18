import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users, sites, pages, canvasElements } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { beanAndBrewPages, beanAndBrewElements, beanAndBrewTheme } from '@/data/seedData';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Ensure user exists in our DB (FK constraint)
        const user = await currentUser();
        const email = user?.emailAddresses?.[0]?.emailAddress || `${userId}@placeholder.local`;
        await db.insert(users).values({ id: userId, email }).onConflictDoNothing();

        // If the user already has a site, return it instead of creating a duplicate
        const existingSites = await db.select({ id: sites.id }).from(sites)
            .where(eq(sites.userId, userId))
            .limit(1);
        if (existingSites.length > 0) {
            return NextResponse.json({ siteId: existingSites[0].id });
        }

        const siteId = uuidv4();

        // 1. Create site
        const [site] = await db.insert(sites).values({
            id: siteId,
            name: 'My New Site',
            userId,
            theme: beanAndBrewTheme as any,
        }).returning();

        // 2. Create pages
        for (const page of beanAndBrewPages) {
            await db.insert(pages).values({
                id: page.id,
                name: page.name,
                slug: page.slug,
                siteId: site.id,
                isHomePage: page.isHomePage,
                height: page.height,
            });

            // 3. Insert elements for each page
            const pageElements = Object.values(beanAndBrewElements).filter(el => el.pageId === page.id);
            if (pageElements.length > 0) {
                await db.insert(canvasElements).values(
                    pageElements.map(el => ({
                        id: el.id,
                        type: el.type,
                        pageId: page.id,
                        siteId: site.id,
                        bounds: el.bounds as any,
                        props: el.props as any,
                        zIndex: el.zIndex,
                        locked: el.locked,
                        hidden: el.hidden,
                    }))
                );
            }
        }

        return NextResponse.json({ siteId });
    } catch (error) {
        console.error('[SITE_CREATE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
