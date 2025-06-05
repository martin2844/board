import { NextRequest } from "next/server";

export function verifyAdminAuth(request: NextRequest): boolean {
    const header = request.headers.get("authorization");
    const token = process.env.ADMIN_TOKEN;
    if (!token || !header) return false;
    const [scheme, value] = header.split(" ");
    if (scheme !== "Bearer" || value !== token) return false;
    return true;
}
