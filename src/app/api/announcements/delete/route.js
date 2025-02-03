import { pool } from '@utils/db';
import { NextResponse } from 'next/server';
import { DateTime } from 'luxon';

export async function PATCH(req) {
    const { id } = await req.json();

    if (!id) {
        return NextResponse.json({ message: "Missing announcement id" }, { status: 400 });
    }

    try {
        console.log(DateTime.now().setZone('Asia/Shanghai').toFormat("yyyy-MM-dd HH:mm:ss"));

        const result = await pool.query(
            'UPDATE announcements SET is_visible = $1 WHERE id = $2 RETURNING *',
            [false, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
