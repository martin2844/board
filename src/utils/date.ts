import dayjs from "dayjs"

export function formatDate(date: Date | string | number): string {
    const dateObj = dayjs(date)
    const formattedDate = dateObj.format('MM/DD/YY(ddd)HH:mm:ss')
    return formattedDate
}

