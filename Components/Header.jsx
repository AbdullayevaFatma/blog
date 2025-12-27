import axios from "axios";
import { assets } from "../Assets/assets";
import Image from "next/image";
import { toast } from "react-toastify";
import { useState } from "react";

const Header = () => {
  const [email, setEmail] = useState("");
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("email", email);

      const response = await axios.post("/api/email", formData);

      toast.success(response.data.message);
      setEmail("");
    } catch (error) {
      // Backend’den gelen mesaj
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <div className="py-5 px-5 md:px-12 lg:px-28">
      {" "}
      <div className="flex justify-between items-center">
        {" "}
        <Image
          src={assets.logo}
          width={180}
          alt="logo"
          className="w-32.5 sm:w-auto"
        />{" "}
        <button className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]">
          Get Started{" "}
          <Image src={assets.arrow} alt="arrow icon" width={16} height={16} />{" "}
        </button>{" "}
      </div>{" "}
      <div className="text-center my-8">
        <h1 className="text-3xl sm:text-5xl font-medium">Latest Blogs</h1>
        <p className="mt-10 max-w-185 m-auto text-xs sm:text-base">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde neque
          reiciendis, quis iure consequuntur beatae.
        </p>
        <form
          onSubmit={onSubmitHandler}
          className="flex justify-between max-w-125 scale-75 sm:scale-100 mx-auto mt-10 border border-black shadow-[-7px_7px_0px_#000000]"
        >
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter your email"
            className="grow pl-4 outline-none"
          />
          <button
            type="submit"
            className="border-l border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;
