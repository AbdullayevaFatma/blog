import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db";
import BlogModel from "@/models/Blog";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function DELETE(req, { params }) {
  await ConnectDB();

  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);

    const blog = await BlogModel.findById(params.id);
    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    if (blog.author.toString() !== decoded.id)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    await blog.remove();
    return NextResponse.json({ message: "Blog deleted" });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Delete failed" }, { status: 500 });
  }
}
