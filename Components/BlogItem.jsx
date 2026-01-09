import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogItem = ({ title, description, category, image, id }) => {
  return (
    <div
      className="
        group
        w-full
        max-w-md
        bg-zinc-900
        rounded-xl
        overflow-hidden
        border
        border-zinc-700
        hover:border-emerald-600/50
        transition-all
        duration-300
      "
    >
      <Link href={`/blogs/${id}`}>
        <div className="relative overflow-hidden">
          <Image
            src={image}
            alt="blog image"
            width={400}
            height={400}
            className="w-full h-64 object-cover  transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-emerald-800/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="py-8 px-4">
        <span className="inline-block px-3 py-2 bg-linear-to-r from-emerald-400 to-emerald-700 text-white text-sm font-medium rounded-lg mb-3">
          {category}
        </span>

        <h5 className="mb-2 text-lg font-semibold text-zinc-50 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {title}
        </h5>

        <p
          className="mb-4 text-sm text-zinc-400 line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: description.slice(0, 120),
          }}
        />

        <Link
          href={`/blogs/${id}`}
          className="inline-flex items-center gap-2 bg-linear-to-r from-emerald-400 to-emerald-700 bg-clip-text text-transparent font-semibold text-base group-hover:gap-3 transition-all"
        >
          Read more
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300 text-emerald-700" />
        </Link>
      </div>
    </div>
  );
};

export default BlogItem;
