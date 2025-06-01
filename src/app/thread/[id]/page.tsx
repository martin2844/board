import { getThreadWithReplies } from "@/services/thread";
import ThreadDetail from "@/components/Threads/ThreadDetail";
import { notFound } from "next/navigation";
import Link from "next/link";

interface ThreadPageProps {
    params: Promise<{ id: string }>;
}

export default async function ThreadPage({ params }: ThreadPageProps) {
    const { id } = await params;
    const threadId = parseInt(id, 10);

    // Validate thread ID
    if (isNaN(threadId)) {
        notFound();
    }

    // Fetch the thread with all its replies
    const thread = await getThreadWithReplies(threadId);

    // If thread doesn't exist, show 404
    if (!thread) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-4 md:py-6">
            <div className="mb-2 md:mb-4">
                <Link href="/" className="text-blue-600 hover:underline text-xs md:text-sm">
                    ← Back to Board
                </Link>
            </div>
            <ThreadDetail thread={thread} />
        </div>
    );
}
