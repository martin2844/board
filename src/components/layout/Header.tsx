"use client"

import Link from "next/link"
import { LiveSearch } from "@/components/Search/LiveSearch"

export default function Header() {
    return (
        <div className="bg-[#d4e6d4] border-b-2 border-[#90c090] p-4">
            <div className="max-w-6xl mx-auto">
                <Link href="/">
                    <h1 className="text-xl md:text-2xl font-bold text-[#2d5a2d] mb-2 md:mb-4">Mate Board</h1>
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <LiveSearch />
                </div>
            </div>
        </div>
    )
}
