import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db";
import BlogModel from "@/models/Blog";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function PATCH(req, { params }) {
  await ConnectDB();

  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { title, content, published } = await req.json();

    const blog = await BlogModel.findById(params.id);
    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    if (blog.author.toString() !== decoded.id)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    blog.title = title ?? blog.title;
    blog.content = content ?? blog.content;
    if (published !== undefined) blog.published = published;

    await blog.save();

    return NextResponse.json({ message: "Blog updated", blog });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Update failed" }, { status: 500 });
  }
}
