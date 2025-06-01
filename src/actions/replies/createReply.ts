"use server";

import { createReply } from "@/services/thread";
import { findOrCreateUser } from "@/services/user";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ImageAttachment } from "@/types/thread";

// Schema for validating the reply form data
const CreateReplySchema = z.object({
    thread_id: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().positive()),
    content: z.string().max(10000, "Content too long"),
    image_url: z.union([z.string(), z.null()]).optional().transform((val) => (val === "" || val === null) ? undefined : val).pipe(z.string().url().optional()),
    image_name: z.union([z.string(), z.null()]).optional().transform((val) => (val === "" || val === null) ? undefined : val),
    image_size: z.union([z.string(), z.null()]).optional().transform((val) => (val === "" || val === null) ? undefined : val),
    image_dimensions: z.union([z.string(), z.null()]).optional().transform((val) => (val === "" || val === null) ? undefined : val),
    device_id: z.union([z.string(), z.null()]).optional().transform((val) => (val === "" || val === null) ? undefined : val),
    revalidate_path: z.union([z.string(), z.null()]).optional().transform((val) => (val === "" || val === null) ? undefined : val),
}).refine((data) => {
    // Require either content or image
    const hasContent = data.content && data.content.trim().length > 0;
    const hasImage = data.image_url && data.image_name;
    return hasContent || hasImage;
}, {
    message: "Either content or an image is required",
    path: ["content"],
});

export async function createReplyAction(formData: FormData) {
    try {
        // Debug: Log what we're receiving
        console.log("FormData received:", {
            thread_id: formData.get("thread_id"),
            content: formData.get("content"),
            image_url: formData.get("image_url"),
            image_name: formData.get("image_name"),
            image_size: formData.get("image_size"),
            image_dimensions: formData.get("image_dimensions"),
            device_id: formData.get("device_id"),
            revalidate_path: formData.get("revalidate_path"),
        });

        // Parse and validate form data
        const validatedFields = CreateReplySchema.safeParse({
            thread_id: formData.get("thread_id"),
            content: formData.get("content"),
            image_url: formData.get("image_url"),
            image_name: formData.get("image_name"),
            image_size: formData.get("image_size"),
            image_dimensions: formData.get("image_dimensions"),
            device_id: formData.get("device_id"),
            revalidate_path: formData.get("revalidate_path"),
        });

        if (!validatedFields.success) {
            console.log("Validation errors:", validatedFields.error.flatten());

            // Create comprehensive error message from validation errors
            const errors = validatedFields.error.flatten().fieldErrors;
            const errorMessages = Object.entries(errors)
                .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
                .join('; ');

            return {
                error: errorMessages || "Please check your form data and try again.",
                fieldErrors: errors,
            };
        }

        const { thread_id, content, image_url, image_name, image_size, image_dimensions, device_id, revalidate_path } = validatedFields.data;

        try {
            // Get request headers for user identification
            const headersList = await headers();
            const userAgent = headersList.get("user-agent") || "Unknown";
            const forwardedFor = headersList.get("x-forwarded-for");
            const realIp = headersList.get("x-real-ip");

            // Extract IP address (prioritize x-real-ip, then x-forwarded-for, then fallback)
            const ipAddress = realIp ||
                (forwardedFor ? forwardedFor.split(",")[0].trim() : "") ||
                "127.0.0.1";

            // Find or create user based on user agent, IP, and optional device ID
            const user = await findOrCreateUser(userAgent, ipAddress, device_id);

            // Prepare image attachment if provided
            let image: ImageAttachment | undefined;
            if (image_url && image_name) {
                image = {
                    url: image_url,
                    filename: image_name,
                    size: image_size ? parseInt(image_size) : 0,
                    dimensions: image_dimensions || "",
                };
            }

            // If content is empty or just whitespace but image is provided, set generic message
            let finalContent = content?.trim() || "";
            if (!finalContent && image) {
                finalContent = "no text";
            }

            // Create the reply
            const reply = await createReply({
                thread_id,
                content: finalContent,
                image,
                user_hash: user.hash,
            });

            // Revalidate pages that might show this thread/reply
            if (revalidate_path) {
                revalidatePath(revalidate_path);
            }

            return {
                success: true,
                reply: {
                    id: reply.id,
                    thread_id,
                },
            };

        } catch (error) {
            console.error("Error creating reply:", error);

            // Handle specific Next.js server action errors
            if (error instanceof Error) {
                // Check for body size limit exceeded error
                if (error.message.includes('Body exceeded') || error.message.includes('413')) {
                    return {
                        error: "Request is too large. Please try with a smaller image or less content."
                    };
                }
                // Check for database errors
                if (error.message.includes('database') || error.message.includes('SQLITE')) {
                    return {
                        error: "Database error. Please try again."
                    };
                }
            }

            // Check if it's a Next.js server error with statusCode
            if (typeof error === 'object' && error !== null && 'statusCode' in error) {
                const statusCode = (error as any).statusCode;
                if (statusCode === 413) {
                    return {
                        error: "Request is too large. Please try with a smaller image or less content."
                    };
                }
            }

            return {
                error: "Failed to create reply. Please try again.",
            };
        }

    } catch (error) {
        console.error("Fatal error in createReplyAction:", error);

        // Handle Next.js server action fatal errors (like body size limit)
        if (error instanceof Error) {
            if (error.message.includes('Body exceeded') || error.message.includes('413')) {
                return {
                    error: "Request is too large. Please try with a smaller image or less content."
                };
            }
        }

        // Check if it's a Next.js server error with statusCode
        if (typeof error === 'object' && error !== null && 'statusCode' in error) {
            const statusCode = (error as any).statusCode;
            if (statusCode === 413) {
                return {
                    error: "Request is too large. Please try with a smaller image or less content."
                };
            }
        }

        return {
            error: "An unexpected error occurred. Please try again.",
        };
    }
}
