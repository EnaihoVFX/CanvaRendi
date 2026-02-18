import 'dotenv/config';
import { db } from '../src/lib/db';
import { users, sites } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function clearUserData() {
    const userId = 'user_39nKpH63obJaIKPWnA0YKiRLTcp';
    console.log(`Starting data clearing for user: ${userId}`);

    try {
        // 1. Delete Sites (Cascading deletes will handle pages and elements)
        const deletedSites = await db.delete(sites)
            .where(eq(sites.userId, userId))
            .returning({ id: sites.id });

        console.log(`✅ Deleted ${deletedSites.length} sites and all associated data.`);

        // 2. Delete User record
        const deletedUsers = await db.delete(users)
            .where(eq(users.id, userId))
            .returning({ id: users.id });

        if (deletedUsers.length > 0) {
            console.log(`✅ Successfully deleted user record: ${userId}`);
        } else {
            console.log(`⚠️ User record ${userId} not found in User table.`);
        }

        console.log('\nUser has been cleared. They will act as a new user on their next login.');

    } catch (error) {
        console.error('❌ Error clearing user data:', error);
    }
}

clearUserData()
    .catch(console.error)
    .finally(() => process.exit());
