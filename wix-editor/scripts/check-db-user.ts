import 'dotenv/config';
import { prisma } from '../src/lib/db';

async function checkUser() {
    const result = await prisma.$queryRaw`SELECT current_user, session_user, current_setting('role') as role`;
    console.log('Connection Info:', result);

    // Check role privileges
    const privileges = await prisma.$queryRaw`SELECT rolname, rolbypassrls, rolsuper FROM pg_roles WHERE rolname = current_user`;
    console.log('Role Privileges:', privileges);

    // Check if RLS is enabled on User table (correct quoting)
    try {
        const rls = await prisma.$queryRaw`SELECT relname, relrowsecurity FROM pg_class WHERE oid = '"User"'::regclass`;
        console.log('RLS Status:', rls);
    } catch (e) {
        console.log('Could not check RLS status (maybe permissions):', e);
    }

    // Try to insert a user and see if it works
    try {
        const testUser = await prisma.user.create({
            data: {
                id: 'test_admin_' + Date.now(),
                email: 'test_admin_' + Date.now() + '@example.com'
            }
        });
        console.log('✅ Successfully created user:', testUser.id);
        // Clean up
        await prisma.user.delete({ where: { id: testUser.id } });
    } catch (e) {
        console.error('❌ Failed to create user:', e);
    }
}

checkUser()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
