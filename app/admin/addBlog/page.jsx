"use client";

import api from "@/lib/api";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import upload_area from "@/public/upload_area.png";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";

const Page = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "Technology",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await api.post("/blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);

        setImage(null);
        setData({
          title: "",
          description: "",
          category: "Technology",
        });
      } else {
        toast.error(response.data.message || "Blog could not be added");
      }
    } catch (error) {
      console.error("Blog add error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add blog. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 py-5 px-5 sm:py-12 sm:pl-16">
      <Card className="max-w-3xl bg-transparent border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Blog</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <label htmlFor="image" className="cursor-pointer inline-block">
                <Image
                  src={image ? URL.createObjectURL(image) : upload_area}
                  alt="upload"
                  width={140}
                  height={80}
                  className="rounded border hover:opacity-80 transition-opacity"
                />
              </label>
              <Input
                id="image"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="space-y-2">
              <Label>Blog Title</Label>
              <Input
                name="title"
                placeholder="Enter blog title"
                value={data.title}
                onChange={onChangeHandler}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                placeholder="Write your blog content here..."
                rows={6}
                value={data.description}
                onChange={onChangeHandler}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2 max-w-xs">
              <Label>Category</Label>
              <Select
                value={data.category}
                onValueChange={(value) =>
                  setData((prev) => ({ ...prev, category: value }))
                }
                disabled={loading}
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
              disabled={loading}
              className="bg-linear-to-r from-emerald-300 to-emerald-700  hover:bg-emerald-700 text-white font-semibold px-6 py-5 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all duration-300"
            >
              {loading ? "Adding Blog..." : "Add Blog"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
