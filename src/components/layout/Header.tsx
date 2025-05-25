import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function Header() {
    return (
        <div className="bg-[#d4e6d4] border-b-2 border-[#90c090] p-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-[#2d5a2d] mb-4">Mate Board</h1>

                <div className="flex items-center gap-4 mb-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input placeholder="Search OPs..." className="pl-8 bg-white border-gray-400 font-mono text-sm" />
                    </div>
                </div>
            </div>
        </div>
    )
}
