"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Mail, Shield, Camera, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/lib/api.js";
import upload_area from "@/public/upload_area.png";
import profile from "@/public/profile_icon.jpg";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const blogSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Content must be at least 10 characters"),
  category: z.enum(["Technology", "AI", "Startups", "Events"]),
});

export default function DashboardPage() {
  const { user, loading, logout, refetchUser } = useAuth();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [blogImage, setBlogImage] = useState(null);
  const [submittingBlog, setSubmittingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);

  const router = useRouter();

  const defaultBlogValues = {
    title: "",
    description: "",
    category: "Technology",
  };

  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: defaultBlogValues,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  const fetchUserBlogs = async () => {
    if (!user) return;
    setLoadingBlogs(true);
    try {
      const response = await api.get("/blog?mine=true");
      setBlogs(response.data.blogs);
    } catch {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoadingBlogs(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserBlogs();
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error("Please select an image first");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await api.post("/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await refetchUser();
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values) => {
    setSubmittingBlog(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);

      if (blogImage && typeof blogImage !== "string") {
        formData.append("image", blogImage);
      }

      let response;
      if (editingBlogId) {
        response = await api.patch("/blog", formData, {
          params: { id: editingBlogId },
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.post("/blog", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingBlogId(null);
        setBlogImage(null);
        form.reset(defaultBlogValues);
        fetchUserBlogs();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create/update blog",
      );
    } finally {
      setSubmittingBlog(false);
    }
  };

  const handleBlogDelete = async (blogId) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await api.delete("/blog", { params: { id: blogId } });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchUserBlogs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    }
  };

  const handleEditClick = (blog) => {
    setEditingBlogId(blog._id);
    setBlogImage(blog.image);
    form.reset({
      title: blog.title,
      description: blog.description,
      category: blog.category,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingBlogId(null);
    setBlogImage(null);
    form.reset(defaultBlogValues);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-zinc-400">Redirecting...</p>
      </div>
    );
  }
  return (
    <div className="relative z-10 py-12 px-5 md:px-12 lg:px-28">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-emerald-400">
          User Dashboard
        </h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 font-medium transition-colors duration-300 ${
              activeTab === "profile"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-6 py-3 font-medium transition-colors duration-300  ${
              activeTab === "blogs"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            My Blogs ({blogs.length})
          </button>
        </div>
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative group w-25 h-25">
                    <Image
                      src={avatarPreview || user.avatar || profile}
                      fill
                      alt="profile"
                      className="rounded-full border-4 border-emerald-600 object-cover "
                    />
                    {!avatarPreview && (
                      <label
                        htmlFor="avatar-input"
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Camera className="w-8 h-8 text-white" />
                      </label>
                    )}
                  </div>

                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />

                  {avatarPreview && (
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleAvatarUpload} disabled={uploading}>
                        {uploading ? "Uploading..." : "Upload"}
                      </Button>
                      <Button
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                        }}
                        disabled={uploading}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {!avatarPreview && (
                    <p className="text-xs text-zinc-500 mt-2 text-center">
                      Hover over image to change
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs text-zinc-400">Name</p>
                      <p className="text-zinc-100 font-medium">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs text-zinc-400">Email</p>
                      <p className="text-zinc-100 font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs text-zinc-400">Role</p>
                      <p className="text-zinc-100 font-medium capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.role === "admin" && (
                  <Button
                    onClick={() => router.push("/admin/addBlog")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Admin Panel
                  </Button>
                )}
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="w-full hover:bg-linear-to-r hover:from-emerald-400 to-emerald-700"
                  variant="outline"
                >
                  Browse Blogs
                </Button>
                <Button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "blogs" && (
          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {editingBlogId ? "Edit Blog" : "Create New Blog"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <Label
                      htmlFor="blog-image"
                      className="cursor-pointer flex flex-col gap-4  items-start"
                    >
                      Blog Image
                      <Image
                        src={
                          blogImage
                            ? typeof blogImage === "string"
                              ? blogImage
                              : URL.createObjectURL(blogImage)
                            : upload_area
                        }
                        alt="upload"
                        width={140}
                        height={80}
                        className="rounded border hover:opacity-80 transition-opacity"
                      />
                    </Label>
                    <input
                      id="blog-image"
                      type="file"
                      className="hidden"
                      onChange={(e) => setBlogImage(e.target.files[0])}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={submittingBlog} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={8}
                              className="h-40"
                              disabled={submittingBlog}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel>Category</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Technology">
                                Technology
                              </SelectItem>
                              <SelectItem value="AI">AI</SelectItem>
                              <SelectItem value="Startups">Startups</SelectItem>
                              <SelectItem value="Events">Events</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={submittingBlog}
                        className="bg-linear-to-r from-emerald-400 to-emerald-700"
                      >
                        {editingBlogId ? "Update Blog" : "Publish Blog"}
                      </Button>
                      {editingBlogId && (
                        <Button
                          onClick={cancelEdit}
                          className="bg-zinc-900 border boder-zinc-100 hover:bg-linear-to-r hover:from-emerald-400 hover:to-emerald-700"
                        >
                          Cancel Edit
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">
                  Your Blogs ({blogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingBlogs ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-400">Loading blogs...</p>
                  </div>
                ) : blogs.length === 0 ? (
                  <p className="text-center text-zinc-400 py-8">
                    You haven&apos;t created any blogs yet. Create your first
                    blog above!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {blogs.map((blog) => (
                      <div
                        key={blog._id}
                        className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-zinc-800 rounded-lg hover:bg-zinc-750 transition-colors"
                      >
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          width={80}
                          height={80}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-zinc-100">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-zinc-400">
                            {blog.category}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditClick(blog)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleBlogDelete(blog._id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
