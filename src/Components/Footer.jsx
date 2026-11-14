import React, { useEffect, useMemo, useState } from "react";
import { MdCall, MdChatBubble, MdEmail, MdLocationOn } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io5";
import { FaExpeditedssl } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL, APIENDPOINTS } from "../../apiconfig";
import { encryptId } from "@/utils/encryption";

function Footer() {
  const { token } = useAuth();
  const { countryLists } = useAuth();

  const [pagelists, setPagelists] = useState(null);
  const [contactdetail, setContactdetail] = useState(null);
  // console.log("contactdetail",contactdetail);
  const slugify = (text) => {
    return text
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  const { categories } = useAuth();
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

  useEffect(() => {
    try {
      const savedPages = sessionStorage.getItem("footer_all_pages");
      if (savedPages) {
        setPagelists(JSON.parse(savedPages));
        return;
      }
    } catch (e) {}

    if (!token) return;
    const timer = setTimeout(() => {
      const FetchPages = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.ALL_PAGES}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) {
            setPagelists([]);
            return;
          }
          const data = await res.json();
          const list = data?.data || [];
          setPagelists(list);
          try {
            sessionStorage.setItem("footer_all_pages", JSON.stringify(list));
          } catch (e) {}
        } catch (err) {}
      };
      FetchPages();
    }, 200);
    return () => clearTimeout(timer);
  }, [token]);

  // FetchContactDetails Api
  useEffect(() => {
    try {
      const savedContact = sessionStorage.getItem("footer_contact_details");
      if (savedContact) {
        setContactdetail(JSON.parse(savedContact));
        return;
      }
    } catch (e) {}

    if (!token) return;
    const timer = setTimeout(() => {
      const FetchContactDetails = async () => {
        try {
          const res = await fetch(
            `${API_BASE_URL}${APIENDPOINTS.CONTACT_DETAILS}`,
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
            setContactdetail([]);
            return;
          }
          const data = await res.json();
          const list = data?.data || [];
          setContactdetail(list);
          try {
            sessionStorage.setItem("footer_contact_details", JSON.stringify(list));
          } catch (e) {}
        } catch (err) {
          console.error("Error fetching FetchContactDetails:", err);
        }
      };
      FetchContactDetails();
    }, 250);
    return () => clearTimeout(timer);
  }, [token]);

  const [footerContent, setfooterContent] = useState(null);
  useEffect(() => {
    try {
      const savedFooter = sessionStorage.getItem("footer_disclaimer_content");
      if (savedFooter !== null) {
        setfooterContent(JSON.parse(savedFooter));
        return;
      }
    } catch (e) {}

    if (!token) return;
    const timer = setTimeout(() => {
      const FetchFootercontent = async () => {
        try {
          const res = await fetch(
            `${API_BASE_URL}${APIENDPOINTS.API_FOOTER_CONTENT}`,
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
            setfooterContent([]);
            try {
              sessionStorage.setItem("footer_disclaimer_content", "[]");
            } catch (e) {}
            return;
          }
          const data = await res.json();
          const list = data?.data || [];
          setfooterContent(list);
          try {
            sessionStorage.setItem("footer_disclaimer_content", JSON.stringify(list));
          } catch (e) {}
        } catch (err) {
          console.error("Error fetching FetchFootercontent:", err);
        }
      };
      FetchFootercontent();
    }, 300);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <>
      <footer className="bg-white text-black py-5 max-sm:p-3">
        <div className="max-w-7xl mx-auto  ">
          <div>
            <h3 className="font-bold text-lg ">Top Catagories</h3>
            {/* <div className="mt-2 flex flex-wrap">
              {categories?.map((item, index) => (
                <Link
                  href={{
                    pathname: `/category-courses/${item?.page_link}`,
                    // query: { id: encryptId(item?.id) },
                  }}
                  key={item?.id}
                  className={`hover:text-[#2E318D] cursor-pointer transition text-[#696969] pr-3 ${
                    index !== categories.length - 1
                      ? "border-r border-[#696969] pr-3"
                      : "pl-3"
                  } pl-3`}
                >
                  {item?.category_name}
                </Link>
              ))}
            </div> */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2 text-[15px]">
              {categories?.map((item) => (
                <Link
                  target="_blank"
                  key={item?.id}
                  href={{
                    pathname: `/category-courses/${item?.page_link}`,
                  }}
                  className="text-[#696969] hover:text-[#882CFB]  hover:underline transition-colors duration-200 md:truncate"
                  title={item?.category_name}
                >
                  {item?.category_name}
                </Link>
              ))}
            </div>
          </div>

          <div className="py-5">
            <h3 className="font-bold text-lg ">Top Courses</h3>
            {/* <div className="mt-2 flex flex-wrap">
              {categories?.flatMap((category) =>
                category?.cources?.map((course) => (
                  <Link
                    key={course?.id}
                    href={{
                      pathname: `/${active_country}/${slugify(
                        course?.url_title
                      )}`,
                    }}
                    className="hover:text-[#2E318D] cursor-pointer transition text-[#696969] px-3 border-r border-[#696969]"
                  >
                    {course?.course_short_name}
                  </Link>
                ))
              )}
            </div> */}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2 text-[15px]">
              {categories?.flatMap((category) =>
                category?.cources?.map((course) => (
                  <Link
                    target="_blank"
                    key={course?.id}
                    href={{
                      pathname: `/${slugify(
                        course?.url_title,
                      )}`,
                    }}
                    className="text-[#696969] hover:text-[#882CFB]  hover:underline transition-colors duration-200 md:truncate"
                    title={course?.course_short_name}
                  >
                    {course?.course_short_name}
                  </Link>
                )),
              )}
            </div>
          </div>
        </div>
      </footer>
      <footer className=" bg-gray-50 max-sm:p-3">
        <br />
        <div className="max-w-7xl mx-auto  grid sm:grid-cols-2 md:grid-cols-5 gap-8  ">
          <div className="">
            <h3 className="font-bold text-lg ">Contact Information</h3>
            <div className="mt-2 flex flex-col gap-3 text-[15px]">
              <div className="flex gap-2 items-center">
                <span>
                  <MdCall />
                </span>
                <a
                  title="Call"
                  href={`tel:${contactdetail?.phone}`}
                  className="text-[#696969]"
                >
                  +91 {contactdetail?.phone}
                </a>
              </div>
              <div className="flex gap-2 items-center">
                <span>
                  <MdEmail />
                </span>
                <a
                  title="Email"
                  href={`mailto:${contactdetail?.email}`}
                  className="text-[#696969]"
                >
                  {contactdetail?.email}
                </a>
              </div>
              <div className="flex gap-2 items-start">
                <span>
                  <MdLocationOn className="mt-1" />
                </span>
                <span className="text-[#696969]">{contactdetail?.address}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Secure Payments</h4>
            <div className="flex  gap-2  my-4">
              <img
                src="/assets/landingpage/payments-logo.png"
                className="rounded-md "
                alt="Payments Logo"
              />
            </div>
            <h4 className="font-semibold flex gap-2 items-center">
              <FaExpeditedssl className="text-yellow-600" />
              SSL Protection
            </h4>

            {/* <select
              className="text-sm px-2 py-2 w-full mt-2 rounded-[4px] border border-gray-200
                focus:outline-none focus:ring-0 focus:border-gray-200
                active:outline-none active:ring-0 active:border-gray-200"
            >
              {countryLists?.map((country, idx) => (
                <option key={idx} value={country?.name}>
                  {country?.name}
                </option>
              ))}
            </select> */}
          </div>
          <div>
            <h4 className="font-semibold flex gap-1 items-center">
              <img
                src="/assets/landingpage/Flag_of_India.png"
                className=" w-[10%]"
                alt="India Logo"
              />
              India
            </h4>
            <ul className="mt-2 text-[15px]">
              <li>
                <a
                  title="Call"
                  href={`tel:${contactdetail?.phone}`}
                  className=""
                >
                  +91 {contactdetail?.phone}
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="font-semibold flex gap-1 items-center">
                <img
                  src="/assets/landingpage/Flag_of_US.png"
                  className=" w-[10%]"
                  alt="US Logo"
                />
                United Kingdom
              </h4>
              <ul className=" mt-2 text-[15px]">
                <li>
                  <a href="#" className="">
                    +44 -744-1428-302
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Company</h4>
            <ul className="flex flex-col gap-2 text-[15px] mt-1">
              <Link
                href="/about"
                className="text-[#696969] hover:text-[#2E318D] hover:underline"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-[#696969] hover:text-[#2E318D] hover:underline"
              >
                Contact Us
              </Link>

              <Link
                href="/join-as-a-trainer"
                className="text-[#696969] hover:text-[#2E318D] hover:underline"
              >
                Careers
              </Link>
            </ul>
            <ul className="mt-2 space-y-2 text-[15px]">
              {pagelists?.map(
                (page, index) =>
                  index >= 0 &&
                  index <= 5 && (
                    <li key={page?.slug}>
                      <Link
                        target="_blank"
                        href={{ pathname: `/${page?.slug}` }}
                        className="text-[#696969] hover:text-[#2E318D] hover:underline"
                      >
                        {page?.title || "NA"}
                      </Link>
                    </li>
                  ),
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg">Explore</h4>
            <ul className="mt-1 space-y-2 text-[15px]">
              <li>
                <Link
                  target="_blank"
                  title="All Courses"
                  href="/all-courses"
                  className="text-[#696969] hover:text-[#2E318D] hover:underline"
                >
                  All Courses
                </Link>
              </li>
              <li>
                <Link
                  target="_blank"
                  title="Blog"
                  href={{
                    pathname: `/resource/blog`,
                  }}
                  className="text-[#696969] hover:text-[#2E318D] hover:underline"
                >
                  Blog
                </Link>
              </li>

              {/* <li>
                <Link
                  title="FAQs"
                  href="/faqs"
                  className="text-[#696969] hover:text-[#2E318D] hover:underline"
                >
                  FAQs
                </Link>
              </li> */}
              <li>
                <Link
                  target="_blank"
                  title="All Testimonials"
                  href="/all-testimonials"
                  className="text-[#696969] hover:text-[#2E318D] hover:underline"
                >
                  All Testimonials
                </Link>
              </li>
              {/* <li>
                <Link
                  title="Reviews & Testimonials"
                  href="/reviews-testimonials"
                  className="text-[#696969] hover:text-[#2E318D] hover:underline"
                >
                  Reviews & Testimonials
                </Link>
              </li> */}
              <li>
                <Link
                  target="_blank"
                  title="Site Map"
                  href="/site-map"
                  className="text-[#696969] hover:text-[#2E318D] hover:underline"
                >
                  Site Map
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto   px-3">
          <div className="flex flex-col md:flex-row justify-between items-center ">
            <div className="text-sm text-gray-500 max-sm:my-3 max-sm:flex max-sm:justify-center max-sm:items-center">
              <img
                src="/assets/landingpage/scholaracad_icon_footer.svg"
                alt="Scholoracad Logo"
                className="object-contain md:w-[60%] max-w-[60%]"
              />
            </div>
            <div className="flex justify-between gap-6 md:flex-row flex-col texts-sm ">
              <div className="flex gap-2 max-sm:justify-center">
                {contactdetail?.facebook && (
                  <Link
                    title="Facebook"
                    href={contactdetail?.facebook || "Na"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-[40px] w-[40px] rounded-full shadow-md bg-white hover:bg-[#882CFB] cursor-pointer hover:text-white"
                  >
                    <FaFacebookF />
                  </Link>
                )}

                {contactdetail?.youtube && (
                  <Link
                    title="Youtube"
                    href={contactdetail?.youtube || "Na"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-[40px] w-[40px] rounded-full shadow-md bg-white hover:bg-[#882CFB] cursor-pointer hover:text-white"
                  >
                    <FaYoutube />
                  </Link>
                )}

                {contactdetail?.x && (
                  <Link
                    title="Twitter"
                    href={contactdetail?.x || "Na"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-[40px] w-[40px] rounded-full shadow-md bg-white hover:bg-[#882CFB] cursor-pointer hover:text-white"
                  >
                    <FaXTwitter />
                  </Link>
                )}

                {contactdetail?.instagram && (
                  <Link
                    title="Instagram"
                    href={contactdetail?.instagram || "Na"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-[40px] w-[40px] rounded-full shadow-md bg-white hover:bg-[#882CFB] cursor-pointer hover:text-white"
                  >
                    <FaInstagram />
                  </Link>
                )}

                {contactdetail?.linkedin && (
                  <Link
                    title="Linkedin"
                    href={contactdetail?.linkedin || "Na"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-[40px] w-[40px] rounded-full shadow-md bg-white hover:bg-[#882CFB] cursor-pointer hover:text-white"
                  >
                    <FaLinkedinIn />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-2  text-center max-sm:my-2">
          <p className="para">
            © {new Date().getFullYear()} Scholar Academy Consulting : All Rights
            Reserved
          </p>
        </div>
        <div className="max-w-7xl mx-auto p-2  max-sm:my-2">
          <h4 className="font-semibold text-lg">Disclaimer :</h4>
          <div className="para">
            <div
              className="summernote-content"
              dangerouslySetInnerHTML={{
                __html: footerContent?.[0]?.content || "",
              }}
            />
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
