import type { Thread } from "@/types/thread"
import ThreadTitle from "./ThreadTitle"
import ThreadContent from "./ThreadContent"
import ThreadImage from "./ThreadImage"
import ThreadFileInfo from "./ThreadFileInfo"
import ThreadRepliesOmitted from "./ThreadRepliesOmitted"
import ThreadReplyPreview from "./ThreadReplyPreview"

interface ThreadCardProps {
    thread: Thread
}

export function ThreadCard({ thread }: ThreadCardProps) {
    return (
        <div className="bg-[#f8fdf8] border border-[#c0d0c0] p-2 md:p-3">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 md:gap-4">
                {/* First column - Image */}
                <ThreadImage thread={thread} />

                {/* Second column - Content */}
                <div className="flex-1 min-w-0">
                    {/* File info and Title on same line */}
                    <div className="flex flex-col mb-2">
                        <ThreadFileInfo thread={thread} />
                        <ThreadTitle thread={thread} />
                    </div>

                    {/* Content */}
                    <ThreadContent thread={thread} />

                    {/* Replies section */}
                    {thread.replies.length > 0 && (
                        <div className="mt-2">
                            <ThreadRepliesOmitted thread={thread} />

                            {/* Show up to 5 replies */}
                            {thread.replies.slice(0, 5).map(reply => (
                                <ThreadReplyPreview key={reply.id} reply={reply} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
