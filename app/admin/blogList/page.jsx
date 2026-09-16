"use client";

import BlogTableItem from "@/components/adminComponents/BlogTableItem";
import DeleteDialog from "@/components/DeleteDialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
 
const Page = ({ openSidebar }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

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

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      const response = await api.delete("/blog", {
        params: { id: deleteId },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchBlogs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    } finally {
      setDeleteId(null);
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
  <div className="flex-1 pt-5 px-2 sm:px-6 md:px-10 sm:pt-12 mx-auto">
    {blogs.length === 0 ? (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-base font-semibold text-zinc-500">
            No blogs found
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            Your published blogs will appear here.
          </p>
        </div>
      </div>
    ) : (
      <>
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          All Blogs
        </h1>

        <div className="overflow-x-auto border rounded-lg">
          <div className="min-w-150 lg:min-w-full">
            <Table>
              <TableCaption>
                All published blogs
              </TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead className="hidden lg:table-cell text-sm lg:text-base font-bold">
                    Author
                  </TableHead>

                  <TableHead className="text-sm lg:text-base font-bold">
                    Blog Title
                  </TableHead>

                  <TableHead className="hidden lg:table-cell text-sm lg:text-base font-bold">
                    Date
                  </TableHead>

                  <TableHead className="text-sm lg:text-base font-bold text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {blogs.map((blog) => (
                  <BlogTableItem
                    key={blog._id}
                    blog={blog}
                    deleteBlog={(id) => setDeleteId(id)}
                  />
                ))}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="font-bold text-sm sm:text-base"
                  >
                    Total Blogs: {blogs.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </>
    )}

    <DeleteDialog
      open={!!deleteId}
      onOpenChange={() => setDeleteId(null)}
      onConfirm={handleDeleteConfirm}
      title="Delete blog?"
      description="This blog will be permanently deleted and cannot be recovered."
      confirmText="Delete"
      cancelText="Cancel"
    />
  </div>
);




};

export default Page;
