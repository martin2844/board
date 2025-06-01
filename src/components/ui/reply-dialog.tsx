"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { ReplyForm } from "@/components/Replies/ReplyForm"

interface ReplyDialogProps {
    threadId: number
    revalidatePath?: string
    children: React.ReactNode
}

export function ReplyDialog({ threadId, revalidatePath = "/", children }: ReplyDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleSuccess = () => {
        setIsOpen(false)
    }

    return (
        <>
            {/* Trigger element */}
            <div onClick={() => setIsOpen(true)}>
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
                    <div
                        className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 z-10 p-1 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Reply form */}
                        <div className="p-6">
                            <h3 className="text-lg font-bold mb-4 text-[#2d5a2d]">Reply to Thread</h3>
                            <ReplyForm
                                threadId={threadId}
                                revalidatePath={revalidatePath}
                                onSuccess={handleSuccess}
                                isModal={true}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
} 