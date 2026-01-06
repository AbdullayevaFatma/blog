import { Plus, FileText, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-6 bg-emerald-600/20 h-screen min-w-40 sm:min-w-50 md:w-80 overflow-hidden p-4">
      <div className="text-start mb-6">
        <Link href="/">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-emerald-50 cursor-pointer hover:text-emerald-100 transition-colors duration-300">
            blog.
          </h1>
        </Link>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Link
          href="/admin/addBlog"
          className="flex items-center gap-2 sm:gap-3 font-medium px-3 py-2 bg-zinc-900 rounded-xl  shadow-zinc-500 shadow  w-full max-w-55"
        >
          <Plus size={24} />
          <p className="truncate">Add blogs</p>
        </Link>
        <Link
          href="/admin/blogList"
          className="flex items-center gap-2 sm:gap-3 font-medium px-3 py-2 bg-zinc-900 rounded-xl  shadow-zinc-500 shadow  w-full max-w-55"
        >
          <FileText size={24} />
          <p className="truncate">Blog lists</p>
        </Link>
        <Link
          href="/admin/subscriptions"
          className="flex items-center gap-2 sm:gap-3 font-medium px-3 py-2 bg-zinc-900 rounded-xl  shadow-zinc-500 shadow  w-full max-w-55"
        >
          <Mail size={24} />
          <p className="truncate">Subscriptions</p>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
