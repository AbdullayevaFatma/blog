import { assets } from "@/Assets/assets";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import Image from "next/image";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

export default function Layout({ children }) {
  return (
    <>
      <div className="flex">
        <ToastContainer theme="dark"/>
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full py-3 max-h-15 px-12 border-b border-black ">
            <h3 className="font-medium">Admin Panel</h3>
            <Image src={assets.profile_icon} width={40} alt="profile icon" />
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
