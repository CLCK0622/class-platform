import { pool } from '@/utils/db';
import { NextResponse } from 'next/server';

export async function GET(res) {
  try {
    const query = 'SELECT id, username FROM Users WHERE role = $1';
    const { rows } = await pool.query(query, ['student']);
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
