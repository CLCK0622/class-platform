import { pool } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
        const query = `
            SELECT CS.id, CS.course_name, CS.subject, CS.year, CS.season, U.username AS teacher_name
            FROM CourseSeries CS
            JOIN Users U ON CS.teacher_id = U.id
            WHERE CS.student_list @> $1::jsonb
            ORDER BY CS.year DESC, CS.season DESC;
        `;

        const result = await pool.query(query, [parseInt(userId)]);

        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
