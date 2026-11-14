import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaChalkboardTeacher,
  FaQuoteLeft,
  FaQuoteRight,
  FaStar,
} from "react-icons/fa";
import { RiGraduationCapFill } from "react-icons/ri";
import { AiOutlineBook, AiOutlineClockCircle } from "react-icons/ai";
import { GoArrowUpRight } from "react-icons/go";
import Testimonials from "@/Components/testimonials";
import { encryptId } from "@/utils/encryption";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CgSmileSad } from "react-icons/cg";
import { API_BASE_URL, APIENDPOINTS } from "../../apiconfig";
import { getCourseImageUrl, getBlogImageUrl, getLiveDocumentUrl, DEFAULT_COURSE_FALLBACK } from "@/utils/imageHelper";
import Loader from "./loader";
import { useCounter } from "@/utils/useCounter";
import { HiMiniArrowLongRight } from "react-icons/hi2";
import { IoCheckmark, IoLogoFacebook } from "react-icons/io5";
import { FaSquareInstagram } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

export default function LandingPage() {
  const slugify = (text) => {
    return text
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };
  const { token } = useAuth();
  const [allcourses, setallcourses] = useState([]);
  const [Recentblogs, setRecentBlogs] = useState([]);
  // console.log("Recentblogs", Recentblogs);
  // const { categories } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
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
    return userLocation?.state || "Delhi";
  }, [userLocation]);

  const leftValue = 250;
  const rightValue = 500;
  const sectionRef = useRef(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const leftCount = useCounter(leftValue, startAnimation);
  const rightCount = useCounter(rightValue, startAnimation);
  // Start animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStartAnimation(true);
        }
      },
      { threshold: 0.4 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try {
      const cachedBlogs = sessionStorage.getItem("home_recent_blogs");
      if (cachedBlogs) setRecentBlogs(JSON.parse(cachedBlogs));
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!token) return;
    try {
      const cached = sessionStorage.getItem("home_recent_blogs");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return;
      }
    } catch (e) {}

    const timer = setTimeout(() => {
      const RecentBlogs = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.RECENT_POSTS}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) {
            setRecentBlogs([]);
            return;
          }
          const data = await res.json();
          const list = data?.data || [];
          setRecentBlogs(list);
          try {
            sessionStorage.setItem("home_recent_blogs", JSON.stringify(list));
          } catch (e) {}
        } catch (err) {
          console.error("Error Recent Blogs :", err);
        }
      };
      RecentBlogs();
    }, 100);
    return () => clearTimeout(timer);
  }, [token]);

  // Fetch all courses with sessionStorage cache
  useEffect(() => {
    const cacheKey = `home_all_courses_${active_country || "in"}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setallcourses(parsed);
          return;
        }
      }
    } catch (e) {}

    if (!token) return;
    const fetchAllCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.ALL_COURSES}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            country_id: active_country,
          }),
        });
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        const list = data?.data || [];
        setallcourses(list);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(list));
        } catch (e) {}
      } catch (err) {
        console.error("Error fetching blog types:", err);
      }
    };
    fetchAllCourses();
  }, [token, active_country]);

  // Fetch Section View directly (eliminating sequential section-list waterfall) + sessionStorage cache
  const [sectionlist, setsectionlist] = useState([]);
  const [sectionView, setSectionView] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const cachedView = sessionStorage.getItem("home_section_view");
      if (cachedView) {
        const parsed = JSON.parse(cachedView);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSectionView(parsed);
          setLoading(false);
          return;
        }
      }
    } catch (e) {}

    if (!token) return;

    const DEFAULT_SECTIONS = [
      "Herosection_Slider1",
      "About Us",
      "Why Choose US",
      "Herosection_Slider2",
      "Herosection_Slider3",
      "Advantages",
      "who_can_join_our_Certifications",
    ];

    const fetchSectionView = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}${APIENDPOINTS.SECTION_DETAILS}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              sections: DEFAULT_SECTIONS,
            }),
          },
        );
        if (!res.ok) {
          setSectionView([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        const list = data?.data || [];
        setSectionView(list);
        try {
          sessionStorage.setItem("home_section_view", JSON.stringify(list));
        } catch (e) {}
      } catch (error) {
        setSectionView([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSectionView();
  }, [token]);

  const slides = [
    <>
      <section className="max-sm:p-3  grid lg:grid-cols-2 md:gap-10 items-center z-10">
        <div data-aos="fade-up" className="max-sm:py-10">
          {loading || sectionView.length === 0 ? (
            <div className="animate-pulse space-y-5">
              <div>
                <span className="h-5 w-40 bg-gray-300 rounded-md block"></span>
              </div>
              <div className="h-7 bg-gray-300 rounded w-2/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded-full w-40 mt-6"></div>
            </div>
          ) : (
            <>
              <div className="mb-2">
                {sectionView[0]?.section === "Herosection_Slider1" && (
                  <span className="bg-blue-200 p-1 rounded-md px-3 text-xs text-[#1363DF]">
                    {sectionView[0]?.label || "NA"}
                  </span>
                )}
              </div>
              {sectionView[0]?.section === "Herosection_Slider1" && (
                <h2 className="heading">
                  {sectionView[0]?.heading ||
                    "Elevate Your Expertise with Scholaracad"}
                </h2>
              )}
              {/* {sectionView[0]?.section === "Herosection_Slider1" && (
                <p className="mt-3 para">
                  {sectionView[0]?.description || "NA"}
                </p>
              )} */}
              {sectionView[0]?.section === "Herosection_Slider1" && (
                <div
                  className="summernote-content"
                  dangerouslySetInnerHTML={{
                    __html: sectionView[0]?.description || "NA",
                  }}
                />
              )}
              <div className="py-5 flex gap-4">
                <Link
                  href="/all-courses"
                  className="relative group border-none bg-transparent p-0 cursor-pointer"
                >
                  <div className="btn_primary">
                    <span className="select-none">
                      {sectionView[0]?.button_label || "Explore Courses"}
                    </span>
                    <HiMiniArrowLongRight />
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
        <div
          ref={sectionRef}
          className="relative w-full flex justify-center items-center  md:top-[110px]"
        >
          <img
            src="/assets/landingpage/herosection_slider1_img.png"
            alt="Hero"
            className="object-contain w-full max-w-xl mx-auto z-10 relative scale-110 lg:scale-125"
          />
          <div
            className="absolute left-0 md:left-6 top-1/2 -translate-y-1/2 
                   bg-white shadow-lg md:px-7  md:py-3 p-2 rounded-xl z-20 text-center flex justify-between  flex-col items-center gap-2"
          >
            <div className="md:w-[40px] md:h-[40px] w-[20px] h-[20px] rounded-full bg-[#882CFB]"></div>
            {sectionView[0]?.section === "Herosection_Slider1" && (
              <p className="md:text-md text-sm text-black font-bold">
                {sectionView[0]?.label_one}
              </p>
            )}
            {sectionView[0]?.section === "Herosection_Slider1" && (
              <h3 className="md:text-3xl font-bold text-black ">
                {sectionView[0]?.label_two}
              </h3>
              // <h3 className="md:text-3xl font-bold text-black ">{leftCount}+</h3>
            )}
          </div>
          <div
            className="absolute right-0 md:right-[100px] md:top-[300px] -translate-y-1/2 
                   bg-white shadow-lg md:px-5 md:py-3 p-2  rounded-xl z-20 text-center flex justify-between  flex-col items-center gap-2"
          >
            <div className="md:w-[40px] md:h-[40px] w-[20px] h-[20px] rounded-full bg-[#12BB6A]"></div>
            {sectionView[0]?.section === "Herosection_Slider1" && (
              <p className="md:text-md text-sm text-black font-bold">
                {sectionView[0]?.label_three}
              </p>
            )}
            {sectionView[0]?.section === "Herosection_Slider1" && (
              <h3 className="md:text-3xl font-bold text-black ">
                {sectionView[0]?.label_four}
              </h3>
              // <h3 className="md:text-3xl font-bold text-black ">{rightCount}+</h3>
            )}
          </div>
        </div>
      </section>
    </>,
    <>
      <section className="max-sm:p-3  grid lg:grid-cols-2 md:gap-10 items-center z-10">
        <div data-aos="fade-up" className="max-sm:py-10">
          {loading || sectionView.length === 0 ? (
            <div className="animate-pulse space-y-5">
              <div>
                <span className="h-5 w-40 bg-gray-300 rounded-md block"></span>
              </div>
              <div className="h-7 bg-gray-300 rounded w-2/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded-full w-40 mt-6"></div>
            </div>
          ) : (
            <>
              <div className="mb-2">
                {/* <span className="bg-blue-200 p-1 rounded-md px-3 text-xs text-[#1363DF]">
                  Consulting Excellence Guarantee
                </span> */}
                {sectionView[3]?.section === "Herosection_Slider2" && (
                  <span className="bg-blue-200 p-1 rounded-md px-3 text-xs text-[#1363DF]">
                    {sectionView[3]?.label || "NA"}
                  </span>
                )}
              </div>
              {/* <h1 className="heading">
                Discover Why ScholarAcad Consulting Stands Out
              </h1> */}
              {sectionView[3]?.section === "Herosection_Slider2" && (
                <h1 className="heading">
                  {sectionView[3]?.heading ||
                    "Discover Why ScholarAcad Consulting Stands Out"}
                </h1>
              )}
              {/* {sectionView[3]?.section === "Herosection_Slider2" && (
                <p className="mt-3 para">
                  {sectionView[3]?.description || "NA"}
                </p>
              )} */}
              {sectionView[3]?.section === "Herosection_Slider2" && (
                <div
                  className="summernote-content"
                  dangerouslySetInnerHTML={{
                    __html: sectionView[3]?.description || "NA",
                  }}
                />
              )}
              {/* <p className="mt-3 para">
                ScholarAcad Consulting is intended to assist individuals and
                businesses in coordinating learning tactics with actual business
                objectives. We guarantee significant solutions that promote
                performance, efficiency, and long-term success with professional
                advice, tailored suggestions, and industry best practices.
              </p> */}
              <div className="py-2 flex gap-4">
                <Link
                  title="Explore Consulting"
                  href="/consulting"
                  className="relative group border-none bg-transparent p-0 cursor-pointer"
                >
                  <div className="btn_primary">
                    <span className="select-none">Explore Consulting</span>
                    <HiMiniArrowLongRight />
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
        <div
          ref={sectionRef}
          className="relative w-full flex justify-center items-center  md:top-[110px]"
        >
          <img
            src="/assets/landingpage/Resources_bg_herosection.svg"
            alt="Hero"
            className="object-contain w-full max-w-xl mx-auto z-10 relative scale-110 lg:scale-125"
          />
        </div>
      </section>
    </>,
    <>
      <section className="max-sm:p-3  grid lg:grid-cols-2 md:gap-10 items-center z-10">
        <div className="max-sm:py-10 ">
          {loading || sectionView.length === 0 ? (
            <div className="animate-pulse space-y-5">
              <div>
                <span className="h-5 w-40 bg-gray-300 rounded-md block"></span>
              </div>
              <div className="h-7 bg-gray-300 rounded w-2/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded-full w-40 mt-6"></div>
            </div>
          ) : (
            <>
              <div className="mb-2 md:mt-[120px]">
                {/* <span className="bg-blue-200 p-1 rounded-md px-3 text-xs text-[#1363DF]">
                  Knowledge Value Guarantee
                </span> */}
                {sectionView[4]?.section === "Herosection_Slider3" && (
                  <span className="bg-blue-200 p-1 rounded-md px-3 text-xs text-[#1363DF]">
                    {sectionView[4]?.label || "NA"}
                  </span>
                )}
              </div>
              {/* <h1 className="heading">
                Discover Why ScholarAcad Resources Stand Out
              </h1> */}
              {sectionView[4]?.section === "Herosection_Slider3" && (
                <h1 className="heading">
                  {sectionView[4]?.heading ||
                    "Discover Why ScholarAcad Resources Stand Out"}
                </h1>
              )}
              {/* {sectionView[4]?.section === "Herosection_Slider3" && (
                <p className="mt-3 para">
                  {sectionView[4]?.description || "NA"}
                </p>
              )} */}
              {sectionView[4]?.section === "Herosection_Slider3" && (
                <div
                  className="summernote-content"
                  dangerouslySetInnerHTML={{
                    __html: sectionView[4]?.description || "NA",
                  }}
                />
              )}
              {/* <p className="mt-3 para">
                Through blogs, manuals, test preparation materials, and industry
                updates, ScholarAcad Resources offers insightful information.
                These carefully chosen resources promote lifelong learning,
                enhance knowledge, and assist professionals in confidently
                implementing best practices in practical situations.
              </p> */}
              <div className="py-2 flex gap-4">
                <Link
                  title="Explore Resources"
                  href="/resource"
                  className="relative group border-none bg-transparent p-0 cursor-pointer"
                >
                  <div className="btn_primary">
                    <span className="select-none">Explore Resources</span>
                    <HiMiniArrowLongRight />
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
        <div
          ref={sectionRef}
          className="relative w-full flex justify-center items-center  md:top-[110px] "
        >
          <img
            src="/assets/landingpage/herosection_slider3_img.png"
            // src="/assets/landingpage/Consulting_bg_herosection.svg"

            alt="Hero"
            className="object-contain w-full mx-auto z-10 relative scale-110 lg:scale-125"
          />
        </div>
      </section>
    </>,
  ];

  const backgroundImages = [
    "/assets/landingpage/aboutusbg2.png",
    "/assets/landingpage/herosection_bg.svg",
    "/assets/landingpage/aboutusbg2.png",
  ];

  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides?.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <main className="font-nunito  bg-white ">
        {/* Slides Wrapper with animation 1 */}
        {/* <div className="relative md:min-h-[75vh] max-sm:min-h-[90vh] w-full overflow-hidden">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slides.map((slide, i) => (
                <div
                  key={i}
                  className="w-full h-full flex-shrink-0 bg-center bg-cover relative"
                  style={{ backgroundImage: `url(${backgroundImages[i]})` }}
                >
                  <div className="max-w-7xl mx-auto py-12">{slide}</div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === index ? "bg-blue-700 scale-125" : "bg-gray-300"
                  }`}
                ></button>
              ))}
            </div>
          </div> */}

        {/* Slider animation 2 */}
        <div className="relative md:min-h-[73vh] max-sm:min-h-[100vh] w-full overflow-hidden">
          {slides?.map((slide, i) => (
            <div
              key={i}
              className={`absolute w-full h-full bg-center bg-cover transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]
                        ${
                          i === index
                            ? "opacity-100 translate-x-0 z-30"
                            : "opacity-0 translate-x-10 z-0"
                        }
                      `}
              style={{ backgroundImage: `url(${backgroundImages[i]})` }}
            >
              <div className="max-w-7xl mx-auto py-12 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]">
                {slide}
              </div>
            </div>
          ))}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30 pointer-events-auto">
            {slides?.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all
                  ${i === index ? "bg-[#882CFB] scale-125" : "bg-gray-300"}
                `}
              />
            ))}
          </div>
        </div>
        {/* <div className="herosection_section ">
          <section className="max-sm:p-3 max-w-7xl mx-auto  py-8 grid lg:grid-cols-2 md:gap-10 items-center z-10">
            <div data-aos="fade-up" className="max-sm:py-10">
              {loading || sectionView.length === 0 ? (
                <div className="animate-pulse space-y-5">
                  <div>
                    <span className="h-5 w-40 bg-gray-300 rounded-md block"></span>
                  </div>
                  <div className="h-7 bg-gray-300 rounded w-2/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded-full w-40 mt-6"></div>
                </div>
              ) : (
                <>
                  <div>
                    <span className="bg-blue-200 p-1 rounded-md px-3 text-xs text-[#1363DF]">
                      100% Satisficatio`n Guarantee
                    </span>
                  </div>
                  <h1 className="heading">
                    {sectionView[0]?.heading ||
                      "Elevate Your Expertise with Scholaracad"}
                  </h1>
                  <p className="mt-3 para">
                    {sectionView[0]?.description || "NA"}
                  </p>
                  <div className="mt-8 flex gap-4">
                    <Link
                      href="/all-courses"
                      className="relative group border-none bg-transparent p-0 cursor-pointer"
                    >
                      <div className="relative flex items-center justify-between py-2 px-5 border-2 border-white text-white rounded-full transform -translate-y-1 bg-[#2E318D] gap-3 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110">
                        <span className="select-none">
                          {sectionView[0]?.button_label || "Explore Courses"}
                        </span>
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5 ml-2 -mr-1 transition duration-250 group-hover:translate-x-1"
                        >
                          <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          ></path>
                        </svg>
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </div>
            <div
              ref={sectionRef}
              className="relative w-full flex justify-center items-center  md:top-[115px]"
            >
              <img
                src="/assets/landingpage/herosecttionrightside_img2.svg"
                alt="Hero"
                className="object-contain w-full max-w-xl mx-auto z-10 relative scale-110 lg:scale-125"
              />
              <div
                className="absolute left-0 md:left-6 top-1/2 -translate-y-1/2 
                   bg-white shadow-lg md:px-7  md:py-3 p-2 rounded-xl z-20 text-center flex justify-between  flex-col items-center gap-2"
              >
                <div className="md:w-[40px] md:h-[40px] w-[20px] h-[20px] rounded-full bg-[#882CFB]"></div>
                <p className="md:text-md text-sm text-black font-bold">
                  Total Student
                </p>
                <h3 className="md:text-3xl font-bold text-black ">
                  {leftCount}+
                </h3>
              </div>
              <div
                className="absolute right-0 md:right-[100px] md:top-[300px] -translate-y-1/2 
                   bg-white shadow-lg md:px-5 md:py-3 p-2  rounded-xl z-20 text-center flex justify-between  flex-col items-center gap-2"
              >
                <div className="md:w-[40px] md:h-[40px] w-[20px] h-[20px] rounded-full bg-[#12BB6A]"></div>
                <p className="md:text-md text-sm text-black font-bold">
                  Total Student
                </p>
                <h3 className="md:text-3xl font-bold text-black ">
                  {rightCount}+
                </h3>
              </div>
            </div>
          </section>
        </div> */}

        <div className="bg-white py-5 overflow-hidden ">
          <div className="relative flex w-max animate-scroll">
            {[
              "/assets/landingpage/institutelogo/hcl_logo.svg",
              "/assets/landingpage/institutelogo/rec_logo.svg",
              "/assets/landingpage/institutelogo/ey_logo.png",
              "/assets/landingpage/institutelogo/dxc_logo.svg",
              "/assets/landingpage/institutelogo/daimler_logo.svg",
              "/assets/landingpage/institutelogo/adidas_logo.png",
              "/assets/landingpage/institutelogo/bajaj_logo.svg",
              "/assets/landingpage/institutelogo/rrtech_logo.svg",
              "/assets/landingpage/institutelogo/rhf_logo.png",
            ]
              // Duplicate list to create seamless looping
              .concat([
                "/assets/landingpage/institutelogo/hcl_logo.svg",
                "/assets/landingpage/institutelogo/rec_logo.svg",
                "/assets/landingpage/institutelogo/ey_logo.png",
                "/assets/landingpage/institutelogo/dxc_logo.svg",
                "/assets/landingpage/institutelogo/daimler_logo.svg",
                "/assets/landingpage/institutelogo/adidas_logo.png",
                "/assets/landingpage/institutelogo/bajaj_logo.svg",
                "/assets/landingpage/institutelogo/rrtech_logo.svg",
                "/assets/landingpage/institutelogo/rhf_logo.png",
              ])
              ?.map((src, idx) => (
                <div
                  key={idx}
                  className="bg-white flex items-center justify-center p-2 border border-[#C1C2F9] hover:shadow-md rounded mx-4"
                >
                  <div className="h-[80px] w-[150px] flex items-center justify-center">
                    <img
                      src={src}
                      alt={`Logo ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* <div  className="bg-[#2E318D] md:w-7xl mx-auto  my-[80px] p-5 text-white rounded-2xl md:absolute md:bottom-[-230px] md:left-1/2 md:transform md:-translate-x-1/2 md:z-50 ">
          <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x max-sm:divide-y divide-gray-300  gap-2 my-8">
            <div className="flex justify-center items-center">
              <div className="flex flex-col md:items-start items-center gap-4 py-2">
                <img
                  src="/assets/landingpage/career.svg"
                  alt="Logo 1"
                  className="h-[50px] object-contain"
                />
                <p className="text-md text-left">
                  Platform to boost your tech career
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex flex-col md:items-start items-center gap-4 py-2">
                <img
                  src="/assets/landingpage/learning_experience.svg"
                  alt="Logo 2"
                  className="h-[50px] object-contain"
                />
                <p className="text-md text-left">
                  Immersive Learning Experience
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex flex-col md:items-start items-center gap-4 py-2">
                <img
                  src="/assets/landingpage/work.svg"
                  alt="Logo 3"
                  className="h-[50px] object-contain"
                />
                <p className="text-md text-left">
                  Work-ready development Experience
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* About Us */}
        <div className="aboutus_section max-sm:p-3">
          <section className="relative   max-w-7xl mx-auto py-5 grid lg:grid-cols-2  items-start">
            <div data-aos="fade-up" className="">
              <img
                src="/assets/landingpage/secondsection_leftsideimg.png"
                //  src={
                //     `${API_BASE_URL}/master/secure-documents?path=
                //               ${sectionView[1]?.image_one}` ||
                //     "/assets/landingpage/secondsection_leftsideimg.png"
                //   }
                alt="About Us"
                className="object-contain w-[85%]"
              />
            </div>
            <div data-aos="fade-up" className="">
              <div className=" gap-2 mt-2">
                {/* <RiGraduationCapFill className="text-[#29A6DD] text-4xl rotate-350 " /> */}
                {sectionView[1]?.section === "About Us" && (
                  <p className="font-bold text-md">
                    {sectionView[1]?.section || "About Us"}
                  </p>
                )}
              </div>
              {sectionView[1]?.section === "About Us" && (
                <h2 className="heading">{sectionView[1]?.heading || "Na"}</h2>
              )}

              {/* <p className="mt-6 para text-justify">
                  {sectionView[1]?.description || "Na"}
                 </p> */}
              {/* {sectionView?.length > 0 && (
                <div
                  className="summernote-content prose max-w-none mt-3"
                  dangerouslySetInnerHTML={{
                    __html:
                      sectionView[1]?.description || "No Details Available",
                  }}
                ></div>
              )} */}
              {sectionView[1]?.section === "About Us" && (
                <div
                  className="summernote-content"
                  dangerouslySetInnerHTML={{
                    __html: sectionView[1]?.description || "NA",
                  }}
                />
              )}
            </div>
          </section>
        </div>

        {/* TRENDING COURSES */}
        {/* <div>
          <Coursesslider />
        </div> */}

        {/* TRENDING COURSES */}
        <section id="courses" className="bg-[#F7F3FF] py-5 max-sm:p-3">
          <div className="max-w-7xl mx-auto ">
            <h2 data-aos="fade-up" className="heading">
              Explore Trending Courses
            </h2>
            <div className="max-w-7xl mx-auto  pt-5">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allcourses?.courses?.length > 0 ? (
                  // Take the last 6 courses
                  allcourses.courses.slice(-6).map((course) => (
                    <Link
                      key={course?.id}
                      href={{
                        pathname: `/${slugify(
                          course?.url_title,
                        )}`,
                      }}
                      className="group flex flex-col justify-between bg-white border border-gray-200/80 hover:border-[#882CFB]/60 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Image Container */}
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
                            <span className="text-xs font-semibold text-purple-600">Trending Certification</span>
                          </div>
                        )}
                        <span className="absolute top-3 left-3 bg-[#882CFB]/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                          {course?.course_category || course?.category_name || "Popular"}
                        </span>
                      </div>

                      {/* Content */}
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
                            {course?.course_title || "NA"}
                          </h2>
                        </div>

                        {/* Ratings and Link */}
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
                      <p className="para">
                        We couldn't find any Courses for this category. Check
                        back later or explore other categories.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-5">
                <Link href="/all-courses">
                  <button className="relative group border-none bg-transparent p-0  cursor-pointer  ">
                    <div className="relative flex items-center justify-between py-2 px-4 border-2 border-white  text-white rounded-full transform -translate-y-1 bg-[#882CFB] hover:bg-[#4347ca] gap-1 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110 ">
                      <span className="select-none">View All Courses</span>
                      <HiMiniArrowLongRight />
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* <section className=" max-w-7xl mx-auto  lg:px-12  md:pt-12 pt-4">
          <div className="flex justify-between  gap-4 ">
            <div className="flex flex-col justify-end ">
              <img
                src="/assets/landingpage/chooseus_img1.jpg"
                alt="Image 1"
                className="w-full md:w-[234px] md:h-[180px] h-full object-cover rounded-lg "
              />
            </div>
            <div className="flex justify-center  ">
              <img
                src="/assets/landingpage/chooseus_img2.jpg"
                alt="Image 2"
                className="w-full md:w-[399px] md:h-[260px] h-full object-cover  rounded-tl-[30px] rounded-tr-[0px] rounded-bl-[0px] rounded-br-[30px] md:mb-5 "
              />
            </div>
            <div className="flex flex-col justify-end  ">
              <img
                src="/assets/landingpage/chooseus_img3.jpg"
                alt="Image 3"
                className="w-full md:w-[295px] md:h-[170px] h-full object-cover rounded-tl-[30px] rounded-tr-[0px] rounded-bl-[0px] rounded-br-[30px]  md:mb-[60px] "
              />
            </div>

            <div className=" flex flex-col justify-center ">
              <img
                src="/assets/landingpage/chooseus_img4.jpg"
                alt="Image 4"
                className="w-full md:w-[104px] md:h-[106px] h-full object-cover rounded-lg  "
              />
            </div>
          </div>
        </section> */}

        {/* WHY CHOOSE US */}
        <section className="relative max-w-7xl mx-auto py-7  grid lg:grid-cols-2 gap-10 max-sm:p-3 ">
          <div data-aos="fade-up" className="">
            <div className=" mt-0">
              {/* <RiGraduationCapFill className="text-[#29A6DD] text-4xl rotate-350 " /> */}
              {sectionView[2]?.section === "Why Choose US" && (
                <p className="font-bold text-md">
                  {sectionView[2]?.section || "Why Choose US"}
                </p>
              )}
            </div>
            {/* <h1 className="heading">
              {sectionView[2]?.heading ||
                "Discover Why Scholaracad Consistently Stands Out"}
            </h1> */}
            {sectionView[2]?.section === "Why Choose US" && (
              <h2 className="heading mt-1">
                {sectionView[2]?.heading || "NA"}
              </h2>
            )}
            {sectionView[2]?.section === "Why Choose US" && (
              <div
                className="summernote-content"
                dangerouslySetInnerHTML={{
                  __html: sectionView[2]?.description || "NA",
                }}
              />
            )}
            {/* {sectionView[2]?.description || "NA"} */}
            {/* <p className=" para">
              Certification programs that are industry-aligned and globally
              renowned, Training given by qualified and seasoned professionals
              in the field, Exam-focused study combined with hands-on,
              real-world experience, Adaptable learning styles for professionals
              in the workforce, Career-focused initiatives aimed at improving
              employability, From enrollment to certification, committed learner
              support,
            </p> */}
          </div>
          <div>
            <div className="max-w-[70%] m-auto">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div
                  data-aos="flip-left"
                  data-aos-easing="ease-out-cubic"
                  data-aos-duration="2000"
                  className=" flex items-center flex-col justify-center p-4  rounded-md bg-[#F7F3FF] "
                >
                  <img
                    src="/assets/landingpage/officeworker.svg"
                    alt="Logo 1"
                    className="h-16 w-auto object-contain"
                  />
                  <p className="text-center p-3 font-bold text-[#535353] text-[18px]">
                    Accredited Training & Exam Centre
                  </p>
                </div>
                <div
                  data-aos="flip-left"
                  data-aos-easing="ease-out-cubic"
                  data-aos-duration="2000"
                  className=" flex items-center flex-col justify-center p-4  rounded-md bg-[#F7F3FF] "
                >
                  <img
                    src="/assets/landingpage/chat.svg"
                    alt="Logo 1"
                    className="h-16 w-auto object-contain"
                  />
                  <p className="text-center p-3 font-bold text-[#535353] text-[18px]">
                    Multiply Training Delivery Options
                  </p>
                </div>
              </div>
            </div>
            <div className="max-sm:max-w-[70%] max-sm:m-auto">
              <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mt-4">
                <div
                  data-aos="flip-left"
                  data-aos-easing="ease-out-cubic"
                  data-aos-duration="2000"
                  className=" flex items-center flex-col justify-center p-4  rounded-md bg-[#F7F3FF] "
                >
                  <img
                    src="/assets/landingpage/security.svg"
                    alt="Logo 1"
                    className="h-16 w-auto object-contain"
                  />
                  <p className="text-center p-3 font-bold text-[#535353] text-[18px]">
                    100% Passing Warranty
                  </p>
                </div>
                <div
                  data-aos="flip-left"
                  data-aos-easing="ease-out-cubic"
                  data-aos-duration="2000"
                  className=" flex items-center flex-col justify-center p-4  rounded-md bg-[#F7F3FF] "
                >
                  <img
                    src="/assets/landingpage/support.svg"
                    alt="Logo 1"
                    className="h-16 w-auto object-contain"
                  />
                  <p className="text-center p-3 font-bold text-[#535353] text-[18px]">
                    After Training Support Available
                  </p>
                </div>
                <div
                  data-aos="flip-left"
                  data-aos-easing="ease-out-cubic"
                  data-aos-duration="2000"
                  className="flex items-center flex-col justify-center p-6 rounded-md bg-[#F7F3FF] hover:shadow-lg transition duration-300"
                >
                  <div className="rounded-full ">
                    <FaChalkboardTeacher className="text-[#1990A7] text-6xl" />
                  </div>

                  <p className="text-center mt-4 font-semibold text-[#535353] text-[18px]">
                    Certified & Experienced Trainers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section data-aos="fade-up" className="py-5 max-sm:p-3">
          <div className="relative max-w-7xl mx-auto text-center rounded-2xl overflow-hidden  ">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('/assets/landingpage/Empower Your Teams_bg.svg')",
              }}
            ></div>
            <div className="relative grid grid-cols-1 md:grid-cols-2 p-4 ">
              <div className="flex flex-col text-left justify-center ">
                {/* <h2 data-aos="fade-up" className="heading_blue ">
                  {sectionView[3]?.heading || "NA"}
                </h2>
                <p
                  data-aos="fade-up"
                  className="mt-4 text-[#2E318D] font-bold text-lg md:leading-1"
                >
                  {sectionView[3]?.description || "NA"}
                </p> */}
                <div className="">
                  {sectionView[5]?.section === "Advantages" && (
                    <h2 className="heading">
                      {sectionView[5]?.heading || "NA"}
                    </h2>
                  )}
                  {sectionView[5]?.section === "Advantages" && (
                    // <p className="para my-4">
                    //   {sectionView[5]?.description || "NA"}
                    // </p>
                    <div
                      className="summernote-content"
                      dangerouslySetInnerHTML={{
                        __html: sectionView[5]?.description || "NA",
                      }}
                    />
                  )}
                  {/* <h4 className="font-bold">Key Advantages: </h4>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-5 mt-5">
                    <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                      <IoCheckmark className="mt-1" />
                      <p className="para">
                        Certification programs that are industry-aligned and
                        globally renowned
                      </p>
                    </div>
                    <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                      <IoCheckmark className="mt-1" />
                      <p className="para">
                        Instruction given by qualified and seasoned experts
                      </p>
                    </div>
                    <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                      <IoCheckmark className="mt-1" />
                      <p className="para">
                        Real-world, practical education with practical
                        supervision
                      </p>
                    </div>
                    <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                      <IoCheckmark className="mt-1" />
                      <p className="para">
                        Exam-focused study leads to a high certification success
                        rate.{" "}
                      </p>
                    </div>
                    <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                      <IoCheckmark className="mt-1" />
                      <p className="para">
                        Adaptable educational opportunities for professionals in
                        the workforce
                      </p>
                    </div>
                    <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                      <IoCheckmark className="mt-1" />
                      <p className="para">
                        Improved professional credibility and career prospects
                      </p>
                    </div>
                  </div> */}
                </div>
                {/* <div data-aos="fade-up" className="mt-8">
                  <Link href="/all-courses">
                    <button className="relative group border-none bg-transparent p-0  cursor-pointer  ">
                      <div className="relative flex items-center justify-between py-2 px-4  text-[#2E318D]  group-hover:bg-[#4347ca] rounded-full transform -translate-y-1 bg-white gap-1 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110 font-bold">
                        <span className="select-none"> Explore Courses</span>
                        <HiMiniArrowLongRight />
                      </div>
                    </button>
                  </Link>
                </div> */}
              </div>
              <div data-aos="fade-up" className="flex justify-end items-center">
                <img
                  src="/assets/landingpage/empower_img.png"
                  className=""
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
        <section className="py-5 max-sm:p-3 ">
          <div className=" max-w-7xl mx-auto bg-[#E1F3F0]  p-4 rounded-xl ">
            {/* <h1 className="heading">Who Can Join Our Certifications</h1> */}
            {sectionView[6]?.section === "who_can_join_our_Certifications" && (
              <p className="heading">{sectionView[6]?.heading || "NA"}</p>
            )}
            {sectionView[6]?.section === "who_can_join_our_Certifications" && (
              <div
                className="summernote-content"
                dangerouslySetInnerHTML={{
                  __html: sectionView[6]?.description || "NA",
                }}
              />
            )}
            {/* <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />

                  <p className="para">
                    Students and recent graduates hoping to begin a career in
                    the workforce
                  </p>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">
                    Professionals in the workforce want to change roles or
                    improve their skills
                  </p>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">
                    IT specialists, team leaders, and project managers{" "}
                  </p>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">
                    Quality experts, consultants, and business analysts
                  </p>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">
                    Businesses and corporate groups want to upskill their
                    employees{" "}
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </section>

        {/* BLOG SECTION */}
        <section id="courses" className="p-3 py-5">
          <div className="max-w-7xl mx-auto">
            <h2 data-aos="fade-up" className="heading">
              Our Latest Blog
            </h2>
            <div className="max-w-7xl mx-auto  py-5">
              {/* Blog Section */}
              {Recentblogs?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div data-aos="fade-up" className="rounded-2xl">
                    <img
                      src={getBlogImageUrl(Recentblogs[0])}
                      alt={Recentblogs[0]?.resource_title || "Blog"}
                      onError={(e) => {
                        if (!e.currentTarget.dataset.triedLive) {
                          e.currentTarget.dataset.triedLive = "true";
                          const clean = (Recentblogs[0]?.header_image || Recentblogs[0]?.image || "").replace(/^\/+/, "");
                          if (clean) {
                            e.currentTarget.src = `https://knowledgeadmin.scholaracad.com/master/secure-documents?path=${encodeURIComponent(clean)}`;
                            return;
                          }
                        }
                        e.currentTarget.src = "/assets/landingpage/blog1_image.png";
                      }}
                      className="h-50 w-full object-cover rounded-md"
                    />
                    <div className="flex flex-col gap-4 mt-2">
                      <span className="mt-2 text-gray-500">
                        {/* {Recentblogs[0]?.resource_category || "Education"} —{" "} */}
                        {Recentblogs[0]?.created_at
                          ? new Date(
                              Recentblogs[0].created_at,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })
                          : "Aug 24, 2023"}
                      </span>
                      <Link
                        title="Read More"
                        href={{
                          pathname: `/article/${slugify(
                            Recentblogs[0]?.resource_title,
                          )}`,
                          // query: { id: encryptId(Recentblogs[0]?.id) },
                        }}
                        className="text-[#2E318D] font-semibold text-md hover:underline cursor-pointer"
                      >
                        {Recentblogs[0]?.resource_title || "NA"}
                      </Link>

                      <span className="text-gray-600 text-wrap">
                        {Recentblogs[0]?.short_description?.slice(0, 250) ||
                          "NA"}
                      </span>
                    </div>
                  </div>
                  {/* 🟦 Right Side — Next 3 Blogs */}
                  <div className="flex flex-col gap-5">
                    {Recentblogs?.slice(1, 4)?.map((blog, i) => (
                      <div
                        key={blog?.id || i}
                        data-aos="fade-up"
                        className="flex flex-col md:flex-row gap-4 items-start"
                      >
                        <div className="w-full md:w-40 flex-shrink-0">
                          <img
                            src={getBlogImageUrl(blog)}
                            alt={blog?.resource_title || "NA"}
                            onError={(e) => {
                              e.currentTarget.src = "/assets/landingpage/blog1_image.png";
                            }}
                            className="w-full h-28 md:h-24 object-cover rounded-lg shadow-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-2 flex-1">
                          <Link
                            title="Read More"
                            href={{
                              pathname: `/article/${slugify(blog?.resource_title)}`,
                            }}
                            className="text-[#2E318D] font-semibold text-md hover:underline cursor-pointer"
                          >
                            {blog?.resource_title || "NA"}
                          </Link>

                          <span className="text-sm text-gray-600 line-clamp-3">
                            {blog?.short_description?.slice(0, 130) || "NA"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                //No Blogs
                <div className="flex flex-col items-center justify-center h-60 bg-white rounded-lg border border-[#DFE0FF] p-6 mx-4 sm:mx-0">
                  <div className="flex flex-col items-center gap-4 animate-pulse">
                    <CgSmileSad className="text-5xl text-gray-400" />
                    <p className="text-gray-500 text-lg font-semibold">
                      No blogs found
                    </p>
                    <p className="text-gray-400 text-sm text-center max-w-xs">
                      We couldn’t find any blogs. Please check back later.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {/* <section className="testimonials_section ">
          <div className="relative max-w-7xl mx-auto py-10 ">
            <div className="text-center">
              <div className="flex justify-center items-center flex-col mt-2">
                <div>
                  <RiGraduationCapFill className="text-[#29A6DD] text-4xl rotate-350 ml-[-15px] mb-[-5px] " />
                  <h1 className="font-bold text-xl text-[#2E318D] ">
                    Testimonials
                  </h1>
                </div>
              </div>
              <h1 className=" text-[30px] md:text-[42px]  font-extrabold leading-tight">
                Customer Speak About Scholaracad
              </h1>
              <div className="flex justify-center items-center md:gap-10 gap-4 my-4">
                <img
                  src="/assets/landingpage/blog1_image.png"
                  className="md:w-[70px] md:h-[70px] w-[50px] h-[50px] rounded-full transition-all duration-300 transform hover:scale-110 hover:border-4 hover:border-[#2E318D]"
                  alt=""
                />
                <img
                  src="/assets/landingpage/blog1_image.png"
                  className="md:w-[70px] md:h-[70px] w-[50px] h-[50px] rounded-full transition-all duration-300 transform hover:scale-110 hover:border-4 hover:border-[#2E318D]"
                  alt=""
                />
                <img
                  src="/assets/landingpage/blog1_image.png"
                  className="md:w-[100px] md:h-[100px] w-[70px] h-[70px] rounded-full transition-all duration-300 transform hover:scale-110 hover:border-4 hover:border-[#2E318D]"
                  alt=""
                />
                <img
                  src="/assets/landingpage/blog1_image.png"
                  className="md:w-[70px] md:h-[70px] w-[50px] h-[50px] rounded-full transition-all duration-300 transform hover:scale-110 hover:border-4 hover:border-[#2E318D]"
                  alt=""
                />
                <img
                  src="/assets/landingpage/blog1_image.png"
                  className="md:w-[70px] md:h-[70px] w-[50px] h-[50px] rounded-full transition-all duration-300 transform hover:scale-110 hover:border-4 hover:border-[#2E318D]"
                  alt=""
                />
              </div>

              <div className="flex flex-col gap-2 justify-center items-center">
                <h1 className="text-[25px] font-bold text-[#2E318D]">
                  Hilary Oise
                </h1>
                <p>Lecturer, Oxford University</p>
                <div className="flex gap-2">
                  <IoIosStar className="text-[#E4B308] text-2xl" />
                  <IoIosStar className="text-[#E4B308] text-2xl" />
                  <IoIosStar className="text-[#E4B308] text-2xl" />
                  <IoIosStar className="text-[#E4B308] text-2xl" />
                  <IoIosStar className="text-[#E4B308] text-2xl" />
                </div>
              </div>
              <p className="mt-6 text-lg text-gray-600  text-center">
                “At Scholaracad, we're reshaping the learning experience by
                seamlessly blending expertise with innovation. What sets us
                apart is our commitment to more than just plugging knowledge
                gaps – we're dedicated to unlocking your.”
              </p>
            </div>
          </div>
       
        </section> */}

        <Testimonials />
      </main>
    </>
  );
}
