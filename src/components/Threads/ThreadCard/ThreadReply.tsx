import type { Reply } from "@/types/thread"
import { formatDate } from "@/utils/date"
import { formatFileSize } from "@/utils/file"
import Image from "next/image"
import { ImageDialog } from "@/components/ui/image-dialog"

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
        <div className="bg-[#f8fdf8] border border-[#c0d0c0] p-2 md:p-3 mt-2 md:mt-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 md:gap-4">
                {/* Image column */}
                {reply.image && (
                    <div className="flex-shrink-0 sm:self-start self-center">
                        <ImageDialog
                            src={reply.image.url}
                            alt="Reply image"
                            filename={reply.image.filename}
                        >
                            <Image
                                src={reply.image.url || "/placeholder.svg"}
                                alt="Reply image"
                                width={150}
                                height={150}
                                className="border border-gray-300 hover:opacity-90 transition-opacity w-24 h-24 sm:w-32 sm:h-32 md:w-[150px] md:h-[150px] object-cover"
                            />
                        </ImageDialog>
                    </div>
                )}

                {/* Content column */}
                <div className="flex-1 min-w-0">
                    {/* Reply header */}
                    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm mb-2 flex-wrap">
                        <span className="text-blue-600">Anonymous</span>
                        <span className="text-gray-600 hidden sm:inline">{formatDate(reply.createdAt)}</span>
                        <span className="text-gray-600">No.{reply.id}</span>
                    </div>

                    {/* File info if image exists */}
                    {reply.image && (
                        <div className="text-xs mb-2 break-all">
                            <span className="text-blue-700">File: </span>
                            <span className="text-blue-700">{reply.image.filename}</span>
                            <span className="text-gray-700"> ({formatFileSize(reply.image.size)}, {reply.image.dimensions})</span>
                        </div>
                    )}

                    {/* Reply content */}
                    <div className="text-xs md:text-sm text-gray-800 whitespace-pre-line break-words">
                        {processContent(reply.content)}
                    </div>
                </div>
            </div>
        </div>
    );
} 