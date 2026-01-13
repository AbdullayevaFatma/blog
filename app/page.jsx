"use client";

"use client";

import Header from "../components/Header"; // alias kullanmadan direkt path
import Footer from "../components/Footer";
import BlogList from "../components/BlogList";



export default function Home() {
  return (
    <>
      <Header />
      <main className="grow">
        <BlogList />
      </main>
      <Footer />
    </>
  );
}
