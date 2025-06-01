import type { Reply } from "@/types/thread"
import { formatDate } from "@/utils/date"
import { formatFileSize } from "@/utils/file"
import Image from "next/image"
import { ImageDialog } from "@/components/ui/image-dialog"

interface ThreadReplyPreviewProps {
    reply: Reply
}

export default function ThreadReplyPreview({ reply }: ThreadReplyPreviewProps) {
    return (
        <div className="pl-2 md:pl-4 border-l-2 border-[#c0d0c0] py-1">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 md:gap-3">
                {/* Reply image if exists */}
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
                                width={80}
                                height={80}
                                className="border border-gray-300 hover:opacity-90 transition-opacity w-16 h-16 sm:w-20 sm:h-20 object-cover"
                            />
                        </ImageDialog>
                    </div>
                )}

                {/* Reply content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 md:gap-2 text-xs mb-1 flex-wrap">
                        <span className="text-blue-600">Anonymous</span>
                        <span className="text-gray-600 hidden sm:inline">{formatDate(reply.createdAt)}</span>
                        <span className="text-gray-600">No.{reply.id}</span>
                    </div>

                    {/* File info if image exists */}
                    {reply.image && (
                        <div className="text-xs mb-1 text-gray-600 break-all">
                            <span className="text-blue-700">File: </span>
                            <span className="text-blue-700">{reply.image.filename}</span>
                            <span className="text-gray-700"> ({formatFileSize(reply.image.size)}, {reply.image.dimensions})</span>
                        </div>
                    )}

                    <div className="text-xs md:text-sm whitespace-pre-wrap break-words">{reply.content}</div>
                </div>
            </div>
        </div>
    );
} 