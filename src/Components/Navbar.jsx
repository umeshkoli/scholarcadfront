import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronDown, FaHome, FaBlog, FaUserFriends } from "react-icons/fa";
import { MdBusiness, MdSchool } from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaUserGraduate, FaHandshake } from "react-icons/fa";
import { TbMenu4 } from "react-icons/tb";
import { VscArrowSmallRight, VscListSelection } from "react-icons/vsc";
import { BiSearchAlt } from "react-icons/bi";
import { useAuth } from "@/context/AuthContext";
import { FiChevronsRight } from "react-icons/fi";
import { encryptId } from "@/utils/encryption";
import { API_BASE_URL } from "../../apiconfig";
import { getCourseImageUrl, getLiveDocumentUrl } from "@/utils/imageHelper";
import { IoCallOutline, IoCloseCircle, IoCloseOutline } from "react-icons/io5";
import { TfiEmail } from "react-icons/tfi";
import { BsChatDots } from "react-icons/bs";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileSub, setOpenMobileSub] = useState(null);
  const [hidden, setHidden] = useState(false);
  const dropdownRef = useRef(null);
  const timerRef = useRef(null);
  const toggleMobileSub = (menu) => {
    setOpenMobileSub(openMobileSub === menu ? null : menu);
  };
  const phoneNumber = "9810812106";
  const emailAddress = "support@scholaracad.com";
  const whatsappNumber = "9350022106";
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
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);
  // useEffect(() => {
  //   if (openDropdown) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "";
  //   }
  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, [openDropdown]);
  // Click outside to close desktop dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // First scroll hide animation
  const lastScrollY = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  const { categories } = useAuth();
  // console.log("categories",categories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // console.log("categories--->", categories);
  // Update selectedCategory when categories change
  useEffect(() => {
    if (categories?.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  useEffect(() => {
    if (categories && categories?.length > 0) {
      const courses = categories?.flatMap((cat) => cat?.cources || []);
      setAllCourses(courses);
    }
  }, [categories]);

  // Filter courses by url_title
  const filteredData =
    allCourses?.filter((course) =>
      course?.url_title?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
    ) || [];

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setTimeout(() => setIsDropdownOpen(false), 100);
    } else {
      setIsDropdownOpen(true);
    }
  };

  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    const saved = sessionStorage.getItem("userLocation");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserLocation(parsed);
        // console.log(" Loaded userLocation from sessionStorage:", parsed);
      } catch (e) {
        console.error(" Failed to parse userLocation JSON", e);
      }
    }
  }, []);

  const active_country = useMemo(() => {
    return userLocation?.raw?.country.toLowerCase() || "in";
  }, [userLocation]);

  const active_state = useMemo(() => {
    return userLocation?.state || "Delhi";
  }, [userLocation]);

  const uniqueCourses = selectedCategory?.cources?.filter(
    (course, index, self) =>
      index === self.findIndex((c) => c.url_title === course.url_title),
  );
  //   <header
  //   className={`bg-[#882CFB] z-40 sticky top-0 transition-transform duration-700 ease-out md:p-1 px-2 ${
  //     hidden ? "-translate-y-20" : "translate-y-0"
  //   }`}
  // ></header>

  return (
    <header className="bg-[#882CFB] z-40 sticky top-0 transition-transform duration-700 ease-out md:p-1 px-2">
      <div className="md:max-w-7xl  mx-auto ">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <img
                src="/assets/landingpage/scholaracad_icon_nav.svg"
                alt="Scholor Acad Logo"
                width={220}
                height={220}
                className="object-contain mt-1"
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex lg:items-center lg:space-x-6"
            ref={dropdownRef}
          >
            <Link
              href="/"
              className={`
              relative text-sm font-medium whitespace-nowrap mt-2
              text-white
              after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
              after:bg-white after:transition-all after:duration-300
              hover:after:w-full pb-1
              ${pathname === "/" ? "after:w-full after:bg-white" : ""}
            `}
            >
              Home
            </Link>

            {/* COURSES DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("courses")}
              // onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className={`
              text-[15px] cursor-pointer font-medium flex items-center gap-1 mt-2
              text-white hover:text-white relative 
              before:absolute before:left-0 before:bottom-0 before:h-[2px]
              before:bg-white before:w-0 before:transition-all before:duration-300
              hover:before:w-full  pb-1
              ${openDropdown === "courses" ? "before:w-full text-white" : ""}
            `}
              >
                Courses
                <svg
                  className={`h-4 w-4 transition-transform ${
                    openDropdown === "courses" ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {openDropdown === "courses" && (
                <>
                  <div className="absolute top-full mt-8 left-[20vw] transform -translate-x-1/2 md:w-[70vw] bg-white rounded-md  flex z-30 overflow-hidden border border-gray-300">
                    {/* Left Panel: Tabs */}
                    <div className="w-[400px] bg-[#E2F3FF] border-r border-gray-200 p-1">
                      <h1 className="px-6 py-3 text-xl font-bold text-[#1F2937]">
                        Categories
                      </h1>
                      {categories?.length === 0 && (
                        <p className="px-6 py-2 text-gray-500">
                          Loading categories...
                        </p>
                      )}

                      {categories?.map((cat) => (
                        <button
                          title={cat?.category_name}
                          key={cat?.id}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-6 py-3 flex items-center gap-2 transition-all duration-300 ${
                            selectedCategory?.category_name ===
                            cat?.category_name
                              ? "bg-white text-[#882CFB] font-semibold border-l-4 rounded-sm border-[#882CFB]"
                              : "text-gray-800 hover:bg-white hover:border-l-4 hover:border-[#882CFB] hover:text-[#882CFB]  cursor-pointer"
                          }`}
                        >
                          {/* <RxDoubleArrowRight className="inline mr-2" /> */}
                          {cat?.category_name}
                        </button>
                      ))}
                    </div>

                    {/* 📚 RIGHT SIDE — Courses for selected category */}
                    <div className="w-3/4 p-6">
                      {selectedCategory ? (
                        <>
                          <h2 className="text-xl font-semibold mb-2 text-[#882CFB]">
                            {selectedCategory?.category_name}
                          </h2>
                          <p className="para mb-2">
                            {selectedCategory?.short_description
                              ? selectedCategory?.short_description?.split(" ")
                                  .length > 20
                                ? selectedCategory?.short_description
                                    .split(" ")
                                    .slice(0, 20)
                                    .join(" ") + "..."
                                : selectedCategory?.short_description
                              : ""}
                          </p>

                          <Link
                            href={{
                              pathname: `/category-courses/${selectedCategory?.page_link}`,
                              // query: { id: encryptId(selectedCategory?.id) },
                            }}
                            onClick={() => setOpenDropdown(null)}
                            className="text-[#882CFB] hover:text-[#4347ca] hover:underline flex gap-1 items-center"
                          >
                            Know More <FiChevronsRight />
                          </Link>

                          <h3 className="text-md font-semibold mb-2 text-gray-700 mt-4">
                            Courses in this category
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-3">
                            {/* /${slugify(active_state)} */}
                            {selectedCategory?.cources &&
                            selectedCategory?.cources.length > 0 ? (
                              selectedCategory?.cources?.map((course, i) => {
                                return (
                                  <Link
                                    key={i}
                                    href={{
                                      pathname: `/${slugify(
                                        course?.url_title,
                                      )}`,
                                    }}
                                    onClick={() => setOpenDropdown(null)}
                                    className="
                                    group
                                    bg-white
                                    flex items-center gap-1
                                 text-[15px]
                                    text-gray-700
                                    cursor-pointer
                                    p-1
                                    rounded-lg
                                    transition-all
                                    hover:bg-purple-50
                                    hover:text-[#882CFB]
                                  "
                                  >
                                    {/* Image */}
                                    <div className="relative w-10 h-10 shrink-0">
                                      {course?.header_image || course?.image_url ? (
                                        <img
                                          src={getCourseImageUrl(course)}
                                          alt={course?.course_title}
                                          onError={(e) => {
                                            if (!e.currentTarget.dataset.retried && (course?.header_image || course?.image_url)) {
                                              e.currentTarget.dataset.retried = "true";
                                              e.currentTarget.src = getLiveDocumentUrl(course?.header_image || course?.image_url);
                                            } else {
                                              e.currentTarget.onerror = null;
                                              e.currentTarget.src = '/assets/landingpage/courses/course2.png';
                                            }
                                          }}
                                          className="
                                        w-full h-full
                                        object-contain
                                        bg-gray-50
                                        rounded-md
                                        p-1
                                        transition-transform
                                        group-hover:scale-105
                                      "
                                        />
                                      ) : (
                                        <div
                                          className="
                                        w-full h-full
                                        flex items-center justify-center
                                        bg-gray-100
                                        rounded-md
                                        text-gray-500
                                        text-xs
                                        font-medium
                                      "
                                        >
                                          {course?.course_title
                                            ?.charAt(0)
                                            ?.toUpperCase() || "?"}
                                        </div>
                                      )}
                                    </div>
                                    <span
                                      title={course?.course_title}
                                      className="flex-1  font-medium ml-2"
                                    >
                                      {course?.course_title || "Na"}
                                    </span>
                                    <VscArrowSmallRight
                                      className="
                                      text-base
                                      text-gray-500
                                      transition-all
                                      group-hover:translate-x-1 bg-purple-100 group-hover:bg-[#882CFB]
                                      group-hover:text-white p-1 rounded-full 
                                    "
                                    />
                                  </Link>
                                );
                              })
                            ) : (
                              <p className="text-gray-500">
                                No courses available.
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500">Loading...</p>
                      )}

                      {/* <div className="my-3">
                        <h3 className="text-md font-semibold mb-2 text-gray-700 mt-2">
                          Accreditation Bodies
                        </h3>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mt-2">
                          {selectedCategory?.cources?.map((course, i) => (
                            <Link
                              key={i}
                              href={{
                                pathname: `/${slugify(
                                  course?.url_title
                                )}`,
                              }}
                              onClick={() => setOpenDropdown(null)}
                              className="
                                  group
                                  flex items-center justify-center
                                  w-14 h-14
                                  bg-gray-50
                                  rounded-md
                                  p-1
                                  transition-all
                                  hover:bg-purple-50
                                "
                              title={course?.course_title}
                            >
                              <img
                                src={getCourseImageUrl(course?.header_image)}
                                alt={course?.course_title}
                                className="
                                w-full h-full
                                object-contain
                                transition-transform
                                group-hover:scale-110
                              "
                              />
                            </Link>
                          ))}
                        </div>
                      </div> */}

                      {/* <div className="flex gap-3 mt-12 bg-yellow-100 p-2 rounded-md">
                        <Link
                          className="hover:bg-[#4347ca]"
                          href="/all-courses"
                        >
                          Course
                        </Link>
                        <Link
                          className="hover:bg-[#4347ca]"
                          href="/course-detail1"
                        >
                          Detail Page 1
                        </Link>
                        <Link
                          className="hover:bg-[#4347ca]"
                          href="/course-detail2"
                        >
                          Detail Page 2
                        </Link>
                        (For Developer Work Only)
                      </div> */}

                      <div>
                        <img src="" alt="" />
                      </div>
                    </div>
                  </div>
                  {/* Overlay */}
                  <div
                    className="fixed inset-x-0 top-[68px] opacity-35 bg-black bg-opacity-30 z-20 h-[calc(100vh-65px)]"
                    onClick={() => setOpenDropdown(null)}
                  ></div>
                </>
              )}
            </div>

            <Link
              href="/corporate-group-traning"
              className={`
              relative text-sm font-medium whitespace-nowrap mt-2
              text-white
              after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
              after:bg-white after:transition-all after:duration-300
              hover:after:w-full  pb-1
              ${
                pathname === "/corporate-group-traning"
                  ? "after:w-full after:bg-white"
                  : ""
              }
            `}
            >
              Bussiness Group Coaching
            </Link>

            <Link
              href="/consulting"
              className={`
              relative text-sm font-medium whitespace-nowrap mt-2
              text-white
              after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
              after:bg-white after:transition-all after:duration-300
              hover:after:w-full  pb-1
              ${pathname === "/consulting" ? "after:w-full after:bg-white" : ""}
            `}
            >
              Consulting
            </Link>

            <Link
              href="/one-to-one-traning"
              className={`
              relative text-sm font-medium whitespace-nowrap mt-2
              text-white
              after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
              after:bg-white after:transition-all after:duration-300
              hover:after:w-full  pb-1
              ${
                pathname === "/one-to-one-traning"
                  ? "after:w-full after:bg-white"
                  : ""
              }
            `}
            >
              Personalized Coaching
            </Link>

            <Link
              href="/join-as-a-trainer"
              className={`
              relative text-sm font-medium whitespace-nowrap mt-2
              text-white
              after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
              after:bg-white after:transition-all after:duration-300
              hover:after:w-full  pb-1
              ${
                pathname === "/join-as-a-trainer"
                  ? "after:w-full after:bg-white"
                  : ""
              }
            `}
            >
              Join Us
            </Link>
            <Link
              href="/resource"
              className={`
              relative text-sm font-medium whitespace-nowrap mt-2
              text-white
              after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0
              after:bg-white after:transition-all after:duration-300
              hover:after:w-full  pb-1
              ${pathname === "/resource" ? "after:w-full after:bg-white" : ""}
            `}
            >
              Resource
            </Link>
            {/* RESOURCES DROPDOWN */}
            {/* onMouseLeave={() => setOpenDropdown(null)} */}
            {/* <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("resources")}
            >
              <button
                aria-expanded={openDropdown === "resources"}
                className={`
              text-sm cursor-pointer font-medium flex items-center gap-1 mt-2
              text-white hover:text-white relative 
              before:absolute before:left-0 before:bottom-0 before:h-[2px]
              before:bg-white before:w-0 before:transition-all before:duration-300
              hover:before:w-full  pb-1
              ${openDropdown === "resources" ? "before:w-full text-white" : ""}
            `}
              >
                Resources
                <svg
                  className={`h-4 w-4 transition-transform duration-300 ${
                    openDropdown === "resources" ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {openDropdown === "resources" && (
                <>
                  <div className="absolute top-full mt-8 left-[20vw w-48 bg-white  rounded-md  mt-2 border border-gray-300 z-30">
                    <Link
                      href="/resource"
                      className={`block px-4 py-2 text-sm hover:bg-gray-50 hover:rounded-md ${
                        pathname === "/resource"
                          ? "text-[#882CFB] bg-gray-50"
                          : "text-black hover:text-[#882CFB] "
                      }`}
                    >
                      Resource
                    </Link>
                    <Link
                      href="/resource/blog"
                      className={`block px-4 py-2 text-sm hover:bg-gray-50 hover:rounded-md ${
                        pathname === "/resource/blog"
                          ? "text-[#882CFB] bg-gray-50"
                          : "text-black hover:text-[#882CFB] "
                      }`}
                    >
                      Blog
                    </Link>
                    <Link
                      href="/our-team"
                      className={`block px-4 py-2 text-sm hover:bg-gray-50 hover:rounded-md ${
                        pathname === "/our-team"
                          ? "text-[#882CFB] bg-gray-50"
                          : "text-black hover:text-[#882CFB] "
                      }`}
                    >
                      Our Team
                    </Link>
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm hover:bg-gray-50 hover:rounded-md"
                    >
                      Careers
                    </Link>
                    <Link
                      href="/about"
                      className={`block px-4 py-2 text-sm hover:bg-gray-50 hover:rounded-md ${
                        pathname === "/about"
                          ? "text-[#882CFB] bg-gray-50"
                          : "text-black hover:text-[#882CFB] "
                      }`}
                    >
                      About Us
                    </Link>
                  </div>
                  <div
                    className="fixed inset-x-0 top-[75px] opacity-35 bg-black bg-opacity-30 z-20 h-[calc(100vh-75px)]"
                    onClick={() => setOpenDropdown(null)}
                  ></div>
                </>
              )}
            </div> */}

            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
                onFocus={() => {
                  if (searchTerm?.trim() !== "" && filteredData?.length > 0) {
                    setIsDropdownOpen(true);
                  }
                }}
                className="bg-white border form-input border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#882CFB] focus:border-[#882CFB] block md:min-w-[250px] w-full pr-10 p-2.5"
                placeholder="Search For Course"
              />
              <svg
                className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute z-50 mt-3 bg-white border border-gray-300 rounded-md   max-h-80 md:w-96 md:right-0 w-full overflow-y-auto">
                  {filteredData?.length > 0 ? (
                    filteredData?.map((course, i) => {
                      const route = `/${course?.url_title}`;
                      return (
                        <Link
                          key={i}
                          href={route}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setIsDropdownOpen(false)}
                          className="bg-white hover:bg-[#882CFB] flex gap-2 items-center text-wrap text-md hover:text-white cursor-pointer transition-all px-4 py-2"
                        >
                          <VscArrowSmallRight />
                          {course?.course_title}
                        </Link>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center px-4 py-6 text-gray-500 space-y-2">
                      <BiSearchAlt className="w-10 h-10 text-gray-400" />
                      <p className="text-sm font-medium">No Course found</p>
                      <p className="text-xs text-gray-400">
                        Try searching with a different keyword
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              className="p-2 rounded-md   focus:outline-none max-sm:z-50 "
              aria-label="Open menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
               <IoCloseOutline  className="text-3xl text-white max-sm:text-gray-800 p-1 bg-white rounded-sm shadow " />
              ) : (
                <VscListSelection  className="text-3xl text-white   " />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden z-30 fixed top-16 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          mobileOpen
            ? "max-h-[90vh] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4"
        } overflow-hidden z-40`}
      >
        <div className="px-5 py-6 space-y-3 text-gray-800 max-h-[65vh] overflow-y-auto">
          {/* --- Courses --- */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition"
            >
              <FaHome className="text-gray-500" size={18} />
              Home
            </Link>
            <button
              className="w-full flex items-center justify-between px-3 py-3 mt-2 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition"
              onClick={() => toggleMobileSub("courses")}
            >
              <div className="flex items-center gap-2">
                <MdSchool className="text-gray-500" size={18} />
                <span>Courses</span>
              </div>
              <FaChevronDown
                className={`text-gray-500 transition-transform duration-300 ${
                  openMobileSub === "courses" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
                openMobileSub === "courses"
                  ? "opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-3"
              }`}
            >
              <div className=" border-l border-gray-100 pl-4 mt-2 space-y-2">
                {/* Categories List */}
                <div className=" border-r border-gray-200">
                  {categories?.length === 0 && (
                    <p className="px-6 py-2 text-gray-500">
                      Loading categories...
                    </p>
                  )}
                  {categories?.map((cat) => (
                    <div key={cat?.id} className="mb-2">
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full border-b cursor-pointer border-gray-200 text-left px-6 py-3 flex items-center gap-2 transition-all duration-300 ${
                          selectedCategory?.category_name === cat?.category_name
                            ? "bg-white text-[#882CFB] font-semibold border-l-4 border-[#0B71C3]"
                            : "text-gray-800 hover:bg-white hover:text-[#882CFB]"
                        }`}
                      >
                        {cat?.category_name}
                      </button>
                      {selectedCategory?.category_name ===
                        cat?.category_name && (
                        <div className="lg:hidden px-6 py-3 bg-white  border-gray-200 space-y-2">
                          {cat?.cources && cat?.cources.length > 0 ? (
                            cat.cources.map((course, i) => {
                              return (
                                <Link
                                  key={i}
                                  href={{
                                    pathname: `/${slugify(
                                      course?.url_title,
                                    )}`,
                                  }}
                                  onClick={() => mobileOpen(null)}
                                  className="flex gap-2 items-center text-md hover:bg-gray-100 rounded-md cursor-pointer transition-all"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 shrink-0">
                                      {course?.header_image || course?.image_url ? (
                                        <img
                                          src={getCourseImageUrl(course)}
                                          alt={course?.course_title}
                                          onError={(e) => {
                                            if (!e.currentTarget.dataset.retried && (course?.header_image || course?.image_url)) {
                                              e.currentTarget.dataset.retried = "true";
                                              e.currentTarget.src = getLiveDocumentUrl(course?.header_image || course?.image_url);
                                            } else {
                                              e.currentTarget.onerror = null;
                                              e.currentTarget.src = '/assets/landingpage/courses/course2.png';
                                            }
                                          }}
                                          className="
                                        w-full h-full
                                        object-contain
                                        bg-gray-50
                                        rounded-md
                                        p-1
                                        transition-transform
                                        group-hover:scale-105
                                      "
                                        />
                                      ) : (
                                        <div
                                          className="
                                        w-full h-full
                                        flex items-center justify-center
                                        bg-gray-100
                                        rounded-md
                                        text-gray-500
                                        text-xs
                                        font-medium
                                      "
                                        >
                                          {course?.course_title
                                            ?.charAt(0)
                                            ?.toUpperCase() || "?"}
                                        </div>
                                      )}
                                    </div>
                                    <span>
                                      {/* <VscArrowSmallRight /> */}
                                      {course?.course_title}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })
                          ) : (
                            <p className="text-gray-500">
                              No courses available.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* --- Resources --- */}
          <div>
            <button
              className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition"
              onClick={() => toggleMobileSub("resources")}
            >
              <div className="flex items-center gap-2">
                <HiOutlineLightBulb className="text-gray-500" size={18} />
                <span>Resources</span>
              </div>
              <FaChevronDown
                className={`text-gray-500 transition-transform duration-300 ${
                  openMobileSub === "resources" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
                openMobileSub === "resources"
                  ? "max-h-[300px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-3"
              }`}
            >
              <div className="ml-5 border-l border-gray-100 pl-4 mt-2 space-y-2">
                <Link
                  href="/resource"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  Resource
                </Link>
                <Link
                  href="/blogs"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  Blogs
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  About Us
                </Link>
                {/* <Link
                  href="/careers"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  Careers
                </Link> */}
              </div>
            </div>
          </div>

          {/* --- Other Menu Items --- */}

          <Link
            href="/corporate-group-traning"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition"
          >
            <MdBusiness className="text-gray-500" size={18} />
            Business Group
          </Link>

          <Link
            href="/consulting"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition"
          >
            <FaUserFriends className="text-gray-500" size={18} />
            Consulting
          </Link>
          {/* Personalized Coaching */}
          <Link
            href="/one-to-one-traning"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition"
          >
            <FaUserGraduate className="text-gray-500" size={18} />
            Personalized Coaching
          </Link>

          {/* Join Us */}
          <Link
            href="/join-as-a-trainer"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition"
          >
            <FaHandshake className="text-gray-500" size={18} />
            Join Us
          </Link>

          <Link
            href="/blogs"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition"
          >
            <FaBlog className="text-gray-500" size={18} />
            Blogs
          </Link>
        </div>
          <div className=" z-50 md:hidden bg-white border-t border-dotted border-gray-200 ">
            <div className="flex justify-around items-center py-2">
              {/* Call */}
              <a
                href={`tel:${phoneNumber}`}
                className="flex flex-col items-center text-gray-700 hover:text-[#882CFB]"
              >
                <IoCallOutline className="w-6 h-6" />
                <span className="text-xs mt-1">Call</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${emailAddress}`}
                className="flex flex-col items-center text-gray-700 hover:text-[#882CFB]"
              >
                <TfiEmail className="w-6 h-6" />
                <span className="text-xs mt-1">Email</span>
              </a>

              {/* Chat */}
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-gray-700 hover:text-[#882CFB]"
              >
                <BsChatDots className="w-6 h-6" />
                <span className="text-xs mt-1">Chat</span>
              </a>
            </div>
          </div>
      </div>
    </header>
  );
}
