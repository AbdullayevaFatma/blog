import Link from 'next/link'
import { Facebook, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="relative bg-emerald-950 py-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent)]" />
      <div className="relative z-10 flex justify-around flex-col gap-6 sm:gap-0 sm:flex-row items-center px-5">
        <Link href="/">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-emerald-50 cursor-pointer hover:text-emerald-100 transition-colors duration-300">
            blog.
          </h1>
        </Link>
        <p className='text-sm text-gray-300'>
          All rights reserved. Copyright © 
          <span className="text-emerald-100 font-semibold"> blog.</span>
        </p>
        <div className='flex gap-3'>
          <a 
            href="#" 
            className="p-2 rounded-full bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 hover:text-emerald-50 transition-all duration-300 hover:scale-110"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a 
            href="#" 
            className="p-2 rounded-full bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 hover:text-emerald-50 transition-all duration-300 hover:scale-110"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a 
            href="#" 
            className="p-2 rounded-full bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 hover:text-emerald-50 transition-all duration-300 hover:scale-110"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer