import { pool } from '@utils/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const data = await req.json();
    console.log(data);
    const studentIds = data.student_list.map(student => student.id);

    if (!data.id) {
        return NextResponse.json({ error: 'Course ID is required for update' }, { status: 400 });
    }

    try {
        const updateQuery = `
            UPDATE CourseSeries
            SET course_name = COALESCE($2, course_name),
                subject = COALESCE($3, subject),
                year = COALESCE($4, year),
                season = COALESCE($5, season),
                student_list = COALESCE($6, student_list)
            WHERE id = $1
            RETURNING *
        `;

        const updatedCourse = await pool.query(updateQuery, [data.id, data.cName, data.cSubject, data.cYear, data.cSeason, JSON.stringify(studentIds)]);

        if (updatedCourse.rows.length === 0) {
            return NextResponse.json({ error: 'Course not found or no changes made' }, { status: 404 });
        }

        return NextResponse.json(updatedCourse.rows[0], { status: 200 });
    } catch (error) {
        console.error('Database error:', error);

        return NextResponse.json(
            { error: 'Failed to update course data' },
            { status: 500 }
        );
    }
}
