import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getThreadWithReplies, updateThread, deleteThread } from "@/services/thread";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    if (!verifyAdminAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = parseInt(params.id, 10);
    const thread = await getThreadWithReplies(id);
    if (!thread) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, thread });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    if (!verifyAdminAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = parseInt(params.id, 10);
    const body = await request.json();
    await updateThread(id, body);
    const thread = await getThreadWithReplies(id);
    return NextResponse.json({ success: true, thread });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    if (!verifyAdminAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = parseInt(params.id, 10);
    await deleteThread(id);
    return NextResponse.json({ success: true });
}
