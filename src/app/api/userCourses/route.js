import { pool } from "@/utils/db";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const query = `
            SELECT L.id, L.date, L.start_time, L.duration, L.status, CS.course_name, CS.subject, CS.teacher_id
            FROM Lessons L
            JOIN CourseSeries CS ON L.course_series_id = CS.id
            WHERE L.student_list @> $1
            ORDER BY L.date DESC, L.start_time DESC;
        `;
        const result = await pool.query(query, [JSON.stringify([parseInt(userId)])]);

        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
