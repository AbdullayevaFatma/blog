import cloudinary from "@/lib/config/cloudinary";
import fs from "fs";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/utils/auth";
import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/models/BlogModel";
import UserModel from "@/models/UserModel";

const { uploader } = cloudinary;

const JWT_SECRET = process.env.JWT_SECRET;

const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();

// function safeUrl(url, fallback) {
//   if (!url) return fallback;
//   if (typeof url === "string") {
//     if (url.startsWith("/") || url.startsWith("http")) return url;
//     return fallback;
//   }
//   return fallback;
// }

function safeUrl(url, fallback) {
  if (!url) return fallback;
  return url;
}

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

     
      let canView = false;
      const token = request.cookies.get("auth_token")?.value;

      if (token) {
        try {
          const decoded = verifyToken(token);
          const isAdmin = decoded.role === "admin";
          const isOwner = blog.userId && blog.userId.toString() === decoded.id;
          const blogStatus = blog.status || "approved"; 
          
         
          if (isAdmin || isOwner) {
            canView = true;
          } else if (blogStatus === "approved") {
            
            canView = true;
          }
        } catch (error) {
          console.error("Token verification error:", error);
          
          if (!blog.status || blog.status === "approved") {
            canView = true;
          }
        }
      } else {
       
        if (!blog.status || blog.status === "approved") {
          canView = true;
        }
      }

      if (!canView) {
        return NextResponse.json(
          { success: false, message: "Blog not available or pending approval" },
          { status: 403 }
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

      let decoded;
      try {
        decoded = verifyToken(token);
      } catch (error) {
        return NextResponse.json(
          { success: false, message: "Invalid token" },
          { status: 401 }
        );
      }

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

  
    const blogs = await BlogModel.find({
      $or: [
        { status: "approved" },
        { status: { $exists: false } } 
      ]
    }).sort({ createdAt: -1 }).lean();

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
    authorImg: blog.authorImg || "/profile_icon.jpg",
    image: blog.image || "/blog_pic_1.jpg",
    userId: blog.userId,
    status: blog.status,
    rejectionReason: blog.rejectionReason,
    approvedBy: blog.approvedBy,
    approvedAt: blog.approvedAt,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    date: blog.createdAt,
  };
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
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid token. Please login again." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const image = formData.get("image");
    const authorImgInput = formData.get("authorImg");

    if (!title || !description || !category || !image) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!image || !image.arrayBuffer) {
      return NextResponse.json(
        { success: false, message: "Image required" },
        { status: 400 }
      );
    }

    const imgBuffer = Buffer.from(await image.arrayBuffer());
    const imgUpload = await uploader.upload(
      "data:image/png;base64," + imgBuffer.toString("base64"),
      { folder: "blog_images" }
    );
    const imgUrl = imgUpload.secure_url;

    let authorImgUrl = "/profile_icon.jpg";
    const user = await UserModel.findById(decoded.id);

    if (authorImgInput && authorImgInput.arrayBuffer) {
      const authorBuffer = Buffer.from(await authorImgInput.arrayBuffer());
      const authorUpload = await uploader.upload(
        "data:image/png;base64," + authorBuffer.toString("base64"),
        { folder: "author_images" }
      );
      authorImgUrl = authorUpload.secure_url;
    } else if (typeof authorImgInput === "string" && authorImgInput) {
      authorImgUrl = authorImgInput;
    } else if (user?.avatar) {
      authorImgUrl = user.avatar;
    }

 
    const status = decoded.role === "admin" ? "approved" : "pending";

    const blogData = {
      title,
      description,
      category,
      author: decoded.name || formData.get("author") || "Anonymous",
      authorImg: authorImgUrl,
      image: imgUrl,
      userId: decoded.id,
      status,
    };

    await BlogModel.create(blogData);

    const message = decoded.role === "admin"
      ? "Blog added successfully!"
      : "Blog submitted for approval. It will be visible after admin review.";

    return NextResponse.json(
      {
        success: true,
        message,
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
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Blog ID required" },
        { status: 400 },
      );
    }

    const blog = await BlogModel.findById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }

    const isOwner = blog.userId && blog.userId.toString() === decoded.id;
    const isAdmin = decoded.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "You can only delete your own blogs" },
        { status: 403 },
      );
    }

    // try {
    //   fs.unlinkSync(`./public${blog.image}`);
    // } catch (err) {
    //   console.log("Image delete warning:", err.message);
    // }

    await BlogModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully!",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    return NextResponse.json(
      { success: false, message: "Delete failed" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const decoded = verifyToken(token);

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Blog ID required" },
        { status: 400 },
      );
    }

    const blog = await BlogModel.findById(id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }

    const isOwner = blog.userId.toString() === decoded.id;
    const isAdmin = decoded.role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const image = formData.get("image");
    const authorImgInput = formData.get("authorImg");

    if (title) blog.title = title;
    if (description) blog.description = description;
    if (category) blog.category = category;

    const user = await UserModel.findById(decoded.id);

    let authorImgUrl = user?.avatar || "/profile_icon.jpg";
    if (authorImgInput && authorImgInput.arrayBuffer) {
      const buffer = Buffer.from(await authorImgInput.arrayBuffer());
      const tempPath = `/tmp/${Date.now()}_author_${authorImgInput.name}`;
      await fs.promises.writeFile(tempPath, buffer);
      const upload = await cloudinary.uploader.upload(tempPath, {
        folder: "author_images",
      });
      blog.authorImg = upload.secure_url;
    } else if (typeof authorImgInput === "string" && authorImgInput) {
      blog.authorImg = authorImgInput;
    } else if (user?.avatar) {
      blog.authorImg = user.avatar;
    }
    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const tempPath = `/tmp/${Date.now()}_${image.name}`;
      await fs.promises.writeFile(tempPath, buffer);
      const upload = await cloudinary.uploader.upload(tempPath, {
        folder: "blog_images",
      });
      blog.image = upload.secure_url;
    }
    await blog.save();

    //   const buffer = Buffer.from(await image.arrayBuffer());
    //   const timeStamp = Date.now();
    //   const path = `./public/${timeStamp}_${image.name}`;
    //   await writeFile(path, buffer);
    //   blog.image = `/${timeStamp}_${image.name}`;
    // }

    // await blog.save();

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("PATCH blog error:", error);
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 },
    );
  }
}
