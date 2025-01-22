import { pool } from '@utils/db';
import { NextResponse } from 'next/server';

export async function GET(res) {
    try {
        const result = await pool.query(`
            SELECT id, content, priority, valid_until
            FROM Announcements
            WHERE is_visible = TRUE
              AND (valid_until IS NULL OR valid_until > NOW())
            ORDER BY priority DESC, updated_at DESC;
        `);

        if (result.rows.length === 0) {
            return NextResponse.json({ message: 'No announcements available.' }, { status: 404 });
        }

        const announcement = result.rows;
        return NextResponse.json(announcement, { status: 200 });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
