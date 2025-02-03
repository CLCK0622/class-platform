import { pool } from '@utils/db';
import { NextResponse } from 'next/server';
import { DateTime } from 'luxon';

export async function POST(req) {
    const { content, valid_until, stick } = await req.json();

    if (!content) {
        return NextResponse.json({ message: "Missing content or valid_until" }, { status: 400 });
    }

    try {
        const createdAt = DateTime.now().setZone('Asia/Shanghai').toFormat("yyyy-MM-dd HH:mm:ss");
        const validUntil = DateTime.fromISO(valid_until).setZone('Asia/Shanghai').toFormat("yyyy-MM-dd HH:mm:ss");

        let result = null;

        if (valid_until) {
            result = await pool.query(
                'INSERT INTO announcements (content, valid_until, updated_at, is_visible, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [content, validUntil, createdAt, true, (stick ? 1 : 0)]
            );
        } else {
            result = await pool.query(
                'INSERT INTO announcements (content, updated_at, is_visible, priority) VALUES ($1, $2, $3, $4) RETURNING *',
                [content, createdAt, true, (stick ? 1 : 0)]
            );
        }

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error creating announcement:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
