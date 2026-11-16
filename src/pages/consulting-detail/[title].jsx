import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import FAQ from "@/Components/faq";
import React, { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaTag, FaUser } from "react-icons/fa";
import { RiGraduationCapFill } from "react-icons/ri";
import "react-datepicker/dist/react-datepicker.css";
import { IoCheckmark } from "react-icons/io5";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";
import { LiaQuoteLeftSolid } from "react-icons/lia";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL, APIENDPOINTS } from "../../../apiconfig";
import { getBlogImageUrl } from "@/utils/imageHelper";
import Link from "next/link";
import Consultingform from "@/Components/consultingform";
import { CgSmileSad } from "react-icons/cg";
import { useRouter } from "next/router";
import Loader from "@/Components/loader";

function ConsultingDetails() {
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);

  const [Title, setTitle] = useState("");
  const [consultingdetail, setconsultingdetail] = useState("");
  console.log("consultingdetail", consultingdetail);
  useEffect(() => {
    if (!router.isReady) return;
    const { title } = router.query;
    setTitle(title);
  }, [router.asPath]);

  useEffect(() => {
    if (!Title || !token) return;
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}${APIENDPOINTS.CONSULTING_DETAILS}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON?.stringify({ slug: Title }),
          }
        );
        if (!res.ok) {
          console?.log("HTTP error! Status:", res?.status);
          setconsultingdetail(null);
          return;
        }
        const data = await res?.json();
        setconsultingdetail(data?.data || null);
      } catch (error) {
        console?.error("Error fetching blog:", error);
        setconsultingdetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [Title, token]);

  const [Recentblogs, setRecentBlogs] = useState([]);
  // console.log("Recentblogs", Recentblogs);
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
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <Navbar />
      {/* style={{
            backgroundImage: `url(${API_BASE_URL}/master/secure-documents?v=2&path=${consultingdetail?.pages_img} ||
              "/assets/landingpage/consulting_herosection_bg.svg"
            })`,
          }} */}
      <section className="font-nunito bg-white ">
        <div className="consulting_bg flex justify-center items-center max-sm:p-3">
          <section className="md:max-w-7xl mx-auto w-full z-10">
            <div className="text-left">
              <h1 className="heading_blue">
                {consultingdetail?.banner_Heading || "NA"}
              </h1>
              <p className="para my-4 md:max-w-[50%] w-full">
                {consultingdetail?.banner_content || "NA"}
              </p>
            </div>
          </section>
        </div>
        <section className="max-w-7xl py-7  mx-auto max-sm:p-3">
          <div className="grid grid-cols-1 md:grid-cols-2  justify-center items-center ">
            <div className="">
              <h1 className="heading">
                {consultingdetail?.section_one_Heading || "NA"}
              </h1>
              <p className="para my-4">
                {consultingdetail?.section_one_content || "NA"}
              </p>
            </div>
            <div>
              <img
                src="/assets/landingpage/consulting_secondsection_rightimage.svg"
                alt=""
              />
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto  max-sm:p-3">
          <div className="flex flex-col justify-center items-center py-10">
            <h1 className="heading">How We Work</h1>
            <p className="para">Our Method for IT Service Management</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative w-full  md:aspect-[16/7] rounded-md  md:overflow-hidden max-sm:border max-sm:border-gray-200  max-sm:p-2">
              <div
                className="absolute inset-0 bg-center bg-contain bg-no-repeat max-sm:hidden"
                style={{
                  backgroundImage:
                    "url('/assets/landingpage/how_wework-red2bg.svg')",
                }}
              ></div>
              {consultingdetail?.consulting?.[0] && (
                <div className="relative h-full flex flex-col items-left justify-center text-left md:py-[100px] md:px-[80px] ">
                  <div className="p-4 mt-7">
                    <h4 className="text-md font-semibold text-gray-900">
                      {consultingdetail?.consulting[0]?.title}
                    </h4>
                    <p className="text-gray-700 mt-2">
                      {consultingdetail?.consulting[0]?.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="relative w-full  md:aspect-[16/7] rounded-md  md:overflow-hidden max-sm:border max-sm:border-gray-200  max-sm:p-2">
              <div
                className="absolute inset-0 bg-center bg-contain bg-no-repeat max-sm:hidden"
                style={{
                  backgroundImage:
                    "url('/assets/landingpage/how_wework-orangebg.svg')",
                }}
              ></div>
              {consultingdetail?.consulting?.[1] && (
                <div className="relative h-full flex flex-col items-left justify-center text-left md:py-[100px] md:px-[80px] ">
                  <div className="p-4 mt-7">
                    <h4 className="text-md font-semibold text-gray-900">
                      {consultingdetail.consulting[1].title}
                    </h4>
                    <p className="text-gray-700 mt-2">
                      {consultingdetail.consulting[1].content}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="relative w-full  md:aspect-[16/7] rounded-md  md:overflow-hidden max-sm:border max-sm:border-gray-200  max-sm:p-2">
              <div
                className="absolute inset-0 bg-center bg-contain bg-no-repeat max-sm:hidden"
                style={{
                  backgroundImage:
                    "url('/assets/landingpage/how_wework-violatebg.svg')",
                }}
              ></div>
              {consultingdetail?.consulting?.[2] && (
                <div className="relative h-full flex flex-col items-left justify-center text-left md:py-[100px] md:px-[80px] ">
                  <div className="p-4 mt-7">
                    <h4 className="text-md font-semibold text-gray-900">
                      {consultingdetail.consulting[2].title}
                    </h4>
                    <p className="text-gray-700 mt-2">
                      {consultingdetail.consulting[2].content}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="relative w-full  md:aspect-[16/7] rounded-md  md:overflow-hidden max-sm:border max-sm:border-gray-200  max-sm:p-2">
              <div
                className="absolute inset-0 bg-center bg-contain bg-no-repeat max-sm:hidden"
                style={{
                  backgroundImage:
                    "url('/assets/landingpage/how_wework-bluebg.svg')",
                }}
              ></div>
              {consultingdetail?.consulting?.[3] && (
                <div className="relative h-full flex flex-col items-left justify-center text-left md:py-[100px] md:px-[80px] ">
                  <div className="p-4 mt-7">
                    <h4 className="text-md font-semibold text-gray-900">
                      {consultingdetail.consulting[3].title}
                    </h4>
                    <p className="text-gray-700 mt-2">
                      {consultingdetail.consulting[3].content}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="relative w-full  md:aspect-[16/7] rounded-md  md:overflow-hidden max-sm:border max-sm:border-gray-200  max-sm:p-2">
              <div
                className="absolute inset-0 bg-center bg-contain bg-no-repeat max-sm:hidden"
                style={{
                  backgroundImage:
                    "url('/assets/landingpage/how_wework-greenbg.svg')",
                }}
              ></div>
              {consultingdetail?.consulting?.[4] && (
                <div className="relative h-full flex flex-col items-left justify-center text-left md:py-[100px] md:px-[80px] ">
                  <div className="p-4 mt-7">
                    <h4 className="text-md font-semibold text-gray-900">
                      {consultingdetail.consulting[4].title}
                    </h4>
                    <p className="text-gray-700 mt-2">
                      {consultingdetail.consulting[4].content}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="relative w-full  md:aspect-[16/7] rounded-md  md:overflow-hidden max-sm:border max-sm:border-gray-200  max-sm:p-2">
              <div
                className="absolute inset-0 bg-center bg-contain bg-no-repeat max-sm:hidden"
                style={{
                  backgroundImage:
                    "url('/assets/landingpage/how_wework-orangebg.svg')",
                }}
              ></div>
              {consultingdetail?.consulting?.[5] && (
                <div className="relative h-full flex flex-col items-left justify-center text-left md:py-[100px] md:px-[80px] ">
                  <div className="p-4 mt-7">
                    <h4 className="text-md font-semibold text-gray-900">
                      {consultingdetail.consulting[5].title}
                    </h4>
                    <p className="text-gray-700 mt-2">
                      {consultingdetail.consulting[5].content}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="relative w-full  md:aspect-[16/7] rounded-md  md:overflow-hidden max-sm:border max-sm:border-gray-200  max-sm:p-2">
              <div
                className="absolute inset-0 bg-center bg-contain bg-no-repeat max-sm:hidden"
                style={{
                  backgroundImage:
                    "url('/assets/landingpage/how_wework-redbg.svg')",
                }}
              ></div>
              {consultingdetail?.consulting?.[6] && (
                <div className="relative h-full flex flex-col items-left justify-center text-left md:py-[100px] md:px-[80px] ">
                  <div className="p-4 mt-7">
                    <h4 className="text-md font-semibold text-gray-900">
                      {consultingdetail.consulting[6].title}
                    </h4>
                    <p className="text-gray-700 mt-2">
                      {consultingdetail.consulting[6].content}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* <div className="relative w-full  md:aspect-[16/7] rounded-md  md:overflow-hidden max-sm:border max-sm:border-gray-200  max-sm:p-2">
              <div
                className="absolute inset-0 bg-center bg-contain bg-no-repeat max-sm:hidden"
                style={{
                  backgroundImage:
                    "url('/assets/landingpage/how_wework-bluebg.svg')",
                }}
              ></div>
              {consultingdetail?.consulting?.[7] && (
                <div className="relative h-full flex flex-col items-left justify-center text-left md:py-[100px] md:px-[80px] ">
                  <div className="p-4 mt-7">
                    <h4 className="text-md font-semibold text-gray-900">
                      {consultingdetail.consulting[7].title}
                    </h4>
                    <p className="text-gray-700 mt-2">
                      {consultingdetail.consulting[7].content}
                    </p>
                  </div>
                </div>
              )}
            </div> */}
          </div>
        </section>

        <section className="bg-[#f7f3ff] my-10">
          <div className=" max-w-7xl mx-auto max-sm:p-3 py-12">
            <div className=" ">
              <div className="">
                <div className="md:max-w-[50%] w-full mx-auto text-center ">
                  {/* <RiGraduationCapFill className="text-[#29A6DD] text-4xl rotate-350 " /> */}
                  <h1 className="font-bold text-xl text-[#2E318D]">
                    Why Choose Us?
                  </h1>
                  <h1 className=" heading">
                    {consultingdetail?.chooseus_Heading || "NA"}
                  </h1>
                </div>
                <div
                  className="summernote-content prose max-w-none mt-2 "
                  dangerouslySetInnerHTML={{
                    __html:
                      consultingdetail?.choose_us_content ||
                      "No Details Available",
                  }}
                ></div>
              </div>
              <div>
                {/* <img
                src="/assets/landingpage/why_choose_us_rightimg.svg"
                alt="Logo 1"
                className=" object-contain"
              /> */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                  {Object?.values(consultingdetail?.pointer || {})?.map(
                    (adv, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[20px_1fr] gap-2 items-start"
                      >
                        <IoCheckmark className="mt-0.5" />
                        <p className=" text-gray-600">{adv}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
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

        <section className="max-w-7xl mx-auto max-sm:p-3 py-7">
          <div className="  ">
            <div className="flex justify-center items-center flex-col ">
              <div>
                {/* <RiGraduationCapFill className="text-[#29A6DD] text-4xl rotate-350 ml-[-15px] mb-[-5px] " /> */}
                <h1 className="font-bold text-xl text-[#2E318D] ">Resources</h1>
              </div>
              <h1 className="md:max-w-[70%] heading text-center">
                Learning Hub: Trend, Tips & Thought Leadership
              </h1>
            </div>
            <div className="grid grid-cols-1  md:grid-cols-4 gap-6 flex-1 my-10">
              {Recentblogs && Recentblogs.length > 0 ? (
                Recentblogs.slice(0, 4).map((blog) => (
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
                          className="text-[#2E318D] hover:bg-[#2E318D] hover:text-white cursor-pointer font-medium border rounded-full py-1.5 px-5"
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
                    <h1 className="text-gray-500 text-lg font-semibold">
                      No blogs found
                    </h1>
                    <p className="text-gray-400 text-sm text-center max-w-xs">
                      We couldn’t find any blogs. Please check back later.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="max-w-7xl mx-auto  max-sm:p-3 py-7">
          <div className=" ">
            <h1 className="heading text-center">FAQs</h1>
            <div
              className="summernote-content prose max-w-none  "
              dangerouslySetInnerHTML={{
                __html:
                  consultingdetail?.faqs_contect || "No Details Available",
              }}
            ></div>
          </div>
        </section>
        {/* FAQ Section */}
        {/* <FAQ /> */}
        <section className="rank_of_industry-bg  text-[#2E318D] max-sm:p-3 ">
          <div className="md:max-w-7xl mx-auto md:py-[100px] ">
            <div className="grid grid-cols-1 md:grid-cols-2 my-3 md:gap-10">
              <div className="">
                <div className="">
                  <h1 className=" heading_blue">
                    Join the Ranks of Industry Leaders & Innovators
                  </h1>

                  <p className=" text-lg text-gray-500 max-w-lg mt-5">
                    Rated by learners
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <FaStar className="text-[#E4B308]" />
                    <h1 className="font-bold text-xl">4.8/5</h1>
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

              <div className="bg-[#BC96FFB2]  md:p-10 p-4 max-sm:mt-4">
                <h1 className=" m-auto uppercase text-[20px] md:text-[30px]  font-extrabold leading-tight text-center">
                  Schedule a consultation
                </h1>
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

export default ConsultingDetails;

export async function getServerSideProps({ req, params }) {
  const token = req.cookies?.access_token || null;
  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const urlTitle = params?.title || "Default Title";
  // console.log("urlTitle", urlTitle);
  const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.CONSULTING_DETAILS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      meta_title: urlTitle,
    }),
  });
  const json = await res.json();
  // console.log("json",json.data);.
  return {
    props: {
      title: json?.data?.meta_title || null,
      description: json?.data?.meta_description || null,
      // keywords: json?.data?.dynamicCourseHeading?.meta_keywords || null,
      // consultingData: json?.data || null,
    },
  };
}
