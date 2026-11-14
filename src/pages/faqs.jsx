import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { useEffect, useState } from "react";
import { FaUser, FaTag, FaCalendarAlt } from "react-icons/fa";
import { CgSmileSad } from "react-icons/cg";
import Link from "next/link";
import { encryptId } from "@/utils/encryption";
import Pagination from "@/Components/Pagination";
import { useAuth, getStoredToken } from "@/context/AuthContext";
import { API_BASE_URL, APIENDPOINTS } from "../../apiconfig";
import Loader from "@/Components/loader";
import { FaAnglesDown } from "react-icons/fa6";
import { DynamicSEO, getCleanCanonicalUrl, generateSupportPageSchema, generateFAQSchema } from "@/lib/seoHelper";

function FAQ() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState(null);
  const [blogTypes, setBlogTypes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(9);

  useEffect(() => {
    const activeToken = token || getStoredToken();
    if (!activeToken) return;
    const fetchBlogTypes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOG_TYPE}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
        });
        if (!res.ok) {
          console.warn("HTTP error! Status:", res.status);
          return;
        }
        const data = await res.json();
        if (data?.data?.length > 0) {
          setBlogTypes(data.data);
          setActiveTab(data.data[0]?.id);
        }
      } catch (err) {
        console.error("Error fetching blog types:", err);
      }
    };
    fetchBlogTypes();
  }, [token]);

  // 🔹 Fetch blogs by selected blog type ID
  useEffect(() => {
    const activeToken = token || getStoredToken();
    if (!activeToken || !activeTab) return;
    const fetchBlogsByType = async () => {
      try {
        setLoadingBlogs(true);
        const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOG_LIST}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({
            blog_type_id: activeTab,
            page: currentPage,
            per_page: perPage,
          }),
        });
        if (!res.ok) {
          console.warn("HTTP error! Status:", res?.status);
          setBlogs([]);
          return;
        }
        const data = await res.json();
        setBlogs(data?.data || []);
        setCurrentPage(data?.pagination?.current_page || 1);
        setTotalPages(data?.pagination?.last_page || 1);
        setPerPage(data?.pagination?.per_page || 9);
      } catch (err) {
        console.error("Error fetching blogs by type:", err);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchBlogsByType();
  }, [activeTab, token, currentPage, perPage]);

  const slugify = (text) => {
    return text
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  const RESOURCE_CATEGORY_MAP = {
    239: "Blog",
    240: "Webinar",
    241: "Article",
    242: "Info",
  };

  const [showNoBlogs, setShowNoBlogs] = useState(false);

  useEffect(() => {
    if (!loadingBlogs && (!blogs || blogs.length === 0)) {
      const timer = setTimeout(() => setShowNoBlogs(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowNoBlogs(false);
    }
  }, [blogs, loadingBlogs]);

  const faqSchema = generateSupportPageSchema({
    pageTitle: "Frequently Asked Questions (FAQs)",
    pageDescription: "Find answers to frequently asked questions about ScholarAcad certification courses, exam formats, training schedules, and support.",
    pageUrl: "/faqs",
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "FAQs", url: "/faqs" },
    ],
  });

  return (
    <>
      <DynamicSEO
        title="Frequently Asked Questions (FAQs) | ScholarAcad"
        description="Find answers to frequently asked questions about ScholarAcad certification courses, exam formats, training schedules, and support."
        canonicalUrl={getCleanCanonicalUrl("/faqs")}
        keywords="faqs, frequently asked questions, certification training faqs, scholaracad help"
        ogTitle="Frequently Asked Questions (FAQs) | ScholarAcad"
        ogDescription="Find answers to frequently asked questions about ScholarAcad certification courses, exam formats, training schedules, and support."
        ogUrl={getCleanCanonicalUrl("/faqs")}
        schemaData={faqSchema}
        robots="index, follow"
      />
      <Navbar />
      <section className="font-nunito bg-[#F7F3FF] max-sm:p-2">
        <div className="max-w-7xl mx-auto py-10">
          <div className="text-center my-6">
            <h1 className="heading">All FAQS</h1>
          </div>

          <section className="py-6 px-5">
            <div className="grid md:grid-cols-[250px_1fr] gap-6">
              {/* Sidebar Tabs */}
              <div className="flex flex-col gap-3">
                {blogTypes && blogTypes?.length > 0 ? (
                  blogTypes?.map((item) => (
                    <button
                      key={item?.id}
                      onClick={() => setActiveTab(item?.id)}
                      className={`text-left px-4 py-3 rounded-md transition-all ${
                        activeTab === item?.id
                          ? "bg-[#b9a8ff] text-white font-semibold"
                          : "bg-white hover:bg-gray-100 text-gray-700 border border-[#DFE0FF]"
                      }`}
                    >
                      {item?.name}
                    </button>
                  ))
                ) : (
                  <p className="text-left px-4 py-3 rounded-md bg-white  text-gray-700 border border-[#DFE0FF] ">
                    No blog types available
                  </p>
                )}
              </div>

              {/* Content Section */}
              <div>
                {loadingBlogs ? (
                  <div className="grid grid-cols-1  gap-6 flex-1">
                    {Array?.from({ length: 6 })?.map((_, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg  overflow-hidden animate-pulse"
                      >
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                          <div className="h-6 bg-gray-300 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          <div className="flex justify-between items-center text-sm">
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : blogs?.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1  gap-6 flex-1">
                      {blogs?.map((blog) => (
                        <div
                          key={blog?.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                        >
                          <div className="p-4">
                            <h2 className="font-semibold text-gray-800 mb-2 leading-snug">
                              {blog?.resource_title?.length > 50
                                ? blog.resource_title.slice(0, 50) + "..."
                                : blog?.resource_title}
                            </h2>
                            <hr className="my-2 text-gray-300" />
                            <div className="flex justify-between items-center text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-[#2E318D]" />
                                <p>
                                  {blog?.created_at
                                    ? new Date(
                                        blog.created_at
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                      })
                                    : "Dec 20, 2025"}
                                </p>
                              </div>
                              <Link
                                title="Read More"
                                href={{
                                  pathname: `/article/${slugify(
                                    blog.resource_title
                                  )}`,
                                  // query: { id: encryptId(blog?.id) },
                                }}
                                className="text-[#2E318D] flex gap-1 items-center hover:bg-[#2E318D] hover:text-white cursor-pointer font-medium border rounded-full py-1.5 px-5"
                              >
                                Read More <FaAnglesDown className="text-xs" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-end">
                      {totalPages > 1 && (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={(page) => {
                            if (page < 1 || page > totalPages) return;
                            setCurrentPage(page);
                          }}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  showNoBlogs && (
                    <div className="flex flex-col items-center justify-center h-60 bg-white rounded-lg border border-[#DFE0FF] p-6 mx-4 sm:mx-0">
                      <div className="flex flex-col items-center gap-4 animate-pulse">
                        <CgSmileSad className="text-5xl text-gray-400" />
                        <h1 className="text-gray-500 text-lg font-semibold">
                          No blogs found
                        </h1>
                        <p className="text-gray-400 text-sm text-center max-w-xs">
                          We couldn't find any blogs for this category. Check
                          back later or explore other categories.
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default FAQ;
