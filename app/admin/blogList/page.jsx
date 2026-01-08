"use client";

import BlogTableItem from "@/components/adminComponents/BlogTableItem";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
  TableCell,
} from "@/components/ui/table";
import api from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/blog");
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Fetch blogs error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBlog = async (mongoId) => {
    if (!confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      const response = await api.delete("/blog", {
        params: { id: mongoId },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchBlogs();
      }
    } catch (error) {
      console.error("Delete blog error:", error);
      toast.error(error.response?.data?.message || "Failed to delete blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  if (loading) {
    return (
      <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
        <div className="flex justify-center items-center min-h-100">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-400">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1 className="text-2xl font-bold mb-6">All Blogs</h1>
      <div className="overflow-x-auto border rounded-lg px-10 py-4">
        <Table>
          <TableCaption>
            {blogs.length === 0 ? "" : "All published blogs"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell font-bold text-base">
                Author
              </TableHead>
              <TableHead className="font-bold text-base">Blog Title</TableHead>
              <TableHead className="font-bold text-base">Date</TableHead>
              <TableHead className="font-bold text-base text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center font-semibold  text-zinc-400"
                >
                  No blogs found. Create your first blog!
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <BlogTableItem
                  key={blog._id}
                  blog={blog}
                  deleteBlog={deleteBlog}
                />
              ))
            )}
          </TableBody>
          {blogs.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="font-bold text-base">
                  Total Blogs: {blogs.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    </div>
  );
};

export default Page;
