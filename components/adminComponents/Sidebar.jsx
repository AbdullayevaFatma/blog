import { Plus, FileText, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import SidebarButton from "@/components/adminComponents/SidebarButton";


const Sidebar = () => {
  return (
    <div className="flex flex-col gap-6 bg-emerald-600/20 h-screen min-w-40 sm:min-w-50 md:w-80 overflow-hidden px-4 py-6">
      <div className="text-start mb-6">
        <Link href="/">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-emerald-50 cursor-pointer hover:text-emerald-100 transition-colors duration-300">
            blog.
          </h1>
        </Link>
      </div>
      <div className="flex flex-col items-center gap-4">
        <SidebarButton href="/admin/addBlog" icon={Plus} label="Add blogs" />
        <SidebarButton
          href="/admin/blogList"
          icon={FileText}
          label="Blog lists"
        />
          <SidebarButton
          href="/admin/pendingBlogs"
          icon={FileText}
          label="Pending blogs"
        />
        <SidebarButton
          href="/admin/subscriptions"
          icon={Mail}
          label="Subscriptions"
        />
      </div>
    </div>
  );
};

export default Sidebar;
