import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaTag,
  FaCalendarAlt,
  FaAngleRight,
  FaChevronDown,
  FaChevronUp,
  FaRegImage,
} from "react-icons/fa";
import { AiTwotoneHome } from "react-icons/ai";
import Link from "next/link";
import { SlCalender } from "react-icons/sl";
import { MdOutlineAccessTime } from "react-icons/md";
import { GoEye } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { useRouter } from "next/router";
import DOMPurify from "dompurify";
import { decryptId } from "@/utils/encryption";
import { encryptId } from "@/utils/encryption";
import { useAuth, getStoredToken } from "@/context/AuthContext";
import Loader from "@/Components/loader";
import { API_BASE_URL, APIENDPOINTS } from "../../../apiconfig";
import { getBlogImageUrl } from "@/utils/imageHelper";
import { Nunito } from "next/font/google";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Head from "next/head";
import ShareThis from "@/Components/sharethis";
import { BsFilterLeft, BsListUl } from "react-icons/bs";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700"],
});
function BlogDetails({ initialBlog }) {
  const { token } = useAuth();
  const router = useRouter();
  const [blog, setBlog] = useState(initialBlog || null);
  const [loading, setLoading] = useState(!initialBlog);
  const [realId, setRealId] = useState(null);
  const [sanitizedHtml, setSanitizedHtml] = useState("");
  const [Recentblogs, setRecentBlogs] = useState([]);
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

  const [expanded, setExpanded] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogId, setBlogId] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    const { title, id } = router.query;
    setBlogTitle(title);
    setBlogId(id);
  }, [router.asPath, router.isReady]);

  // Fetch blog when token and blogTitle are ready
  useEffect(() => {
    if (!blogTitle) return;

    if (
      initialBlog &&
      (initialBlog.url_title === blogTitle ||
        slugify(initialBlog.resource_title) === blogTitle ||
        String(initialBlog.id) === blogTitle)
    ) {
      setBlog(initialBlog);
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      setLoading(true);
      try {
        const activeToken = token || getStoredToken();
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        };

        // 1. Try direct fetch with blogTitle
        const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOG_DETAIL}`, {
          method: "POST",
          headers,
          body: JSON.stringify({ blog_id: blogTitle }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.data) {
            setBlog(data.data);
            setLoading(false);
            return;
          }
        }

        // 2. Fallback: Search blog list if direct url_title didn't match
        const listRes = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOG_LIST}`, {
          method: "POST",
          headers,
          body: JSON.stringify({ blog_type_id: 241, per_page: 100 }),
        });

        if (listRes.ok) {
          const listData = await listRes.json();
          const blogsList = listData?.data || [];
          const matched = blogsList.find((b) => {
            const cleanUrlTitle = (b.url_title || "").toLowerCase();
            const cleanQuery = blogTitle.toLowerCase();
            const cleanSlug = slugify(b.resource_title || "");
            return cleanUrlTitle === cleanQuery || cleanSlug === cleanQuery || String(b.id) === cleanQuery;
          });

          if (matched && matched.url_title) {
            const detailRes = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOG_DETAIL}`, {
              method: "POST",
              headers,
              body: JSON.stringify({ blog_id: matched.url_title }),
            });
            if (detailRes.ok) {
              const detailData = await detailRes.json();
              if (detailData?.data) {
                setBlog(detailData.data);
                setLoading(false);
                return;
              }
            }
            setBlog(matched);
            setLoading(false);
            return;
          }
        }

        setBlog(null);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogTitle, token, initialBlog]);

  useEffect(() => {
    if (blog?.overview) {
      setSanitizedHtml(DOMPurify.sanitize(blog?.overview));
    } else {
      setSanitizedHtml("");
    }
  }, [blog?.overview]);

  // Read More and Read Less
  const contentRef = useRef(null);
  const INITIAL_HEIGHT = 500;
  const STEP_HEIGHT = 400;
  const [visibleHeight, setVisibleHeight] = useState(INITIAL_HEIGHT);
  const [fullHeight, setFullHeight] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    if (contentRef.current) {
      setFullHeight(contentRef.current.scrollHeight);
    }
  }, [sanitizedHtml]);
  const handleToggle = () => {
    if (!isExpanded) {
      const newHeight = visibleHeight + STEP_HEIGHT;
      if (newHeight >= fullHeight) {
        setVisibleHeight(fullHeight);
        setIsExpanded(true);
      } else {
        setVisibleHeight(newHeight);
      }
    } else {
      setVisibleHeight(INITIAL_HEIGHT);
      setIsExpanded(false);
    }
  };
  const showButton = fullHeight > INITIAL_HEIGHT;

  //  Fetch recent blogs when token is ready
  useEffect(() => {
    const activeToken = token || getStoredToken();
    if (!activeToken) return;

    const fetchRecentBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.RECENT_POSTS}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
        });
        if (!res.ok) {
          console.log("HTTP error! Status:", res.status);
          setRecentBlogs([]);
          return;
        }
        const data = await res?.json();
        setRecentBlogs(data?.data || []);
      } catch (err) {
        console.error("Error fetching Recent Blogs:", err);
      }
    };

    fetchRecentBlogs();
  }, [token]);

  //  Render
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }
  if (!blog) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <p className="text-xl font-semibold">No blog found</p>
      </div>
    );
  }

  const handleTocClick = (e) => {
    const anchor = e.target.closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    e.preventDefault();
    const id = href.substring(1);
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 90;
    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };
  return (
    <>
      <Head>
        {/* <script
          type="text/javascript"
          src="https://platform-api.sharethis.com/js/sharethis.js#property=69a4166a6dc05e424818582b&product=sop"
          async="async"
        ></script> */}
      </Head>
      <Navbar />
      <section className="font-nunito bg-[#F7F3FF] max-sm:p-2  ">
        <div className="max-w-7xl mx-auto md:py-5  ">
          <section className="">
            <div className="grid grid-cols-1 md:grid-cols-[74%_25%] gap-5 items-start">
              <div className="bg-white p-4 rounded-md">
                <nav
                  className="flex md:flex-row flex-wrap items-center gap-2 text-sm text-gray-600 font-medium  mt-3"
                  aria-label="Breadcrumb"
                >
                  <Link
                    title="Home"
                    href="/"
                    className="flex items-center gap-1 hover:text-blue-600 transition"
                  >
                    <AiTwotoneHome className="text-[#2E318D]" />
                    Home
                  </Link>
                  <FaAngleRight className="text-gray-400" />
                  <Link
                    title="All Blog Lists"
                    href="/blogs"
                    className="hover:text-blue-600 transition"
                  >
                    Resource
                  </Link>
                  <FaAngleRight className="text-gray-400" />
                  <span className="text-[#2E318D] font-semibold cursor-not-allowed">
                    {blog?.resource_title}
                  </span>
                </nav>
                <div className="text-left my-4">
                  <h1 data-aos="fade-up" className="heading">
                    {blog?.resource_title}
                  </h1>
                  <div data-aos="fade-up" className=" mt-3">
                    <div className="flex md:flex-row flex-wrap items-center gap-4 text-sm text-gray-600 font-medium mb-2">
                      <p className="flex items-center gap-1 ">
                        <CiUser className="" />
                        {blog?.resource_auther || "Scholaracad"}
                      </p>
                      <SlCalender className="text-gray-400" />
                      <p className="">
                        Updated on{" "}
                        {blog?.created_at
                          ? new Date(blog.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            },
                          )
                          : "Dec 20, 2025"}
                      </p>
                      <MdOutlineAccessTime className="text-gray-400" />
                      <p className="">12 Minutes Read</p>
                      <GoEye className="text-gray-400" />
                      <span className=" ">{blog?.user_views || "0"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  {/* <img
                    data-aos="fade-up"
                    src={
                      blog?.header_image
                        ? `${API_BASE_URL}/master/secure-documents?path=${blog?.header_image}`
                        : ""
                    }
                    alt={blog?.title}
                    className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-md border border-gray-100 "
                  /> */}

                  <div className="w-full rounded-md border border-gray-100 overflow-hidden">
                    {blog?.header_image || blog?.image_url || blog?.image ? (
                      <img
                        data-aos="fade-up"
                        src={getImageSrc(blog)}
                        alt={blog?.resource_title || "Blog"}
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
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 sm:h-80 md:h-96 flex items-center justify-center bg-gray-100">
                        <FaRegImage className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  {/* <div class="sharethis-inline-share-buttons mt-3"></div> */}
                  <div className="mt-3">
                    <ShareThis />
                  </div>
                  {blog?.tableof_content && (
                    <>
                      <div className="mt-4  rounded-md px-2 border border-gray-100">
                        <h2 className="Sub_heading_black flex gap-1 items-center">
                          <BsListUl />
                          Table of Contents
                        </h2>
                        <div>
                          <div
                            ref={contentRef}
                            onClick={handleTocClick}
                            className={`summernote-content [&_a]:no-underline ${nunito?.className}`}
                            style={{
                              maxHeight: expanded ? "1000px" : "80px",
                              overflow: "hidden",
                              transition: "max-height 0.4s ease",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: blog?.tableof_content,
                            }}
                          />

                          <div className="flex justify-end ">
                            <button
                              className="flex gap-1 items-center p-2"
                              onClick={() => setExpanded(!expanded)}
                              style={{
                                marginTop: "10px",
                                color: "#882CFB",
                                cursor: "pointer",
                              }}
                            >
                              {expanded ? (
                                <>
                                  View Less <FiChevronUp />
                                </>
                              ) : (
                                <>
                                  View More <FiChevronDown />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className=" flex flex-col gap-5  overflow-x-auto">
                    <div
                      ref={contentRef}
                      className={`summernote-content    ${nunito?.className}`}
                      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                    />

                    {/* <div
                      ref={contentRef}
                      className="summernote-content overflow-hidden transition-all duration-500"
                      style={{ maxHeight: `${visibleHeight}px` }}
                      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                    />

                    {showButton && (
                      <>
                        <div className="flex justify-center">
                          <button
                            onClick={handleToggle}
                            className="text-[#882CFB] hover:bg-[#882CFB] hover:text-white cursor-pointer font-medium border rounded-full text-sm py-1.5 px-4 flex items-center gap-1"
                          >
                            {isExpanded ? (
                              <>
                                Read Less <IoMdArrowDropup />
                              </>
                            ) : (
                              <>
                                Read More <IoMdArrowDropdown />
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )} */}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[20px] font-extrabold leading-tight bg-white p-3 rounded-sm mb-2">
                  Recent Post
                </p>
                <div className="grid grid-cols-1 gap-6 flex-1">
                  {Recentblogs?.slice(0, 5).map((blog, i) => (
                    <div
                      data-aos="fade-up"
                      key={blog?.id || i}
                      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      {blog?.header_image || blog?.image_url || blog?.image ? (
                        <img
                          src={getImageSrc(blog)}
                          alt={blog?.resource_title || "Blog"}
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
                          className="w-full h-44 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-44 flex items-center justify-center bg-gray-100 rounded-md">
                          <FaRegImage className="text-4xl text-gray-400" />
                        </div>
                      )}

                      <div className="p-4">
                        <h2 className="font-semibold text-gray-800 mb-2 leading-snug">
                          {blog?.resource_title?.length > 80
                            ? blog?.resource_title?.slice(0, 80) + "..."
                            : blog?.resource_title}
                        </h2>

                        <hr className="my-2 text-gray-300" />

                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-[#2E318D]" />
                            {blog?.created_at
                              ? new Date(blog?.created_at)?.toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                },
                              )
                              : "Dec 20, 2025"}
                          </div>

                          <Link
                            title="Read More"
                            href={`/article/${blog?.url_title || blog?.slug || slugify(blog.resource_title)}`}
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
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default BlogDetails;

export async function getServerSideProps({ req, params }) {
  const token = req.cookies?.access_token || null;
  const rawTitle = params.title;
  let blogData = null;

  try {
    // 1. Direct attempt with rawTitle
    let res = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOG_DETAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        blog_id: rawTitle,
      }),
    });
    let json = await res.json();
    if (res.ok && json?.data) {
      blogData = json.data;
    } else {
      // 2. Fallback: list blogs and find match
      const listRes = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOGS}?per_page=100`, {
        headers: { Accept: "application/json" },
      });
      const listJson = await listRes.json();
      const list = listJson?.data?.data || listJson?.data || [];
      const match = list.find(
        (b) =>
          b.url_title === rawTitle ||
          b.slug === rawTitle ||
          String(b.id) === rawTitle ||
          (b.resource_title &&
            b.resource_title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "") === rawTitle)
      );
      if (match?.url_title) {
        const retryRes = await fetch(`${API_BASE_URL}${APIENDPOINTS.BLOG_DETAIL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ blog_id: match.url_title }),
        });
        const retryJson = await retryRes.json();
        if (retryRes.ok && retryJson?.data) {
          blogData = retryJson.data;
        }
      }
    }
  } catch (err) {
    console.error("getServerSideProps error in article:", err);
  }

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const pageUrl = `${protocol}://${req.headers.host}${req.url}`;
  const metaTitle = blogData?.resource_title || null;
  const metaDescription =
    blogData?.metaDescription || blogData?.meta_description || null;
  const metaKeywords = blogData?.meta_keywords || null;

  return {
    props: {
      initialBlog: blogData,
      title: metaTitle,
      description: metaDescription,
      keywords: metaKeywords,
      ogTitle: metaTitle,
      ogDescription: metaDescription,
      ogUrl: pageUrl,
    },
  };
}