"use client"
import BlogItem from "./BlogItem"
import { useEffect, useState } from "react"
import axios from "axios"


const BlogList = () => {
  const [menu,setMenu] = useState("All")
  const [blogs,setBlogs] = useState([])
  const [loading, setLoading] = useState(true)  // Başlangıçta yükleniyor
const [error, setError] = useState(null) 
const categories = ["All", "Technology", "Startup", "Lifestyle"] 
const fetchBlogs = async () => {
  try {
    // setLoading(true) burada YOK çünkü zaten başlangıçta true
    const response = await axios.get("/api/blog")
    setBlogs(response.data.blogs)
  } catch (error) {
    console.error( error)
    setError('Bloglar yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.')
  } finally {
    setLoading(false)
  }
}

  useEffect(()=>{
    fetchBlogs()
  },[])

  if (loading) {
  return (
    <div className="flex justify-center items-center min-h-100">
      <p className="text-lg">Loading...</p>
    </div>
  )
}
if (error) {
  return (
    <div className="flex justify-center items-center-100">
      <div className="text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchBlogs}
          className="bg-black text-white py-2 px-4 rounded"
        >
         Try Again
        </button>
      </div>
    </div>
  )
}
if (blogs.length === 0) {
  return (
    <div className="flex justify-center items-center min-h-100">
      <p className="text-lg text-gray-600">No posts found.</p>
    </div>
  )
}
  return (
    <div>
      <div className="flex justify-center gap-6 my-10">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setMenu(cat)}
          className={
            menu === cat 
              ? "bg-black text-white py-1 px-4 rounded-sm cursor-pointer" 
              : "py-1 px-4 rounded-sm cursor-pointer hover:bg-gray-100"
          }
        >
          {cat}
        </button>
      ))}
    </div>
      <div className="flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24">
        {
          blogs.filter((item)=>menu=== "All" ? true : item.category===menu).map((item)=>{
            return <BlogItem key={item._id} id={item._id} image={item.image} title={item.title} description={item.description} category={item.category}/>
          })
        }
      </div>
    </div>
  )
}

export default BlogList