import Dashboard from '@/components/dashboard/Dashboard';
import { storage } from '@/lib/storage';
import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage() {
    const { userId } = await auth();
    if (!userId) {
        // Should have been handled by middleware, but for strict type safety
        return <div>Unauthorized</div>;
    }

    const sites = await storage.getSites(userId);

    return <Dashboard initialSites={sites} />;
}
