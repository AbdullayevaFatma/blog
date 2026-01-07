import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ConnectDB } from "@/lib/config/db";
import UserModel from "@/models/UserModel";
import { writeFile } from "fs/promises";
import fs from "fs";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await ConnectDB();
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      console.log("🔴 BACKEND /user/avatar: Token yok");
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login." },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("🟢 BACKEND /user/avatar: Token valid for", decoded.name);
    } catch (error) {
      console.log("🔴 BACKEND /user/avatar: Token invalid");
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
      console.log("🔴 BACKEND /user/avatar: User not found");
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (user.avatar && user.avatar !== "/profile_icon.jpg") {
      try {
        fs.unlinkSync(`./public${user.avatar}`);
        console.log("🟢 BACKEND /user/avatar: Old avatar deleted");
      } catch (err) {
        console.log(
          "⚠️ BACKEND /user/avatar: Old avatar delete warning:",
          err.message,
        );
      }
    }

    const timeStamp = Date.now();
    const avatarBuffer = Buffer.from(await avatar.arrayBuffer());
    const avatarPath = `./public/${timeStamp}_avatar_${avatar.name}`;
    await writeFile(avatarPath, avatarBuffer);
    const avatarUrl = `/${timeStamp}_avatar_${avatar.name}`;

    console.log("🟢 BACKEND /user/avatar: New avatar saved:", avatarUrl);

    user.avatar = avatarUrl;
    await user.save();

    console.log("🟢 BACKEND /user/avatar: Avatar updated in database");

    return NextResponse.json({
      success: true,
      message: "Avatar updated successfully!",
      avatar: avatarUrl,
    });
  } catch (error) {
    console.error("🔴 BACKEND /user/avatar: Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update avatar" },
      { status: 500 },
    );
  }
}
