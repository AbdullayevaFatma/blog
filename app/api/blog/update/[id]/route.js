import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/models/BlogModel";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function PATCH(req, { params }) {
  await ConnectDB();
  const {id} = await params

  try {

    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

 
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const image = formData.get("image"); 


    const blog = await BlogModel.findById(id);
    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    if (blog.userId.toString() !== decoded.id)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });


    blog.title = title ?? blog.title;
    blog.description = description ?? blog.description;
    blog.category = category ?? blog.category;

    if (image && image.size > 0) {
   
      if (blog.image) {
        try {
          await fs.unlink(`./public${blog.image}`);
        } catch (err) {
          console.warn("Old image delete failed:", err.message);
        }
      }

      const buffer = Buffer.from(await image.arrayBuffer());
      const timeStamp = Date.now();
      const imgPath = `./public/${timeStamp}_${image.name}`;
      await fs.writeFile(imgPath, buffer);
      blog.image = `/${timeStamp}_${image.name}`;
    }

    await blog.save();

    return NextResponse.json({ success: true, message: "Blog updated", blog });
  } catch (err) {
    console.error("Blog update error:", err);
    return NextResponse.json({ message: err.message || "Update failed" }, { status: 500 });
  }
}
