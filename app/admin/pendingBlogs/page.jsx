"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approveId, setApproveId] = useState(null);
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchPendingBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/blog?mine=true");
      
     
      const pendingBlogs = (response.data.blogs || []).filter(
        (blog) => blog.status === "pending"
      );
      
      setBlogs(pendingBlogs);
    } catch (error) {
      console.error("Fetch blogs error:", error);
      toast.error("Failed to fetch pending blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApproveConfirm = async () => {
    if (!approveId) return;

    try {
      const response = await api.post("/blog/approve", {
        blogId: approveId,
      });

      if (response.data.success) {
        toast.success("Blog approved successfully!");
        fetchPendingBlogs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve blog");
    } finally {
      setApproveId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectId) return;

    try {
      const response = await api.post("/blog/reject", {
        blogId: rejectId,
        reason: rejectReason || "No reason provided",
      });

      if (response.data.success) {
        toast.success("Blog rejected");
        fetchPendingBlogs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject blog");
    } finally {
      setRejectId(null);
      setRejectReason("");
    }
  };

  useEffect(() => {
    fetchPendingBlogs();
  }, [fetchPendingBlogs]);

  if (loading) {
    return (
      <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
        <div className="flex justify-center items-center min-h-100">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-400">Loading pending blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1 className="text-2xl font-bold mb-6">Pending Blogs</h1>
      
      <div className="overflow-x-auto border rounded-lg px-10 py-4">
        <Table>
          <TableCaption>
            {blogs.length === 0 ? "" : "Blogs awaiting approval"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell font-bold text-base">
                Author
              </TableHead>
              <TableHead className="font-bold text-base">Blog Title</TableHead>
              <TableHead className="hidden md:table-cell font-bold text-base">
                Category
              </TableHead>
              <TableHead className="font-bold text-base">Date</TableHead>
              <TableHead className="font-bold text-base text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center font-semibold text-zinc-400"
                >
                  No pending blogs at the moment 🎉
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-600">
                        <Image
                          src={blog.authorImg || "/profile_icon.jpg"}
                          alt={blog.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium">{blog.author}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {blog.title}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="px-3 py-1 bg-emerald-900 text-emerald-200 rounded-full text-sm">
                      {blog.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(blog.date).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => setApproveId(blog._id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        size="sm"
                      >
                        ✓ Approve
                      </Button>
                      <Button
                        onClick={() => setRejectId(blog._id)}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                        size="sm"
                      >
                        ✗ Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {blogs.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="font-bold text-base">
                  Total Pending: {blogs.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

    
      <AlertDialog open={!!approveId} onOpenChange={() => setApproveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve this blog?</AlertDialogTitle>
            <AlertDialogDescription>
              This blog will be published and visible to all users on the website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveConfirm}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={!!rejectId} onOpenChange={() => setRejectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this blog?</AlertDialogTitle>
            <AlertDialogDescription>
              The author will be notified that their blog was rejected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Rejection Reason (Optional)
            </label>
            <Textarea
              placeholder="e.g., Content doesn't meet quality standards, inappropriate language, etc."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectReason("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Page;