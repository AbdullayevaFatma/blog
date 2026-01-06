import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db";
import BlogModel from "@/models/Blog";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req) {
  await ConnectDB();

  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ blogs: [] });

    const decoded = jwt.verify(token, JWT_SECRET);
    const blogs = await BlogModel.find({ author: decoded.id }).sort({ createdAt: -1 });

    return NextResponse.json({ blogs });
  } catch {
    return NextResponse.json({ blogs: [] });
  }
}
