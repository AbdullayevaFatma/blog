import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ConnectDB } from "@/lib/config/db";
import UserModel from "@/models/UserModel";
import { writeFile } from "fs/promises";
import fs from "fs";
import { verifyToken } from "@/lib/utils/auth";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await ConnectDB();
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login." },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token)
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const avatar = formData.get("avatar");

    if (!avatar) {
      return NextResponse.json(
        { success: false, message: "Avatar file is required" },
        { status: 400 },
      );
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (user.avatar && user.avatar !== "/profile_icon.jpg") {
      try {
        fs.unlinkSync(`./public${user.avatar}`);
      } catch (err) {}
    }

    const timeStamp = Date.now();
    const avatarBuffer = Buffer.from(await avatar.arrayBuffer());
    const avatarPath = `./public/${timeStamp}_avatar_${avatar.name}`;
    await writeFile(avatarPath, avatarBuffer);
    const avatarUrl = `/${timeStamp}_avatar_${avatar.name}`;

    user.avatar = avatarUrl;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Avatar updated successfully!",
      avatar: avatarUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update avatar" },
      { status: 500 },
    );
  }
}
