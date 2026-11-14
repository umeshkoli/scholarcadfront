import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineBook, AiTwotoneHome } from "react-icons/ai";
import {
  FaAngleRight,
  FaChalkboardTeacher,
  FaImage,
  FaLaptop,
  FaStar,
  FaUserGraduate,
  FaUsers,
  FaVideo,
} from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FiSearch } from "react-icons/fi";
import { GoArrowUpRight } from "react-icons/go";
import { IoIosStar } from "react-icons/io";

import {
  IoCheckmark,
  IoClose,
  IoLogoFacebook,
  IoSearch,
} from "react-icons/io5";
import { CgSmileSad } from "react-icons/cg";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { RiGraduationCapFill } from "react-icons/ri";
import { API_BASE_URL, APIENDPOINTS } from "../../apiconfig";
import { getCourseImageUrl, getLiveDocumentUrl, DEFAULT_COURSE_FALLBACK } from "@/utils/imageHelper";
import { DynamicSEO, getCleanCanonicalUrl, generateCourseListingSchema } from "@/lib/seoHelper";

function Course() {
  const { categories } = useAuth();
  // console.log("categories", categories);
  const [selected, setSelected] = useState("All");
  const [activeTab, setActiveTab] = useState(0);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 9;
  const tabs = ["All Courses", ...categories?.map((cat) => cat.category_name)];

  const slugify = (text) => {
    return text
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
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
  //  Combine courses based on selected tab
  useEffect(() => {
    let updatedCourses = [];
    if (activeTab === 0) {
      // All Courses
      updatedCourses = categories.flatMap((cat) =>
        (cat.cources || []).map((cources) => ({
          ...cources,
          category_name: cat.category_name,
        })),
      );
    } else {
      // Selected Category
      const selectedCat = categories[activeTab - 1];
      updatedCourses = (selectedCat?.cources || []).map((cources) => ({
        ...cources,
        category_name: selectedCat.category_name,
      }));
    }
    //  Filter by search
    if (searchQuery.trim()) {
      updatedCourses = updatedCourses.filter((course) =>
        course.course_title?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    setFilteredCourses(updatedCourses);
    setCurrentPage(1);
  }, [activeTab, categories, searchQuery]);

  //  Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse,
  );
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const { token } = useAuth();
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [testimonialList, setTestimonialList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch testimonials
  useEffect(() => {
    if (!token) return;
    const fetchTestimonials = async () => {
      try {
        setLoadingBlogs(true);
        const res = await fetch(
          `${API_BASE_URL}${APIENDPOINTS.TESTIMONIALS_LIST}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              course_id: null,
              top: 10,
              country_id: active_country,
              state_id: active_state || null,
            }),
          },
        );

        if (!res.ok) {
          console.warn("HTTP error! Status:", res?.status);
          setTestimonialList([]);
          return;
        }
        const data = await res.json();
        // console.log("Testimonials list:", data?.data);
        setTestimonialList(data?.data || []);
      } catch (err) {
        // console.error("Error fetching  ", err);
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchTestimonials();
  }, [token]);

  // --- Auto-slide every 5 seconds (only for first 5 testimonials) ---
  useEffect(() => {
    if (!testimonialList || testimonialList.length === 0) return;
    const visibleTestimonials = testimonialList.slice(0, 5);
    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev === visibleTestimonials.length - 1 ? 0 : prev + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonialList]);
  // --- Handle click ---
  const handleClick = (index) => {
    setActiveIndex(index);
  };
  // --- Active testimonial (from first 5 only) ---
  const visibleTestimonials = testimonialList?.slice(0, 5) || [];
  const activeTestimonial =
    visibleTestimonials.length > 0 ? visibleTestimonials[activeIndex] : null;

  const trainingOptions = [
    {
      id: 1,
      title: "Classroom Instruction ",
      description:
        "In person, instructor-led training events that promote communication, practical application, and instantaneous information sharing",
      icon: FaChalkboardTeacher,
    },
    {
      id: 2,
      title: "Real-Time Online Education",
      description:
        "Expert trainers provide interactive virtual sessions that allow for flexible participation and cross-location collaborative learning. ",
      icon: FaVideo,
    },
    {
      id: 3,
      title: "Business Education Solutions",
      description:
        "Programs for consultation and training that are specifically tailored to the objectives, culture, and performance standards of the firm.  ",
      icon: FaUsers,
    },
    {
      id: 4,
      title: "Online Self-Paced Education ",
      description:
        "Internet courses with structure that let students study at their own speed while using guided modules to reinforce concepts. ",
      icon: FaLaptop,
    },
    {
      id: 5,
      title: "Mentoring and Coaching",
      description:
        "Individualized and group coaching sessions with an emphasis on developing leadership, improving skills, and solving practical problems. ",
      icon: FaUserGraduate,
    },
  ];
  const ActiveIcon = trainingOptions[activeIndex].icon;
  const [allcoursecontent, setallcoursecontent] = useState(null);
  // console.log("allcoursecontent", allcoursecontent);
  useEffect(() => {
    if (!token) return;
    const FetchFootercontent = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}${APIENDPOINTS.API_ALLCOURSES_CONTENT}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) {
          console.warn("HTTP error! Status:", res?.status);
          setallcoursecontent([]);
          return;
        }
        const data = await res.json();
        setallcoursecontent(data?.data || []);
      } catch (err) {
        console.error("Error fetching FetchFootercontent:", err);
      }
    };
    FetchFootercontent();
  }, [token]);
  const courseListingSchema = useMemo(() => {
    const items = (filteredCourses || []).slice(0, 20).map((c) => ({
      name: c.course_title,
      url: `/${c.course_url_title || slugify(c.course_title)}`,
      description: c.course_description || "",
      imageUrl: c.course_image ? `${API_BASE_URL}/${c.course_image}` : null,
    }));

    return generateCourseListingSchema({
      listTitle: "All Professional Certification Training Courses",
      listDescription: "Explore globally accredited certification courses across Project Management, Agile, Scrum, IT Service, and Cybersecurity.",
      pageUrl: "/all-courses",
      courseItems: items,
      breadcrumbs: [
        { name: "Home", url: "/" },
        { name: "All Courses", url: "/all-courses" },
      ],
    });
  }, [filteredCourses]);

  return (
    <>
      <DynamicSEO
        title="All Certification Courses | ScholarAcad"
        description="Explore globally accredited certification courses across Project Management, Agile, Scrum, IT Service, and Cybersecurity."
        canonicalUrl={getCleanCanonicalUrl("/all-courses")}
        keywords="all courses, certification training, pmp certification, agile, scrum, prince2"
        ogTitle="All Certification Courses | ScholarAcad"
        ogDescription="Explore globally accredited certification courses across Project Management, Agile, Scrum, IT Service, and Cybersecurity."
        ogUrl={getCleanCanonicalUrl("/all-courses")}
        schemaData={courseListingSchema}
        robots="index, follow"
      />
      {/* Navbar */}
      <Navbar />
      <section className="font-nunito bg-white max-sm:p-3 ">
        {/* First Section */}
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="md:max-w-[550px] md:ml-[120px]  md:min-h-[80vh]  mx-auto flex justify-center items-center">
              <div className=" p-5 bg-white rounded-md shadow-2xl shadow-[#d4c0ec] ">
                {/* Breadcrumb */}
                {/* <nav
                  className="flex md:flex-row flex-wrap items-center gap-2 text-sm text-gray-600 font-medium mb-2"
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
                  <span className="text-[#2E318D] font-semibold cursor-not-allowed">
                    All Courses
                  </span>
                </nav> */}
                <h1 className="heading">All Courses at Scholaracad</h1>
                 <div
              className="summernote-content"
              dangerouslySetInnerHTML={{
                __html: allcoursecontent?.[0]?.content || "",
              }}
            />
                {/* <div
                  className="summernote-content"
                  dangerouslySetInnerHTML={{
                    __html:
                      (allcoursecontent?.[0]?.content || "")
                        .replace(/<[^>]+>/g, "")
                        .split(/\s+/)
                        .slice(0, 200)
                        .join(" ") + "...",
                  }}
                /> */}
                {/* <p className="mt-2 para ">
                  Industry-recognized training programs designed to build
                  essential skills and accelerate professional growt
                </p>
                <p className="mt-1 para ">
                  Scholaracad offers a comprehensive portfolio of certification
                  courses covering project management, IT service management,
                  governance, DevOps, quality management, process improvement,
                  and emerging technologies. Our programs are designed to equip
                  professionals and organizations with practical knowledge,
                  globally recognized certifications, and industry-relevant
                  expertise.
                </p>

                <p className="mt-1 para ">
                  Our expert-led training combines structured learning,
                  real-world case studies, and exam-focused preparation to help
                  learners build strong foundations, gain hands-on experience,
                  and achieve professional certifications that support long-term
                  career advancement and organizational success.
                </p>
                <p className="mt-1 para ">
                  Accreditation Notice: Selected certification programs such as
                  ITIL®, PRINCE2®, and MSP® are delivered in partnership with
                  accredited training organizations. The ITIL®, PRINCE2®, and
                  MSP® courses are provided by SkillMetrix Knowledge Services
                  LLP, an Accredited Training Organization (ATO) of PeopleCert.
                  ITIL®, PRINCE2®, MSP® and the Swirl logo are registered
                  trademarks of the PeopleCert group. Used under licence from
                  PeopleCert.
                </p> */}

                {/* <div className="my-4">
                  <div className="relative w-full max-w-sm">
                    <input
                      type="text"
                      placeholder="Explore..."
                      className="w-full pl-4 bg-[#2E318D] pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    />
                    <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-xl cursor-pointer" />
                  </div>
                </div> */}
              </div>
            </div>

            <div className="relative max-sm:mt-2">
              <img
                src="/assets/landingpage/course_page_righghtimg.jpg"
                alt="Image 1"
                className="w-full h-full object-cover bg-gray-100 "
              />
              {/* Left edge white gradient */}
              <div
                className="absolute top-0 left-0 h-full w-1/4 pointer-events-none"
                style={{
                  background: "linear-gradient(to right, white, transparent)",
                }}
              ></div>
              {/* Top edge white gradient */}
              <div
                className="absolute top-0 left-0 w-full h-1/3 pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, white, transparent)",
                }}
              ></div>
            </div>
          </div>
        </div>
        {/* Second Section */}
        <section className="">
          <div className="max-w-7xl mx-auto py-10 ">
            <div className=" mt-2">
              <h2 className="heading">Explore Courses</h2>
              <div className=" mt-2">
                <p className="font-semibold text-md text-[#535353]  ">
                  Explore expert-led courses to upgrade your skills, earn
                  certifications, and achieve your career goals.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {/* Tabs and Search */}
              <div className="grid grid-cols-[90%_10%] items-center gap-2 my-3">
                <div>
                  {!showSearch ? (
                    <div className="bg-white border border-[#882CFB] rounded-md p-2 shadow-md overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      <div className="flex flex-row gap-2">
                        {tabs?.map((tab, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            className={`px-4 py-2 rounded-full text-nowrap transition cursor-pointer font-semibold text-sm ${
                              activeTab === i
                                ? "bg-[#E2D2FFB2] text-[#2E318D] border-[#29A6DD]"
                                : "bg-white text-[#2E318D] hover:bg-gray-100"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="relative w-full max-w-xl">
                        <input
                          type="text"
                          placeholder="Search by course title..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-4 pr-32 py-3 bg-[#E8E8FF] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          {/* <select
                            value={selected}
                            onChange={(e) => setSelected(e.target.value)}
                            className="bg-white py-2 px-2 rounded-md max-w-[200px] border-none text-[#2E318D] text-sm font-medium focus:outline-none cursor-pointer"
                          >
                            <option value="All">All Courses</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.category_name}>
                                {cat.category_name}
                              </option>
                            ))}
                          </select> */}
                          <button
                            type="button"
                            className="text-[#2E318D] hover:text-blue-500 p-2 rounded-md"
                          >
                            <FiSearch className="text-[#2E318D] text-lg cursor-pointer" />
                          </button>
                        </div>
                      </div>
                      <button
                        title="Close"
                        onClick={() => {
                          setSearchQuery("");
                          setShowSearch(false);
                        }}
                        className="p-3 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-md border border-[#882CFB]"
                      >
                        <IoClose className="text-xl text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>

                {!showSearch && (
                  <div
                    title="Search Course"
                    onClick={() => setShowSearch(true)}
                    className="flex justify-center cursor-pointer bg-white border border-[#882CFB] hover:bg-gray-100 rounded-md p-3 shadow-md"
                  >
                    <button>
                      <IoSearch className="text-2xl text-gray-600 my-1" />
                    </button>
                  </div>
                )}
              </div>

              {/* Courses Grid */}
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCourses?.length > 0 ? (
                  currentCourses?.map((course) => (
                    <Link
                      key={course?.id}
                      href={{
                        pathname: `/${slugify(
                          course?.url_title,
                        )}`,
                      }}
                      className="group flex flex-col justify-between bg-white border border-gray-200/80 hover:border-[#882CFB]/60 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Top Image Container */}
                      <div className="relative overflow-hidden rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center h-48 group-hover:bg-purple-50/40 transition-colors">
                        {course?.header_image || course?.image_url ? (
                          <img
                            src={getCourseImageUrl(course)}
                            alt={course?.course_title}
                            onError={(e) => {
                              if (!e.currentTarget.dataset.retried && (course?.header_image || course?.image_url)) {
                                e.currentTarget.dataset.retried = "true";
                                e.currentTarget.src = getLiveDocumentUrl(course?.header_image || course?.image_url);
                              } else {
                                e.currentTarget.src = DEFAULT_COURSE_FALLBACK;
                              }
                            }}
                            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-gray-400">
                            <FaImage className="text-4xl mb-2 text-purple-300" />
                            <span className="text-xs font-semibold">ScholarAcad Certified</span>
                          </div>
                        )}
                        <span className="absolute top-3 left-3 bg-[#882CFB]/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                          {course?.category_name || "Certification"}
                        </span>
                      </div>

                      {/* Course Body */}
                      <div className="flex-1 flex flex-col justify-between mt-4">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
                            <AiOutlineBook className="text-[#882CFB] text-sm" />
                            <span>
                              {course?.ratings?.enrolled || "6,000+ Learners Enrolled"}
                            </span>
                          </div>

                          <h2
                            title={course?.course_title}
                            className="text-base font-bold text-gray-900 group-hover:text-[#882CFB] transition-colors line-clamp-2 leading-snug"
                          >
                            {course?.course_title || "Course Details"}
                          </h2>
                        </div>

                        {/* Social & Ratings */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md border border-amber-200/60">
                              <FaStar className="text-amber-400 text-xs" />
                              <span>{course?.ratings?.googleRating || "4.9"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                              <FcGoogle />
                              <IoLogoFacebook className="text-[#1877F2]" />
                              <FaSquareInstagram className="text-[#E1306C]" />
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-bold text-[#882CFB] group-hover:translate-x-1 transition-transform">
                            <span>Explore</span>
                            <GoArrowUpRight className="text-sm font-bold" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center col-span-12 h-60 bg-white rounded-lg border border-[#DFE0FF] p-6 mx-4 sm:mx-0">
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                      <CgSmileSad className="text-5xl text-gray-400" />
                      <p className="text-gray-500 text-lg font-semibold">
                        No Courses found
                      </p>
                      <p className="text-gray-400 text-sm text-center max-w-xs">
                        We couldn't find any Courses for this category or
                        search.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 🔹 Pagination */}
              {filteredCourses.length > coursesPerPage && (
                <div className="flex justify-end items-center gap-4 mt-2">
                  <button
                    title="Previous"
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-[#882CFB] cursor-pointer rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-gray-700 font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    title="Next"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-[#882CFB] cursor-pointer rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Third Section */}
        <div className="md:max-w-7xl mx-auto max-sm:p-4 py-5    ">
          <div className="bg-[#F7F3FF] rounded-md border border-gray-300 p-5">
            <h2 className=" heading ">Why Choose Our Courses</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  In order to keep students competitive and prepared for the
                  future, Scholaracad courses are in line with international
                  standards and changing industry demands.
                </p>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Courses that are in line with industry standards and offer
                  internationally recognized certificates
                </p>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Courses that are in line with industry standards and offer
                  internationally recognized certificates
                </p>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Adaptable learning formats to accommodate a range of learning
                  styles
                </p>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Programs with an emphasis on career advancement and skill
                  development that are outcome-driven
                </p>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Frequent course updates in line with certification and market
                  developments
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Testimonials */}
        <section className="testimonials_section ">
          <div className="relative max-w-7xl mx-auto py-5 ">
            <div className="text-center">
              <div className="flex justify-center items-center flex-col mt-2">
                <div>
                  {/* <RiGraduationCapFill className="text-[#29A6DD] text-4xl rotate-350 ml-[-15px] mb-[-5px] " /> */}
                  <p className="font-bold text-xl text-[#2E318D] ">
                    Testimonials
                  </p>
                </div>
              </div>
              <h2 className=" heading">Customer Speak About Scholaracad</h2>

              <div className="text-center max-w-3xl mx-auto mt-10">
                {/* Top Images */}
                <div className="flex justify-center items-center md:gap-10 gap-4 my-6 flex-wrap">
                  {visibleTestimonials?.map((item, index) => {
                    const initials = item?.name
                      ? item.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "NA";

                    const bgColors = [
                      "bg-red-300",
                      "bg-blue-300",
                      "bg-green-300",
                      "bg-purple-300",
                      "bg-pink-300",
                      "bg-yellow-300",
                    ];
                    const bgColor = bgColors[index % bgColors.length];
                    return item?.image ? (
                      <img
                        key={index}
                        src={item.image}
                        alt={item?.name}
                        onClick={() => handleClick(index)}
                        className={`cursor-pointer rounded-full object-cover transition-all duration-500 transform 
                          ${
                            index === activeIndex
                              ? "scale-110 border-2 border-[#2E318D]"
                              : "opacity-70"
                          } 
                          md:w-[70px] md:h-[70px] w-[50px] h-[50px]
                          hover:scale-110 hover:border-4 hover:border-[#2E318D]`}
                      />
                    ) : (
                      <div
                        key={index}
                        onClick={() => handleClick(index)}
                        className={`cursor-pointer flex items-center justify-center rounded-full text-white font-semibold transition-all duration-500 transform
                          ${bgColor}
                          ${
                            index === activeIndex
                              ? "scale-110 border-4 border-[#2E318D]"
                              : "opacity-70"
                          }
                          md:w-[70px] md:h-[70px] w-[50px] h-[50px]
                          hover:scale-110 hover:border-4 hover:border-[#2E318D]`}
                      >
                        {initials}
                      </div>
                    );
                  })}
                </div>

                {/* Testimonial Content */}
                {activeTestimonial && (
                  <div
                    key={activeIndex}
                    className="flex flex-col gap-2 justify-center items-center transition-all duration-700 ease-in-out animate-fadeIn"
                  >
                    <h2 className="text-[25px] font-bold text-[#2E318D]">
                      {activeTestimonial?.name}
                    </h2>
                    <p>{activeTestimonial?.designation}</p>

                    {/* Rating */}
                    <div className="flex gap-2">
                      {Array?.from({ length: 5 }).map((_, i) => (
                        <IoIosStar
                          key={i}
                          className={`text-2xl ${
                            i < (activeTestimonial?.rating || 5)
                              ? "text-[#E4B308]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Description */}
                    <p className="mt-2 text-lg text-gray-600 text-center px-4 md:px-0 max-w-2xl">
                      “{activeTestimonial?.comment}”
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Fourth Section */}
        <section className="py-5">
          <div className="relative max-w-7xl mx-auto text-center rounded-2xl overflow-hidden  ">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('/assets/landingpage/Empower Your Teams_bg.svg')",
              }}
            ></div>
            <div className="relative grid grid-cols-1 md:grid-cols-2 max-sm:gap-6 p-5 text-[#2E318D]">
              <div className="flex flex-col text-left justify-center ">
                <h2 className=" heading ">Who Can Benefit from Scholaracad</h2>
                <div className="grid grid-cols-1  gap-5 mt-5">
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <IoCheckmark className="mt-1" />
                    <p className="para">
                      {" "}
                      Students and recent grads looking for skills that can help
                      them in the workplace
                    </p>
                  </div>
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <IoCheckmark className="mt-1" />
                    <p className="para">
                      {" "}
                      Professionals in the workforce seeking certification and
                      promotion
                    </p>
                  </div>
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <IoCheckmark className="mt-1" />
                    <p className="para">
                      {" "}
                      Professionals in the workforce seeking certification and
                      promotion{" "}
                    </p>
                  </div>
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <IoCheckmark className="mt-1" />
                    <p className="para">Corporate groups and companies</p>
                  </div>
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <IoCheckmark className="mt-1" />
                    <p className="para">
                      Domain experts, coaches, and consultants{" "}
                    </p>
                  </div>
                  <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                    <IoCheckmark className="mt-1" />
                    <p className="para">
                      Lifelong learners dedicated to ongoing development{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center">
                <img
                  src="/assets/landingpage/empower_img.png"
                  className=""
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>

        <div className="max-sm:p-3">
          <section className="relative  max-w-7xl mx-auto py-5 grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <img
                src="/assets/landingpage/Corporate_ enterprice_training.svg"
                alt=""
              />
            </div>
            <div className="mt-3">
              <h2 className="heading">Key Benefits of Scholaracad </h2>
              <p className="my-4 para">
                Through organized instruction, professional advice, and
                real-world application, Scholaracad helps students and
                organizations attain excellence.{" "}
              </p>
              <div className="grid grid-cols-1  gap-5 mt-3">
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">
                    {" "}
                    Improved abilities and credibility in the workplace
                  </p>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">
                    {" "}
                    Promotion of one's career with accredited certifications
                  </p>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">
                    {" "}
                    Knowledge that is applicable to real-world situations
                  </p>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">
                    Adaptable and easily accessible educational
                    opportunities{" "}
                  </p>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">
                    Long-term organizational and professional development
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="tranning_delivery_bg  text-[#2E318D] max-sm:p-3">
          <div className="md:max-w-7xl mx-auto md:py-[220px] py-[150px]">
            <div className="flex justify-center items-center flex-col mt-2">
              <h2 className="heading text-center">
                Learning and Engagement Modes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 my-3 ">
              <div className="">
                <div class="md:max-w-md mx-auto mt-10 max-sm:p-7">
                  <ul className="relative border">
                    {trainingOptions.map((item, index) => (
                      <li
                        key={item.id}
                        onClick={() => setActiveIndex(index)}
                        className={`relative border-b py-4 cursor-pointer transition
                                  ${
                                    activeIndex === index
                                      ? "bg-[#E4D3FF]"
                                      : "hover:bg-gray-50"
                                  }
                                `}
                      >
                        <span
                          className={`absolute -left-5 top-0 my-4 w-8 h-8 flex items-center justify-center 
                                text-white font-bold rounded
                                ${
                                  activeIndex === index
                                    ? "bg-[#882CFB]"
                                    : "bg-gray-400"
                                }
                              `}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          className={`font-bold text-lg ml-10
                                    ${
                                      activeIndex === index
                                        ? "text-[#2E318D]"
                                        : "text-gray-600"
                                    }
                                  `}
                        >
                          {item.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-3 p-10">
                <div className="w-[250px] h-[250px] rounded-full bg-white flex justify-center items-center shadow">
                  <ActiveIcon
                    className={`w-[100px] h-[100px] transition animate-pulse
                      ${
                        activeIndex !== null
                          ? "text-[#882CFB]"
                          : "text-gray-400"
                      }
                    `}
                  />
                </div>

                <p className="text-center font-bold md:max-w-[90%]">
                  {trainingOptions[activeIndex].description}
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
      {/* <hr className="text-gray-200" /> */}

      {/* Footer */}
      <div className="max-sm:p-3">
        <Footer />
      </div>
    </>
  );
}

export default Course;
