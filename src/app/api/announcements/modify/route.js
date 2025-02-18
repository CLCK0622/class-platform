import { pool } from '@utils/db';
import { NextResponse } from 'next/server';
import { DateTime } from 'luxon';

export async function PATCH(req) {
    try {
        const { id, content, valid_until, is_stick } = await req.json();

        if (!id || !content || valid_until === undefined || is_stick === undefined) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const validUntilFormatted = valid_until
            ? DateTime.fromISO(valid_until).setZone("Asia/Shanghai").toFormat("yyyy-MM-dd HH:mm:ss")
            : null;

        const result = await pool.query(
            `UPDATE announcements 
             SET content = $1, valid_until = $2, priority = $3 
             WHERE id = $4 RETURNING *`,
            [content, validUntilFormatted, (is_stick ? 1 : 0), id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ message: "Announcement not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
        console.error("Error modifying announcement:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
