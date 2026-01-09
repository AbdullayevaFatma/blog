"use client";

import Footer from "@/components/Footer";
import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const Page = ({ params }) => {
  const { id } = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/blog", { params: { id: id } });

      if (!response.data.blog) {
        setError("Blog not found");
        return;
      }
      setData(response.data.blog);
    } catch (err) {
      setError(err.response?.data?.message || "Blog loading error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-zinc-400 text-lg">Blog loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 bg-zinc-900 rounded-xl border border-zinc-800">
          <p className="text-red-400 text-xl mb-6">{error}</p>
          <Link href="/">
            <Button className="bg-linear-to-r from-emerald-400 to-emerald-700">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return data ? (
    <div className="flex flex-col min-h-screen">
      <div className="relative bg-emerald-950 py-5 px-5 md:px-12 lg:px-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent)]" />
        <div className="relative z-10 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-emerald-50 cursor-pointer hover:text-emerald-100 transition-colors duration-300">
              blog<span className="text-emerald-400">.</span>
            </h1>
          </Link>
          <Link href="/">
            <Button className="bg-linear-to-r from-emerald-400 to-emerald-700 font-semibold px-6 py-5">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
      <main className="flex-1">
        <div className="py-12 px-5 md:px-12 lg:px-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-block px-6 py-2 text-lg font-semibold rounded-full bg-linear-to-r from-emerald-400 to-emerald-700">
                {data.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-zinc-50 mb-6 leading-tight">
              {data.title}
            </h1>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="relative w-12 h-12 rounded-full border-2 border-emerald-600 overflow-hidden hover:border-emerald-500 transition-colors cursor-pointer">
                <Image
                  src={data.authorImg}
                  alt="profile icon"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-zinc-100 font-semibold text-lg">
                  {data.author
                    ? data.author.charAt(0).toUpperCase() +
                      data.author.slice(1).toLowerCase()
                    : ""}
                </p>
                <p className="text-zinc-400 text-sm">
                  {new Date(data.createdAt || data.date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mb-12">
              <div className="relative w-full aspect-video">
                <Image
                  src={data.image}
                  alt="blog image"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-2xl border-2 border-zinc-800 shadow-xl"
                  priority
                />
              </div>
            </div>
            <article
              className="blog-content text-left prose prose-invert prose-emerald prose-lg max-w-none mb-12
                prose-headings:text-zinc-50 prose-headings:font-bold
                prose-p:text-zinc-300 prose-p:leading-relaxed
                prose-a:text-emerald-500 prose-a:no-underline hover:prose-a:text-emerald-400
                prose-strong:text-zinc-100
                prose-code:text-emerald-400 prose-code:bg-zinc-900 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-img:rounded-xl prose-img:border-2 prose-img:border-zinc-800"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  ) : null;
};

export default Page;
