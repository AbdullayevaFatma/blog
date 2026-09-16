import Image from "next/image";
import React from "react";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const BlogTableItem = ({ blog, deleteBlog,onRow }) => {
  const { authorImg, title, date, author, _id: mongoId } = blog;
  const blogDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
   <TableRow>

  <TableCell className="hidden lg:table-cell">
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10 rounded-full border-2 border-emerald-600 overflow-hidden hover:border-emerald-500 transition-colors">
        <Image
          src={authorImg || "/profile_icon.jpg"}
          alt="author"
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
      <span className="text-sm truncate">{author || "No author"}</span>
    </div>
  </TableCell>

  <TableCell className="text-sm lg:text-base font-medium truncate">
    {title || "No title"}
  </TableCell>

  <TableCell className="hidden lg:table-cell text-sm lg:text-base">
    {blogDate}
  </TableCell>

  <TableCell className="text-right">
    <Button size="sm" onClick={() => deleteBlog(mongoId)}>
      Delete
    </Button>
  </TableCell>
</TableRow>

  );
};

export default BlogTableItem;
