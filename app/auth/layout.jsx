"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <ToastContainer 
        theme="dark" 
        position="top-right"
        autoClose={3000}
      />

      <div className="relative bg-emerald-950 py-5 px-5 md:px-12 lg:px-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent)]" />
        
        <div className="relative z-10">
          <Link href="/">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-emerald-50 cursor-pointer hover:text-emerald-100 transition-colors duration-300">
              blog.
            </h1>
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}