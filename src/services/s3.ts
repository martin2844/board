import { S3Client, PutObjectCommand, ObjectCannedACL, HeadBucketCommand, CreateBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';

interface UploadOptions {
    key: string;
    body: Buffer | Blob;
    contentType?: string;
    bucket?: string;
    isPublic?: boolean;
}

// Default bucket name - can be overridden in individual upload functions
const DEFAULT_BUCKET = 'threads';

// S3 credentials from environment variables - using MinIO endpoint
const S3_USERNAME = process.env.S3_USERNAME || 'H95UBfmFRaK3vEVi';
const S3_PASSWORD = process.env.S3_PASSWORD || 'lGz8RUua2y2RpPrVXg9n5fKFr43vWag6';
// Update endpoint to point to MinIO directly for operations
const S3_URL = process.env.S3_URL || 'https://minio.c5h.dev/';
// Use a publicly accessible URL for accessing the files
const S3_PUBLIC_URL = process.env.S3_PUBLIC_URL || 'https://s3.c5h.dev/';

// Create an S3 client with the provided credentials (for SDK operations)
const s3Client = new S3Client({
    endpoint: S3_URL,
    region: 'auto', // or your specific region if required
    credentials: {
        accessKeyId: S3_USERNAME,
        secretAccessKey: S3_PASSWORD,
    },
    forcePathStyle: true, // Required for S3-compatible services like MinIO
});

/**
 * Checks if a bucket exists, creates it if it doesn't.
 * For the 'avatars' and 'threads' buckets, also sets up public read permissions.
 */
async function ensureBucketExists(bucketName: string): Promise<void> {
    try {
        // Check if bucket exists
        await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
        // Bucket exists, no need to create it
        console.log(`Bucket '${bucketName}' already exists`);
    } catch (error: any) {
        // If bucket doesn't exist, create it
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
            console.log(`Bucket '${bucketName}' not found, creating it...`);

            try {
                await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
                console.log(`Created bucket '${bucketName}'`);

                // Set public-read policy for avatars and threads buckets
                if (bucketName === 'avatars' || bucketName === 'threads') {
                    const publicPolicy = {
                        Version: "2012-10-17",
                        Statement: [
                            {
                                Effect: "Allow",
                                Principal: "*",
                                Action: ["s3:GetObject"],
                                Resource: [`arn:aws:s3:::${bucketName}/*`]
                            }
                        ]
                    };

                    await s3Client.send(
                        new PutBucketPolicyCommand({
                            Bucket: bucketName,
                            Policy: JSON.stringify(publicPolicy)
                        })
                    );
                    console.log(`Set public-read policy on bucket '${bucketName}'`);
                }
            } catch (createError) {
                console.error(`Error creating bucket '${bucketName}':`, createError);
                throw createError;
            }
        } else {
            // Some other error occurred
            console.error(`Error checking bucket '${bucketName}':`, error);
            throw error;
        }
    }
}

/**
 * Base function to upload a file to S3
 * Uses AWS SDK which works well with MinIO
 */
export async function uploadToS3({
    key,
    body,
    contentType = 'application/octet-stream',
    bucket = DEFAULT_BUCKET,
    isPublic = false,
}: UploadOptions): Promise<string> {
    try {
        // Ensure bucket exists before uploading
        await ensureBucketExists(bucket);

        // Use AWS SDK for MinIO (which is fully S3 compatible)
        const params = {
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
            ACL: isPublic ? 'public-read' as ObjectCannedACL : 'private' as ObjectCannedACL,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        // Return the URL to the uploaded object with proper path formatting
        let baseUrl = S3_PUBLIC_URL;
        // Ensure the base URL ends with a slash
        if (!baseUrl.endsWith('/')) {
            baseUrl += '/';
        }
        return `${baseUrl}${bucket}/${key}`;
    } catch (error: unknown) {
        console.error('Error uploading to S3:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to upload file to S3: ${errorMessage}`);
    }
}