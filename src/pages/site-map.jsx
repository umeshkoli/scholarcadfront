import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { useAuth, getStoredToken } from "@/context/AuthContext";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { API_BASE_URL, APIENDPOINTS } from "../../apiconfig";
import { HiArrowLongRight } from "react-icons/hi2";
import { RiArrowRightDoubleFill } from "react-icons/ri";

export default function Sitemap() {
  const { categories } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const slugify = (text) => {
    return text
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };
  useEffect(() => {
    const saved = sessionStorage.getItem("userLocation");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserLocation(parsed);
      } catch (e) {
        console.error(" Failed to parse userLocation JSON", e);
      }
    }
  }, []);
  const active_country = useMemo(() => {
    return userLocation?.raw?.country.toLowerCase() || "in";
  }, [userLocation]);

  const active_state = useMemo(() => {
    return userLocation?.state;
  }, [userLocation]);

  const { token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  // 🔹 Fetch blogs by selected blog type ID
  const fetchByType = async (typeId) => {
    const activeToken = token || getStoredToken();
    const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOG_LIST}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
      },
      body: JSON.stringify({
        blog_type_id: typeId,
        page: 1,
        per_page: 20,
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data || [];
  };
  useEffect(() => {
    const activeToken = token || getStoredToken();
    if (!activeToken) return;
    const fetchAllData = async () => {
      try {
        setLoadingBlogs(true);
        const [blogData, articleData] = await Promise.all([
          fetchByType(239),
          fetchByType(241),
        ]);
        setBlogs(blogData || []);
        setArticles(articleData || []);
      } catch (error) {
        console.error("Error fetching Blog & Article:", error);
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchAllData();
  }, [token]);


  return (
    <>
      <Navbar />
      <main className="font-nunito bg-white ">
        <section className="relative  max-w-7xl mx-auto py-5 max-sm:p-3">
          <h1 className="heading_blue text-center">Site Map</h1>
          <div className="text-left mb-10">
            <h1 className="Sub_heading_black">India</h1>
            <h1 className="Sub_heading_black">Course Categories</h1>
            <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 list-disc list-inside">
              {categories?.map((item) => (
                <li key={item?.id} className="text-[#696969]">
                  <Link
                    href={{
                      pathname: `/category-courses/${item?.page_link}`,
                    }}
                    className="hover:text-[#2E318D] transition"
                  >
                    {item?.category_name} 
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="my-10">
            <h1 className="Sub_heading_black">Country Courses</h1>
            <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 list-disc list-inside">
              {categories?.flatMap((category) =>
                category?.cources?.map((course) => (
                  <li key={course?.id} className="text-[#696969]">
                    <Link
                      href={{
                        pathname: `/${slugify(
                          course?.url_title
                        )}`,
                      }}
                      className="hover:text-[#2E318D] transition"
                    >
                      {course?.course_short_name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="my-10">
            <div className="flex justify-between">
              <h1 className="Sub_heading_black">Blog</h1>
              <Link
                href="/blogs"
                className="text-blue-400 flex items-center underline"
              >
                Read More <RiArrowRightDoubleFill />
              </Link>
            </div>
            {loadingBlogs ? (
              <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 list-disc list-inside animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="text-[#696969]">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </ul>
            ) : (
              <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 list-disc list-inside">
                {blogs?.map((blog) => (
                  <li key={blog?.id} className="text-[#696969]">
                    <Link
                      href={{
                        pathname: `/article/${slugify(blog.resource_title)}`,
                        // query: { id: encryptId(blog?.id) },
                      }}
                      className="hover:text-[#2E318D] transition"
                    >
                      {blog?.resource_title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="my-10">
            <div className="flex justify-between">
              <h1 className="Sub_heading_black">Articals</h1>
              <Link
                href="/blogs"
                className="text-blue-400 flex items-center underline"
              >
                Read More <RiArrowRightDoubleFill />
              </Link>
            </div>
            {loadingBlogs ? (
              <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 list-disc list-inside animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="text-[#969494]">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </ul>
            ) : (
              <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 list-disc list-inside">
                {articles?.map((item) => (
                  <li key={item?.id} className="text-[#696969]">
                    <Link
                      href={{
                        pathname: `/article/${slugify(item.resource_title)}`,
                        // query: { id: encryptId(blog?.id) },
                      }}
                      className="hover:text-[#2E318D] transition"
                    >
                      {item?.resource_title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <hr className="text-gray-200 " />
      </main>
      <Footer />
    </>
  );
}
