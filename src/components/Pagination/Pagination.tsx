import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PaginationProps {
    currentPage: number
    totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className="flex justify-center items-center gap-2 py-4">
            <span className="text-sm font-mono text-gray-600 mr-4">
                Page {currentPage} of {totalPages}
            </span>

            {currentPage > 1 && (
                <Link href={`/?page=${currentPage - 1}`}>
                    <Button variant="outline" size="sm" className="border-gray-400 font-mono text-xs">
                        Previous
                    </Button>
                </Link>
            )}

            {pages.map((page) => (
                <Link key={page} href={`/?page=${page}`}>
                    <Button
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        className={`border-gray-400 font-mono text-xs ${page === currentPage ? "bg-[#90c090] text-black hover:bg-[#7ab07a]" : ""
                            }`}
                    >
                        {page}
                    </Button>
                </Link>
            ))}

            {currentPage < totalPages && (
                <Link href={`/?page=${currentPage + 1}`}>
                    <Button variant="outline" size="sm" className="border-gray-400 font-mono text-xs">
                        Next
                    </Button>
                </Link>
            )}
        </div>
    )
}
