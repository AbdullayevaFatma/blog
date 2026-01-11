"use client";


import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import upload_area from "../../../public/upload_area.png";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Label } from "components/ui/label";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Button } from "components/ui/button";
import { useAuth } from "lib/context/AuthContext";
import api from "lib/api";

const blogSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Content must be at least 10 characters"),
  category: z.enum(["Technology", "AI", "Startups", "Events"]),
});

export default function AdminAddBlogPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [blogImage, setBlogImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Technology",
    },
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  const onSubmit = async (values) => {
    if (!blogImage) {
      toast.error("Please select an image");
      return;
    }
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("image", blogImage);

    try {
      const response = await api.post("/blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setBlogImage(null);
        form.reset();
      } else {
        toast.error(response.data.message || "Blog could not be added");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add blog. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-5 md:px-12 lg:px-28">
      <Card className="max-w-3xl mx-auto bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl text-emerald-400 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Blog
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="blog-image">Thumbnail</Label>
              <label
                htmlFor="blog-image"
                className="cursor-pointer inline-block"
              >
                <Image
                  src={
                    blogImage
                      ? typeof blogImage === "string"
                        ? blogImage
                        : URL.createObjectURL(blogImage)
                      : upload_area
                  }
                  al
                  alt="upload"
                  width={140}
                  height={80}
                  className="rounded border hover:opacity-80 transition-opacity"
                />
              </label>
              <input
                id="blog-image"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setBlogImage(e.target.files[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Blog Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Enter blog title"
                disabled={submitting}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Content</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Write your blog content here..."
                rows={8}
                className="h-40"
                disabled={submitting}
              />
              {form.formState.errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2 max-w-xs">
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.getValues("category")}
                onValueChange={(value) =>
                  form.setValue("category", value, { shouldValidate: true })
                }
                disabled={submitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="Startups">Startups</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="bg-linear-to-r from-emerald-400 to-emerald-700 hover:shadow-lg text-white font-semibold px-6 py-3 shadow-emerald-600/20 transition-all duration-300"
            >
              {submitting ? "Adding Blog..." : "Add Blog"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
