import type { Thread } from "@/types/thread";
import { formatDate } from "@/utils/date";
import Link from "next/link";

export default function ThreadTitle({ thread }: { thread: Thread }) {
    return (
        <div className="flex items-center flex-wrap gap-x-2 text-sm">
            <input type="checkbox" className="w-3.5 h-3.5" />
            <span className="text-green-700 font-bold">{thread.subject}</span>
            <span className="text-blue-600">Anonymous</span>
            <span className="text-gray-600">{formatDate(thread.createdAt)}</span>
            <span className="text-gray-600">No.{thread.id}</span>
            <Link href={`/thread/${thread.id}`} className="text-blue-600 hover:underline">
                [Reply]
            </Link>
        </div>
    )
}
