import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PaginationProps {
    currentPage: number
    totalPages: number
    baseUrl?: string
}

export function Pagination({ currentPage, totalPages, baseUrl = "/" }: PaginationProps) {
    const getPageUrl = (page: number) => {
        if (baseUrl.includes('?')) {
            return `${baseUrl}&page=${page}`
        }
        return `${baseUrl}?page=${page}`
    }

    // Smart pagination logic
    const getVisiblePages = () => {
        const pages: (number | 'ellipsis')[] = []

        // If we have 7 or fewer pages, show all
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        // Always show first page
        pages.push(1)

        // Determine the range around current page
        const delta = 2 // How many pages to show around current
        const rangeStart = Math.max(2, currentPage - delta)
        const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

        // Add ellipsis after first page if needed
        if (rangeStart > 2) {
            pages.push('ellipsis')
        }

        // Add pages around current page
        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i)
        }

        // Add ellipsis before last page if needed
        if (rangeEnd < totalPages - 1) {
            pages.push('ellipsis')
        }

        // Always show last page (if we have more than 1 page)
        if (totalPages > 1) {
            pages.push(totalPages)
        }

        return pages
    }

    const visiblePages = getVisiblePages()

    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 py-4">
            <span className="text-xs md:text-sm font-mono text-gray-600 mb-2 sm:mb-0 sm:mr-4">
                Page {currentPage} of {totalPages}
            </span>

            <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2">
                {currentPage > 1 && (
                    <Link href={getPageUrl(currentPage - 1)}>
                        <Button variant="outline" size="sm" className="border-gray-400 font-mono text-xs">
                            Previous
                        </Button>
                    </Link>
                )}

                {visiblePages.map((page, index) => {
                    if (page === 'ellipsis') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-1 md:px-2 text-gray-500 font-mono text-xs">
                                ...
                            </span>
                        )
                    }

                    return (
                        <Link key={page} href={getPageUrl(page)}>
                            <Button
                                variant={page === currentPage ? "default" : "outline"}
                                size="sm"
                                className={`border-gray-400 font-mono text-xs ${page === currentPage ? "bg-[#90c090] text-black hover:bg-[#7ab07a]" : ""
                                    }`}
                            >
                                {page}
                            </Button>
                        </Link>
                    )
                })}

                {currentPage < totalPages && (
                    <Link href={getPageUrl(currentPage + 1)}>
                        <Button variant="outline" size="sm" className="border-gray-400 font-mono text-xs">
                            Next
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    )
}
