import 'dotenv/config';
import { prisma } from '../src/lib/db';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'src/data/db.json');

async function migrate() {
    console.log('Starting migration...');

    if (!fs.existsSync(DB_FILE)) {
        console.log('No local database file found.');
        return;
    }

    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    const sites = data.sites || {};

    // Get a default user ID to assign strict ownership
    // In a real scenario, we'd map this, but for now we'll ask for one or pick the first user
    // ideally, we should create a seed user if none exists.
    // For this script, we'll assume we want to assign everything to a specific user ID if passed, or fail.

    // Check if any user exists
    const user = await prisma.user.findFirst();
    let userId = user?.id;

    if (!userId) {
        console.log('No users found in database. Please sign up in the app first or provide a userId.');
        // Create a dummy user for migration if allowed? 
        // Better to fail and ask dev to sign in.
        // Actually, let's create a placeholder user for migration purposes locally
        const newUser = await prisma.user.create({
            data: {
                id: 'migration_user_' + Date.now(),
                email: 'migration@example.com'
            }
        });
        userId = newUser.id;
        console.log(`Created migration user: ${userId}`);
    }

    console.log(`Migrating data for user: ${userId}`);

    for (const [siteId, siteData] of Object.entries(sites) as [string, any][]) {
        console.log(`Migrating site: ${siteId}`);

        try {
            // 1. Create Site
            const site = await prisma.site.upsert({
                where: { id: siteId },
                update: {},
                create: {
                    id: siteId,
                    name: siteData.name || 'Untitled Site',
                    userId: userId,
                    theme: siteData.theme || {},
                    isPublished: !!siteData.lastPublished,
                    updatedAt: siteData.lastSaved ? new Date(siteData.lastSaved) : new Date()
                }
            });

            // 2. Create Pages
            if (siteData.pages) {
                for (const page of siteData.pages) {
                    await prisma.page.upsert({
                        where: { id: page.id },
                        update: {},
                        create: {
                            id: page.id,
                            siteId: site.id,
                            name: page.name,
                            slug: page.slug,
                            isHomePage: page.isHomePage,
                            height: page.height || 1200
                        }
                    });

                    // 3. Create Elements (if embedded in page)
                    // Old structure might have elements in siteData.elements dictionary
                    // New structure in storage.ts puts them in page.elements
                    // Let's handle legacy dictionary structure primarily for the existing db.json

                    const pageElements = Object.values(siteData.elements || {}).filter((el: any) => el.pageId === page.id);

                    if (pageElements.length > 0) {
                        await prisma.canvasElement.createMany({
                            data: pageElements.map((el: any) => ({
                                id: el.id,
                                type: el.type,
                                pageId: page.id,
                                siteId: site.id,
                                bounds: el.bounds,
                                props: el.props,
                                zIndex: el.zIndex,
                                locked: el.locked,
                                hidden: el.hidden
                            })),
                            skipDuplicates: true
                        });
                    }
                }
            }

            console.log(`User ${userId} now owns site ${siteId}`);

        } catch (error) {
            console.error(`Failed to migrate site ${siteId}:`, error);
        }
    }

    console.log('Migration complete.');
}

migrate()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
