export type ImageAttachment = {
    filename: string
    url: string
    size: number
    dimensions: string
}

export type Reply = {
    id: number
    content: string
    createdAt: Date
    image?: ImageAttachment
}

export type Thread = {
    id: number
    subject: string
    content: string
    createdAt: Date
    image?: ImageAttachment
    user_hash: string
    replies: Reply[]
}

export type PaginatedThreads = {
    threads: Thread[]
    currentPage: number
    totalPages: number
    totalCount: number
}

export type PaginatedReplies = {
    replies: Reply[]
    currentPage: number
    totalPages: number
    totalCount: number
}
