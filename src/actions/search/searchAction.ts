"use server"

import { searchContent } from "@/services/search"

export interface SearchActionResult {
    success: boolean
    results?: any[]
    totalCount?: number
    currentPage?: number
    totalPages?: number
    query?: string
    error?: string
}

export async function searchAction(formData: FormData): Promise<SearchActionResult> {
    try {

        const query = formData.get("query") as string
        const page = parseInt(formData.get("page") as string) || 1
        const perPage = parseInt(formData.get("perPage") as string) || 20

        if (!query || query.trim().length === 0) {
            return {
                success: false,
                error: "Search query is required"
            }
        }

        const searchResults = await searchContent(query, page, perPage)

        return {
            success: true,
            results: searchResults.results,
            totalCount: searchResults.totalCount,
            currentPage: searchResults.currentPage,
            totalPages: searchResults.totalPages,
            query: searchResults.query
        }

    } catch (error) {
        console.error("Search action error:", error)
        return {
            success: false,
            error: "Search failed. Please try again."
        }
    }
} 