import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { pool } from "@/utils/db";

export async function POST(req) {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
        return NextResponse.json({ error: "请填写全部信息！" }, { status: 400 });
    }

    const emailExp = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.(?:[a-zA-Z]{2}|com|org|net|gov|mil|edu|top|info)$/;

    if (!emailExp.test(email)) {
        return NextResponse.json({ error: "请输入有效的邮箱地址。" }, { status: 400 });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
            [username, email, hashedPassword]
        );

        return NextResponse.json({ message: "用户注册成功！" }, { status: 201 });
    } catch (error) {
        if (error.code === "23505") {
            return NextResponse.json({ error: "用户名或邮箱已经存在。" }, { status: 400 });
        } else {
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }
}
