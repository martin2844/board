import type { Thread } from "@/types/thread"

interface ThreadRepliesOmittedProps {
    thread: Thread
}

export default function ThreadRepliesOmitted({ thread }: ThreadRepliesOmittedProps) {
    if (thread.replies.length <= 5) return null;

    const totalReplies = thread.replies.length;
    const shownReplies = 5;
    const omittedReplies = totalReplies - shownReplies;

    const totalImages = thread.replies.filter(r => r.image).length;
    const shownImages = thread.replies.slice(0, 5).filter(r => r.image).length;
    const omittedImages = totalImages - shownImages;

    // Build the omitted message
    let omittedText = `${omittedReplies} replies`;
    if (omittedImages > 0) {
        omittedText += ` and ${omittedImages} images`;
    }
    omittedText += " omitted.";

    return (
        <div className="flex items-center gap-2 mt-2 mb-2">
            <span className="text-amber-600">📁</span>
            <span className="text-sm text-gray-600">
                {omittedText}
            </span>
            <a href={`/thread/${thread.id}`} className="text-sm text-blue-600 hover:underline">
                Click here to view
            </a>
        </div>
    );
} 