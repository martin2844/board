export interface ImageAttachment {
    filename: string
    url: string
    size: number
    dimensions: string
}

export interface Reply {
    id: number
    content: string
    createdAt: Date
    image?: ImageAttachment
}

export interface Thread {
    id: number
    subject: string
    content: string
    createdAt: Date
    image?: ImageAttachment
    replies: Reply[]
}
