import EditorLayout from "@/components/layout/EditorLayout";
import { storage } from "@/lib/storage";
import { redirect } from "next/navigation";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditorPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const siteId = params.siteId as string;

    if (!siteId) {
        redirect('/dashboard');
    }

    const siteData = await storage.getSite(siteId);

    if (!siteData) {
        return <div>Site not found</div>;
    }

    return <EditorLayout initialData={siteData} siteId={siteId} />;
}
