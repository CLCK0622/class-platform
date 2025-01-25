import { pool } from "@/utils/db";
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const query = `
            SELECT CS.id, CS.course_name, CS.subject, CS.year, CS.season, U.username AS teacher_name
            FROM CourseSeries CS
            JOIN Users U ON CS.teacher_id = U.id
            ORDER BY CS.year DESC, CS.season DESC;
        `;

        const result = await pool.query(query);

        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error("Database query failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
