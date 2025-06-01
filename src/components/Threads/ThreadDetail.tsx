import type { Thread } from "@/types/thread"
import ThreadTitle from "./ThreadCard/ThreadTitle"
import ThreadContent from "./ThreadCard/ThreadContent"
import ThreadImage from "./ThreadCard/ThreadImage"
import ThreadFileInfo from "./ThreadCard/ThreadFileInfo"
import ThreadReply from "./ThreadCard/ThreadReply"
import { ReplyForm } from "@/components/Replies/ReplyForm"

interface ThreadDetailProps {
    thread: Thread
}

export default function ThreadDetail({ thread }: ThreadDetailProps) {
    return (
        <div className="space-y-2 md:space-y-4">
            {/* Main thread */}
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
                    </div>
                </div>
            </div>

            {/* All replies */}
            {thread.replies.map(reply => (
                <ThreadReply key={reply.id} reply={reply} />
            ))}

            {/* Reply form for new replies */}
            <div className="bg-[#f8fdf8] border border-[#c0d0c0] p-2 md:p-3">
                <ReplyForm
                    threadId={thread.id}
                    revalidatePath={`/thread/${thread.id}`}
                />
            </div>
        </div>
    )
} 