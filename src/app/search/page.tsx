import { searchContent } from "@/services/search"
import { SearchResults } from "@/components/Search/SearchResults"
import { Pagination } from "@/components/Pagination/Pagination"
import Link from "next/link"

interface SearchPageProps {
    searchParams: Promise<{
        q?: string
        page?: string
    }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const resolvedSearchParams = await searchParams
    const query = resolvedSearchParams.q || ""
    const page = parseInt(resolvedSearchParams.page || "1")

    if (!query) {
        return (
            <div className="container mx-auto px-4 py-4 md:py-8">
                <div className="bg-[#f8fdf8] border border-[#c0d0c0] p-4 md:p-6 rounded-lg text-center">
                    <h1 className="text-xl md:text-2xl font-bold text-[#2d5a2d] mb-4">Search</h1>
                    <p className="text-gray-600 mb-4 text-sm md:text-base">Enter a search term to find threads and replies.</p>
                    <Link
                        href="/"
                        className="text-blue-600 hover:underline text-sm md:text-base"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    const searchResults = await searchContent(query, page, 20)

    return (
        <div className="container mx-auto px-4 py-4 md:py-8">
            <div className="mb-4 md:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                    <h1 className="text-lg md:text-2xl font-bold text-[#2d5a2d]">
                        Search Results for &quot;{query}&quot;
                    </h1>
                    <Link
                        href="/"
                        className="text-blue-600 hover:underline text-xs md:text-sm self-start"
                    >
                        ← Back to Home
                    </Link>
                </div>

                {searchResults.totalCount > 0 ? (
                    <p className="text-gray-600 text-xs md:text-sm">
                        Found {searchResults.totalCount} result{searchResults.totalCount !== 1 ? 's' : ''}
                        {searchResults.totalPages > 1 && ` (page ${searchResults.currentPage} of ${searchResults.totalPages})`}
                    </p>
                ) : (
                    <p className="text-gray-600 text-xs md:text-sm">No results found.</p>
                )}
            </div>

            {searchResults.results.length > 0 ? (
                <>
                    <SearchResults results={searchResults.results} />

                    {searchResults.totalPages > 1 && (
                        <div className="mt-4 md:mt-8">
                            <Pagination
                                currentPage={searchResults.currentPage}
                                totalPages={searchResults.totalPages}
                                baseUrl={`/search?q=${encodeURIComponent(query)}`}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-[#f8fdf8] border border-[#c0d0c0] p-4 md:p-6 rounded-lg text-center">
                    <p className="text-gray-600 mb-4 text-sm md:text-base">
                        No results found for &quot;{query}&quot;. Try different search terms.
                    </p>
                    <div className="text-xs md:text-sm text-gray-500">
                        <p>Search tips:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-left max-w-md mx-auto">
                            <li>Try shorter or more general keywords</li>
                            <li>Check your spelling</li>
                            <li>Use different words with similar meanings</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
} 