"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createReplyAction } from "@/actions/replies/createReply"
import { uploadImageAction } from "@/actions/upload/uploadImage"

interface ReplyFormProps {
    threadId: number
    revalidatePath?: string
    onSuccess?: () => void
    isModal?: boolean
}

export function ReplyForm({ threadId, revalidatePath = "/", onSuccess, isModal = false }: ReplyFormProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [deviceId, setDeviceId] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [uploadedImage, setUploadedImage] = useState<{
        url: string;
        filename: string;
        size: number;
        dimensions: string;
    } | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        content: ""
    })

    // Generate device ID on client side
    useEffect(() => {
        // Try to get existing device ID from localStorage, or generate new one
        let id = localStorage.getItem("device_id")
        if (!id) {
            id = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            localStorage.setItem("device_id", id)
        }
        setDeviceId(id)
    }, [])

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) {
            setUploadedImage(null)
            return
        }

        // Client-side file size validation (1MB limit)
        const maxSize = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
            setError(`File is too large (${fileSizeMB}MB). Please choose an image under 1MB.`);
            // Clear the file input
            event.target.value = "";
            return;
        }

        // Client-side file type validation
        if (!file.type.startsWith('image/')) {
            setError("Please select an image file (JPG, PNG, GIF, WebP, etc.)");
            // Clear the file input
            event.target.value = "";
            return;
        }

        setIsUploading(true)
        setError(null)

        try {
            const formDataUpload = new FormData()
            formDataUpload.append("file", file)

            const result = await uploadImageAction(formDataUpload)

            if (result.success && result.url) {
                setUploadedImage({
                    url: result.url,
                    filename: result.filename || file.name,
                    size: result.size || file.size,
                    dimensions: result.dimensions || "unknown",
                })
            } else {
                setError(result.error || "Failed to upload image")
                // Clear the file input
                event.target.value = ""
            }
        } catch (err) {
            console.error("Upload error:", err)

            // Show proper file size error
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);

            if (file.size > 1024 * 1024) { // 1MB
                setError(`File is too large (${fileSizeMB}MB). Please choose an image under 1MB.`)
            } else {
                setError("Failed to upload image. Please try again.")
            }

            // Clear the file input
            event.target.value = ""
        } finally {
            setIsUploading(false)
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const submitFormData = new FormData()
            submitFormData.append("content", formData.content)
            submitFormData.append("thread_id", threadId.toString())
            submitFormData.append("device_id", deviceId)
            submitFormData.append("revalidate_path", revalidatePath)

            // Add uploaded image data if available
            if (uploadedImage) {
                submitFormData.append("image_url", uploadedImage.url)
                submitFormData.append("image_name", uploadedImage.filename)
                submitFormData.append("image_size", uploadedImage.size.toString())
                submitFormData.append("image_dimensions", uploadedImage.dimensions)
            }

            const result = await createReplyAction(submitFormData)

            if (result?.error) {
                setError(result.error)
                setIsSubmitting(false)
            } else if (result?.success) {
                // Success - close form, clear error and reset state
                setIsOpen(false)
                setError(null)
                setIsSubmitting(false)
                setUploadedImage(null)
                setFormData({ content: "" }) // Reset form data
                onSuccess?.()
            }

        } catch (err) {
            console.error("Reply creation error:", err)

            // Check if this is a body size limit error
            if (err instanceof Error) {
                if (err.message.includes('fetch') || err.message.includes('413') || err.message.includes('Body exceeded')) {
                    setError("Request is too large. Please try with a smaller image or less content.")
                } else {
                    setError("An unexpected error occurred. Please try again.")
                }
            } else {
                setError("An unexpected error occurred. Please try again.")
            }
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        setIsOpen(false)
        setError(null)
        setUploadedImage(null)
        setFormData({ content: "" }) // Reset form data on cancel
    }

    const handleInputChange = (value: string) => {
        setFormData({ content: value })
    }

    if (!isModal && !isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                variant="ghost"
                className="text-blue-600 hover:underline text-sm p-0 h-auto font-normal"
            >
                [Reply]
            </Button>
        )
    }

    return (
        <div className={isModal ? "" : "bg-[#e8f4e8] border border-[#90c090] p-2 md:p-3 mt-2 rounded"}>
            {!isModal && (
                <h4 className="font-bold mb-2 md:mb-3 text-[#2d5a2d] text-xs md:text-sm">Reply to Thread</h4>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 md:mb-3 text-xs">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
                <div>
                    <Label htmlFor={`file-${threadId}`} className="text-xs font-bold">
                        File (max 1MB): {isUploading && <span className="text-blue-600">(uploading...)</span>}
                        {uploadedImage && <span className="text-green-600">(uploaded: {uploadedImage.filename})</span>}
                    </Label>
                    <Input
                        id={`file-${threadId}`}
                        name="file"
                        type="file"
                        accept="image/*"
                        className="bg-white border-gray-400 font-mono text-xs w-full"
                        disabled={isSubmitting || isUploading}
                        onChange={handleFileChange}
                    />
                </div>

                <div>
                    <Label htmlFor={`content-${threadId}`} className="text-xs font-bold">
                        Comment:
                    </Label>
                    <Textarea
                        id={`content-${threadId}`}
                        name="content"
                        value={formData.content}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="bg-white border-gray-400 font-mono text-xs min-h-[60px] md:min-h-[80px] w-full"
                        placeholder="Enter your reply... (optional if image attached)"
                        disabled={isSubmitting || isUploading}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        type="submit"
                        className="bg-[#90c090] hover:bg-[#7ab07a] text-black border border-gray-400 font-mono text-xs"
                        disabled={isSubmitting || isUploading}
                        size="sm"
                    >
                        {isSubmitting ? "Posting..." : isUploading ? "Uploading..." : "Post Reply"}
                    </Button>
                    {!isModal && (
                        <Button
                            type="button"
                            onClick={handleCancel}
                            variant="outline"
                            className="border-gray-400 font-mono text-xs"
                            disabled={isSubmitting || isUploading}
                            size="sm"
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </div>
    )
} 