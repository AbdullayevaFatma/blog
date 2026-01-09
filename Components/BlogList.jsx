"use client";

import BlogItem from "./BlogItem";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categories = ["All", "Technology", "AI", "Startups", "Events"];

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/blog");
      setBlogs(response.data.blogs || []);
    } catch (error) {
      setError(
        "An error occurred while loading the blogs. Please refresh the page.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100 py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-100 py-20">
        <div className="text-center max-w-md mx-auto p-8 bg-zinc-900 rounded-xl border border-red-500/30">
          <p className="text-zinc-100 mb-4">{error}</p>
          <button
            onClick={fetchBlogs}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-6 rounded-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-100 py-20">
        <p className="text-lg text-zinc-400">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="px-5 md:px-12 lg:px-28">
      <div className="flex flex-wrap justify-center gap-3 my-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setMenu(cat)}
            className={
              menu === cat
                ? "bg-linear-to-r from-emerald-400 to-emerald-700 text-white py-2 px-6 rounded-lg font-semibold shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:shadow-emerald-600/40"
                : "bg-zinc-800 border border-zinc-700 text-zinc-300 py-2 px-6 rounded-lg font-medium hover:border-emerald-600 hover:text-emerald-400 transition-all duration-300"
            }
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16 justify-items-center">
        {blogs
          .filter((item) => (menu === "All" ? true : item.category === menu))
          .map((item) => (
            <BlogItem
              key={item._id}
              id={item._id}
              image={item.image}
              title={item.title}
              description={item.description}
              category={item.category}
            />
          ))}
      </div>
    </div>
  );
};

export default BlogList;
