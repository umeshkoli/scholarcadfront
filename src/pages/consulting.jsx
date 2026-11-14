import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import FAQ from "@/Components/faq";
import React, { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaTag, FaUser } from "react-icons/fa";
import { RiGraduationCapFill } from "react-icons/ri";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCheckmark } from "react-icons/io5";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";
import { LiaQuoteLeftSolid } from "react-icons/lia";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL, APIENDPOINTS } from "../../apiconfig";
import { getBlogImageUrl, getLiveDocumentUrl } from "@/utils/imageHelper";
import Link from "next/link";
import Head from "next/head";
import Consultingform from "@/Components/consultingform";
import { CgSmileSad } from "react-icons/cg";

function Consulting() {
  const { token } = useAuth();
  const slugify = (text) => {
    return text
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  const [Recentblogs, setRecentBlogs] = useState([]);
  useEffect(() => {
    if (!token) return;
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
          console.log("HTTP error! Status:", res?.status);
          setRecentBlogs([]);
          return;
        }
        const data = await res.json();
        setRecentBlogs(data?.data || []);
      } catch (err) {
        console.error("Error Recent Blogs :", err);
      }
    };
    RecentBlogs();
  }, [token]);

  const [Consultinglist, SetConsultinglist] = useState([]);
  console.log("Consultinglist----->", Consultinglist);
  useEffect(() => {
    if (!token) return;
    const Consultinglist = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}${APIENDPOINTS.CONSULTING_LIST}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          console.log("HTTP error! Status:", res?.status);
          SetConsultinglist([]);
          return;
        }
        const data = await res.json();

        SetConsultinglist(data?.data || []);
      } catch (err) {
        console.error("Error Recent Blogs :", err);
      }
    };
    Consultinglist();
  }, [token]);

  return (
    <>
      <Navbar />
      <section className="font-nunito bg-white ">
        <div className="consultent_first_section_bg ">
          <section className=" max-w-7xl mx-auto  md:py-[90px] py-5  z-10 ">
            <div className="text-center">
              <h1 className="max-w-[80%] m-auto heading_blue">
                Consulting Services for Business Development
              </h1>
            </div>
          </section>
        </div>
        <section className="max-sm:p-3">
          <div className="max-w-7xl mx-auto py-5 ">
            <div className=" grid gap-5">
              {/* {Array?.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition flex flex-col sm:flex-row"
                >
                  
                  <div className="sm:w-[30%] w-full h-48 sm:h-auto">
                    <img
                      src="/assets/landingpage/blog1_image.png"
                      alt="Blog 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                 
                  <div className="sm:w-[70%] w-full p-5 flex flex-col justify-between">
                    <div>
                      <h2 className="font-semibold text-gray-800 text-lg leading-snug mb-2">
                        Agile Consultation
                      </h2>
                      <p className="text-gray-600 text-sm mb-3">
                        At Spoclearn, our Agile Consulting empowers
                        organizations to shift from rigid structures to fluid
                        innovation. We guide your teams in mastering Agile
                        practices that drive clarity, speed, and meaningful
                        results.
                      </p>
                      <h2 className="font-semibold text-gray-800 text-md leading-snug mb-2">
                        Advantages
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="text-gray-600 text-sm mb-3">
                          <div className="flex gap-2 items-center">
                            <IoCheckmark />
                            <p>Accelerated innovation cycles</p>
                          </div>
                        </div>
                        <div className="text-gray-600 text-sm mb-3">
                          <div className="flex gap-2 items-center">
                            <IoCheckmark />
                            <p>Accelerated innovation cycles</p>
                          </div>
                        </div>
                        <div className="text-gray-600 text-sm mb-3">
                          <div className="flex gap-2 items-center">
                            <IoCheckmark />
                            <p>Accelerated innovation cycles</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                      <Link
                        href="/view-consulting"
                        type="button"
                        className="text-[#2E318D] cursor-pointer hover:bg-[#2E318D] hover:text-white font-medium border border-[#2E318D] rounded-full py-1.5 px-5 transition"
                      >
                        View Agile Consultation →
                      </Link>
                    </div>
                  </div>
                </div>
              ))} */}

              {Consultinglist && Consultinglist?.length > 0 ? (
                Consultinglist?.map((item, i) => (
                  <div
                    key={item.id || i}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition flex flex-col sm:flex-row"
                  >
                    {/* Image */}
                    <div className="sm:w-[30%] w-full h-48 sm:h-auto">
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        {item?.pages_img ? (
                          <img
                            src={getLiveDocumentUrl(item?.pages_img)}
                            alt={item?.banner_Heading || "image"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 mb-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5h18M3 5v14h18V5M9 13l2 2 4-4"
                              />
                            </svg>
                            <span className="text-sm">No Image</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="sm:w-[70%] w-full p-5 flex flex-col justify-between">
                      <div>
                        <h2 className="font-semibold text-gray-800 text-lg mb-2">
                          {item?.banner_Heading || "NA"}
                        </h2>

                        <p className="text-gray-600 text-sm mb-3">
                          {item?.banner_content || "NA"}
                        </p>
                      </div>
                      <h2 className="font-semibold text-gray-800 text-md leading-snug mb-2">
                        Advantages
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object?.values(item?.advantages || {})?.map(
                          (adv, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-[20px_1fr] gap-2 items-start"
                            >
                              <IoCheckmark className="mt-0.5" />
                              <p className="text-sm text-gray-600">{adv}</p>
                            </div>
                          )
                        )}
                      </div>

                      <div className="flex item-start mt-3">
                        <Link
                          href={{
                            pathname: `/consulting-detail/${item?.slug}`,
                          }}
                          className="text-[#882CFB] border border-[#882CFB] rounded-full py-1.5 px-5 hover:bg-[#882CFB] hover:text-white transition text-sm"
                        >
                          View {item?.meta_title} →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-10">
                  No data available
                </p>
              )}
            </div>
          </div>
        </section>
        <section className=" bg-[#F7F3FF] max-sm:p-3">
          <div className=" max-w-7xl mx-auto py-5 ">
            <div className="">
              <div className="md:max-w-[50%] m-auto max-sm:w-full text-center  mt-2">
                {/* <RiGraduationCapFill className="text-[#29A6DD] text-4xl rotate-350 " /> */}
                <p className="font-bold text-xl text-[#2E318D]">
                  Why Choose Us?
                </p>
                <h2 className=" heading">
                  ScholarAcad for Consultation Services?
                </h2>
              </div>
              <p className="my-3 para ">
                ScholarAcad provides all-inclusive consulting services that
                support businesses in enhancing operations, controlling risk,
                increasing agility, and fostering long-term success. In order to
                guarantee quantifiable and long-term business outcomes across
                industries, our consulting methodology combines domain
                experience, strategic insight, and practical implementation.
              </p>
            </div>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <div>
                    <h4 className="font-semibold text-md text-gray-600">
                      Skilled Consultants
                    </h4>
                    <p className="para">
                      Business strategy, IT services, cybersecurity, Agile
                      transformation, digital operations, and organizational
                      change management are just a few of the many areas in
                      which our experts have vast experience.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <div>
                    <h4 className="font-semibold text-md text-gray-600">
                      Customized & Goal-Oriented Solutions
                    </h4>
                    <p className="para">
                      In order to ensure relevance, scalability, and long-term
                      value, we create specialized consulting solutions that are
                      in line with your company's goals, obstacles, and market
                      conditions.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <div>
                    <h4 className="font-semibold text-md text-gray-600">
                      Creative and Flexible Methodology
                    </h4>
                    <p className="para">
                      ScholarAcad helps businesses stay competitive in quickly
                      changing business and digital environments by utilizing
                      cutting-edge techniques, cutting-edge technologies, and
                      industry best practices.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <div>
                    <h4 className="font-semibold text-md text-gray-600">
                      Verified Outcomes in Various Industries
                    </h4>
                    <p className="para">
                      We assist enterprises in achieving better performance,
                      increased resilience, streamlined operations, and
                      quantifiable business impact. We have a solid track record
                      of successful engagements.
                    </p>
                  </div>
                </div>
              </div>
              {/* <img
                src="/assets/landingpage/why_choose_us_rightimg.svg"
                alt="Logo 1"
                className=" object-contain"
              /> */}
            </div>
          </div>
        </section>
        {/* <section className="max-w-7xl mx-auto py-5   my-10 flex flex-col md:flex-row items-start gap-10 max-sm:p-3">
          <div className="md:w-1/3 w-full flex flex-col justify-center">
            <LiaQuoteLeftSolid className="md:text-7xl text-2xl text-[#2E318D] mb-4" />
            <h2 className="text-5xl md:text-4xl font-bold text-gray-800 leading-tight">
              Meet The <br /> Instructor
            </h2>
            <div className="flex items-center mt-6 gap-3">
              <button
                title="Previous"
                onClick={prevSlide}
                className="p-2 border rounded-full hover:bg-gray-100 transition cursor-pointer"
              >
                <FaArrowLeft />
              </button>
              <div className="w-24 h-[3px] bg-gray-300 rounded overflow-hidden">
                <div
                  className="h-[3px] bg-[#2E318D] rounded transition-all duration-300"
                  style={{
                    width: `${
                      ((index + cardsPerView) / instructors.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <button
                title="Next"
                onClick={nextSlide}
                className="p-2 border rounded-full hover:bg-gray-100 transition cursor-pointer"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
          <div className="md:w-2/3 w-full overflow-hidden ">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${
                  (index / instructors.length) *
                  100 *
                  (instructors.length / cardsPerView)
                }%)`,
              }}
            >
              {instructors.map((inst, i) => (
                <div key={i} className="w-full md:w-1/2 flex-shrink-0 md:px-3">
                  <div className="bg-[#F8F4FF] border border-[#E4D8FB] rounded-lg p-5 relative">
                    <div className="absolute left-4 -bottom-3 w-6 h-6 bg-[#F8F4FF] border-b border-r border-[#E4D8FB] rotate-45"></div>
                    <p className="text-[#747474] text-[15px] leading-relaxed text-wrap">
                      Familiarize yourself with the MSP® Practitioner exam
                      structure, content outline, and topics covered by
                      PeopleCert. Familiarize yourself with the MSP®
                      Practitioner exam structure, content outline.
                    </p>
                    <div className="flex gap-1 text-[#2E318D] mt-3">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <FaStar key={i} />
                        ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-6 ml-2">
                    <img
                      src="/assets/kareena.jpg"
                      alt="Kareena"
                      className="w-12 h-12 rounded-full object-cover bg-gray-200"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">Kareena</h4>
                      <p className="text-sm text-gray-500">
                        Experience : <br /> 12 Years
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        <section className="max-sm:p-3">
          <div className="max-w-7xl mx-auto py-5 ">
            <div className="flex justify-center items-center flex-col ">
              <div>
                {/* <RiGraduationCapFill className="text-[#29A6DD] text-4xl rotate-350 ml-[-15px] mb-[-5px] " /> */}
                <p className="font-bold text-xl text-[#2E318D] ">Resources</p>
              </div>
              <h2 className="md:max-w-[70%] heading text-center">
                Learning Hub: Trend, Tips & Thought Leadership
              </h2>
            </div>
            <div className="grid grid-cols-1  md:grid-cols-4 gap-6 flex-1 my-5">
              {Recentblogs && Recentblogs?.length > 0 ? (
                Recentblogs?.slice(0, 4)?.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={getBlogImageUrl(blog?.header_image)}
                      alt={blog?.resource_title || "NA"}
                      className="h-40  w-full object-cover border-b border-gray-100"
                    />

                    <div className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <FaUser className="text-[#2E318D]" />{" "}
                        {blog?.resource_auther || "Scholaracad"}
                      </div>

                      <h2
                        title={blog?.resource_title}
                        className="font-semibold text-gray-800 mb-2 leading-snug"
                      >
                        {/* {blog?.resource_title?.slice(0, 50) || "Na"} */}
                        {blog?.resource_title?.length > 50
                          ? blog.resource_title.slice(0, 50) + "..."
                          : blog?.resource_title}
                      </h2>
                      <span className="para">
                        {blog?.short_description?.slice(0, 100) || "Na"}
                      </span>
                      <hr className="my-2 text-gray-300" />
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-[#2E318D]" />
                          {blog?.created_at
                            ? new Date(blog.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                }
                              )
                            : "NA"}
                        </div>
                        <Link
                          title="Read More"
                          href={{
                            pathname: `/article/${slugify(blog.resource_title)}`,
                          }}
                          className="text-[#882CFB] hover:bg-[#882CFB] hover:text-white cursor-pointer font-medium border rounded-full py-1.5 px-5"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
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
        {/* FAQ Section */}
        {/* <FAQ /> */}
        <section className="rank_of_industry-bg  text-[#2E318D] max-sm:p-3 ">
          <div className="md:max-w-7xl mx-auto md:py-[100px] ">
            <div className="grid grid-cols-1 md:grid-cols-2 my-3 md:gap-10">
              <div className="">
                <div className="">
                  <h2 className="heading">
                    Join the Ranks of Industry Leaders & Innovators
                  </h2>
                  <p className=" text-lg text-gray-500 max-w-lg mt-2">
                    Rated by learners
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <FaStar className="text-[#E4B308]" />
                    <p className="font-bold text-xl">4.8/5</p>
                    <p className="text-lg text-gray-500  pl-3">
                      12,500+ Reviews
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-7">
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
                  ]?.map((src, idx) => (
                    <div
                      key={idx}
                      className="bg-white flex items-center justify-center p-2 border border-[#C1C2F9] hover:shadow-md rounded"
                    >
                      <div className="h-[80px] w-[80px] flex items-center justify-center">
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

              <div className="bg-[#BC96FFB2] rounded-md  p-5 max-sm:mt-4">
                <h2 className=" m-auto  text-[20px] md:text-[30px]  font-extrabold leading-tight text-center">
                  Schedule Consultation
                </h2>
                <p className=" text-lg text-[#2E318D] text-center m-auto max-w-lg my-2">
                  Your roof is one of the most crucial parts of your home.
                </p>
                <div>
                  <Consultingform />
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
      <Footer />
    </>
  );
}

export default Consulting;

export async function getStaticProps() {
  return {
    props: {
      title: "Scholaracad",
      description:
        "Explore ScholarAcad’s consultation services designed to help organizations improve operations, manage risk, enhance agility, and drive sustainable growth through expert-led, customized consulting solutions across industries.",
      keywords:
        "Consultation Services, Business Consulting Services , IT Consulting Services , Cybersecurity Consulting , Agile Consulting Services , Digital Transformation Consulting , Enterprise Consulting Solutions",
    },
  };
}
