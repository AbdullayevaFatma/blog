import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db";
import BlogModel from "@/models/Blog";
import jwt from "jsonwebtoken";
import DOMPurify from "isomorphic-dompurify";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await ConnectDB();

  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Title and description are required" },
        { status: 400 }
      );
    }

    const cleanDescription = DOMPurify.sanitize(description);

    const blog = await BlogModel.create({
      title: title.trim(),
      description: cleanDescription,
      author: decoded.id,
    });

 
    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
        blog,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Blog creation failed",
      },
      { status: 500 }
    );
  }
}
