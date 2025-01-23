import { pool } from '@utils/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { id } = await params;

    try {
        const courseQuery = `
      SELECT * FROM CourseSeries WHERE id = $1
    `;
        const lessonsQuery = `
      SELECT * FROM Lessons WHERE course_series_id = $1 ORDER BY date, start_time
    `;
        const course = await pool.query(courseQuery, [id]);
        const lessons = await pool.query(lessonsQuery, [id]);

        if (!course.rows[0]) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json(
            {
                course: course.rows[0],
                lessons: lessons.rows
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Database error:', error);

        return NextResponse.json(
            { error: 'Failed to fetch course data' },
            { status: 500 }
        );
    }
}
