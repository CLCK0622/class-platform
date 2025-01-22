import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "@utils/db";

export async function POST(req) {

    console.log("Logging in...");
    const { username, password } = await req.json();
    console.log("Parsed data:", { username, password });

    if (!username || !password) {
        return NextResponse.json({ error: "请填写全部信息！" }, { status: 400 });
    }

    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rowCount === 0) {
            return NextResponse.json({ error: "未找到用户，请先注册。" }, { status: 401 });
        }

        const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!isValidPassword) {
            return NextResponse.json({ error: "用户名或密码错误。" }, { status: 401 });
        }

        const token = jwt.sign(
            { id: user.rows[0].id, username: user.rows[0].username, email: user.rows[0].email, avatar_url: user.rows[0].avatar_url },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return NextResponse.json({ token, avatar_url: user.rows[0].avatar_url });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
