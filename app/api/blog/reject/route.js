import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/utils/auth";
import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/models/BlogModel";

const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();


export async function POST(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

 
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can reject blogs" },
        { status: 403 }
      );
    }

    const { blogId, reason } = await request.json();

    if (!blogId) {
      return NextResponse.json(
        { success: false, message: "Blog ID required" },
        { status: 400 }
      );
    }

    const blog = await BlogModel.findById(blogId);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    blog.status = "rejected";
    blog.rejectionReason = reason || "No reason provided";
    await blog.save();

    return NextResponse.json({
      success: true,
      message: "Blog rejected",
    });
  } catch (error) {
    console.error("Reject blog error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}