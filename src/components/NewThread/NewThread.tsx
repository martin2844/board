"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createThreadAction } from "@/actions/threads/createThread"
import { uploadImageAction } from "@/actions/upload/uploadImage"
import { useReCaptcha } from "next-recaptcha-v3"

export function NewThreadForm() {
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
    const { executeRecaptcha } = useReCaptcha()

    // Form state
    const [formData, setFormData] = useState({
        subject: "",
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
            // Generate reCAPTCHA token for image upload
            const recaptchaToken = await executeRecaptcha('upload_image')

            const formDataUpload = new FormData()
            formDataUpload.append("file", file)

            // Add reCAPTCHA token to upload request
            if (recaptchaToken) {
                formDataUpload.append("recaptcha_token", recaptchaToken)
            }

            const result = await uploadImageAction(formDataUpload)

            if (result && result.success && result.url) {
                setUploadedImage({
                    url: result.url,
                    filename: result.filename || file.name,
                    size: result.size || file.size,
                    dimensions: result.dimensions || "unknown",
                })
            } else {
                // Check if result is null/undefined (server crash) and file is large
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);

                if (!result && file.size > 1024 * 1024) {
                    setError(`File is too large (${fileSizeMB}MB). Please choose an image under 1MB.`)
                } else {
                    setError(result?.error || "Failed to upload image")
                }
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
            // Execute reCAPTCHA
            const recaptchaToken = await executeRecaptcha('create_thread')

            const submitFormData = new FormData()
            submitFormData.append("subject", formData.subject)
            submitFormData.append("content", formData.content)
            submitFormData.append("device_id", deviceId)

            // Add reCAPTCHA token if available
            if (recaptchaToken) {
                submitFormData.append("recaptcha_token", recaptchaToken)
            }

            // Add uploaded image data if available
            if (uploadedImage) {
                submitFormData.append("image_url", uploadedImage.url)
                submitFormData.append("image_name", uploadedImage.filename)
                submitFormData.append("image_size", uploadedImage.size.toString())
                submitFormData.append("image_dimensions", uploadedImage.dimensions)
            }

            const result = await createThreadAction(submitFormData)

            if (result?.error) {
                setError(result.error)
                setIsSubmitting(false)
            } else if (result?.threadId) {
                // Success - close form and reset state
                setIsOpen(false)
                setIsSubmitting(false)
                setError(null)
                setUploadedImage(null)
                setFormData({ subject: "", content: "" }) // Reset form data
            }

        } catch (err) {
            console.error("Thread creation error:", err)

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
        setFormData({ subject: "", content: "" }) // Reset form data on cancel
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
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
        <div className="bg-[#e8f4e8] border-2 border-[#90c090] p-2 md:p-4 mb-2 md:mb-4">
            <h3 className="font-bold mb-2 md:mb-4 text-[#2d5a2d] text-sm md:text-base">Start a New Thread</h3>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 md:mb-4 text-xs md:text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2 md:space-y-4">
                <div>
                    <Label htmlFor="subject" className="text-xs md:text-sm font-bold">
                        Subject:
                    </Label>
                    <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className="bg-white border-gray-400 font-mono text-xs md:text-sm w-full"
                        placeholder="Thread subject..."
                        required
                        disabled={isSubmitting || isUploading}
                    />
                </div>

                <div>
                    <Label htmlFor="file" className="text-xs md:text-sm font-bold">
                        File (max 1MB): {isUploading && <span className="text-blue-600">(uploading...)</span>}
                        {uploadedImage && <span className="text-green-600">(uploaded: {uploadedImage.filename})</span>}
                    </Label>
                    <Input
                        id="file"
                        name="file"
                        type="file"
                        accept="image/*"
                        className="bg-white border-gray-400 font-mono text-xs md:text-sm w-full"
                        disabled={isSubmitting || isUploading}
                        onChange={handleFileChange}
                    />
                </div>

                <div>
                    <Label htmlFor="content" className="text-xs md:text-sm font-bold">
                        Comment:
                    </Label>
                    <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={(e) => handleInputChange("content", e.target.value)}
                        className="bg-white border-gray-400 font-mono text-xs md:text-sm min-h-[80px] md:min-h-[100px] w-full"
                        placeholder="Enter your message here... (optional if image attached)"
                        disabled={isSubmitting || isUploading}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        type="submit"
                        className="bg-[#90c090] hover:bg-[#7ab07a] text-black border border-gray-400 font-mono text-xs md:text-sm"
                        disabled={isSubmitting || isUploading}
                    >
                        {isSubmitting ? "Posting..." : isUploading ? "Uploading..." : "Post Thread"}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleCancel}
                        variant="outline"
                        className="border-gray-400 font-mono text-xs md:text-sm"
                        disabled={isSubmitting || isUploading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}
