import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db";
import BlogModel from "@/models/Blog";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req) {
  await ConnectDB();

  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { title, content } = await req.json();

    if (!title || !content)
      return NextResponse.json({ message: "Title and content required" }, { status: 400 });

    const blog = await BlogModel.create({
      title,
      content,
      author: decoded.id,
    });

    return NextResponse.json({ message: "Blog created", blog });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Blog creation failed" }, { status: 500 });
  }
}
