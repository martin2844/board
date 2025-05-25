import type { Thread } from "@/types/thread"
import Link from 'next/link'
import { formatFileSize } from '@/utils/file'

interface ThreadFileInfoProps {
    thread: Thread
}

export default function ThreadFileInfo({ thread }: ThreadFileInfoProps) {
    if (!thread.image) return null;

    return (
        <div className="text-xs mb-1">
            <span className="text-blue-700">File: </span>
            <Link href="#" className="text-blue-700 underline">
                {thread.image.filename}
            </Link>
            <span className="text-gray-700"> ({formatFileSize(thread.image.size)}, {thread.image.dimensions})</span>
        </div>
    );
} 