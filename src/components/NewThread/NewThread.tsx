"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function NewThreadForm() {
    const [isOpen, setIsOpen] = useState(false)
    const [subject, setSubject] = useState("")
    const [content, setContent] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Mock submission
        alert("Thread created! (This is a mock)")
        setSubject("")
        setContent("")
        setIsOpen(false)
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="bg-[#90c090] mb-4 hover:bg-[#7ab07a] text-black border border-gray-400 font-mono"
            >
                [Start a New Thread]
            </Button>
        )
    }

    return (
        <div className="bg-[#e8f4e8] border-2 border-[#90c090] p-4 mb-4">
            <h3 className="font-bold mb-4 text-[#2d5a2d]">Start a New Thread</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="subject" className="text-sm font-bold">
                        Subject:
                    </Label>
                    <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="bg-white border-gray-400 font-mono text-sm"
                        placeholder="Thread subject..."
                    />
                </div>

                <div>
                    <Label htmlFor="file" className="text-sm font-bold">
                        File:
                    </Label>
                    <Input id="file" type="file" accept="image/*" className="bg-white border-gray-400 font-mono text-sm" />
                </div>

                <div>
                    <Label htmlFor="content" className="text-sm font-bold">
                        Comment:
                    </Label>
                    <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="bg-white border-gray-400 font-mono text-sm min-h-[100px]"
                        placeholder="Enter your message here..."
                        required
                    />
                </div>

                <div className="flex gap-2">
                    <Button type="submit" className="bg-[#90c090] hover:bg-[#7ab07a] text-black border border-gray-400 font-mono">
                        Post Thread
                    </Button>
                    <Button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        variant="outline"
                        className="border-gray-400 font-mono"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}
