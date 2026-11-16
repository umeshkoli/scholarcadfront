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
import { CiCircleCheck, CiSearch } from "react-icons/ci";
import { CiWarning } from "react-icons/ci";
import { CiCircleRemove } from "react-icons/ci";
import { getBlogImageUrl } from "@/utils/imageHelper";
function blogs() {
  const { token, login } = useAuth();
  const [activeTab, setActiveTab] = useState(239);
  const [blogTypes, setBlogTypes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const { categories } = useAuth();
  const [activeTab2, setActiveTab2] = useState(0);
  console.log("categories", categories);
  // 🔹 Fetch all blog types
  useEffect(() => {
    const fetchBlogTypes = async () => {
      try {
        const activeToken = token || getStoredToken();
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        };
        const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOG_TYPE}`, {
          headers,
        });
        if (res.status === 401 && login) {
          const loginRes = await login();
          if (loginRes?.success && loginRes?.token) {
            const retryRes = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOG_TYPE}`, {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${loginRes.token}`,
              },
            });
            if (retryRes.ok) {
              const retryData = await retryRes.json();
              if (retryData?.data?.length > 0) {
                setBlogTypes(retryData.data);
                return;
              }
            }
          }
        }
        if (!res.ok) {
          console.warn("HTTP error! Status:", res.status);
          return;
        }
        const data = await res.json();
        if (data?.data?.length > 0) {
          setBlogTypes(data.data);
          setActiveTab((prev) => prev || data.data[0]?.id || 239);
        }
      } catch (err) {
        console.error("Error fetching blog types:", err);
      }
    };
    fetchBlogTypes();
  }, [token]);

  // 🔹 Fetch blogs by selected blog type ID
  useEffect(() => {
    if (!activeTab) return;
    const fetchBlogsByType = async () => {
      try {
        setLoadingBlogs(true);
        const payload = {
          blog_type_id: activeTab,
          page: currentPage,
          per_page: perPage,
        };

        if (activeTab2 !== 0) {
          payload.course_category_id = activeTab2;
        }
        const activeToken = token || getStoredToken();
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        };
        const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOG_LIST}`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        if (res?.status === 401 && login) {
          const loginRes = await login();
          if (loginRes?.success && loginRes?.token) {
            const retryRes = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOG_LIST}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${loginRes.token}`,
              },
              body: JSON.stringify(payload),
            });
            if (retryRes.ok) {
              const retryData = await retryRes.json();
              setBlogs(retryData?.data || []);
              setCurrentPage(retryData?.pagination?.current_page || 1);
              setTotalPages(retryData?.pagination?.last_page || 1);
              setPerPage(retryData?.pagination?.per_page || 6);
              return;
            }
          }
        }
        if (!res.ok) {
          console.warn("HTTP error! Status:", res?.status);
          setBlogs([]);
          return;
        }
        const data = await res.json();
        setBlogs(data?.data || []);
        setCurrentPage(data?.pagination?.current_page || 1);
        setTotalPages(data?.pagination?.last_page || 1);
        setPerPage(data?.pagination?.per_page || 6);
      } catch (err) {
        console.error("Error fetching blogs by type:", err);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchBlogsByType();
  }, [activeTab, activeTab2, token, currentPage]);

  const tabs = [
    { id: 0, label: "All" },
    ...categories.map((cat) => ({
      id: cat.id,
      label: cat.category_name,
    })),
  ];
  useEffect(() => {
    let updatedblogs = [];
    if (activeTab === 0) {
      // All Courses
      updatedblogs = categories.flatMap((cat) =>
        (cat.cources || []).map((cources) => ({
          ...cources,
          category_name: cat.category_name,
        }))
      );
    } else {
      // Selected Category
      const selectedCat = categories[activeTab2 - 1];
      updatedblogs = (selectedCat?.cources || []).map((cources) => ({
        ...cources,
        category_name: selectedCat.category_name,
      }));
    }
  }, [activeTab, categories]);

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
      const timer = setTimeout(() => setShowNoBlogs(true));
      return () => clearTimeout(timer);
    } else {
      setShowNoBlogs(false);
    }
  }, [blogs, loadingBlogs]);

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    if (!searchText.trim()) {
      setResult("No match found");
      return;
    }
    try {
      setLoading(true);
      setResult("");
      const activeToken = token || getStoredToken();
      const response = await fetch(
        `${API_BASE_URL}${APIENDPOINTS.BLOG_SEARCH}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
          },
          body: JSON.stringify({
            filter: searchText,
          }),
        }
      );
      const data = await response.json();
      // console.log("data--->blog search", data?.data);
      if (data?.status == true) {
        setResult(data?.data);
      } else {
        setResult("No match found");
      }
    } catch (error) {
      console.error(error);
      setResult("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="font-nunito bg-[#F7F3FF] max-sm:p-2">
        <div className="max-w-7xl mx-auto py-10">
          <div className="">
            {/* Header Section */}
            <div className="grid grid-cols-1 ">
              <div className="">
                <h1 className="heading">Explore Our Latest Blogs</h1>
                <h2 className="max-w-[80%] font-semibold text-md text-[#535353] mt-1">
                  Explore trends, insights, and helpful advice for earning
                  certifications and advancing your career.
                </h2>
              </div>
            </div>
          </div>
          <section className="py-7 ">
            <div className="grid grid-cols-[93%_5%] items-center gap-2 ">
              {!showSearch && (
                <div className="bg-white border border-[#882CFB] rounded-md  shadow-md mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  <div className="flex flex-row gap-2 whitespace-nowrap overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent p-2">
                    {tabs?.map((tab) => (
                      <button
                        title={tab?.label}
                        key={tab?.id}
                        onClick={() => {
                          setActiveTab2(tab?.id);
                          setCurrentPage(1);
                        }}
                        className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition cursor-pointer
                        ${
                          activeTab2 === tab?.id
                            ? "bg-[#E2D2FFB2] text-[#2E318D] border border-[#882CFB]"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                        }
                      `}
                      >
                        {tab?.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="">
                {!showSearch && (
                  <button
                    type="Search"
                    onClick={() => setShowSearch(true)}
                    className="text-[#882CFB] bg-white border border-[#882CFB] px-2 py-[20px] mb-[15px] rounded flex items-center gap-1 hover:bg-[#882CFB] hover:text-white transition cursor-pointer text-sm  "
                  >
                    <CiSearch />
                    Search
                  </button>
                )}
                {/* Search Section */}
                {showSearch && (
                  <div className="flex justify-end  items-center gap-2  p-2  mb-4 w-full">
                    <div className="">
                      <input
                        type="text"
                        placeholder="Enter Title For Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="border bg-white border-gray-300 px-4 py-2 w-72 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-1">
                      <button
                        title="Search"
                        onClick={handleSearch}
                        className="bg-[#882CFB] cursor-pointer text-sm text-white px-2 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-1"
                      >
                        <CiSearch className="" />
                        Search
                      </button>

                      <button
                        title="Cancel"
                        onClick={() => {
                          setShowSearch(false);
                          setSearchText("");
                          setResult("");
                        }}
                        className="border cursor-pointer border-gray-400 text-gray-700 px-2 py-2 rounded-md hover:bg-red-200 transition text-sm flex items-center gap-1"
                      >
                        <CiCircleRemove />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-[250px_1fr] gap-6">
              {/* Sidebar Tabs */}
              <div className="flex flex-col gap-3">
                {blogTypes && blogTypes?.length > 0 ? (
                  blogTypes?.map((item) => (
                    <button
                      key={item?.id}
                      disabled={showSearch}
                      onClick={() => setActiveTab(item?.id)}
                      className={`text-left px-4 py-3 rounded-md transition-all
                        ${
                          activeTab === item?.id
                            ? "bg-[#b9a8ff] text-white font-semibold"
                            : "bg-white hover:bg-gray-100 text-gray-700 border border-[#DFE0FF]"
                        }
                        ${
                          showSearch
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }
                      `}
                    >
                      {item?.name}
                    </button>
                  ))
                ) : (
                  <p className="text-left px-4 py-3 rounded-md bg-white text-gray-700 border border-[#DFE0FF]">
                    No blog types available
                  </p>
                )}
              </div>

              {/* Content Section */}
              <div>
                <div>
                  {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                      {Array?.from({ length: 3 })?.map((_, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-lg  overflow-hidden animate-pulse"
                        >
                          <div className="w-full h-44 bg-gray-200" />
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
                  )}
                  {((Array?.isArray(result) && result?.length === 0) ||
                    result === "No match found") && (
                    <div className="w-full flex flex-col items-center justify-center py-8 bg-white rounded-md border border-gray-200">
                      <CiWarning className="text-4xl text-red-500 mb-3" />
                      <p className="text-center text-red-600 font-semibold text-lg">
                        No Data found
                      </p>
                      <p className="text-center text-gray-500 text-sm">
                        Try adjusting your search or search by title.
                      </p>
                    </div>
                  )}

                  {result && (
                    <section className="w-full  ">
                      <div className="max-w-7xl mx-auto px-4 flex justify-center">
                        <div>
                          {result === "No match found" ? (
                            <></>
                          ) : (
                            <>
                              <div className="max-w-7xl mx-auto px-4 grid gap-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                                  {result?.map((blog) => (
                                    <div
                                      key={blog?.id}
                                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                                    >
                                      <img
                                        src={getBlogImageUrl(blog)}
                                        alt={blog?.resource_title || blog?.title || "Blog Image"}
                                        onError={(e) => {
                                          e.currentTarget.src = "/assets/landingpage/blog1_image.png";
                                        }}
                                        className="w-full h-44 object-cover border-b border-gray-200"
                                      />
                                      <div className="p-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                          <FaUser className="text-[#2E318D]" />{" "}
                                          {blog?.resource_auther ||
                                            "Scholaracad"}
                                          <FaTag className="text-[#2E318D]" />{" "}
                                          <p className="text-gray-500">
                                            {RESOURCE_CATEGORY_MAP[
                                              blog?.resource_category
                                            ] || "General"}
                                          </p>
                                        </div>
                                        <h2 className="font-semibold text-gray-800 mb-2 leading-snug">
                                          {blog?.resource_title?.length > 50
                                            ? blog.resource_title.slice(0, 50) +
                                              "..."
                                            : blog?.resource_title}
                                        </h2>
                                        <p className="para">
                                          {blog?.short_description?.length > 100
                                            ? blog.short_description.slice(
                                                0,
                                                100
                                              ) + "..."
                                            : blog?.short_description}
                                        </p>
                                        <hr className="my-2 text-gray-300" />
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                          <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-[#2E318D]" />
                                            <p>
                                              {blog?.created_at
                                                ? new Date(
                                                    blog.created_at
                                                  ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                      year: "numeric",
                                                      month: "short",
                                                      day: "2-digit",
                                                    }
                                                  )
                                                : "NA"}
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
                                            className="text-[#882CFB] hover:bg-[#882CFB] hover:text-white cursor-pointer font-medium border rounded-full py-1.5 px-5"
                                          >
                                            Read More →
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </section>
                  )}
                </div>
                {!showSearch && (
                  <>
                    {loadingBlogs ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                        {Array?.from({ length: 6 })?.map((_, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-lg  overflow-hidden animate-pulse"
                          >
                            <div className="w-full h-44 bg-gray-200" />
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                          {blogs?.map((blog) => (
                            <div
                              key={blog?.id}
                              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition flex flex-col justify-between"
                            >
                              <div>
                                <img
                                  src={getBlogImageUrl(blog)}
                                  alt={blog?.resource_title || blog?.title || "Blog"}
                                  onError={(e) => {
                                    if (!e.currentTarget.dataset.triedLive) {
                                      e.currentTarget.dataset.triedLive = "true";
                                      const clean = (blog?.header_image || blog?.image || "").replace(/^\/+/, "");
                                      if (clean) {
                                        e.currentTarget.src = `https://knowledgeadmin.scholaracad.com/master/secure-documents?path=${encodeURIComponent(clean)}`;
                                        return;
                                      }
                                    }
                                    e.currentTarget.src = "/assets/landingpage/blog1_image.png";
                                  }}
                                  className="w-full h-44 object-cover"
                                />
                                <div className="p-4">
                                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <FaUser className="text-[#2E318D]" />{" "}
                                    {blog?.resource_auther || "Scholaracad"}
                                    <FaTag className="text-[#2E318D]" />{" "}
                                    <p className="text-gray-500">
                                      {RESOURCE_CATEGORY_MAP[
                                        blog?.resource_category
                                      ] || "General"}
                                    </p>
                                  </div>
                                  <h2 title={blog?.resource_title} className="font-semibold text-gray-800 mb-2 leading-snug line-clamp-2">
                                    {blog?.resource_title}
                                  </h2>
                                </div>
                              </div>

                              <div className="p-4 pt-0">
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
                                        : "NA"}
                                    </p>
                                  </div>
                                  <Link
                                    title="Read More"
                                    href={`/article/${blog?.url_title || blog?.slug || slugify(blog.resource_title)}`}
                                    className="text-[#882CFB] hover:bg-[#882CFB] hover:text-white cursor-pointer font-medium border border-[#882CFB]/40 rounded-full py-1.5 px-5 transition"
                                  >
                                    Read More →
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Pagination */}
                        <div className="flex justify-center mt-8 mb-6">
                          {totalPages >= 1 && blogs?.length > 0 && (
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
                              No Data found
                            </h1>
                            <p className="text-gray-400 text-sm text-center max-w-xs">
                              We couldn't find any data for this category or
                              type. Check back later or explore other
                              categories.
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </>
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

export default blogs;

export async function getStaticProps() {
  return {
    props: {
      title: "ScholarAcad Blogs | Expert Articles on Agile, Scrum & More",
      description:
        "Explore ScholarAcad blogs for professional advice on project management, Agile, Scrum, ITIL, PRINCE2, DevOps, and certification trends and many more. ",
      keywords:
        "Scholaracad blogs, ITIL and DevOps blogs ,Scholaracad all blogs",
    },
  };
}
