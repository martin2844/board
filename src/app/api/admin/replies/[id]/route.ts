import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/adminAuth";
import { getReply, updateReply, deleteReply } from "@/services/thread";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    if (!verifyAdminAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = parseInt(params.id, 10);
    const reply = await getReply(id);
    if (!reply) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, reply });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    if (!verifyAdminAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = parseInt(params.id, 10);
    const body = await request.json();
    await updateReply(id, body);
    const reply = await getReply(id);
    return NextResponse.json({ success: true, reply });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    if (!verifyAdminAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = parseInt(params.id, 10);
    await deleteReply(id);
    return NextResponse.json({ success: true });
}
