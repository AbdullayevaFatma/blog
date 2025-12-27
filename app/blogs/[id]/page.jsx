"use client";
import { assets} from "@/Assets/assets";
import Footer from "@/Components/Footer";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, use } from "react";

const Page = ({ params }) => {
  const { id } = use(params);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

 const fetchBlogData = async () => {
  try {
    const response = await axios.get("/api/blog", {params: {id: id}})
    
    if (!response.data.blog) {
      setError('Blog bulunamadı')
      return
    }
    
    setData(response.data.blog)
  } catch (err) {
    console.error('Blog yükleme hatası:', err)
    setError('Blog yüklenirken hata oluştu')
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchBlogData();
  }, []);

  if (loading) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Blog loading...</p>
      </div>
    </div>
  )
}
if (error) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="text-red-600 text-xl mb-4">{error}</p>
        <Link href="/" className="bg-black text-white py-2 px-6 rounded">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}

  return data ? (
    <>
      <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center">
          <Link href="/">
          <Image
            src={assets.logo}
            alt="logo"
            width={180}
            className="w-32.5 sm:w-auto"
          />
          </Link>
          <button className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]">
            Get started <Image src={assets.arrow} alt="arrow icon" width={24} />{" "}
          </button>
        </div>
        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-175 mx-auto">
            {data.title}
          </h1>
          <Image
            className="mx-auto mt-6 border border-white rounded-full"
            src={data?.authorImg}
            width={60}
            height={60}
            alt="author image"
          />
          <p className="mt-1 pb-2 text-lg max-w-185 mx-auto">{data.author}</p>
        </div>
      </div>

      <div className="mx-5 max-w-200 md:mx-auto -mt-25 mb-10">
        <Image
          className="border-4 border-white"
          src={data.image}
          width={1280}
          height={720}
          alt="image"
        />
        
     <div className="blog-content" dangerouslySetInnerHTML={{__html:data.description}}></div>
       
      
        <div className="my-24">
          <p className="text-black font-semibold my-4">
            Share this article on social media
          </p>
          <div className="flex">
            <Image src={assets.facebook_icon} width={50} alt="facebook" />
            <Image src={assets.twitter_icon} width={50} alt="twitter" />
            <Image src={assets.googleplus_icon} width={50} alt="google" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <></>
  );
};

export default Page;
