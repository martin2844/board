import { User } from "./user";

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
    author: User;
    replies: Reply[]
}
