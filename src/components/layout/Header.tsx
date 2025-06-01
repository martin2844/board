"use client"

import Link from "next/link"
import Image from "next/image"
import { LiveSearch } from "@/components/Search/LiveSearch"

export default function Header() {
    return (
        <div className="bg-[#d4e6d4] border-b-2 border-[#90c090] p-4">
            <div className="max-w-6xl mx-auto">
                <Link href="/">
                    <div className="flex items-center gap-2 mb-2 md:mb-4">
                        <Image
                            src="/logo.png"
                            alt="Mate Board Icon"
                            width={32}
                            height={32}
                            className="w-6 h-6 md:w-8 md:h-8"
                        />
                        <h1 className="text-xl md:text-2xl font-bold text-[#2d5a2d]">Mate Board</h1>
                    </div>
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                    <LiveSearch />
                </div>
            </div>
        </div>
    )
}
