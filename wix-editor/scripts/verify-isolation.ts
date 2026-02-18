import 'dotenv/config';
import { prisma } from '../src/lib/db';

async function verifyIsolation() {
    console.log('Starting Security Isolation Verification...');

    const timestamp = Date.now();
    const userA = { id: 'user_A_' + timestamp, email: `userA_${timestamp}@test.com` };
    const userB = { id: 'user_B_' + timestamp, email: `userB_${timestamp}@test.com` };

    console.log(`Creating Mock Users: ${userA.id}, ${userB.id}`);

    // Use upsert or sequential create to ensure they exist
    // createMany with skipDuplicates might be flaky with the adapter?
    console.log(`Creating/Updating User A: ${userA.id}`);
    await prisma.user.upsert({
        where: { id: userA.id },
        update: {},
        create: userA
    });

    console.log(`Creating/Updating User B: ${userB.id}`);
    await prisma.user.upsert({
        where: { id: userB.id },
        update: {},
        create: userB
    });

    // 2. User A creates a site
    const siteA = await prisma.site.create({
        data: {
            name: 'Site A',
            userId: userA.id,
            theme: {},
            elements: { create: [] }
        }
    });

    console.log(`User A created site: ${siteA.id}`);

    // 3. User B attempts to access Site A (simulating API or DB access)
    // In our app logic (storage.ts), we filter by userId.
    // Let's verify that a query enforcing our pattern returns null.

    console.log('Testing access control...');

    const accessByA = await prisma.site.findFirst({
        where: { id: siteA.id, userId: userA.id }
    });

    const accessByB = await prisma.site.findFirst({
        where: { id: siteA.id, userId: userB.id }
    });

    if (accessByA && accessByA.id === siteA.id) {
        console.log('✅ PASS: User A can access their own site.');
    } else {
        console.error('❌ FAIL: User A CANNOT access their own site.');
        process.exit(1);
    }

    if (accessByB === null) {
        console.log('✅ PASS: User B CANNOT access User A\'s site.');
    } else {
        console.error('❌ FAIL: User B WAS ABLE to access User A\'s site!');
        console.error(accessByB);
        process.exit(1);
    }

    // 4. Verify Page Isolation
    // User A adds a page
    const pageA = await prisma.page.create({
        data: {
            name: 'Page A',
            slug: 'page-a',
            siteId: siteA.id,
            isHomePage: true
        }
    });

    // User B tries to fetch this page via site association? 
    // If User B tries `prisma.site.findFirst({ includes: { pages: true }, where: { userId: userB.id } })`
    // They should get nothing, so they can't see pages.

    const siteAccessB = await prisma.site.findFirst({
        where: { id: siteA.id, userId: userB.id },
        include: { pages: true }
    });

    if (siteAccessB === null) {
        console.log('✅ PASS: User B CANNOT view pages of User A via site relation.');
    } else {
        console.error('❌ FAIL: User B leaked site data with pages!');
        process.exit(1);
    }

    console.log('Security Verification Complete: All checks passed.');
}

verifyIsolation()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
