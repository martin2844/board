import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getThreads, createThread } from "@/services/thread";

export async function GET(request: NextRequest) {
    if (!verifyAdminAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
    const threads = await getThreads(page, limit);
    return NextResponse.json({ success: true, ...threads });
}

export async function POST(request: NextRequest) {
    if (!verifyAdminAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const thread = await createThread({
        subject: body.subject,
        content: body.content || "",
        image: body.image,
        user_hash: body.user_hash || "admin",
    });
    return NextResponse.json({ success: true, thread });
}
