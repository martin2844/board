import { NextRequest, NextResponse } from "next/server"
import { searchContent } from "@/services/search"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get("q")
        const page = parseInt(searchParams.get("page") || "1")
        const perPage = parseInt(searchParams.get("limit") || "20")

        if (!query || query.trim().length === 0) {
            return NextResponse.json({
                success: false,
                error: "Search query is required"
            }, { status: 400 })
        }

        if (query.trim().length < 2) {
            return NextResponse.json({
                success: false,
                error: "Search query must be at least 2 characters"
            }, { status: 400 })
        }

        const searchResults = await searchContent(query, page, perPage)

        return NextResponse.json({
            success: true,
            ...searchResults
        })

    } catch (error) {
        console.error("Search API error:", error)
        return NextResponse.json({
            success: false,
            error: "Search failed. Please try again."
        }, { status: 500 })
    }
} 