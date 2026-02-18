import 'dotenv/config';
import { prisma } from '../src/lib/db';

async function enableRLS() {
    console.log('🔒 Locking down database tables with RLS...');

    const tables = ['User', 'Site', 'Page', 'CanvasElement'];

    for (const table of tables) {
        console.log(`Processing table: "${table}"`);

        try {
            // 1. Enable RLS
            await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
            console.log(`  - RLS Enabled.`);

            // 2. Drop existing restrictive policies if any (to avoid errors on re-run)
            try {
                await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "deny_all_public" ON "${table}";`);
            } catch (e) {
                // Ignore if it doesn't exist
            }

            // 3. Create Deny All Policy for public/anon roles
            // This ensures that if the Data API is used with the anon key, it returns nothing.
            // Service role (which Prisma uses if connected as postgres/service_role) bypasses RLS.

            // Note: Postgres policies are "permissive" by default if any exist, but if RLS is on and NO policies exist, 
            // the default is "deny all". However, explicitly adding a deny policy is clearer documentation.
            // BUT, actually, standard RLS behavior is: if RLS enabled, and no policy matches, access is DENIED.
            // So simply enabling RLS is sufficient to block 'anon' if we don't create an 'allow' policy for them.
            // But let's be explicit to show we mean business. 
            // Actually, `CREATE POLICY` is usually for ALLOWING access. 
            // To DENY, we just don't create an allow policy. 

            // So, step 1 (Enable RLS) essentially locks the table for everyone EXCEPT the owner/superuser.
            // Since our Prisma connection `DATABASE_URL` usually connects as the `postgres` user (superuser) or via the transaction pooler as an admin,
            // it naturally bypasses RLS.

            // Let's just create a dummy policy that effectively does nothing but documents intent if we wanted to be fancy,
            // but enabling RLS is the key step.

            // However, Supabase Studio sometimes warns if there are no policies.
            // Let's creating a policy that explicitly denies everything for 'anon' role just to be sure?
            // "CREATE POLICY" implies granting permission. Postgres doesn't have "DENY" policies in the simple sense (it denies by default).
            // So we will just trust ENABLE ROW LEVEL SECURITY.

            console.log(`  - Table secured (Default deny for non-admin users).`);

        } catch (error) {
            console.error(`  ❌ Failed to secure table "${table}":`, error);
        }
    }

    console.log('✅ Database hardening complete. All tables now have RLS enabled.');
    console.log('⚠️  NOTE: Standard Prisma queries should continue to work if using the admin connection string.');
}

enableRLS()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
