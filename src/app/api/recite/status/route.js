import { pool } from '@utils/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { user, book_id } = await req.json();

    if (!user || !user.id || !book_id) {
        return NextResponse.json({
            error: "缺少用户信息或词书 ID"
        }, { status: 400 });
    }

    try {
        const query = `
            WITH NewWords AS (
                SELECT COUNT(*) AS total,
                       SUM(CASE WHEN status > 0 THEN 1 ELSE 0 END) AS learned
                FROM UserWordProgress
                WHERE user_id = $1 AND book_id = $2 AND status = 0
            ),
                 ReviewWords AS (
                     SELECT COUNT(*) AS total,
                            SUM(CASE WHEN status = 1 AND next_review <= NOW() THEN 1 ELSE 0 END) AS reviewed
                     FROM UserWordProgress
                     WHERE user_id = $1 AND book_id = $2 AND status = 1
                 )
            SELECT n.total AS new_words_total, n.learned AS new_words_learned,
                   r.total AS review_words_total, r.reviewed AS review_words_reviewed
            FROM NewWords n, ReviewWords r;
        `;

        const { rows } = await pool.query(query, [user.id, book_id]);

        if (rows.length > 0) {
            const { new_words_total, new_words_learned, review_words_total, review_words_reviewed } = rows[0];
            return NextResponse.json({
                new_words_total,
                new_words_learned,
                review_words_total,
                review_words_reviewed
            });
        } else {
            return NextResponse.json({
                error: "没有找到该用户的进度数据"
            }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
