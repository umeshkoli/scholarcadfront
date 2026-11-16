import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { useEffect, useState } from "react";
import { FaUser, FaTag, FaCalendarAlt, FaLaptop, FaChalkboardTeacher } from "react-icons/fa";
import { CgSmileSad } from "react-icons/cg";
import Link from "next/link";
import { encryptId } from "@/utils/encryption";
import Pagination from "@/Components/Pagination";
import { useAuth, getStoredToken } from "@/context/AuthContext";
import { API_BASE_URL, APIENDPOINTS } from "../../../apiconfig";
import Loader from "@/Components/loader";
import { CiCircleCheck, CiSearch } from "react-icons/ci";
import { CiWarning } from "react-icons/ci";
import { useRouter } from "next/router";
import { getBlogImageUrl } from "@/utils/imageHelper";

function blogs() {
  const router = useRouter();
  const { token, login } = useAuth();
  const [activeTab, setActiveTab] = useState(null);
  const [blogTypes, setBlogTypes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const { categories } = useAuth();
  const [activeTab2, setActiveTab2] = useState(0);
  const [title, setTitle] = useState("");

  const queryTitleLower = router.query?.title ? String(router.query.title).toLowerCase() : "";
  const isQuizMode = ["quiz", "quizzes"].includes(queryTitleLower);
  const isSupportPageMode = ["support-page", "support", "support-pages"].includes(queryTitleLower);

  const slugify = (text) => {
    return text
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  const getImageSrc = (img) => getBlogImageUrl(img);

  const RESOURCE_CATEGORY_MAP = {
    239: "Blog",
    240: "Webinar",
    241: "Article",
    242: "Info",
  };

  const Selectedtab = isQuizMode
    ? "Quiz"
    : isSupportPageMode
      ? "Support Page"
      : (RESOURCE_CATEGORY_MAP[Number(activeTab)] || "Article").toLowerCase();

  const RESOURCE_TITLE_TO_ID = Object.entries(RESOURCE_CATEGORY_MAP).reduce(
    (acc, [id, title]) => {
      acc[title.toLowerCase()] = Number(id);
      return acc;
    },
    {}
  );

  // Fetch blog types or setup category types for Quiz/SupportPage
  useEffect(() => {
    if (!router.isReady) return;
    const { title: queryTitle } = router.query;
    const qLower = queryTitle ? String(queryTitle).toLowerCase() : "";

    const capitalizeFirstLetter = (str) => {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    if (["quiz", "quizzes"].includes(qLower)) {
      setTitle("Quiz");
      setActiveTab("all");
      setBlogTypes([
        { id: "all", name: "All Quizzes" },
      ]);
      return;
    }

    if (["support-page", "support", "support-pages"].includes(qLower)) {
      setTitle("Support Page");
      setActiveTab("all");
      setBlogTypes([
        { id: "all", name: "All Support Pages" },
        { id: "syllabus", name: "Syllabus" },
        { id: "exam-format", name: "Exam Format" },
        { id: "practice-test", name: "Practice Test" },
      ]);
      return;
    }

    setTitle(capitalizeFirstLetter(queryTitle));
    const idFromTitle = RESOURCE_TITLE_TO_ID[qLower];
    if (idFromTitle) {
      setActiveTab(idFromTitle);
    } else {
      setActiveTab(241); // Default to Article
    }

    const fetchBlogTypes = async () => {
      try {
        const activeToken = token || getStoredToken();
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        };
        const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOG_TYPE}`, { headers });
        if (!res.ok) {
          console.warn("HTTP error! Status:", res.status);
          return;
        }
        const data = await res.json();
        if (data?.data?.length > 0) {
          setBlogTypes(data?.data);
        }
      } catch (err) {
        console.error("Error fetching blog types:", err);
      }
    };
    fetchBlogTypes();
  }, [token, router.isReady, router.query]);

  // Fetch blogs/quizzes/support-pages by selected type and category
  useEffect(() => {
    if (!activeTab && !isQuizMode && !isSupportPageMode) return;
    const fetchResources = async () => {
      try {
        setLoadingBlogs(true);
        let endpoint = `${API_BASE_URL}${APIENDPOINTS.BLOG_LIST}`;
        let payload = {};

        if (isQuizMode) {
          endpoint = `${API_BASE_URL}${APIENDPOINTS.RESOURCE_QUIZZES}`;
          payload = {
            page: currentPage,
            per_page: perPage,
          };
          if (activeTab2 !== 0) {
            payload.course_category_id = activeTab2;
          }
        } else if (isSupportPageMode) {
          endpoint = `${API_BASE_URL}${APIENDPOINTS.RESOURCE_SUPPORT_PAGES}`;
          payload = {
            page: currentPage,
            per_page: perPage,
          };
          if (activeTab && activeTab !== "all") {
            payload.type = activeTab;
          }
          if (activeTab2 !== 0) {
            payload.course_category_id = activeTab2;
          }
        } else {
          endpoint = `${API_BASE_URL}${APIENDPOINTS.BLOG_LIST}`;
          payload = {
            blog_type_id: activeTab,
            page: currentPage,
            per_page: perPage,
          };
          if (activeTab2 !== 0) {
            payload.course_category_id = activeTab2;
          }
        }

        const activeToken = token || getStoredToken();
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        };

        const res = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
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
        console.error("Error fetching resources:", err);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchResources();
  }, [activeTab, activeTab2, token, currentPage, router.query?.title]);

  const tabs = [
    { id: 0, label: "All" },
    ...categories.map((cat) => ({
      id: cat.id,
      label: cat.category_name,
    })),
  ];

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
      let searchEndpoint = `${API_BASE_URL}${APIENDPOINTS.BLOG_SEARCH}`;
      let searchBody = { filter: searchText };

      if (isQuizMode) {
        searchEndpoint = `${API_BASE_URL}${APIENDPOINTS.RESOURCE_QUIZZES}`;
        searchBody = { search: searchText };
      } else if (isSupportPageMode) {
        searchEndpoint = `${API_BASE_URL}${APIENDPOINTS.RESOURCE_SUPPORT_PAGES}`;
        searchBody = { search: searchText };
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(searchEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(searchBody),
      });
      const data = await response.json();
      if (data?.status == true || data?.success == true) {
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
      <section className="font-nunito bg-[#F7F3FF] max-sm:p-2 min-h-screen">
        <div className="max-w-7xl mx-auto py-10">
          <div>
            {/* Header Section */}
            <div className="grid grid-cols-1">
              <div>
                <h1 className="heading">
                  {isQuizMode
                    ? "Explore Certification Quizzes & Mock Exams"
                    : isSupportPageMode
                      ? "Explore Course Support Pages & Study Guides"
                      : "Explore Our Latest Resources"}
                </h1>
                <h2 className="max-w-[80%] font-semibold text-md text-[#535353] mt-1">
                  {isQuizMode
                    ? "Practice with exam-aligned questions and mock assessments across top certification domains."
                    : isSupportPageMode
                      ? "Access comprehensive syllabuses, exam formats, notes, and study roadmaps category-wise."
                      : "Explore trends, insights, and helpful advice for earning certifications and advancing your career."}
                </h2>
              </div>
            </div>
          </div>

          <section className="py-5">
            <div className="grid grid-cols-1 md:grid-cols-[93%_5%] items-center gap-2">
              {!showSearch && (
                <div className="bg-white border border-[#882CFB] rounded-md shadow-md mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
                        ${activeTab2 === tab?.id
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
              <div>
                {!showSearch && (
                  <button
                    type="button"
                    onClick={() => setShowSearch(true)}
                    className="text-[#882CFB] bg-white border border-[#882CFB] px-2 py-3 md:py-[20px] mb-[15px] rounded flex items-center gap-1 hover:bg-[#882CFB] hover:text-white transition cursor-pointer text-sm"
                  >
                    <CiSearch />
                    Search
                  </button>
                )}
                {/* Search Section */}
                {showSearch && (
                  <div className="flex flex-wrap justify-end items-center gap-2 p-2 mb-4 w-full">
                    <div>
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
                        <CiSearch />
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
                      onClick={() => {
                        setActiveTab(item?.id);
                        setCurrentPage(1);
                      }}
                      className={`text-left px-4 py-3 rounded-md transition-all
                        ${activeTab === item?.id
                          ? "bg-[#b9a8ff] text-white font-semibold"
                          : "bg-white hover:bg-gray-100 text-gray-700 border border-[#DFE0FF]"
                        }
                        ${showSearch
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
                    {isQuizMode ? "All Quizzes" : isSupportPageMode ? "All Support Pages" : "No types available"}
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
                          className="bg-white rounded-lg overflow-hidden animate-pulse"
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

                  {Array.isArray(result) && result.length > 0 && (
                    <section className="w-full mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                        {result?.map((item) => (
                          <div
                            key={item?.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition p-4 border"
                          >
                            <h2 className="font-semibold text-gray-800 mb-2">
                              {item?.resource_title || item?.title}
                            </h2>
                            <Link
                              href={
                                isQuizMode
                                  ? item?.quiz_url || `/course-quizzes/${item?.course_slug}/${item?.slug}`
                                  : isSupportPageMode
                                    ? item?.page_url || `/${item?.course_slug}/${item?.slug || item?.type}`
                                    : `/article/${item?.url_title || item?.slug || slugify(item?.resource_title)}`
                              }
                              className="text-[#882CFB] font-medium text-sm hover:underline"
                            >
                              View Details →
                            </Link>
                          </div>
                        ))}
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
                            className="bg-white rounded-lg overflow-hidden animate-pulse"
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
                          {blogs?.map((item) => {
                            if (isQuizMode) {
                              return (
                                <div
                                  key={item?.id}
                                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#882CFB] transition flex flex-col justify-between"
                                >
                                  <div className="p-5">
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E2D2FF] text-[#2E318D]">
                                        {item?.category_name || "Assessment"}
                                      </span>
                                      <span className="text-xs text-gray-500 font-medium">
                                        {item?.total_questions || 30} Qs
                                      </span>
                                    </div>
                                    <h2
                                      title={item?.title}
                                      className="font-bold text-lg text-gray-800 mb-2 leading-snug line-clamp-2"
                                    >
                                      {item?.title}
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-3">
                                      Course: <span className="font-semibold text-gray-700">{item?.course_title}</span>
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg">
                                      <span>? {item?.duration_minutes || 60} Mins</span>
                                      <span>?? Passing: {item?.passing_score || 70}%</span>
                                    </div>
                                  </div>
                                  <div className="p-5 pt-0">
                                    <hr className="my-3 text-gray-200" />
                                    <div className="flex justify-end items-center">
                                      <Link
                                        title="Take Quiz"
                                        href={item?.quiz_url || `/course-quizzes/${item?.course_slug}/${item?.slug}`}
                                        className="bg-[#882CFB] text-white hover:bg-[#2E318D] transition cursor-pointer font-medium text-sm rounded-full py-2 px-5"
                                      >
                                        Take Quiz ?
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            if (isSupportPageMode) {
                              return (
                                <div
                                  key={item?.id}
                                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#882CFB] transition flex flex-col justify-between"
                                >
                                  <div className="p-5">
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#B9D09A66] text-[#2E318D]">
                                        {item?.type_label || item?.type || "Guide"}
                                      </span>
                                      <span className="text-xs text-gray-500 font-medium">
                                        {item?.category_name || "Course"}
                                      </span>
                                    </div>
                                    <h2
                                      title={item?.title}
                                      className="font-bold text-lg text-gray-800 mb-2 leading-snug line-clamp-2"
                                    >
                                      {item?.title}
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-3">
                                      Course: <span className="font-semibold text-gray-700">{item?.course_title}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 line-clamp-2">
                                      {item?.seo_description || `Official curriculum and preparation roadmap for ${item?.course_title}.`}
                                    </p>
                                  </div>
                                  <div className="p-5 pt-0">
                                    <hr className="my-3 text-gray-200" />
                                    <div className="flex justify-end items-center">
                                      <Link
                                        title="View Page"
                                        href={item?.page_url || `/${item?.course_slug}/${item?.slug || item?.type}`}
                                        className="bg-[#2E318D] text-white hover:bg-[#882CFB] transition cursor-pointer font-medium text-sm rounded-full py-2 px-5"
                                      >
                                        View Page ?
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // Default: Article / Blog card
                            return (
                              <div
                                key={item?.id}
                                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition flex flex-col justify-between"
                              >
                                <div>
                                  <img
                                    src={getBlogImageUrl(item)}
                                    alt={item?.resource_title || item?.title || "Article"}
                                    onError={(e) => {
                                      if (!e.currentTarget.dataset.triedLive) {
                                        e.currentTarget.dataset.triedLive = "true";
                                        const clean = (item?.header_image || item?.image || "").replace(/^\/+/, "");
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
                                      {item?.resource_auther || "Scholaracad"}
                                      <FaTag className="text-[#2E318D]" />{" "}
                                      <p className="text-gray-500">
                                        {RESOURCE_CATEGORY_MAP[item?.resource_category] || "Article"}
                                      </p>
                                    </div>
                                    <h2
                                      title={item?.resource_title}
                                      className="font-semibold text-gray-800 mb-2 leading-snug line-clamp-2"
                                    >
                                      {item?.resource_title}
                                    </h2>
                                  </div>
                                </div>

                                <div className="p-4 pt-0">
                                  <hr className="my-2 text-gray-300" />
                                  <div className="flex justify-between items-center text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                      <FaCalendarAlt className="text-[#2E318D]" />
                                      <p>
                                        {item?.created_at
                                          ? new Date(item.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "2-digit",
                                          })
                                          : "NA"}
                                      </p>
                                    </div>
                                    <Link
                                      title="Read More"
                                      href={`/article/${item?.url_title || item?.slug || slugify(item?.resource_title)}`}
                                      className="text-[#882CFB] hover:bg-[#882CFB] hover:text-white cursor-pointer font-medium border border-[#882CFB]/40 rounded-full py-1.5 px-5 transition"
                                    >
                                      Read More →
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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
                            <p className="text-gray-500 text-lg font-semibold">
                              No Data found
                            </p>
                            <p className="text-gray-400 text-sm text-center max-w-xs">
                              We couldn't find any data for this category or type. Check back later or explore other categories.
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
