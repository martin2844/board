import type { Thread } from "@/types/thread"
import Image from "next/image"
import { ImageDialog } from "@/components/ui/image-dialog"

interface ThreadImageProps {
    thread: Thread
}

export default function ThreadImage({ thread }: ThreadImageProps) {
    if (!thread.image) return null;

    return (
        <div className="flex-shrink-0 sm:self-start self-center">
            <ImageDialog
                src={thread.image.url}
                alt="Thread image"
                filename={thread.image.filename}
            >
                <Image
                    src={thread.image.url || "/placeholder.svg"}
                    alt="Thread image"
                    width={150}
                    height={150}
                    className="border border-gray-300 hover:opacity-90 transition-opacity w-24 h-24 sm:w-32 sm:h-32 md:w-[150px] md:h-[150px] object-cover"
                />
            </ImageDialog>
        </div>
    );
} 