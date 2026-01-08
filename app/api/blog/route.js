import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/models/BlogModel";
import { writeFile } from "fs/promises";
import fs from "fs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/utils/auth";

const JWT_SECRET = process.env.JWT_SECRET;


const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();


export async function GET(request) {
  try {
    const blogId = request.nextUrl.searchParams.get("id");
    const mine = request.nextUrl.searchParams.get("mine");

    if (blogId) {
      const blog = await BlogModel.findById(blogId).lean();
      if (!blog) {
        return NextResponse.json(
          { success: false, blog: null, message: "Blog not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        blog: sanitizeBlog(blog),
      });
    }

    if (mine === "true") {
      const token = request.cookies.get("auth_token")?.value;
      if (!token) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);

      let blogs;
      if (decoded.role === "admin") {
      
        blogs = await BlogModel.find({}).sort({ createdAt: -1 }).lean();
      } else {
       
        blogs = await BlogModel.find({ userId: decoded.id })
          .sort({ createdAt: -1 })
          .lean();
      }

      return NextResponse.json({
        success: true,
        blogs: blogs.map(sanitizeBlog),
      });
    }

    
    const blogs = await BlogModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      blogs: blogs.map(sanitizeBlog),
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}




function sanitizeBlog(blog) {
  return {
    _id: blog._id,
    title: blog.title,
    description: blog.description,
    category: blog.category,
    author: blog.author,
    authorImg: safeUrl(blog.authorImg, "/profile_icon.jpg"),
    image: safeUrl(blog.image, "/blog_pic_1.jpg"),
    userId: blog.userId,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    date: blog.createdAt, 
  };
}

function safeUrl(url, fallback) {
  if (!url) return fallback;
  if (typeof url === "string") {
    if (url.startsWith("/") || url.startsWith("http")) return url;
    return fallback;
  }
  return fallback;
}


export async function POST(request) {
  try {
  
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

  
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid token. Please login again." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const timeStamp = Date.now();

    
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const image = formData.get("image");

    if (!title || !description || !category || !image) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

 
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const imagePath = `./public/${timeStamp}_${image.name}`;
    await writeFile(imagePath, imageBuffer);
    const imgUrl = `/${timeStamp}_${image.name}`;

   
    const authorImgInput = formData.get("authorImg");
    let authorImgUrl = decoded.avatar || "/profile_icon.jpg";

    if (authorImgInput && typeof authorImgInput === "object" && authorImgInput.arrayBuffer) {
      const authorImgBuffer = Buffer.from(await authorImgInput.arrayBuffer());
      const authorImgPath = `./public/${timeStamp}_author_${authorImgInput.name}`;
      await writeFile(authorImgPath, authorImgBuffer);
      authorImgUrl = `/${timeStamp}_author_${authorImgInput.name}`;
    } else if (typeof authorImgInput === "string" && authorImgInput) {
      authorImgUrl = authorImgInput;
    }

  
    const authorName = decoded.name || formData.get("author") || "Anonymous";

    
    const blogData = {
      title,
      description,
      category,
      author: authorName,
      authorImg: authorImgUrl,
      image: imgUrl,
      userId: decoded.id, 
    };

    await BlogModel.create(blogData);

    return NextResponse.json(
      {
        success: true,
        message: "Blog added successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Blog create error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create blog" },
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
      decoded = verifyToken(token)
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Blog ID required" },
        { status: 400 }
      );
    }

    const blog = await BlogModel.findById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

 
    const isOwner = blog.userId && blog.userId.toString() === decoded.id;
    const isAdmin = decoded.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "You can only delete your own blogs" },
        { status: 403 }
      );
    }

   
    try {
      fs.unlinkSync(`./public${blog.image}`);
    } catch (err) {
      console.log("Image delete warning:", err.message);
    }

   
    await BlogModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully!",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token)

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Blog ID required" }, { status: 400 });
    }

    const blog = await BlogModel.findById(id);
    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    const isOwner = blog.userId.toString() === decoded.id;
    const isAdmin = decoded.role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const image = formData.get("image");

    if (title) blog.title = title;
    if (description) blog.description = description;
    if (category) blog.category = category;

    if (image && image.size > 0) {
      try {
        if (blog.image) fs.unlinkSync(`./public${blog.image}`);
      } catch {}

      const buffer = Buffer.from(await image.arrayBuffer());
      const timeStamp = Date.now();
      const path = `./public/${timeStamp}_${image.name}`;
      await writeFile(path, buffer);
      blog.image = `/${timeStamp}_${image.name}`;
    }

    await blog.save();

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("PATCH blog error:", error);
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}
