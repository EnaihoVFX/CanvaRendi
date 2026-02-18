import { notFound } from 'next/navigation';
import ViewerCanvas from '@/components/viewer/ViewerCanvas';
import { storage } from '@/lib/storage';
import { SiteData, PublishedSite } from '@/types/editor';

interface PageProps {
    params: Promise<{
        siteId: string;
    }>;
    searchParams: Promise<{
        draft?: string;
    }>;
}

// We'll use Server Components to fetch data directly
export default async function ViewSitePage({ params, searchParams }: PageProps) {
    const { siteId } = await params;
    const { draft } = await searchParams;

    // In a real implementation with a remote DB, we would fetch here.
    // Since we are using a local JSON file adapter that runs on server-side, 
    // we can use the storage utility directly in this Server Component.

    // Note: This relies on the memory/file state of the server process.
    let site: PublishedSite | SiteData | null = (!draft || draft !== 'true') ? await storage.getPublishedSite(siteId) : null;

    // Fallback to draft if requested or not published
    // Note: getSite requires auth, so this might fail if viewing as guest.
    // We should only fallback to getSite if we are the owner, but for now we'll try and let it fail/return null if unauthorized.
    if (!site && draft === 'true') {
        try {
            site = await storage.getSite(siteId);
        } catch (e) {
            // Likely unauthorized if viewing draft as guest
            console.error("Failed to load draft site:", e);
        }
    }

    if (!site) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                fontFamily: 'sans-serif'
            }}>
                <h1>404 - Site Not Found</h1>
                <p>The site you are looking for does not exist or has not been published.</p>
            </div>
        );
    }

    // Default to first page for now, or handle routing for multiple pages later
    const homePage = site.pages.find((p: any) => p.isHomePage) || site.pages[0];
    // Elements are now attached to pages in our new structure, but let's support both
    const pageElements = homePage.elements || (site.elements ? Object.values(site.elements).filter((el: any) => el.pageId === homePage.id) : []);

    return (
        <main>
            <ViewerCanvas
                page={homePage}
                elements={pageElements}
                theme={site.theme}
            />
        </main>
    );
}
