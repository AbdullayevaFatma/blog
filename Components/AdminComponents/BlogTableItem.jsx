import Image from "next/image";
import React from "react";
import { TableRow, TableCell } from "../ui/table";
import { Button } from "../ui/button";
import profile from "@/public/profile_icon.jpg"

const BlogTableItem = ({ blog, deleteBlog }) => {
  const { authorImg, title, date, author, _id: mongoId } = blog;
  const blogDate = new Date(date).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <div className="flex items-center gap-3">
          <Image
            src={authorImg || profile}
            alt="author image"
            width={40}
            height={40}
            className="rounded-full"
          />
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
