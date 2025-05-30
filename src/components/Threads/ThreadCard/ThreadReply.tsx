import type { Reply } from "@/types/thread"
import { formatDate } from "@/utils/date"
import { formatFileSize } from "@/utils/file"
import Image from "next/image"

interface ThreadReplyProps {
    reply: Reply
}

export default function ThreadReply({ reply }: ThreadReplyProps) {
    const processContent = (content: string) => {
        // Split content by newlines
        return content.split('\n').map((line, index) => {
            // Check if line starts with '>' for greentext
            if (line.startsWith('>')) {
                return (
                    <div key={index} className="text-green-700">
                        {line}
                    </div>
                );
            }
            return <div key={index}>{line}</div>;
        });
    };

    return (
        <div className="bg-[#f8fdf8] border border-[#c0d0c0] p-3 mt-4">
            <div className="flex items-start gap-4">
                {/* Image column */}
                {reply.image && (
                    <div className="flex-shrink-0">
                        <Image
                            src={reply.image.url || "/placeholder.svg"}
                            alt="Reply image"
                            width={150}
                            height={150}
                            className="border border-gray-300"
                        />
                    </div>
                )}

                {/* Content column */}
                <div className="flex-1">
                    {/* Reply header */}
                    <div className="flex items-center gap-2 text-sm mb-2">
                        <input type="checkbox" className="w-3.5 h-3.5" />
                        <span className="text-blue-600">Anonymous</span>
                        <span className="text-gray-600">{formatDate(reply.createdAt)}</span>
                        <span className="text-gray-600">No.{reply.id}</span>
                    </div>

                    {/* File info if image exists */}
                    {reply.image && (
                        <div className="text-xs mb-2">
                            <span className="text-blue-700">File: </span>
                            <span className="text-blue-700">{reply.image.filename}</span>
                            <span className="text-gray-700"> ({formatFileSize(reply.image.size)}, {reply.image.dimensions})</span>
                        </div>
                    )}

                    {/* Reply content */}
                    <div className="text-sm text-gray-800 whitespace-pre-line">
                        {processContent(reply.content)}
                    </div>
                </div>
            </div>
        </div>
    );
} 