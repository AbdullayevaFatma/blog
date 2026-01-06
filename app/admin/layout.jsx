"use client";


import Sidebar from "@/Components/AdminComponents/Sidebar";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";




export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();



 
  useEffect(() => {
    if (!loading) {
      if (!user) {
      
        router.replace("/auth/signin");
        return;
      }

      if (user.role !== "admin") {
       
        router.replace("/");
        return;
      }

     
    }
  }, [user, loading, router]);

  const handleUserDashboard = () => {
    window.location.href = "/user";
  };

  const handleHomePage = () => {
    window.location.href = "/";
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Checking permissions...</p>
        </div>
      </div>
    );
  }


  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-zinc-400">Redirecting...</p>
      </div>
    );
  }

 
  return (
    <>
      <div className="flex">
        <ToastContainer theme="dark" />
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full py-12 max-h-15 px-14">
            <h3 className="font-medium">Admin Panel</h3>
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 focus:outline-none hover:opacity-80 transition-opacity">
                  <span className="text-sm text-zinc-300 hidden sm:block">{user.name}</span>
                  <Image
                    src={user.avatar || "/profile_icon.png"}
                    width={42}
                    height={42}
                    alt="profile icon"
                    className="rounded-full border-2 border-emerald-600 cursor-pointer hover:border-emerald-500 transition-colors"
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 ">
                <div className="px-2 py-3">
                  <p className="text-sm font-semibold text-zinc-100">
                    {user.name}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-emerald-500 mt-1 font-medium">
                    Admin
                  </p>
                </div>
                <DropdownMenuSeparator/>
                <DropdownMenuItem 
                  onClick={handleHomePage}
                  className="cursor-pointer outline-none focus:bg-emerald-800 focus:text-white transition-all duration-300"
                >
                   Home Page
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleUserDashboard}
                  className="cursor-pointer outline-none focus:bg-emerald-800 focus:text-white transition-all duration-300"
                >
                   User Dashboard
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-950 outline-none transition-all duration-300"
                >
                   Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}

