import { Thread } from '@/types/thread'
import React from 'react'
import Threads from '../Threads/Threads'
import { Pagination } from '../Pagination/Pagination'
import { NewThreadForm } from '../NewThread/NewThread'

export default function ThreadPage({ threads, currentPage, totalPages }: { threads: Thread[], currentPage: number, totalPages: number }) {
    return (
        <div>
            <NewThreadForm />
            <Threads threads={threads} />
            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
    )
}
