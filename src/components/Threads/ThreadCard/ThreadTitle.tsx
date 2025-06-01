import type { Thread } from "@/types/thread";
import { formatDate } from "@/utils/date";
import Link from "next/link";
import { ReplyDialog } from "@/components/ui/reply-dialog";

export default function ThreadTitle({ thread }: { thread: Thread }) {
    return (
        <div className="flex items-center flex-wrap gap-x-1 md:gap-x-2 gap-y-1 text-xs md:text-sm">
            <span className="text-green-700 font-bold break-words">{thread.subject}</span>
            <span className="text-blue-600">Anonymous</span>
            <span className="text-gray-600 hidden sm:inline">{formatDate(thread.createdAt)}</span>
            <span className="text-gray-600">No.{thread.id}</span>
            <ReplyDialog threadId={thread.id} revalidatePath="/">
                <button className="text-blue-600 hover:underline text-xs md:text-sm cursor-pointer">
                    [Reply]
                </button>
            </ReplyDialog>
        </div>
    )
}
