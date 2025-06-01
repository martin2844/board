"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface ImageDialogProps {
    src: string
    alt: string
    filename?: string
    children: React.ReactNode
}

export function ImageDialog({ src, alt, filename, children }: ImageDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Trigger element */}
            <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                {children}
            </div>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsOpen(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Dialog content */}
                    <div className="relative bg-white rounded-lg max-w-[95vw] max-h-[95vh] overflow-hidden">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 md:p-2"
                        >
                            <X size={16} className="md:w-5 md:h-5" />
                        </button>

                        <div className="p-1 md:p-2">
                            <Image
                                src={src}
                                alt={alt}
                                width={800}
                                height={600}
                                className="max-w-full max-h-[85vh] md:max-h-[80vh] object-contain"
                                unoptimized // For GIFs and external images
                            />
                            {filename && (
                                <div className="mt-1 md:mt-2 text-xs md:text-sm text-gray-600 text-center px-2">
                                    {filename}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
} 