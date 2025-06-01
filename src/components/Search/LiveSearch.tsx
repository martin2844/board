"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import type { SearchResult } from "@/services/search"
import { formatDate } from "@/utils/date"
import Link from "next/link"

export function LiveSearch() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const router = useRouter()
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Debounce search
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setIsOpen(false)
            return
        }

        const timeoutId = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true)
                try {
                    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`)
                    const data = await response.json()

                    if (data.success) {
                        setResults(data.results || [])
                        setIsOpen(true)
                        setSelectedIndex(-1)
                    } else {
                        setResults([])
                        setIsOpen(false)
                    }
                } catch (error) {
                    console.error('Search error:', error)
                    setResults([])
                    setIsOpen(false)
                } finally {
                    setIsLoading(false)
                }
            }
        }, 300) // 300ms debounce

        return () => clearTimeout(timeoutId)
    }, [query])

    // Handle click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSelectedIndex(-1)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) {
            if (e.key === 'Enter' && query.trim()) {
                // Navigate to full search page
                router.push(`/search?q=${encodeURIComponent(query.trim())}`)
                setIsOpen(false)
            }
            return
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev =>
                    prev < results.length - 1 ? prev + 1 : prev
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
                break
            case 'Enter':
                e.preventDefault()
                if (selectedIndex >= 0 && selectedIndex < results.length) {
                    const result = results[selectedIndex]
                    const url = result.type === 'thread'
                        ? `/thread/${result.id}`
                        : `/thread/${result.threadId}#reply-${result.id}`
                    router.push(url)
                    setIsOpen(false)
                    setQuery("")
                } else if (query.trim()) {
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
                    setIsOpen(false)
                }
                break
            case 'Escape':
                setIsOpen(false)
                setSelectedIndex(-1)
                inputRef.current?.blur()
                break
        }
    }

    const clearSearch = () => {
        setQuery("")
        setResults([])
        setIsOpen(false)
        inputRef.current?.focus()
    }

    const handleResultClick = (result: SearchResult) => {
        const url = result.type === 'thread'
            ? `/thread/${result.id}`
            : `/thread/${result.threadId}#reply-${result.id}`
        router.push(url)
        setIsOpen(false)
        setQuery("")
    }

    return (
        <div ref={searchRef} className="relative">
            <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                    ref={inputRef}
                    placeholder="Search threads and replies..."
                    className="pl-8 pr-8 bg-white border-gray-400 font-mono text-sm w-full sm:w-80"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.trim().length >= 2 && results.length > 0 && setIsOpen(true)}
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}
                {isLoading && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto mt-1">
                    {results.length > 0 ? (
                        <>
                            {results.map((result, index) => (
                                <div
                                    key={`${result.type}-${result.id}`}
                                    className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${index === selectedIndex ? 'bg-blue-50' : ''
                                        }`}
                                    onClick={() => handleResultClick(result)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded ${result.type === 'thread'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {result.type === 'thread' ? 'THREAD' : 'REPLY'}
                                                </span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {result.type === 'thread' ? result.subject : result.threadSubject}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(result.createdAt)}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 line-clamp-2">
                                                <div dangerouslySetInnerHTML={{ __html: result.snippet }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* View all results link */}
                            <div className="p-3 border-t border-gray-200 bg-gray-50">
                                <Link
                                    href={`/search?q=${encodeURIComponent(query)}`}
                                    className="text-sm text-blue-600 hover:underline font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    View all results for &quot;{query}&quot; →
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            <p className="text-sm">No results found</p>
                            <p className="text-xs">Try different keywords</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
} 