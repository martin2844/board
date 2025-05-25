import type { Reply } from "@/types/thread"
import { formatDate } from "@/utils/date"

interface ThreadReplyPreviewProps {
    reply: Reply
}

export default function ThreadReplyPreview({ reply }: ThreadReplyPreviewProps) {
    return (
        <div className="pl-4 border-l-2 border-[#c0d0c0] py-1">
            <div className="flex items-center gap-2 text-xs mb-1">
                <input type="checkbox" className="w-3.5 h-3.5" />
                <span className="text-blue-600">Anonymous</span>
                <span className="text-gray-600">{formatDate(reply.createdAt)}</span>
                <span className="text-gray-600">No.{reply.id}</span>
            </div>
            <div className="text-sm whitespace-pre-wrap">{reply.content}</div>
        </div>
    );
} 