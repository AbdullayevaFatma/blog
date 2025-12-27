import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: { 
    type: String,
     default: "/blog_pic_1.png" 
    },
  authorImg: {
    type: String,
   default: "/profile_icon.png"
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const BlogModel = mongoose.models.blog || mongoose.model("blog", Schema);
export default BlogModel;
