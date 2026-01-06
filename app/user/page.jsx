"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { User, Mail, Shield, ArrowLeft } from "lucide-react";

export default function UserPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

useEffect(() => {
  if (!loading && user === null) {
    router.replace("/auth/signin");
  }
}, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-400">Redirecting...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <div className="relative bg-emerald-950 py-5 px-5 md:px-12 lg:px-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent)]" />
        <div className="relative z-10 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-emerald-50 cursor-pointer hover:text-emerald-100 transition-colors duration-300">
              blog.
            </h1>
          </Link>
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
      <div className="py-12 px-5 md:px-12 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-emerald-400">
            User Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-transparent border-2 ">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <Image
                    src={user.avatar || "/profile_icon.png"}
                    width={120}
                    height={120}
                    alt="profile"
                    className="rounded-full border-4 border-emerald-600"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs text-zinc-400">Name</p>
                      <p className="text-zinc-100 font-medium">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs text-zinc-400">Email</p>
                      <p className="text-zinc-100 font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs text-zinc-400">Role</p>
                      <p className="text-zinc-100 font-medium capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-transparent border-2">
              <CardHeader>
                <CardTitle className="text-xl text-emerald-400">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.role === "admin" && (
                  <Button 
                    onClick={() => window.location.href = "/admin/addBlog"}
                    className="w-full bg-linear-to-r from-emerald-400 to-emerald-800"
                  >
                    Go to Admin Panel
                  </Button>
                )}
                <Button 
                  onClick={() => window.location.href = "/"}
                  className="w-full" 
                  variant="outline"
                >
                  Browse Blogs
                </Button>

                <Button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-transparent border-2 mt-6">
            <CardHeader>
              <CardTitle className="text-xl text-emerald-400">
                Welcome to Blog App
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300">
                Thank you for joining our community! You can browse all blogs,
                subscribe to newsletters, and stay updated with the latest content.
                {user.role === "admin" && (
                  <span className="block mt-2 text-emerald-400">
                    As an admin, you have access to the admin panel where you can
                    create, edit, and delete blogs.
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}