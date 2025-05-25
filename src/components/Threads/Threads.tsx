import type { Thread } from "@/types/thread"
import { ThreadCard } from "./ThreadCard/ThreadCard"

interface ThreadListProps {
    threads: Thread[]
}

export default function Threads({ threads }: ThreadListProps) {
    return (
        <div className="space-y-4">
            {threads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
            ))}
        </div>
    )
}
