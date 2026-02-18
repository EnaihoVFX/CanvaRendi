import { prisma } from '../src/lib/db';

async function main() {
    console.log('Testing DB connection...');
    try {
        console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);
        if (process.env.DATABASE_URL) {
            console.log('DATABASE_URL length:', process.env.DATABASE_URL.length);
            // safe log first few chars
            console.log('DATABASE_URL starts with:', process.env.DATABASE_URL.substring(0, 15));
        }

        const siteCount = await prisma.site.count();
        console.log('Successfully connected! Site count:', siteCount);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
