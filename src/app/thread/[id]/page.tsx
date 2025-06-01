import { getThreadWithReplies } from "@/services/thread";
import ThreadDetail from "@/components/Threads/ThreadDetail";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface ThreadPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ThreadPageProps): Promise<Metadata> {
    const { id } = await params;
    const threadId = parseInt(id, 10);

    if (isNaN(threadId)) {
        return {
            title: "Thread Not Found",
            description: "The requested thread could not be found.",
        };
    }

    const thread = await getThreadWithReplies(threadId);

    if (!thread) {
        return {
            title: "Thread Not Found",
            description: "The requested thread could not be found.",
        };
    }

    // Truncate content for description (limit to ~160 chars)
    const description = thread.content.length > 160
        ? thread.content.substring(0, 157) + "..."
        : thread.content;

    return {
        title: thread.subject || `Thread #${thread.id}`,
        description: description,
    };
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
