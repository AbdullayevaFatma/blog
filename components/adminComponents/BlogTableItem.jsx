import Image from "next/image";
import React from "react";


import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const BlogTableItem = ({ blog, deleteBlog }) => {
  const { authorImg, title, date, author, _id: mongoId } = blog;
  const blogDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full border-2 border-emerald-600 overflow-hidden hover:border-emerald-500 transition-colors cursor-pointer">
            <Image
              src={authorImg || "/profile_icon.jpg"}
              alt="profile icon"
               sizes="48px"
               fill
              className="object-cover"
            />
          </div>
          <span className="font-medium">{author || "No author"}</span>
        </div>
      </TableCell>
      <TableCell className="font-medium">{title || "No title"}</TableCell>
      <TableCell>{blogDate}</TableCell>
      <TableCell className="text-right">
        <Button onClick={() => deleteBlog(mongoId)}>Delete</Button>
      </TableCell>
    </TableRow>
  );
};

export default BlogTableItem;
