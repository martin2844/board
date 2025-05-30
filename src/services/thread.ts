import type { Thread, PaginatedThreads } from "@/types/thread"
import db from "@/lib/db"

export async function getThreads(page: number = 1, perPage: number = 10): Promise<PaginatedThreads> {
    const offset = (page - 1) * perPage;

    // First get the total count of threads for pagination
    const totalCountResult = await db('threads').count('* as count').first();
    const totalCount = totalCountResult?.count as number || 0;
    const totalPages = Math.ceil(totalCount / perPage);

    // Get threads with their replies using LEFT JOIN
    const results = await db('threads as t')
        .leftJoin('replies as r', 't.id', 'r.thread_id')
        .select(
            't.id as thread_id',
            't.subject',
            't.content as thread_content',
            't.created_at as thread_created_at',
            't.user_hash',
            't.image_url as thread_image_url',
            't.image_name as thread_image_name',
            't.image_size as thread_image_size',
            't.image_dimensions as thread_image_dimensions',
            'r.id as reply_id',
            'r.content as reply_content',
            'r.created_at as reply_created_at',
            'r.image_url as reply_image_url',
            'r.image_name as reply_image_name',
            'r.image_size as reply_image_size',
            'r.image_dimensions as reply_image_dimensions'
        )
        .orderBy('t.created_at', 'desc')
        .orderBy('r.created_at', 'asc')
        .limit(perPage * 50) // Generous limit to account for replies
        .offset(offset);

    // Group results by thread
    const threadsMap = new Map<number, Thread>();

    results.forEach(row => {
        // Create or get thread
        if (!threadsMap.has(row.thread_id)) {
            const threadImage = row.thread_image_url ? {
                filename: row.thread_image_name,
                url: row.thread_image_url,
                size: row.thread_image_size,
                dimensions: row.thread_image_dimensions,
            } : undefined;

            threadsMap.set(row.thread_id, {
                id: row.thread_id,
                subject: row.subject,
                content: row.thread_content,
                createdAt: new Date(row.thread_created_at),
                user_hash: row.user_hash,
                image: threadImage,
                replies: [],
            });
        }

        // Add reply if it exists
        if (row.reply_id) {
            const thread = threadsMap.get(row.thread_id)!;
            const replyImage = row.reply_image_url ? {
                filename: row.reply_image_name,
                url: row.reply_image_url,
                size: row.reply_image_size,
                dimensions: row.reply_image_dimensions,
            } : undefined;

            thread.replies.push({
                id: row.reply_id,
                content: row.reply_content,
                createdAt: new Date(row.reply_created_at),
                image: replyImage,
            });
        }
    });

    // Convert map to array and ensure we only return the requested number of threads
    const threads = Array.from(threadsMap.values()).slice(0, perPage);

    return {
        threads,
        currentPage: page,
        totalPages,
        totalCount
    };
}

export function getThread(id: number): Promise<Thread | undefined> {
    return db('threads').where('id', id).first()
}

export async function getThreadWithReplies(id: number): Promise<Thread | null> {
    // Get thread with its replies using LEFT JOIN
    const results = await db('threads as t')
        .leftJoin('replies as r', 't.id', 'r.thread_id')
        .select(
            't.id as thread_id',
            't.subject',
            't.content as thread_content',
            't.created_at as thread_created_at',
            't.user_hash',
            't.image_url as thread_image_url',
            't.image_name as thread_image_name',
            't.image_size as thread_image_size',
            't.image_dimensions as thread_image_dimensions',
            'r.id as reply_id',
            'r.content as reply_content',
            'r.created_at as reply_created_at',
            'r.image_url as reply_image_url',
            'r.image_name as reply_image_name',
            'r.image_size as reply_image_size',
            'r.image_dimensions as reply_image_dimensions'
        )
        .where('t.id', id)
        .orderBy('r.created_at', 'asc');

    if (results.length === 0) {
        return null;
    }

    // Build the thread with replies
    const firstRow = results[0];
    const threadImage = firstRow.thread_image_url ? {
        filename: firstRow.thread_image_name,
        url: firstRow.thread_image_url,
        size: firstRow.thread_image_size,
        dimensions: firstRow.thread_image_dimensions,
    } : undefined;

    const thread: Thread = {
        id: firstRow.thread_id,
        subject: firstRow.subject,
        content: firstRow.thread_content,
        createdAt: new Date(firstRow.thread_created_at),
        user_hash: firstRow.user_hash,
        image: threadImage,
        replies: [],
    };

    // Add all replies
    results.forEach(row => {
        if (row.reply_id) {
            const replyImage = row.reply_image_url ? {
                filename: row.reply_image_name,
                url: row.reply_image_url,
                size: row.reply_image_size,
                dimensions: row.reply_image_dimensions,
            } : undefined;

            thread.replies.push({
                id: row.reply_id,
                content: row.reply_content,
                createdAt: new Date(row.reply_created_at),
                image: replyImage,
            });
        }
    });

    return thread;
}

export function createThread(thread: Thread) {
    return db('threads').insert({
        subject: thread.subject,
        content: thread.content,
        image_url: thread.image?.url,
        image_name: thread.image?.filename,
        image_size: thread.image?.size,
        image_dimensions: thread.image?.dimensions,
        user_hash: thread.user_hash,
    })
}