import { MetadataRoute } from 'next'
import db from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 1,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ]

    try {
        // Get all threads from database
        const threads = await db('threads')
            .select('id', 'updated_at', 'created_at')
            .orderBy('updated_at', 'desc')

        // Generate thread URLs
        const threadUrls: MetadataRoute.Sitemap = threads.map((thread) => ({
            url: `${baseUrl}/thread/${thread.id}`,
            lastModified: new Date(thread.updated_at || thread.created_at),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))

        return [...staticPages, ...threadUrls]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        // Return static pages only if database fails
        return staticPages
    }
} 