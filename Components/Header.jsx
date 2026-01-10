"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/Form";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/Dropdown-menu";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import profile from "@/public/profile_icon.jpg";

const emailFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const Header = () => {
  const form = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      const response = await api.post("/email", formData);

      if (response.data.success) {
        toast.success(response.data.message);
        form.reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleUserDashboard = () => {
    router.push("/dashboard");
  };

  const handleAdminPanel = () => {
    router.push("/admin/addBlog");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <div className="relative bg-emerald-950 py-6 px-5 md:px-12 lg:px-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent)]" />
        <div className="relative z-10 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-emerald-50 cursor-pointer hover:text-emerald-100 transition-colors duration-300">
              blog.
            </h1>
          </Link>
          <div className="flex items-center gap-4 ">
            {!loading && !user && (
              <Button asChild>
                <Link href="/auth/signin" className="bg-linear-to-r from-emerald-400 to-emerald-700">Start Blogging</Link>
              </Button>
            )}
            {!loading && user && (
              <>
                <Button
                  asChild
                  className="bg-linear-to-r from-emerald-400 to-emerald-700"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="relative w-12 h-12 rounded-full border-2 border-emerald-600 overflow-hidden hover:border-emerald-500 transition-colors cursor-pointer">
                                       <Image
                                         src={user.avatar || profile}
                                         alt="profile icon"
                                         fill
                                         className="object-cover"
                                       />
                                     </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-3 space-y-2">
                      <p className="text-sm font-semibold text-zinc-100">
                        {user.name
                      ? user.name.charAt(0).toUpperCase() +
                        user.name.slice(1).toLowerCase()
                      : ""}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <DropdownMenuSeparator />
                    {user.role === "admin" && (
                      <DropdownMenuItem
                        onClick={handleAdminPanel}
                        className="cursor-pointer"
                      >
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleUserDashboard}
                      className="cursor-pointer"
                    >
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-800"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="text-center my-20 px-5 md:px-12 lg:px-28">
        <div className="gradient-blur-dark-vibrant rounded-2xl p-8 sm:p-12 border border-zinc-600/50 backdrop-blur-sm">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 bg-linear-to-r from-white to-emerald-100 bg-clip-text text-transparent">
            Latest Blogs
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-zinc-400">
            Explore insights and updates on AI,Technology,Startups and Events
            from our vibrant community of writers.
          </p>
          <div className="mt-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1 m-0">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your email"
                          className="border-emerald-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-linear-to-r from-emerald-400 to-emerald-700 "
                >
                  Subscribe
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
