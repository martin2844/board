export function formatDate(date: Date): string {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
        return (
            date.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "2-digit",
            }) +
            "(" +
            date.toLocaleDateString("en-US", { weekday: "short" }) +
            ")" +
            date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            })
        )
    }

    return (
        date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
        }) +
        "(" +
        date.toLocaleDateString("en-US", { weekday: "short" }) +
        ")" +
        date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        })
    )
}

