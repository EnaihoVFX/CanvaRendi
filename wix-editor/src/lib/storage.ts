import { db } from './db';
import { users, sites, pages, canvasElements } from '@/db/schema';
import { SiteData, Page, CanvasElement, SiteTheme, PublishedSite } from '@/types/editor';
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, and, desc } from 'drizzle-orm';

// Helper to get current user ID
const getCurrentUserId = async () => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    return userId;
};

// Ensure the Clerk user exists in our User table (required by FK constraints)
const ensureUser = async (userId: string) => {
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress || `${userId}@placeholder.local`;
    await db.insert(users).values({
        id: userId,
        email,
    }).onConflictDoNothing();
};

export const storage = {
    async getSite(siteId: string): Promise<SiteData | null> {
        const userId = await getCurrentUserId();

        const site = await db.query.sites.findFirst({
            where: and(eq(sites.id, siteId), eq(sites.userId, userId)),
            with: {
                pages: {
                    with: {
                        elements: true
                    }
                }
            }
        });

        if (!site) return null;

        const siteData: SiteData = {
            siteId: site.id,
            pages: site.pages.map(p => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                isHomePage: p.isHomePage,
                height: p.height,
                sections: [], // Compat
                elements: p.elements as unknown as CanvasElement[]
            })),
            elements: {}, // Deprecated
            theme: site.theme as unknown as SiteTheme,
            lastSaved: site.updatedAt.toISOString()
        };

        return siteData;
    },

    async saveSite(data: SiteData): Promise<void> {
        const userId = await getCurrentUserId();
        await ensureUser(userId);

        // 1. Upsert Site
        const [site] = await db.insert(sites).values({
            id: data.siteId,
            name: 'My Site',
            userId,
            theme: data.theme as any,
            updatedAt: new Date()
        })
            .onConflictDoUpdate({
                target: sites.id,
                set: {
                    theme: data.theme as any,
                    updatedAt: new Date()
                }
            })
            .returning();

        // 2. Handle Pages
        console.log(`[STORAGE] Saving ${data.pages.length} pages for site ${site.id}`);
        for (const page of data.pages) {
            console.log(`[STORAGE] Page "${page.id}" has ${page.elements?.length || 0} elements`);
            await db.insert(pages).values({
                id: page.id,
                siteId: site.id,
                name: page.name,
                slug: page.slug,
                isHomePage: page.isHomePage,
                height: page.height,
                updatedAt: new Date()
            })
                .onConflictDoUpdate({
                    target: pages.id,
                    set: {
                        name: page.name,
                        slug: page.slug,
                        isHomePage: page.isHomePage,
                        height: page.height,
                        updatedAt: new Date()
                    }
                });

            // 3. Handle Elements for this Page
            // Delete existing
            await db.delete(canvasElements).where(eq(canvasElements.pageId, page.id));

            if (page.elements && page.elements.length > 0) {
                await db.insert(canvasElements).values(
                    page.elements.map(el => ({
                        id: el.id,
                        type: el.type,
                        pageId: page.id,
                        siteId: site.id,
                        bounds: el.bounds as any,
                        props: el.props as any,
                        zIndex: el.zIndex,
                        locked: el.locked,
                        hidden: el.hidden
                    }))
                );
            }
        }
    },

    async publishSite(siteId: string): Promise<string> {
        const userId = await getCurrentUserId();
        await ensureUser(userId);

        await db.update(sites)
            .set({ isPublished: true })
            .where(and(eq(sites.id, siteId), eq(sites.userId, userId)));

        return `https://wix-clone.com/view/${siteId}`;
    },

    async getPublishedSite(siteId: string): Promise<PublishedSite | null> {
        const site = await db.query.sites.findFirst({
            where: and(eq(sites.id, siteId), eq(sites.isPublished, true)),
            with: {
                pages: {
                    with: {
                        elements: true
                    }
                }
            }
        });

        if (!site) return null;

        return {
            siteId: site.id,
            pages: site.pages.map(p => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                isHomePage: p.isHomePage,
                height: p.height,
                sections: [],
                elements: p.elements as unknown as CanvasElement[]
            })),
            elements: {},
            theme: site.theme as unknown as SiteTheme,
            publishedAt: site.updatedAt.toISOString()
        };
    },

    async getSites(userId: string): Promise<SiteData[]> {
        const userSites = await db.select().from(sites)
            .where(eq(sites.userId, userId))
            .orderBy(desc(sites.updatedAt));

        if (userSites.length === 0) return [];

        const siteIds = userSites.map(s => s.id);

        // Fetch pages for these sites
        const sitePages = await db.query.pages.findMany({
            where: (pages, { inArray }) => inArray(pages.siteId, siteIds),
            with: {
                elements: true
            }
        });

        // Map pages to sites
        return userSites.map(site => {
            const myPages = sitePages.filter(p => p.siteId === site.id);
            return {
                siteId: site.id,
                pages: myPages.map(p => ({
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    isHomePage: p.isHomePage,
                    height: p.height,
                    sections: [],
                    elements: p.elements as unknown as CanvasElement[]
                })),
                elements: {},
                theme: site.theme as unknown as SiteTheme,
                lastSaved: site.updatedAt.toISOString()
            };
        });
    }
};
