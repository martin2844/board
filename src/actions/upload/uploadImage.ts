"use server";

import { uploadToS3 } from "@/services/s3";
import sharp from "sharp";

interface UploadImageResult {
    success: boolean;
    url?: string;
    filename?: string;
    size?: number;
    dimensions?: string;
    error?: string;
}

export async function uploadImageAction(formData: FormData): Promise<UploadImageResult> {
    try {
        const file = formData.get("file") as File;

        if (!file || file.size === 0) {
            return {
                success: false,
                error: "No file provided"
            };
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return {
                success: false,
                error: "File must be an image (JPG, PNG, GIF, WebP, etc.)"
            };
        }

        // Validate file size (max 1MB for original file)
        const maxSize = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
            return {
                success: false,
                error: `File is too large (${fileSizeMB}MB). Please choose an image under 1MB.`
            };
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Check if it's a GIF to preserve animation
        const isGif = file.type === 'image/gif';

        let processedImage: Buffer;
        let contentType: string;
        let fileExtension: string;
        let displayFilename: string;

        if (isGif) {
            // For GIFs, only resize but keep the GIF format to preserve animation
            processedImage = await sharp(buffer, { animated: true })
                .resize({
                    width: 1200,
                    height: 1200,
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .gif()
                .toBuffer();

            contentType = 'image/gif';
            fileExtension = 'gif';
            displayFilename = file.name; // Keep original filename for GIFs
        } else {
            // For other formats, convert to WebP for better compression
            processedImage = await sharp(buffer)
                .resize({
                    width: 1200,
                    height: 1200,
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({
                    quality: 80,
                    effort: 4
                })
                .toBuffer();

            contentType = 'image/webp';
            fileExtension = 'webp';
            const originalName = file.name.split('.')[0];
            displayFilename = `${originalName}.webp`;
        }

        // Get metadata of the processed image
        const metadata = await sharp(processedImage).metadata();
        const dimensions = `${metadata.width}x${metadata.height}`;

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const key = `images/${timestamp}_${randomString}.${fileExtension}`;

        // Upload processed image to S3
        const url = await uploadToS3({
            key,
            body: processedImage,
            contentType: contentType,
            bucket: 'threads',
            isPublic: true,
        });

        return {
            success: true,
            url,
            filename: displayFilename,
            size: processedImage.length, // Size of processed image
            dimensions,
        };

    } catch (error) {
        console.error("Error uploading image:", error);

        // Handle specific Next.js server action errors
        if (error instanceof Error) {
            // Check for body size limit exceeded error
            if (error.message.includes('Body exceeded') || error.message.includes('413')) {
                return {
                    success: false,
                    error: "File is too large. Please choose an image under 1MB."
                };
            }
            // Check for invalid image errors
            if (error.message.includes('Invalid image') || error.message.includes('Input buffer')) {
                return {
                    success: false,
                    error: "Invalid image file. Please try a different image."
                };
            }
            // Check for S3 upload errors
            if (error.message.includes('S3') || error.message.includes('upload')) {
                return {
                    success: false,
                    error: "Failed to upload image to storage. Please try again."
                };
            }
        }

        // Check if it's a Next.js server error with statusCode
        if (typeof error === 'object' && error !== null && 'statusCode' in error) {
            const statusCode = (error as any).statusCode;
            if (statusCode === 413) {
                return {
                    success: false,
                    error: "File is too large. Please choose an image under 1MB."
                };
            }
        }

        return {
            success: false,
            error: "Failed to upload image. Please try again with a smaller file."
        };
    }
}
