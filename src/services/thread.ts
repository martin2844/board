import type { Thread } from "@/types/thread"
import db from "@/lib/db"

const mockThreads: Thread[] = [
    {
        id: 8103257,
        subject: "Animation scenery wallpaper",
        content: "Post your favorite animated scenery wallpapers. I'll start with this beautiful castle scene.",
        createdAt: new Date("2025-05-15T18:10:22"),
        image: {
            filename: "Cliffside-Tower.png",
            url: "/placeholder.svg?height=300&width=400",
            size: 2190000,
            dimensions: "1920x1080",
        },
        replies: [
            {
                id: 8103406,
                content: "Very nice OP, but it would be better if these were labelled.",
                createdAt: new Date("2025-05-16T05:54:08"),
                image: {
                    filename: "the_port_of_hort.jpg",
                    url: "/placeholder.svg?height=200&width=300",
                    size: 442000,
                    dimensions: "1920x1038",
                },
            },
        ],
    },
    {
        id: 8103433,
        subject: "Landscape Photography",
        content: "Share your best landscape shots. Nature is beautiful.",
        createdAt: new Date("2025-05-16T14:38:11"),
        image: {
            filename: "17316266990710.jpg",
            url: "/placeholder.svg?height=250&width=350",
            size: 2060000,
            dimensions: "3840x2160",
        },
        replies: [],
    },
    {
        id: 8103434,
        subject: "Forest Vibes",
        content: "Deep forest photography thread. Post your most atmospheric forest pics.",
        createdAt: new Date("2025-05-16T14:39:57"),
        image: {
            filename: "17275138403119.jpg",
            url: "/placeholder.svg?height=250&width=350",
            size: 652000,
            dimensions: "1920x1080",
        },
        replies: [],
    },
    {
        id: 8103440,
        subject: "Mountain Peaks",
        content: "High altitude photography. The view from the top is always worth it.",
        createdAt: new Date("2025-05-16T17:35:16"),
        image: {
            filename: "16354654654.jpg",
            url: "/placeholder.svg?height=250&width=350",
            size: 664000,
            dimensions: "4096x1743",
        },
        replies: [],
    },
    {
        id: 8104549,
        subject: "Cozy Places",
        content: `Cozy places you would snuggle with someone you love
>cool/darker colors
>comfy/peaceful setting
>sense of privacy
>nothing else besides you matters in the world`,
        createdAt: new Date("2025-05-25T18:51:56"),
        image: {
            filename: "heidi_-_girl_of_the_alps_(...).png",
            url: "/placeholder.svg?height=250&width=350",
            size: 4090000,
            dimensions: "2880x2160",
        },
        replies: [
            {
                id: 8104550,
                content: ">>8101327\nlmaooo",
                createdAt: new Date("2025-05-25T21:18:00"),
            },
        ],
    },
    {
        id: 8092299,
        subject: "Cyberpunk Aesthetics",
        content: `Cozy places you would snuggle with someone you love
>cool/darker colors
>comfy/peaceful setting  
>sense of privacy
>nothing else besides you matters in the world`,
        createdAt: new Date("2025-01-01T02:56:17"),
        image: {
            filename: "cozy.png",
            url: "/placeholder.svg?height=250&width=350",
            size: 3000000,
            dimensions: "2194x1226",
        },
        replies: [
            {
                id: 8092301,
                content: "This is exactly what I needed today. Thanks OP.",
                createdAt: new Date("2025-01-01T03:15:22"),
            },
            {
                id: 8092305,
                content: "More like this please! The lighting is perfect.",
                createdAt: new Date("2025-01-01T03:45:11"),
            },
        ],
    },
]

export function getThreads(page = 1, perPage = 10) {
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const threads = mockThreads.slice(startIndex, endIndex)
    const totalPages = Math.ceil(mockThreads.length / perPage)

    return { threads, totalPages }
}

export function getThread(id: number): Thread | undefined {
    return mockThreads.find((thread) => thread.id === id)
}

export function createThread(thread: Thread) {
    return db.thread.create({
        data: thread,
    })
}