import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard with blogs and profile info",
};

export default function UserRootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative flex flex-col min-h-screen bg-zinc-900 antialiased">
         <div className="relative bg-emerald-950 py-6 px-5 md:px-12 lg:px-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent)]" />
          <div className="relative z-10 flex items-center">
            <Link href="/">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-emerald-50 cursor-pointer hover:text-emerald-100 transition-colors duration-300">
                blog.
              </h1>
            </Link>
          </div>
        </div>
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-950/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-20 w-96 h-96 bg-emerald-950/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(52, 211, 153, 0.01) 1px, transparent 1px),
                linear-gradient(90deg, rgba(52, 211, 153, 0.01) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
