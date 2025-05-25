import type { Thread } from "@/types/thread"
import Link from 'next/link'
import Image from 'next/image'

interface ThreadImageProps {
    thread: Thread
}

export default function ThreadImage({ thread }: ThreadImageProps) {
    if (!thread.image) return null;

    return (
        <div className="flex-shrink-0">
            <Link href={`/thread/${thread.id}`}>
                <Image
                    src={thread.image.url || "/placeholder.svg"}
                    alt="Thread image"
                    width={150}
                    height={150}
                    className="border border-gray-300"
                />
            </Link>
        </div>
    );
} 