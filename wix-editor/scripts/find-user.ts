import 'dotenv/config';
import { db } from '../src/lib/db';
import { users } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function findUser() {
    const email = 'enaihouwaspaul@gmail.com';
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (user) {
        console.log(`Found user: ${user.id} (${user.email})`);
    } else {
        console.log(`User with email ${email} not found.`);
    }
}

findUser()
    .catch(console.error)
    .finally(() => process.exit());
