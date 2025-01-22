import { pool } from "@/utils/db";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return new Response(JSON.stringify({ error: "User ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
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

        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Database query failed:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
