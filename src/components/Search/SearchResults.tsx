import type { SearchResult } from "@/services/search"
import { formatDate } from "@/utils/date"
import { formatFileSize } from "@/utils/file"
import { ImageDialog } from "@/components/ui/image-dialog"
import Image from "next/image"
import Link from "next/link"

interface SearchResultsProps {
    results: SearchResult[]
}

export function SearchResults({ results }: SearchResultsProps) {
    return (
        <div className="space-y-4">
            {results.map((result) => (
                <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
            ))}
        </div>
    )
}

function SearchResultCard({ result }: { result: SearchResult }) {
    const isThread = result.type === 'thread'
    const linkUrl = isThread ? `/thread/${result.id}` : `/thread/${result.threadId}#reply-${result.id}`

    return (
        <div className="bg-[#f8fdf8] border border-[#c0d0c0] p-2 md:p-4 hover:bg-[#f0f8f0] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 md:gap-4">
                {/* Image if exists */}
                {result.image && (
                    <div className="flex-shrink-0 sm:self-start self-center">
                        <ImageDialog
                            src={result.image.url}
                            alt={isThread ? "Thread image" : "Reply image"}
                            filename={result.image.filename}
                        >
                            <Image
                                src={result.image.url}
                                alt={isThread ? "Thread image" : "Reply image"}
                                width={100}
                                height={100}
                                className="border border-gray-300 hover:opacity-90 transition-opacity w-20 h-20 sm:w-24 sm:h-24 md:w-[100px] md:h-[100px] object-cover"
                            />
                        </ImageDialog>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm mb-2 flex-wrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                            {isThread ? 'THREAD' : 'REPLY'}
                        </span>
                        {isThread ? (
                            <span className="text-green-700 font-bold break-words">{result.subject}</span>
                        ) : (
                            <span className="text-gray-600 text-xs">
                                Reply in: <Link href={`/thread/${result.threadId}`} className="text-green-700 font-bold hover:underline break-words">
                                    {result.threadSubject}
                                </Link>
                            </span>
                        )}
                        <span className="text-gray-500 hidden sm:inline">•</span>
                        <span className="text-gray-600 hidden sm:inline">{formatDate(result.createdAt)}</span>
                        <span className="text-gray-600">No.{result.id}</span>
                    </div>

                    {/* File info if image exists */}
                    {result.image && (
                        <div className="text-xs mb-2 text-gray-600 break-all">
                            <span className="text-blue-700">File: </span>
                            <span className="text-blue-700">{result.image.filename}</span>
                            <span className="text-gray-700"> ({formatFileSize(result.image.size)}, {result.image.dimensions})</span>
                        </div>
                    )}

                    {/* Search snippet with highlighting */}
                    <div className="text-xs md:text-sm text-gray-800 mb-2 md:mb-3">
                        <div
                            className="prose prose-sm max-w-none break-words"
                            dangerouslySetInnerHTML={{ __html: result.snippet }}
                        />
                    </div>

                    {/* View link */}
                    <Link
                        href={linkUrl}
                        className="text-blue-600 hover:underline text-xs md:text-sm font-medium"
                    >
                        {isThread ? 'View Thread' : 'View Reply'} →
                    </Link>
                </div>
            </div>
        </div>
    )
} 