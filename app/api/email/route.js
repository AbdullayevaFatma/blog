import { ConnectDB } from "../../../lib/config/db";
import { verifyToken } from "../../../lib/utils/auth";
import EmailModel from "../../../models/EmailModel";
import { NextResponse } from "next/server";

const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();

export async function POST(request) {
  try {
    const formData = await request.formData();
    const email = formData.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 },
      );
    }

    const existingEmail = await EmailModel.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email already subscribed" },
        { status: 409 },
      );
    }

    await EmailModel.create({ email });

    return NextResponse.json(
      {
        success: true,
        message: "Email subscribed successfully!",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Email subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token); 
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden. Admins only." },
        { status: 403 }
      );
    }

    const emails = await EmailModel.find({}).sort({ date: -1 });

    return NextResponse.json({
      success: true,
      emails,
    });
  } catch (error) {
    console.error("Get emails error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}


export async function DELETE(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

 
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden. Admins only." },
        { status: 403 }
      );
    }

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Email ID is required" },
        { status: 400 }
      );
    }

    const deletedEmail = await EmailModel.findByIdAndDelete(id);

    if (!deletedEmail) {
      return NextResponse.json(
        { success: false, message: "Email not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email deleted successfully!",
    });
  } catch (error) {
    console.error("Delete email error:", error);
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}
