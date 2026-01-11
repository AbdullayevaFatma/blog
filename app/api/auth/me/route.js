import { ConnectDB } from "lib/config/db";
import { verifyToken } from "lib/utils/auth";
import UserModel from "models/UserModel";
import { NextResponse } from "next/server";


const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    await ConnectDB();

    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
