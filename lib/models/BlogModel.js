import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Technology", "Startup", "Lifestyle"],
    },
  
    author: {
      type: String,
      required: true,
    },
    authorImg: {
      type: String,
      default: "/profile_icon.png",
    },
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false, 
    },
  },
  { timestamps: true }
);

const BlogModel = mongoose.models.blog || mongoose.model("blog", BlogSchema);
export default BlogModel;