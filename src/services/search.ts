import type { Thread, Reply, ImageAttachment } from "@/types/thread"
import db from "@/lib/db"
import dayjs from "dayjs"

export interface SearchResult {
    type: 'thread' | 'reply'
    id: number
    content: string
    subject?: string // Only for threads
    threadId?: number // Only for replies
    threadSubject?: string // Only for replies
    createdAt: Date
    image?: ImageAttachment
    relevanceScore: number
    snippet: string // Highlighted snippet
}

export interface SearchResults {
    results: SearchResult[]
    totalCount: number
    currentPage: number
    totalPages: number
    query: string
}

// Advanced search function with FTS
export async function searchContent(
    query: string,
    page: number = 1,
    perPage: number = 20
): Promise<SearchResults> {
    if (!query.trim()) {
        return {
            results: [],
            totalCount: 0,
            currentPage: page,
            totalPages: 0,
            query: query.trim()
        }
    }

    const offset = (page - 1) * perPage
    // Add prefix matching for partial word searches
    const sanitizedQuery = query.trim()
        .replace(/['"]/g, '') // Remove quotes
        .split(/\s+/) // Split on whitespace
        .filter(term => term.length > 0) // Remove empty terms
        .map(term => {
            // Add prefix matching wildcard for each term
            return term.endsWith('*') ? term : `${term}*`
        })
        .join(' AND ') // Join with AND for all terms must match

    try {
        // Search threads with FTS
        const threadResults = await db.raw(`
            SELECT 
                'thread' as type,
                t.id,
                t.subject,
                t.content,
                t.created_at,
                t.image_url,
                t.image_name,
                t.image_size,
                t.image_dimensions,
                fts.rank,
                snippet(threads_fts, 1, '<mark>', '</mark>', '...', 50) as content_snippet,
                snippet(threads_fts, 0, '<mark>', '</mark>', '...', 20) as subject_snippet
            FROM threads_fts fts
            JOIN threads t ON t.id = fts.rowid
            WHERE threads_fts MATCH ?
            ORDER BY fts.rank
        `, [sanitizedQuery])

        // Search replies with FTS
        const replyResults = await db.raw(`
            SELECT 
                'reply' as type,
                r.id,
                r.content,
                r.created_at,
                r.thread_id,
                r.image_url,
                r.image_name,
                r.image_size,
                r.image_dimensions,
                t.subject as thread_subject,
                fts.rank,
                snippet(replies_fts, 0, '<mark>', '</mark>', '...', 50) as content_snippet
            FROM replies_fts fts
            JOIN replies r ON r.id = fts.rowid
            JOIN threads t ON t.id = r.thread_id
            WHERE replies_fts MATCH ?
            ORDER BY fts.rank
        `, [sanitizedQuery])

        // Combine and sort results by relevance
        const allResults = [
            ...(threadResults || []).map((row: any) => {
                // Prioritize content snippet if it contains highlights, otherwise use subject snippet
                let snippet = row.content_snippet || row.subject_snippet

                // If no FTS snippet available, create a fallback snippet around the search term
                if (!snippet || snippet.trim() === '') {
                    const content = row.content || row.subject || ''
                    const searchTerms = sanitizedQuery.toLowerCase().split(' AND ').map(term => term.trim())
                    let foundIndex = -1

                    // Find the first occurrence of any search term
                    for (const term of searchTerms) {
                        foundIndex = content.toLowerCase().indexOf(term.toLowerCase())
                        if (foundIndex !== -1) break
                    }

                    if (foundIndex !== -1) {
                        // Show context around the match
                        const start = Math.max(0, foundIndex - 50)
                        const end = Math.min(content.length, foundIndex + 150)
                        snippet = (start > 0 ? '...' : '') +
                            content.substring(start, end) +
                            (end < content.length ? '...' : '')
                    } else {
                        // Fallback to beginning of content
                        snippet = content.substring(0, 200) + (content.length > 200 ? '...' : '')
                    }
                }

                return {
                    type: 'thread' as const,
                    id: row.id,
                    content: row.content,
                    subject: row.subject,
                    createdAt: dayjs(row.created_at).toDate(),
                    image: row.image_url ? {
                        url: row.image_url,
                        filename: row.image_name,
                        size: parseInt(row.image_size || '0'),
                        dimensions: row.image_dimensions
                    } : undefined,
                    relevanceScore: Math.abs(row.rank),
                    snippet
                }
            }),
            ...(replyResults || []).map((row: any) => {
                // Use content snippet or create fallback
                let snippet = row.content_snippet

                if (!snippet || snippet.trim() === '') {
                    const content = row.content || ''
                    const searchTerms = sanitizedQuery.toLowerCase().split(' AND ').map(term => term.trim())
                    let foundIndex = -1

                    for (const term of searchTerms) {
                        foundIndex = content.toLowerCase().indexOf(term.toLowerCase())
                        if (foundIndex !== -1) break
                    }

                    if (foundIndex !== -1) {
                        const start = Math.max(0, foundIndex - 50)
                        const end = Math.min(content.length, foundIndex + 150)
                        snippet = (start > 0 ? '...' : '') +
                            content.substring(start, end) +
                            (end < content.length ? '...' : '')
                    } else {
                        snippet = content.substring(0, 200) + (content.length > 200 ? '...' : '')
                    }
                }

                return {
                    type: 'reply' as const,
                    id: row.id,
                    content: row.content,
                    threadId: row.thread_id,
                    threadSubject: row.thread_subject,
                    createdAt: dayjs(row.created_at).toDate(),
                    image: row.image_url ? {
                        url: row.image_url,
                        filename: row.image_name,
                        size: parseInt(row.image_size || '0'),
                        dimensions: row.image_dimensions
                    } : undefined,
                    relevanceScore: Math.abs(row.rank),
                    snippet
                }
            })
        ]

        // Sort by relevance score (lower is better for FTS rank)
        allResults.sort((a, b) => a.relevanceScore - b.relevanceScore)

        const totalCount = allResults.length
        const totalPages = Math.ceil(totalCount / perPage)
        const paginatedResults = allResults.slice(offset, offset + perPage)

        return {
            results: paginatedResults,
            totalCount,
            currentPage: page,
            totalPages,
            query: query.trim()
        }

    } catch (error) {
        console.error('Search error:', error)

        // Fallback to LIKE search if FTS fails
        return await fallbackSearch(query, page, perPage)
    }
}

// Fallback search using LIKE queries
async function fallbackSearch(
    query: string,
    page: number,
    perPage: number
): Promise<SearchResults> {
    const offset = (page - 1) * perPage
    const likeQuery = `%${query.trim()}%`

    try {
        // Search threads
        const threads = await db('threads')
            .select(
                'id',
                'subject',
                'content',
                'created_at',
                'image_url',
                'image_name',
                'image_size',
                'image_dimensions'
            )
            .where('subject', 'like', likeQuery)
            .orWhere('content', 'like', likeQuery)
            .orderBy('created_at', 'desc')

        // Search replies
        const replies = await db('replies as r')
            .join('threads as t', 't.id', 'r.thread_id')
            .select(
                'r.id',
                'r.content',
                'r.created_at',
                'r.thread_id',
                'r.image_url',
                'r.image_name',
                'r.image_size',
                'r.image_dimensions',
                't.subject as thread_subject'
            )
            .where('r.content', 'like', likeQuery)
            .orderBy('r.created_at', 'desc')

        const allResults: SearchResult[] = [
            ...threads.map(thread => {
                // Create contextual snippet for fallback search
                const content = thread.content || thread.subject || ''
                const searchTerms = query.toLowerCase().split(' ')
                let foundIndex = -1

                // Find the first occurrence of any search term
                for (const term of searchTerms) {
                    foundIndex = content.toLowerCase().indexOf(term.toLowerCase())
                    if (foundIndex !== -1) break
                }

                let snippet = ''
                if (foundIndex !== -1) {
                    // Show context around the match
                    const start = Math.max(0, foundIndex - 50)
                    const end = Math.min(content.length, foundIndex + 150)
                    snippet = (start > 0 ? '...' : '') +
                        content.substring(start, end) +
                        (end < content.length ? '...' : '')
                } else {
                    snippet = content.substring(0, 200) + (content.length > 200 ? '...' : '')
                }

                return {
                    type: 'thread' as const,
                    id: thread.id,
                    content: thread.content,
                    subject: thread.subject,
                    createdAt: dayjs(thread.created_at).toDate(),
                    image: thread.image_url ? {
                        url: thread.image_url,
                        filename: thread.image_name,
                        size: parseInt(thread.image_size || '0'),
                        dimensions: thread.image_dimensions
                    } : undefined,
                    relevanceScore: 1,
                    snippet
                }
            }),
            ...replies.map(reply => {
                // Create contextual snippet for reply
                const content = reply.content || ''
                const searchTerms = query.toLowerCase().split(' ')
                let foundIndex = -1

                for (const term of searchTerms) {
                    foundIndex = content.toLowerCase().indexOf(term.toLowerCase())
                    if (foundIndex !== -1) break
                }

                let snippet = ''
                if (foundIndex !== -1) {
                    const start = Math.max(0, foundIndex - 50)
                    const end = Math.min(content.length, foundIndex + 150)
                    snippet = (start > 0 ? '...' : '') +
                        content.substring(start, end) +
                        (end < content.length ? '...' : '')
                } else {
                    snippet = content.substring(0, 200) + (content.length > 200 ? '...' : '')
                }

                return {
                    type: 'reply' as const,
                    id: reply.id,
                    content: reply.content,
                    threadId: reply.thread_id,
                    threadSubject: reply.thread_subject,
                    createdAt: dayjs(reply.created_at).toDate(),
                    image: reply.image_url ? {
                        url: reply.image_url,
                        filename: reply.image_name,
                        size: parseInt(reply.image_size || '0'),
                        dimensions: reply.image_dimensions
                    } : undefined,
                    relevanceScore: 1,
                    snippet
                }
            })
        ]

        const totalCount = allResults.length
        const totalPages = Math.ceil(totalCount / perPage)
        const paginatedResults = allResults.slice(offset, offset + perPage)

        return {
            results: paginatedResults,
            totalCount,
            currentPage: page,
            totalPages,
            query: query.trim()
        }

    } catch (error) {
        console.error('Fallback search error:', error)
        return {
            results: [],
            totalCount: 0,
            currentPage: page,
            totalPages: 0,
            query: query.trim()
        }
    }
} 