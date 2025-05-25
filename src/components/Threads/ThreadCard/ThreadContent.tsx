import type { Thread } from "@/types/thread";

export default function ThreadContent({ thread }: { thread: Thread }) {
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
        <div className="text-sm text-gray-800 whitespace-pre-line">
            {processContent(thread.content)}
        </div>
    );
}
