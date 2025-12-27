import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { writeFile } from "fs/promises";
const fs = require("fs")

const { NextResponse } = require("next/server");

const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();


export async function GET(request) {
  const blogId = request.nextUrl.searchParams.get("id");

  if (blogId) {
    const blog = await BlogModel.findById(blogId).lean();
    if (!blog) return NextResponse.json({ blog: null });

    return NextResponse.json({
      blog: sanitizeBlog(blog),
    });
  }

  const blogs = await BlogModel.find({}).lean();
  const safeBlogs = blogs.map(sanitizeBlog);

  return NextResponse.json({ blogs: safeBlogs });
}

// 🔒 Her türlü veri için sanitize fonksiyonu
function sanitizeBlog(blog) {
  return {
    ...blog,
    authorImg: safeUrl(blog.authorImg, "/profile_icon.png"),
    image: safeUrl(blog.image, "/blog_pic_1.png"),
  };
}

// 🔒 Url güvenlik fonksiyonu
function safeUrl(url, fallback) {
  if (!url) return fallback;

  if (typeof url === "string") {
    // relative veya absolute URL kontrolü
    if (url.startsWith("/") || url.startsWith("http")) return url;
    return fallback;
  }

  // Eğer url object, File, null vs ise fallback
  return fallback;
}

export async function POST(request) {
  const formData = await request.formData();
  const timeStamp = Date.now();

  // IMAGE
  const image = formData.get("image");
  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const imagePath = `./public/${timeStamp}_${image.name}`;
  await writeFile(imagePath, imageBuffer);
  const imgUrl = `/${timeStamp}_${image.name}`;

  const authorImg = formData.get("authorImg");
  let authorImgUrl;

  // ✅ Check: File object mı yoksa string mi?
  if (authorImg && typeof authorImg === "object" && authorImg.arrayBuffer) {
    // File object - upload et
    const authorImgBuffer = Buffer.from(await authorImg.arrayBuffer());
    const authorImgPath = `./public/${timeStamp}_author_${authorImg.name}`;
    await writeFile(authorImgPath, authorImgBuffer);
    authorImgUrl = `/${timeStamp}_author_${authorImg.name}`;
  } else {
    // String path - direkt kullan
    authorImgUrl = authorImg;
  }

  const blogData = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    author: formData.get("author"),
    image: imgUrl,
    authorImg: authorImgUrl, // ✅ ARTIK STRING PATH
  };

  await BlogModel.create(blogData);

  return NextResponse.json({
    success: true,
    message: "Blog added succesfully!",
  });
}
export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get("id")
  const blog = await BlogModel.findById(id)
  fs.unlink(`./public${blog.image}`,()=>{})
   await BlogModel.findByIdAndDelete(id)
  return NextResponse.json({
    message: "Blog deleted succesfully!",
  });
}
