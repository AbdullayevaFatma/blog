import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
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
        { status: 400 }
      );
    }

 
    const existingEmail = await EmailModel.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email already subscribed" },
        { status: 409 }
      );
    }

    await EmailModel.create({ email });

    return NextResponse.json({
      success: true,
      message: "Email Subscribed",
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  const emails = await EmailModel.find({});
  return NextResponse.json({ emails });
}
export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get("id");
  await EmailModel.findByIdAndDelete(id);
  return NextResponse.json({ success: true, message: "Email deleted!" });
}
