import {pool} from '@utils/db';
import {NextResponse} from 'next/server';
import {DateTime} from 'luxon';

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT id, content, priority, valid_until
            FROM Announcements
            WHERE is_visible = TRUE
              AND (valid_until IS NULL OR valid_until > NOW())
            ORDER BY priority DESC, updated_at DESC;
        `);

        if (result.rows.length === 0) {
            return NextResponse.json({message: 'No announcements available.'}, {status: 404});
        }

        return NextResponse.json(result.rows, {status: 200});
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}

export async function POST(req) {
    try {
        const {content, valid_until, stick} = await req.json();
        if (!content) {
            return NextResponse.json({message: "Missing content"}, {status: 400});
        }

        const createdAt = DateTime.now().setZone('Asia/Shanghai').toFormat("yyyy-MM-dd HH:mm:ss");
        const validUntil = valid_until ? DateTime.fromISO(valid_until).setZone('Asia/Shanghai').toFormat("yyyy-MM-dd HH:mm:ss") : null;

        const result = await pool.query(
            'INSERT INTO announcements (content, valid_until, updated_at, is_visible, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [content, validUntil, createdAt, true, (stick ? 1 : 0)]
        );

        return NextResponse.json(result.rows[0], {status: 201});
    } catch (error) {
        console.error('Error creating announcement:', error);
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
    }
}

export async function PATCH(req) {
    try {
        const {id, content, valid_until, is_stick} = await req.json();
        if (!id) {
            return NextResponse.json({message: "Missing announcement ID"}, {status: 400});
        }

        const validUntilFormatted = valid_until
            ? DateTime.fromISO(valid_until).setZone("Asia/Shanghai").toFormat("yyyy-MM-dd HH:mm:ss")
            : null;

        const result = await pool.query(
            `UPDATE announcements
             SET content = $1,
                 valid_until = $2,
                 priority = $3
             WHERE id = $4 RETURNING *`,
            [content, validUntilFormatted, (is_stick ? 1 : 0), id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({message: "Announcement not found"}, {status: 404});
        }

        return NextResponse.json(result.rows[0], {status: 200});
    } catch (error) {
        console.error("Error modifying announcement:", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}

export async function DELETE(req) {
    try {
        const {id} = await req.json();
        if (!id) {
            return NextResponse.json({message: "Missing announcement ID"}, {status: 400});
        }

        const result = await pool.query(
            'UPDATE announcements SET is_visible = FALSE WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({message: 'Announcement not found'}, {status: 404});
        }

        return NextResponse.json(result.rows[0], {status: 200});
    } catch (error) {
        console.error('Error deleting announcement:', error);
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
    }
}
