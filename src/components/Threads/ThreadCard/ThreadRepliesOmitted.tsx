import type { Thread } from "@/types/thread"

interface ThreadRepliesOmittedProps {
    thread: Thread
}

export default function ThreadRepliesOmitted({ thread }: ThreadRepliesOmittedProps) {
    if (thread.replies.length === 0) return null;

    const replyCount = thread.replies.length;
    const imageCount = thread.replies.filter(r => r.image).length + (thread.image ? 1 : 0);

    return (
        <div className="flex items-center gap-2 mt-2 mb-2">
            <span className="text-amber-600">📁</span>
            <span className="text-sm text-gray-600">
                {replyCount} replies and {imageCount} images omitted.
            </span>
            <a href={`/thread/${thread.id}`} className="text-sm text-blue-600 hover:underline">
                Click here to view
            </a>
        </div>
    );
} 