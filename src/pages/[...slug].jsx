import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import FormModal from "@/Components/FormModal";
import FAQ from "@/Components/faq";
import DedicatedSyllabusPage from "@/Components/DedicatedSyllabusPage";
import DedicatedNotesPage from "@/Components/DedicatedNotesPage";
import DedicatedQuizzesPage from "@/Components/DedicatedQuizzesPage";
import DedicatedQuizDetailPage from "@/Components/DedicatedQuizDetailPage";
import DedicatedQuizQuestionsPage from "@/Components/DedicatedQuizQuestionsPage";
import { API_BASE_URL, APIENDPOINTS } from "../../apiconfig";
import { useAuth } from "@/context/AuthContext";
import DOMPurify from "dompurify";
import { encryptId } from "@/utils/encryption";
import {
  IoCalendarOutline,
  IoClose,
  IoCloseCircleOutline,
  IoCloseOutline,
  IoHomeOutline,
  IoWarningOutline,
} from "react-icons/io5";
import toast from "react-hot-toast";
import { IoIosArrowForward, IoIosTimer } from "react-icons/io";
import {
  FaCalendarDay,
  FaCertificate,
  FaChalkboardTeacher,
  FaCity,
  FaRegCalendarTimes,
  FaTools,
  FaUserGraduate,
} from "react-icons/fa";
import { MdLocationCity, MdOutlineExplore } from "react-icons/md";
import { FaGlobe } from "react-icons/fa";
import { PiCalendarCheckLight } from "react-icons/pi";

import {
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaUserCircle,
} from "react-icons/fa";
import { FaMinus, FaPlus } from "react-icons/fa";
import {
  FiMail,
  FiPrinter,
  FiMessageCircle,
  FiTag,
  FiCheckCircle,
  FiGlobe,
  FiHash,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { HiOutlineEmojiSad, HiOutlineVideoCamera } from "react-icons/hi";
import { IoBookOutline } from "react-icons/io5";
import {
  DynamicSEO,
  generateCourseSchema,
  generateSupportPageSchema,
} from "@/lib/seoHelper";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { useRef } from "react";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import { useCheckout } from "@/context/CheckoutContext";
import React, { useEffect, useMemo, useState } from "react";
import {
  FaAngleRight,
  FaArrowRight,
  FaCalendarAlt,
  FaCheckSquare,
  FaCircle,
  FaHome,
  FaInstagramSquare,
  FaQuoteLeft,
  FaQuoteRight,
  FaStar,
  FaTag,
  FaUser,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  RiFacebookBoxFill,
  RiFolderDownloadLine,
  RiGraduationCapFill,
} from "react-icons/ri";
import Accordion from "@/Components/Accordion";
import Tabs from "@/Components/tab";
import { SlCalender } from "react-icons/sl";
import {
  IoCheckmarkCircleSharp,
  IoChevronDownOutline,
  IoLogoFacebook,
  IoTimeOutline,
} from "react-icons/io5";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { GrFormSubtract } from "react-icons/gr";
import { IoIosAdd } from "react-icons/io";
import {
  HiArrowLongRight,
  HiMiniArrowLongRight,
  HiOutlineCalendarDateRange,
} from "react-icons/hi2";
import Lottie from "lottie-react";
import MSPPractitionericon1 from "../../public/assets/landingpage/lottiIcon/Bussiness.json";
import MSPPractitionericon2 from "../../public/assets/landingpage/lottiIcon/Exam Preparation";
import MSPPractitionericon3 from "../../public/assets/landingpage/lottiIcon/Learning.json";
import MSPPractitionericon4 from "../../public/assets/landingpage/lottiIcon/Meeting.json";
import MSPPractitionericon5 from "../../public/assets/landingpage/lottiIcon/Not found.json";
import MSPPractitionericon6 from "../../public/assets/landingpage/lottiIcon/Time.json";
import MSPPractitionericon7 from "../../public/assets/landingpage/lottiIcon/GROUP DISCUSION.json";
import { IoIosArrowBack } from "react-icons/io";
import {
  MdOutlineArrowRightAlt,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineNavigateNext,
} from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";
import { TfiLocationPin } from "react-icons/tfi";
import SalaryChart from "@/Components/SalaryChart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiTwotoneCloseCircle, AiTwotoneHome } from "react-icons/ai";
import Link from "next/link";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useRouter } from "next/router";
import Testimonials from "@/Components/testimonials";
import { decryptId } from "@/utils/encryption";
import Loader from "@/Components/loader";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { LuDownload, LuTvMinimal } from "react-icons/lu";
import { BsCheck2All, BsCheck2Circle } from "react-icons/bs";
import Contactus from "@/Components/contact";
import { CgSmileSad } from "react-icons/cg";
import { getCourseImageUrl, DEFAULT_COURSE_FALLBACK } from "@/utils/imageHelper";

const normalizeImageUrl = (path, fallback = DEFAULT_COURSE_FALLBACK) => {
  return getCourseImageUrl(path, fallback);
};

const sanitizeDynamicCourseData = (rawData) => {
  if (!rawData || typeof rawData !== "object" || Array.isArray(rawData)) {
    return rawData;
  }
  const targetCourseId =
    rawData?.course?.id ||
    rawData?.course_id ||
    rawData?.support_page?.course_id ||
    rawData?.dynamicCourseHeading?.course_id ||
    rawData?.allHeadline?.course_id ||
    rawData?.courseOverview?.course_id ||
    rawData?.whatYouWillLearn?.course_id ||
    rawData?.courseHighlights?.course_id ||
    rawData?.images?.course_id ||
    null;

  const belongsToCourse = (rec) => {
    if (!rec || typeof rec !== "object") return false;
    if (rec.course_id !== undefined && rec.course_id !== null) {
      if (!targetCourseId) return false;
      if (Number(rec.course_id) !== Number(targetCourseId)) return false;
    }
    return true;
  };

  const cleaned = { ...rawData };
  const courseScopedObjectKeys = [
    "dynamicCourseHeading",
    "courseHighlights",
    "allHeadline",
    "keyfeatures",
    "courseWhyScholarAcad",
    "whatYouWillLearn",
    "whatyoulearn",
    "courseOverview",
    "courseDescription",
    "newExamstructure",
    "certificateEligibility",
    "certificationPath",
    "certificationImage",
    "certificationText",
    "coursePDF",
    "courseBenefits",
    "images",
    "courseImage",
    "ratings",
  ];
  for (const key of courseScopedObjectKeys) {
    if (cleaned[key] && !Array.isArray(cleaned[key]) && !belongsToCourse(cleaned[key])) {
      cleaned[key] = null;
    }
  }
  const courseScopedArrayKeys = [
    "CourseFaqs",
    "courseCurriculumFAQ",
    "courseSalaries",
    "coursePlan",
    "youtubeVideos",
  ];
  for (const key of courseScopedArrayKeys) {
    if (Array.isArray(cleaned[key])) {
      cleaned[key] = cleaned[key].filter((item) => belongsToCourse(item));
    }
  }
  return cleaned;
};

function DynamicPage({
  courseData: initialCourseData = null,
  isSupportPage: initialIsSupportPage = false,
  matchedSupportPage: initialMatchedSupportPage = null,
}) {
  const router = useRouter();
  const { id } = router.query;
  const { slug } = router.query;
  const { token, countryLists: authCountryLists } = useAuth();
  const { setCheckoutData } = useCheckout();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);
  const [open, setOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // console.log("userLocation",userLocation);
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
  const slugify = (text) => {
    return text
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };
  // Calendar funtionality start
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("00:00");
  const [timeSlots, setTimeSlots] = useState([]);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  useEffect(() => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const period = h < 12 ? "AM" : "PM";
        const minuteStr = String(m).padStart(2, "0");
        slots.push(`${hour12}:${minuteStr} ${period}`);
      }
    }

    setTimeSlots(slots);
  }, []);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const handleDateSelect = (day) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    setSelectedDate(date);
  };
  // Calendar funtionality End

  const [activeVideo, setActiveVideo] = useState(null);
  const getVideoId = (url) => {
    if (!url) return "";
    if (url.includes("v=")) return url.split("v=")[1]?.split("&")[0];
    return url.split("/").pop();
  };

  // const [openIndex2, setOpenIndex2] = useState(0);
  // const toggleAccordion = (index) => {
  //   setOpenIndex2(openIndex === index ? null : index);
  // };

  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [countryLists, setcoutryLists] = useState([]);
  useEffect(() => {
    if (authCountryLists && authCountryLists.length > 0) {
      setcoutryLists(authCountryLists);
      return;
    }
    if (!token) return;
    const FetchCountryList = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.COUNTRY_LIST}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          console.warn("HTTP error! Status:", res?.status);
          setcoutryLists([]);
          return;
        }
        const data = await res.json();
        setcoutryLists(data?.data || []);
      } catch (err) {
        console.error("Error fetching CountryList:", err);
      }
    };
    FetchCountryList();
  }, [token, authCountryLists]);

  const quizIdx = useMemo(() => {
    return (slug || []).findIndex(
      (s) => ["quizzes", "quiz", "quizz"].includes(s?.toLowerCase())
    );
  }, [slug]);

  // Supported subpages / support page slugs
  const SUPPORT_PAGE_SLUGS = [
    "syllabus",
    "notes",
    "exam",
    "exam-format",
    "eligibility",
    "study-plan",
    "corporate-training",
    "practice-test",
    "faqs",
    "certification-benefits",
    "certification-guide",
  ];

  const matchedSupportPage = useMemo(() => {
    if (quizIdx !== -1) return null;
    if (initialMatchedSupportPage) return initialMatchedSupportPage;
    const staticMatch = (slug || []).find((s) =>
      SUPPORT_PAGE_SLUGS.includes(s?.toLowerCase())
    )?.toLowerCase();
    if (staticMatch) return staticMatch;
    if (initialIsSupportPage || initialCourseData?.support_page) {
      const segments = Array.isArray(slug) ? slug : slug ? [slug] : [];
      const isCountry = segments.length >= 2 && segments[0]?.length === 2;
      const sub = isCountry ? segments[2] : segments[1];
      if (sub) return sub.toLowerCase();
    }
    return null;
  }, [slug, quizIdx, initialMatchedSupportPage, initialIsSupportPage, initialCourseData]);

  const isSyllabus = useMemo(() => {
    return matchedSupportPage === "syllabus";
  }, [matchedSupportPage]);

  const isNotes = useMemo(() => {
    return matchedSupportPage === "notes";
  }, [matchedSupportPage]);

  const isSupportPage = useMemo(() => {
    return Boolean(matchedSupportPage || initialIsSupportPage || initialCourseData?.support_page);
  }, [matchedSupportPage, initialIsSupportPage, initialCourseData]);

  const isQuestionsScreen = useMemo(() => {
    return (
      quizIdx !== -1 &&
      (slug || []).length > quizIdx + 2 &&
      ["questions", "start", "exam", "practice"].includes(
        slug[quizIdx + 2]?.toLowerCase()
      )
    );
  }, [quizIdx, slug]);

  const isQuizDetail = useMemo(() => {
    return (
      quizIdx !== -1 &&
      (slug || []).length > quizIdx + 1 &&
      !isQuestionsScreen
    );
  }, [quizIdx, isQuestionsScreen, slug]);

  const quiz_slug = useMemo(() => {
    return isQuizDetail || isQuestionsScreen ? slug[quizIdx + 1] : null;
  }, [isQuizDetail, isQuestionsScreen, quizIdx, slug]);

  const isQuizzes = useMemo(() => {
    return quizIdx !== -1 && !isQuizDetail && !isQuestionsScreen;
  }, [quizIdx, isQuizDetail, isQuestionsScreen]);

  const filteredSlug = useMemo(() => {
    return (slug || []).filter(
      (s, idx) =>
        !SUPPORT_PAGE_SLUGS.includes(s?.toLowerCase()) &&
        (!matchedSupportPage || s?.toLowerCase() !== matchedSupportPage.toLowerCase()) &&
        !["quizzes", "quiz", "quizz"].includes(s?.toLowerCase()) &&
        (!isQuizDetail && !isQuestionsScreen ? true : idx !== quizIdx + 1) &&
        (!isQuestionsScreen ? true : idx !== quizIdx + 2)
    );
  }, [slug, isQuizDetail, isQuestionsScreen, quizIdx, matchedSupportPage]);

  const isCountryPrefix = useMemo(() => {
    return filteredSlug?.length >= 2 && filteredSlug[0]?.length === 2;
  }, [filteredSlug]);

  const active_country = useMemo(() => {
    if (isCountryPrefix) return filteredSlug[0];
    return "in";
  }, [isCountryPrefix, filteredSlug]);

  const url_title = useMemo(() => {
    if (isCountryPrefix) return filteredSlug[1];
    if (filteredSlug?.length >= 1) return filteredSlug[0];
    return null;
  }, [isCountryPrefix, filteredSlug]);

  const active_state = useMemo(() => {
    if (isCountryPrefix) return filteredSlug[2] || null;
    if (filteredSlug?.length >= 2) return filteredSlug[1];
    return null;
  }, [isCountryPrefix, filteredSlug]);

  const active_state_city = useMemo(() => {
    if (isCountryPrefix) return filteredSlug[3] || filteredSlug[2] || null;
    if (filteredSlug?.length >= 3) return filteredSlug[2];
    if (filteredSlug?.length >= 2) return filteredSlug[1];
    return null;
  }, [isCountryPrefix, filteredSlug]);

  // console.log("tesss--->",active_state_city,);

  const [realId, setRealId] = useState(null);
  useEffect(() => {
    if (!id) return;
    const decoded = decryptId(id);
    setRealId(decoded);
  }, [id]);

  const [testimonialList, setTestimonialList] = useState([]);
  const [activeSlidetestimonials, setActiveSlidetestimonials] = useState(0);

  // Fetch testimonials with session cache and rate-limit guard
  useEffect(() => {
    if (!token || !url_title) return;
    const cacheKey = `testimonials_${url_title}_${active_country || "in"}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setTestimonialList(JSON.parse(cached));
        return;
      }
    } catch (e) {}

    const fetchTestimonials = async () => {
      try {
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
              course_id: url_title,
              top: 10,
              country_id: active_country || "in",
              state_id: active_state || null,
            }),
          },
        );
        if (res.status === 429 || !res.ok) {
          console.warn("HTTP error! Status:", res?.status);
          return;
        }
        const data = await res.json();
        const list = data?.data?.slice(0, 10) || [];
        setTestimonialList(list);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(list));
        } catch (e) {}
        setActiveSlidetestimonials(0);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };
    fetchTestimonials();
  }, [token, url_title, active_country, active_state]);

  useEffect(() => {
    if (!testimonialList || testimonialList.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlidetestimonials((prev) => (prev + 1) % testimonialList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonialList]);

  const capitalizeFirst = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "NA";

  const [isValidSlug, setIsValidSlug] = useState(true);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (!router.isReady) return;
    const segments = Array.isArray(slug) ? slug : slug ? [slug] : [];
    if (segments.length > 0 && segments[0]?.toLowerCase() === "in") {
      const cleanPath = segments.length > 1 ? `/${segments.slice(1).join("/")}` : "/";
      router.replace(cleanPath);
      return;
    }
    const isQuizPath = segments.some(
      (s) => ["quizzes", "quiz", "quizz"].includes(s?.toLowerCase())
    );
    const maxSegments = isQuizPath ? 5 : 4;
    if (segments.length > maxSegments) {
      setShowModal(true);
      setIsValidSlug(false);
    } else {
      setShowModal(false);
      setIsValidSlug(true);
    }
  }, [router.isReady, slug]);

  const handleClose = () => {
    setShowModal(false);
  };

  const [rawCourseData, setCourseData] = useState(initialCourseData || null);
  const courseData = useMemo(
    () => sanitizeDynamicCourseData(rawCourseData),
    [rawCourseData]
  );
  const [error, setError] = useState(null);

  // Track the key of the data already loaded to skip duplicate client-side fetch on initial mount
  const initialDataKey = initialCourseData
    ? `${url_title || ''}_${matchedSupportPage || ''}_${quiz_slug || ''}`
    : null;
  const lastFetchedKeyRef = useRef(initialDataKey);

  useEffect(() => {
    if (initialCourseData) {
      setCourseData(initialCourseData);
      lastFetchedKeyRef.current = `${url_title || ''}_${matchedSupportPage || ''}_${quiz_slug || ''}`;
      setError(null);
    }
  }, [initialCourseData, router.asPath]);

  useEffect(() => {
    const segments = router.asPath.split("?")[0].split("/").filter(Boolean);
    if (segments.length > 0 && segments[0]?.toLowerCase() === "in") {
      return;
    }
    const isQuizPath = segments.some(
      (s) => s?.toLowerCase() === "quizzes" || s?.toLowerCase() === "quiz"
    );
    const maxSegments = isQuizPath ? 5 : 4;
    if (segments.length > maxSegments) {
      setCourseData([]);
      setError("Invalid URL structure.");
      return;
    }

    if (!token && !isSupportPage && !isQuizzes && !isQuizDetail && !isQuestionsScreen) return;

    if (!url_title && !isNotes) {
      setError("Required information is missing.");
      setCourseData(null);
      return;
    }

    const currentKey = `${url_title || ''}_${matchedSupportPage || ''}_${quiz_slug || ''}`;
    // If SSR data already exists and the page route hasn't changed, skip duplicate client fetch
    if (rawCourseData && lastFetchedKeyRef.current === currentKey) {
      return;
    }

    const cleanCountry =
      (active_country || userLocation?.raw?.country || "in")
        ?.replace(/[^a-zA-Z]/g, "")
        ?.trim()
        ?.toUpperCase() || "IN";

    const cleanState =
      active_state
        ?.replace(/[^a-zA-Z ]/g, " ")
        ?.replace(/\s+/g, " ")
        ?.trim()
        ?.toLowerCase()
        ?.replace(/\b\w/g, (c) => c.toUpperCase()) || null;

    async function fetchCourse() {
      try {
        if (isQuestionsScreen && url_title && quiz_slug) {
          // Fetch Questions from /api/courses/{courseSlug}/quizzes/{quizSlug}/questions
          const endpoint = `${API_BASE_URL}/api/courses/${url_title}/quizzes/${quiz_slug}/questions`;
          const res = await fetch(endpoint, {
            method: "GET",
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (!res.ok) {
            setError(
              res.status === 404
                ? "Quiz questions not found or not published."
                : "Failed to fetch questions data."
            );
            setCourseData(null);
            return;
          }
          const data = await res.json();
          if (data?.status && data?.data && Array.isArray(data?.data?.questions) && data.data.questions.length > 0) {
            setCourseData(data.data);
            setError(null);
          } else {
            setError("Quiz questions not found or not published.");
            setCourseData(null);
          }
        } else if (isQuizDetail && url_title && quiz_slug) {
          // Fetch Quiz Detail from /api/courses/{courseSlug}/quizzes/{quizSlug}
          const endpoint = `${API_BASE_URL}/api/courses/${url_title}/quizzes/${quiz_slug}`;
          const res = await fetch(endpoint, {
            method: "GET",
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (!res.ok) {
            setError(
              res.status === 404
                ? "Quiz details not found or not published."
                : "Failed to fetch quiz detail."
            );
            setCourseData(null);
            return;
          }
          const data = await res.json();
          if (data?.status && data?.data && data?.data?.quiz) {
            setCourseData(data.data);
            setError(null);
          } else {
            setError("Quiz detail not found or not published.");
            setCourseData(null);
          }
        } else if (isQuizzes && url_title) {
          // Fetch Quizzes from /api/courses/{courseSlug}/quizzes
          const quizzesEndpoint = `${API_BASE_URL}/api/courses/${url_title}/quizzes`;
          const res = await fetch(quizzesEndpoint, {
            method: "GET",
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (!res.ok) {
            setError(
              res.status === 404
                ? "No published quizzes or mock exams available for this course."
                : "Failed to fetch quizzes data."
            );
            setCourseData(null);
            return;
          }
          const data = await res.json();
          if (!data?.status || !data?.data || (Array.isArray(data.data) && data.data.length === 0)) {
            setCourseData(null);
            setError("No published quizzes or mock exams available for this course.");
          } else {
            setCourseData(data);
            setError(null);
          }
        } else if (isSupportPage && !isNotes && url_title) {
          // Fetch Support Page from /api/courses/{courseSlug}/support/{pageType}
          let supportEndpoint = `${API_BASE_URL}/api/courses/${url_title}/support/${matchedSupportPage}`;
          let res = await fetch(supportEndpoint, {
            method: "GET",
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (res.status === 404 && matchedSupportPage === "exam") {
            const altRes = await fetch(`${API_BASE_URL}/api/courses/${url_title}/support/exam-format`, {
              method: "GET",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            if (altRes.ok) {
              res = altRes;
            } else {
              const directExamRes = await fetch(`${API_BASE_URL}/api/courses/${url_title}/exam`, {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });
              if (directExamRes.ok) {
                res = directExamRes;
              }
            }
          }
          if (!res.ok) {
            setError(
              res.status === 404
                ? `The ${matchedSupportPage} page is not published for this course.`
                : `Failed to fetch ${matchedSupportPage} data.`
            );
            setCourseData(null);
            return;
          }
          const data = await res.json();
          if (!data?.data) {
            setError(`No ${matchedSupportPage} data found.`);
            setCourseData(null);
          } else {
            try {
              const dynRes = await fetch(`${API_BASE_URL}${APIENDPOINTS.DYNAMIC_PAGE}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  course_id: url_title,
                  country_id: cleanCountry || "IN",
                  state_id: cleanState || null,
                }),
              });
              if (dynRes.ok) {
                const dynJson = await dynRes.json();
                if (dynJson?.data) {
                  const supportSchema = data.data.schema;
                  const supportCourse = data.data.course;
                  Object.assign(data.data, dynJson.data);
                  if (supportCourse) {
                    data.data.course = supportCourse;
                  }
                  if (supportSchema) {
                    data.data.schema = supportSchema;
                  }
                }
              }
            } catch (e) {}

            setCourseData(sanitizeDynamicCourseData(data?.data));
            setError(null);
          }
        } else if (isNotes) {
          // Fetch Notes from /api/dynamic-page with { slug: "Notes" }
          const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.DYNAMIC_PAGE}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              slug: "Notes",
              course_id: url_title || null,
              country_id: cleanCountry,
              state_id: cleanState || null,
            }),
          });
          if (!res.ok) {
            setError("Invalid course, country, or state.");
            setCourseData([]);
            return;
          }
          const data = await res.json();
          if (!data?.data || (Array.isArray(data?.data) && data?.data?.length === 0)) {
            setError("No data found for the given information.");
            setCourseData(null);
          } else {
            setCourseData(sanitizeDynamicCourseData(data?.data));
            setError(null);
          }
        } else {
          // Standard dynamic course detail page
          const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.DYNAMIC_PAGE}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              course_id: url_title,
              country_id: cleanCountry,
              state_id: cleanState || null,
            }),
          });
          if (!res.ok) {
            setError("Invalid course, country, or state.");
            setCourseData([]);
            return;
          }
          const data = await res.json();
          if (!data?.data || (Array.isArray(data?.data) && data?.data?.length === 0)) {
            setError("No data found for the given information.");
            setCourseData(null);
          } else {
            setCourseData((prev) =>
              sanitizeDynamicCourseData({
                ...(data?.data || {}),
                course: data?.data?.course || prev?.course || initialCourseData?.course || null,
                header_image: data?.data?.header_image || prev?.header_image || initialCourseData?.header_image || null,
                course_title: data?.data?.course_title || prev?.course_title || initialCourseData?.course_title || null,
                short_description: data?.data?.short_description || prev?.short_description || initialCourseData?.short_description || null,
                schema: data?.data?.schema || prev?.schema || initialCourseData?.schema || null,
              })
            );
            lastFetchedKeyRef.current = currentKey;
            setError(null);
          }
        }
      } catch (err) {
        setError("Something went wrong while fetching data.");
        setCourseData(null);
      }
    }
    fetchCourse();
  }, [token, active_country, url_title, active_state, isSupportPage, matchedSupportPage, isSyllabus, isNotes, isQuizzes, isQuizDetail, isQuestionsScreen, quiz_slug, userLocation]);

  const [formData, setFormData] = useState({
    full_name: "",
    contact_number: "",
    email: "",
    country: "",
    course: "",
    training_delivery_mode: "",
    enquiry_for: "",
    preferred_contact_mode: "",
    company_name: "",
    job_title: "",
    group_size: "",
    message: "",
    agree_terms: 0,
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const requiredFields = [
      "full_name",
      "email",
      "country",
      "course",
      "training_delivery_mode",
      "enquiry_for",
      "preferred_contact_mode",
      "message",
      "agree_terms",
      // "group_size",
    ];
    // Add corporate-only fields if enquiry_for is corporate
    if (formData.enquiry_for === "corporate") {
      requiredFields.push("company_name", "job_title", "group_size");
      // requiredFields.push("company_name", "job_title");
    }
    // Validate required fields
    for (let field of requiredFields) {
      if (
        formData[field] === "" ||
        formData[field] === null ||
        formData[field] === 0
      ) {
        setLoading(false);
        toast("Please fill all required fields and accept terms", {
          icon: "⚠️",
        });
        return;
      }
    }
    // Message Word Count Validation (max 500 words)
    const wordCount = formData.message.trim().split(/\s+/).length;
    if (wordCount > 500) {
      toast.error("Message cannot exceed 500 words.");
      setLoading(false);
      return;
    }
    // **Phone Validation (min 5 digits, max 10 digits)**
    // if (!/^[0-9]{5,10}$/.test(formData.contact_number)) {
    //   toast.error("Phone number must be between 5 and 10 digits.");
    //   setLoading(false);
    //   return;
    // }
    const formatDate = (date) => {
      if (!date) return null;

      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Add selected date before sending
    const payload = {
      ...formData,
      selected_date: selectedDate.toLocaleDateString(),
      selected_time: selectedTime,
      selected_datetime: formatDate(selectedDate, selectedTime),
    };
    console.log("Payload to send:", payload);
    try {
      const res = await fetch(
        `${API_BASE_URL}${APIENDPOINTS.LEARNING_CALENDER_FORM}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        setLoading(false);
        // console.log("HTTP error! Status:", res.status);
        return;
      }
      const data = await res.json();
      toast.success("Thanks for the query for course! We will reach you soon.");
      setLoading(false);
      setFormData({
        full_name: "",
        contact_number: "",
        email: "",
        country: "",
        course: "",
        training_delivery_mode: "",
        enquiry_for: "",
        preferred_contact_mode: "",
        message: "",
        agree_terms: 0,
        company_name: "",
        job_title: "",
        group_size: "",
      });
    } catch (err) {
      setLoading(false);
    }
  };


  // Course FAQS
  const DEFAULT_VISIBLE = 5;
  const LOAD_MORE_COUNT = 5;
  const [visibleCourseFaqCount, setVisibleCourseFaqCount] =
    useState(DEFAULT_VISIBLE);
  const courseFaq = courseData?.CourseFaqs || [];
  const totalCourseFaq = courseFaq.length;
  const visibleCourseFaq = courseFaq.slice(0, visibleCourseFaqCount);
  const hasMoreCourseFaq = visibleCourseFaqCount < totalCourseFaq;

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  {
    showSuccessModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            🎉 Form Submitted Successfully!
          </h2>
          <p className="mt-2 text-gray-600">We will contact you soon.</p>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="mt-4 px-6 py-2 bg-[#882CFB] text-white rounded-md hover:bg-[#7221D8]"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = (data) => {
    setSelectedJob(data);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };
  const { categories } = useAuth();
  console.log("categories", categories);
  // First tab active by default
  const [activeId, setActiveId] = useState("Course Highlights");
  useEffect(() => {
    const sectionIds = [
      "Course Highlights",
      "Course overview",
      "Key Features",
      "Why Choose Us",
      "What You’ll Learn",
      "Training Options",
      "Contact",
      "Schedule Courses",
      "MSP Roadmap",
      "FAQs",
    ];

    const handleScroll = () => {
      let foundActive = false;
      for (let id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveId(id);
          foundActive = true;
          break;
        }
      }
      if (!foundActive) {
        setActiveId("");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveId(id);
    const yOffset = -120;
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    if (isSyllabus && courseData) {
      setTimeout(() => {
        scrollToSection("What You’ll Learn");
      }, 500);
    }
    if (isNotes && courseData) {
      setTimeout(() => {
        scrollToSection("Key Features");
      }, 500);
    }
  }, [isSyllabus, isNotes, courseData]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const instructors = courseData?.courseInstructor || [];
  const visibleCount = 2;

  useEffect(() => {
    if (instructors.length <= visibleCount) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % instructors.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [instructors.length]);

  const getVisibleInstructors = () => {
    const list = [];
    const count = Math.min(visibleCount, instructors.length);

    for (let i = 0; i < count; i++) {
      list.push(instructors[(currentIndex + i) % instructors.length]);
    }

    return list;
  };
  const [keyfeatureisOpen, keyfeaturesetIsOpen] = useState(false);

  // Testimonial Slider Start
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  // Handle dot click
  const handleDotClick = (index) => {
    setActiveSlide(index);
  };
  const testimonials = [
    {
      name: "John Doe",
      role: "CEO, Company",
      image: "/assets/landingpage/user-avatar.png",
      quote:
        "This course changed my life! Highly recommend it to anyone looking to advance their skills.",
    },
    {
      name: "Jane Smith",
      role: "Marketing Lead",
      image: "/assets/landingpage/user-avatar.png",
      quote:
        "Amazing content and well-structured training. Learned a lot in a short period.",
    },
    {
      name: "Mike Johnson",
      role: "Developer",
      image: "/assets/landingpage/user-avatar.png",
      quote:
        "The trainers are very knowledgeable. Highly recommend for professionals!",
    },
    {
      name: "Priya Verma",
      role: "Project Manager",
      image: "/assets/landingpage/user-avatar.png",
      quote:
        "A truly transformative learning experience. The practical exercises were excellent.",
    },
    {
      name: "Ravi Kumar",
      role: "Consultant",
      image: "/assets/landingpage/user-avatar.png",
      quote:
        "I gained so much confidence and skills after completing this course.",
    },
  ];

  const [quantities, setQuantities] = useState({});
  const increment = (id) => {
    setQuantities((prev) => {
      const current = prev[id] ?? 1;
      return { ...prev, [id]: current + 1 };
    });
  };
  const decrement = (id) => {
    setQuantities((prev) => {
      const current = prev[id] ?? 1;
      return { ...prev, [id]: Math.max(1, current - 1) };
    });
  };
  const getTotals = (content, qty) => {
    const original = Number(content?.course_fees) || 0;
    const discountPercentAPI = Number(
      String(content?.discount_amt || "").replace("%", ""),
    );
    const offerFor = content?.discount_offer_for || "";
    // ---- FIX 1: If discount_end_date missing, assume discount IS active ----
    const hasEndDate = !!content?.discount_end_date;
    let isDiscountActive = false;
    if (hasEndDate) {
      const end = new Date(content.discount_end_date + "T23:59:59");
      isDiscountActive = end.getTime() >= Date.now();
    } else {
      isDiscountActive = discountPercentAPI > 0;
    }
    // ---- FIX 2: Always apply discount on ORIGINAL PRICE ----
    let finalUnitPrice = original;
    if (isDiscountActive && discountPercentAPI > 0) {
      finalUnitPrice = original - (original * discountPercentAPI) / 100;
    }
    // ---- Total calculations ----
    const totalOriginal = original * qty;
    const totalPrice = finalUnitPrice * qty;
    const totalSave = totalOriginal - totalPrice;
    const discountPercent =
      totalOriginal > 0 ? Math.round((totalSave / totalOriginal) * 100) : 0;
    return {
      totalOriginal,
      totalPrice,
      totalSave,
      discountPercent,
      isDiscountActive,
      discountPercentAPI,
      offerFor,
    };
  };
  const getTimeLeft = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate.replace(" ", "T"));
    const now = new Date();
    const diff = end - now;
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${minutes}m left`;
  };
  const isEnrollmentExpired = (endDate) => {
    if (!endDate) return false;
    const end = new Date(endDate.replace(" ", "T"));
    return end <= new Date();
  };
  const isSameMonth = (dateStr, offset = 0) => {
    const date = new Date(dateStr);
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    return (
      date.getFullYear() === target.getFullYear() &&
      date.getMonth() === target.getMonth()
    );
  };
  const isWeekend = (dateStr) => {
    const day = new Date(dateStr).getDay();
    return day === 0 || day === 6;
  };
  const isWeekday = (dateStr) => {
    const day = new Date(dateStr).getDay();
    return day >= 1 && day <= 5;
  };

  // const isTodayOrFuture = (dateStr) => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   const date = new Date(dateStr);
  //   date.setHours(0, 0, 0, 0);
  //   return date >= today;
  // };

  // const renderScheduleCards = (filterFn) => {
  //   const filteredData =
  //     courseData?.courseSchedule?.filter(
  //       (item) => isTodayOrFuture(item.class_start_date) && filterFn(item)
  //     ) || [];
  //   if (filteredData.length === 0) {
  //     return (
  //       <div
  //         className="bg-white p-4 rounded-xl border border-gray-200
  //       flex flex-col items-center justify-center text-center gap-3"
  //       >
  //         <HiOutlineEmojiSad className="text-5xl text-[#2E318D]" />
  //         <p className="text-gray-700 text-lg font-medium">
  //           Can’t find a batch you are looking for?
  //         </p>
  //       </div>
  //     );
  //   }
  const STEP = 5;
  const [visibleScheduleCount, setVisibleScheduleCount] = useState(STEP);

  const renderScheduleCards = (filterFn) => {
    const filteredData = courseData?.courseSchedule?.filter(filterFn) || [];
    const visibleScheduleData = filteredData.slice(0, visibleScheduleCount);

    const handleToggle = () => {
      if (visibleScheduleCount < filteredData.length) {
        setVisibleScheduleCount((v) => Math.min(v + STEP, filteredData.length));
      } else {
        setVisibleScheduleCount(STEP);
      }
    };

    const isExpanded = visibleScheduleCount >= filteredData.length;
    if (filteredData.length === 0) {
      return (
        <div
          className="bg-white p-4 rounded-xl border border-gray-200
          flex flex-col items-center justify-center text-center gap-3"
        >
          <HiOutlineEmojiSad className="text-5xl text-[#2E318D]" />
          <p className="text-gray-700 text-lg font-medium">
            Can’t find a batch you are looking for?
          </p>
        </div>
      );
    }

    return (
      <>
        {visibleScheduleData.map((content, index) => {
          const id = content?.course_schedule_id || index;
          const qty = quantities[id] || 1;
          const expired = isEnrollmentExpired(content?.enroll_end_date);

          // for show day count of total days
          const calculateClassDays = (startStr, endStr, batchType) => {
            if (!startStr || !endStr || !batchType) return 0;

            const startDate = new Date(`${startStr}T00:00:00`);
            const endDate = new Date(`${endStr}T00:00:00`);

            if (isNaN(startDate) || isNaN(endDate)) {
              console.error("❌ Invalid date format. Expected YYYY-MM-DD", {
                startStr,
                endStr,
              });
              return 0;
            }
            const batch = batchType.toLowerCase();
            let totalDays = 0;
            for (
              let d = new Date(startDate);
              d <= endDate;
              d.setDate(d.getDate() + 1)
            ) {
              if (batch === "weekday") {
                totalDays++;
                continue;
              }
              if (batch === "weekend") {
                const day = d.getDay();
                if (day === 0 || day === 6) {
                  totalDays++;
                }
              }
            }

            return totalDays;
          };
          const totalClassDays = calculateClassDays(
            content?.class_start_date,
            content?.class_end_date,
            content?.batch_type,
          );

          // for show day/date count of total days
          const getClassDates = (startStr, endStr, batchType) => {
            if (!startStr || !endStr || !batchType) return [];
            const startDate = new Date(`${startStr}T00:00:00`);
            const endDate = new Date(`${endStr}T00:00:00`);
            if (isNaN(startDate) || isNaN(endDate)) return [];
            const batch = batchType.toLowerCase();
            const dates = [];
            for (
              let d = new Date(startDate);
              d <= endDate;
              d.setDate(d.getDate() + 1)
            ) {
              const day = d.getDay();

              if (batch === "weekday") {
                dates.push(new Date(d));
              }
              if (batch === "weekend" && (day === 0 || day === 6)) {
                dates.push(new Date(d));
              }
            }
            return dates;
          };
          const classDates = getClassDates(
            content?.class_start_date,
            content?.class_end_date,
            content?.batch_type,
          );
          const formatDayDate = (date) => {
            const day = date
              .toLocaleDateString("en-US", { weekday: "short" })
              .toUpperCase();
            const dayNum = date.getDate();
            return `${day}/${dayNum}`;
          };
          const {
            totalOriginal,
            totalPrice,
            totalSave,
            discountPercent,
            isDiscountActive,
            offerFor,
          } = getTotals(content, qty);

          return (
            <>
              <div
                key={index}
                className="bg-white  border-1 relative border-[#882CFB] rounded-xl mb-5 hover:shadow-md"
              >
                {isDiscountActive && totalSave > 0 && (
                  <div className="bg-gradient-to-r from-[#2E318D] to-[#882CFB] text-white text-xs px-3 py-1 rounded-br-xl rounded-tl-xl mb-2 absolute top-0 left-0 flex gap-2 items-center ">
                    <span className="flex gap-1 item-center flex-wrap">
                      <span> SPECIAL OFFER : </span>
                      <span className="flex gap-1 item-center">
                        <span>
                          Save Flat {discountPercent}% (
                          {totalSave.toLocaleString()})
                        </span>
                        <span>
                          On {content?.course_fees} {""}
                          {content?.fee_currency}
                        </span>
                      </span>
                      {/* Hover Content */}
                    </span>
                    {/* <div className="relative group inline-block">
                <span className="cursor-pointer  ">
                  <FiAlertCircle />
                </span>
                <div
                  className="
                        absolute left-6 top-1 border border-gray-200
                        invisible opacity-0 group-hover:visible group-hover:opacity-100
                        transition-all duration-200
                        bg-white text-gray-700 text-sm
                        p-2 rounded shadow-md w-60 z-20
                      "
                >
                  <p className=" text-xs">
                    Discount offer , Term & Conditions Special offers not
                    applicable for ...... Participents
                  </p>
                </div>
              </div> */}
                  </div>
                )}
                <div
                  className={`grid grid-cols-1 md:grid-cols-[40%_30%_30%] ${isDiscountActive && totalSave > 0 ? "mt-5" : ""
                    }`}
                >
                  <div className="border-r border-gray-300 md:p-5 p-3 max-sm:mt-8">
                    {content?.batch_type && (
                      <span className="px-3 py-1 rounded-full bg-green-200 border border-green-500 text-green-700">
                        {capitalizeFirst(content.batch_type)}
                      </span>
                    )}

                    <div className=" flex flex-wrap items-center gap-4 my-4 ">
                      <div className="flex items-center gap-2">
                        <SlCalender className="text-green-600 text-lg" />
                        <span className="font-semibold text-gray-800">
                          {content?.class_start_date || "NA"}
                        </span>
                      </div>
                      <span className="text-gray-400">-</span>
                      <div className="flex items-center gap-2">
                        <HiOutlineCalendarDateRange className="text-red-600 text-lg" />
                        <span className="font-semibold text-gray-800">
                          {content?.class_end_date || "NA"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between    my-3">
                      <div className="flex gap-3 items-center flex-wrap">
                        {classDates?.map((date, index) => {
                          const day = date
                            .toLocaleDateString("en-US", { weekday: "short" })
                            .slice(0, 2)
                            .toUpperCase();
                          const dayNum = date.getDate();
                          return (
                            <div
                              key={index}
                              className="flex flex-col items-center bg-[#FAF8FE] py-1 border border-[#882CFB]  rounded-md p-3"
                            >
                              <span className="text-xs font-semibold text-gray-600 border-b">
                                {day}
                              </span>
                              <span className="text-sm font-bold  text-gray-600">
                                {dayNum}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {/* <div className="flex items-center gap-3">
                  <div className="bg-[#F9FAFB] border border-gray-100 p-3 rounded-md flex items-center justify-center">
                    <SlCalender className="text-[#2E318D]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#2E318D]">Program Duration</p>
                    <p className="font-normal text-[#333333]">
                      {totalClassDays === 1
                        ? "1 Day "
                        : `${totalClassDays} Days `}
                    </p>
                  </div>
                </div> */}

                      {/* {content?.batch_type && (
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                    {content.batch_type}
                  </span>
                )} */}
                    </div>

                    {/* <div className="flex gap-3 mt-3">
                <div className="w-10 border border-purple-200 rounded-sm shadow-sm bg-white">
                  <div className="h-2 bg-[#F7B439] rounded-t-sm"></div>
                  <div className="flex flex-col items-center ">
                    <p className="text-sm font-bold">06</p>
                    <p className="text-gray-600 text-sm">Sat</p>
                  </div>
                </div>

                <div className="w-10 border border-purple-200 rounded-sm shadow-sm bg-white">
                  <div className="h-2 bg-[#F7B439] rounded-t-sm"></div>
                  <div className="flex flex-col items-center ">
                    <p className="text-sm font-bold">07</p>
                    <p className="text-gray-600 text-sm">Sun</p>
                  </div>
                </div>

                <div className="w-10 border border-purple-200 rounded-sm shadow-sm bg-white">
                  <div className="h-2 bg-[#F7B439] rounded-t-sm"></div>
                  <div className="flex flex-col items-center ">
                    <p className="text-sm font-bold">13</p>
                    <p className="text-gray-600 text-sm">Sat</p>
                  </div>
                </div>

                <div className="w-10 border border-purple-200 rounded-sm shadow-sm bg-white">
                  <div className="h-2 bg-[#F7B439] rounded-t-sm"></div>
                  <div className="flex flex-col items-center ">
                    <p className="text-sm font-bold">14</p>
                    <p className="text-gray-600 text-sm">Sun</p>
                  </div>
                </div>
              </div> */}
                    <div className="grid grid-cols-2 gap-4 mt-4 text-[16px]">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#F9FAFB] border border-gray-100 p-3 rounded-md flex items-center justify-center">
                          <IoTimeOutline className="text-[#2E318D] text-lg" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#2E318D]">
                            Start Time
                          </span>
                          <span className="font-normal text-[#333333]">
                            {content?.class_start_time}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-[#F9FAFB] border border-gray-100 p-3 rounded-md flex items-center justify-center">
                          <IoIosTimer className="text-[#2E318D] text-lg" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#2E318D]">
                            End Time
                          </span>
                          <span className="font-normal text-[#333333]">
                            {content?.class_end_time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" space-y-2 text-sm max-sm:p-3 md:px-7 md:py-10">
                    <p className="font-semibold text-lg">
                      Live Online Classroom
                    </p>
                    {/* <p className="para ">{content?.course_schedule_id}</p> */}
                    <p className="para">{content?.class_language} (Language)</p>
                    <div className="">
                      {JSON.parse(content?.course_includes || "[]").map(
                        (item, idx) => (
                          <p key={idx} className="flex gap-2 items-center para">
                            {/* <IoMdCheckmarkCircleOutline /> */}
                            {item}
                          </p>
                        ),
                      )}
                    </div>
                    <p className="text-red-500  font-[16px]">
                      Hurry Up!!! Registration closes soon! Limited Seats Left
                    </p>
                  </div>

                  <div className="md:p-5 max-sm:p-3">
                    <div className="flex gap-4 md:justify-end items-center">
                      <p className="font-semibold text-lg">Learners</p>
                      <div className="inline-flex border rounded-lg overflow-hidden mt-2">
                        <button
                          title="Decreament"
                          className="px-4 py-2 hover:bg-gray-300 border-r"
                          onClick={() => decrement(id)}
                        >
                          <GrFormSubtract />
                        </button>

                        <span className="px-6 py-2">{qty}</span>

                        <button
                          title="Increament"
                          className="px-4 py-2 hover:bg-gray-300 border-l cursor-pointer"
                          onClick={() => increment(id)}
                        >
                          <IoIosAdd />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 md:justify-end mt-2 items-center">
                      <p className="text-2xl font-bold text-[#2E318D]">
                        {totalPrice.toLocaleString()} {content?.fee_currency}
                      </p>
                      {isDiscountActive &&
                        Number(
                          String(content?.discount_amt || "").replace("%", ""),
                        ) > 0 && (
                          <p className="line-through text-[#797979]">
                            {totalOriginal.toLocaleString()}
                          </p>
                        )}
                    </div>
                    {/* DISCOUNT DETAILS */}
                    <div className="flex flex-col md:items-end ">
                      {/* {isDiscountActive && discountPercentAPI > 0 && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {discountPercentAPI}% OFF
                        </span>
                      )} */}
                      {isDiscountActive && totalSave > 0 && (
                        <>
                          <p className="text-green-500 flex gap-2 items-center  font-[16px] py-2">
                            <IoMdCheckmarkCircleOutline />
                            Save {discountPercent}% (
                            {totalSave.toLocaleString()})
                          </p>
                          <p className="para">
                            Discount End Date - {content?.discount_end_date}
                          </p>
                        </>
                      )}
                      {offerFor && (
                        <p className="text-[#2E318D] font-[16px] ">
                          Offer for - {offerFor}
                        </p>
                      )}
                    </div>
                    {/* ENROLL BUTTON */}
                    {/* <div className="flex md:justify-end">
                <button
                  title="Checkout"
                  onClick={() => {
                    setCheckoutData({
                      ...content,
                      quantity: qty,
                      url_title: url_title,
                    });

                    router.push("/order-summary/checkout");
                  }}
                  className="relative overflow-hidden px-5 py-2 cursor-pointer bg-[#2E318D] text-white rounded-full mt-4 hover:bg-[#3c40c0] glow-slide flex gap-1 item-center"
                >
                  Enroll Now <HiOutlineArrowNarrowRight className="mt-1" />
                </button>
              </div> */}
                    <div className="flex md:justify-end">
                      <button
                        title={expired ? "Enrollment Closed" : "Checkout"}
                        disabled={expired}
                        onClick={() => {
                          if (expired) return;
                          setCheckoutData({
                            ...content,
                            quantity: qty,
                            url_title: url_title,
                            totalClassDays: totalClassDays,

                            active_country: active_country,
                          });

                          router.push("/order-summary/checkout");
                        }}
                        className={`relative overflow-hidden px-5 py-2 rounded-full mt-4 flex gap-1 items-center
                          ${expired
                            ? "bg-red-500 cursor-not-allowed text-white"
                            : "bg-[#882CFB] hover:bg-[#3c40c0] cursor-pointer text-white"
                          }`}
                      >
                        {expired ? "Enrollment Closed" : "Enroll Now"}
                        {!expired && (
                          <HiOutlineArrowNarrowRight className="mt-1" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex max-sm:flex-col md:flex-row justify-between p-2 bg-gray-50 rounded-xl gap-4 text-xs font-medium">
                  <div className="flex item-center gap-4  text-gray-700">
                    {/* <div className="flex items-center gap-1 cursor-pointer hover:text-[#2E318D] transition">
                      <FiMail className="text-xs" />
                      <span>Email Schedule</span>
                    </div> */}
                    {/* <div className="flex items-center gap-1 cursor-pointer hover:text-[#2E318D] transition">
                <FiPrinter className="text-xs" />
                <span>Print Schedule</span>
              </div> */}
                    <div
                      onClick={() => scrollToSection("Contact")}
                      className="flex items-center gap-1 cursor-pointer hover:text-[#2E318D] transition"
                    >
                      <FiMessageCircle className="text-xs" />
                      <span>Enquiry</span>
                    </div>
                  </div>
                  {content?.enroll_end_date && (
                    <div>
                      <span className="flex gap-2 items-center">
                        <span className="text-sm">Registration Ends In</span>
                        <span className="text-white bg-red-400 px-3 py-1 font-bold rounded-tr-xl rounded-bl-xl">
                          {getTimeLeft(content?.enroll_end_date)}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          );
        })}
        <div className="mt-3 flex justify-center  gap-3">
          {filteredData.length > STEP && (
            <button
              onClick={handleToggle}
              className="flex items-center gap-1 px-4 py-2
             border border-[#882CFB] text-[#882CFB]
             rounded-full text-sm font-medium
             hover:bg-[#882CFB] hover:text-white
             transition-all duration-200 cursor-pointer"
            >
              {isExpanded ? (
                <>
                  View Less Schedule
                  <FiChevronUp className="" />
                </>
              ) : (
                <>
                  View More Schedule
                  <FiChevronDown className="" />
                </>
              )}
            </button>
          )}
        </div>
      </>
    );
  };

  const tabs = [
    {
      label: "All",
      content: renderScheduleCards(() => true),
    },
    {
      label: "This Month",
      content: renderScheduleCards((item) =>
        isSameMonth(item?.class_start_date, 0),
      ),
    },
    {
      label: "Next Month",
      content: renderScheduleCards((item) =>
        isSameMonth(item.class_start_date, 1),
      ),
    },
    {
      label: "Weekend",
      content: renderScheduleCards((item) => isWeekend(item.class_start_date)),
    },
    {
      label: "Weekday",
      content: renderScheduleCards((item) => isWeekday(item.class_start_date)),
    },
  ];

  // 1️⃣ Get any course in this month
  // const getOneCourseSchedules = () => {
  //   return courseData?.courseSchedule?.find((item) =>
  //     isWeekend(item?.class_start_date, 0)
  //   );
  // };

  // 1️⃣ Get any course in this month
  // const getOneCourseSchedules = () => {
  //   // Try to find a weekend course first
  //   const weekendCourse = courseData?.courseSchedule?.find((item) =>
  //     isWeekend(item?.class_start_date, 0),
  //   );
  //   if (weekendCourse) {
  //     return weekendCourse;
  //      // Return weekend if available
  //   }
  //   // Fallback: find a weekday course
  //   const weekdayCourse = courseData?.courseSchedule?.find((item) =>
  //     isWeekday(item?.class_start_date),
  //   );
  //   return weekdayCourse;
  //    // May return undefined if nothing exists
  // };

  // const getOneCourseSchedules = () => {
  //   const schedules = courseData?.courseSchedule || [];
  //   if (!schedules.length) return null;

  //   const latest = [...schedules].sort(
  //     (a, b) => new Date(b.class_start_date) - new Date(a.class_start_date),
  //   )[0];
  //   return {
  //     ...latest,
  //     courseType: isWeekend(latest.class_start_date, 0) ? "Weekend" : "Weekday",
  //   };
  // };
  //   const getOneCourseSchedules = () => {
  //   const schedules = courseData?.courseSchedule || [];
  //   if (!schedules.length) return null;
  //   const first = [...schedules].sort(
  //     (a, b) => new Date(a.class_start_date) - new Date(b.class_start_date)
  //   )[0];
  //   return {
  //     ...first,
  //     courseType: isWeekend(first.class_start_date, 0)
  //       ? "Weekend"
  //       : "Weekday",
  //   };
  // };
  const parseDate = (dateStr) => new Date(`${dateStr}T00:00:00`);

  const getOneCourseSchedules = () => {
    const schedules = courseData?.courseSchedule || [];
    if (!schedules.length) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = schedules.filter(
      (s) => parseDate(s.class_start_date) >= today,
    );
    if (!upcoming.length) return null;
    const closest = upcoming.reduce((nearest, curr) =>
      parseDate(curr.class_start_date) < parseDate(nearest.class_start_date)
        ? curr
        : nearest,
    );
    // console.log("Closest upcoming date:", closest.class_start_date);
    return closest;
  };

  // 2️⃣ Render single course card with all existing UI
  const renderSingleScheduleCard = (content) => {
    if (!content) return null;
    // console.log("contentssss", content);
    const id = content?.course_schedule_id;
    const qty = quantities[id] || 1;
    const expired = isEnrollmentExpired(content?.enroll_end_date);

    // for show count of total days
    const calculateClassDays = (startStr, endStr, batchType) => {
      if (!startStr || !endStr || !batchType) return 0;
      const startDate = new Date(`${startStr}T00:00:00`);
      const endDate = new Date(`${endStr}T00:00:00`);
      if (isNaN(startDate) || isNaN(endDate)) {
        console.error("❌ Invalid date format. Expected YYYY-MM-DD", {
          startStr,
          endStr,
        });
        return 0;
      }

      const batch = batchType.toLowerCase();
      let totalDays = 0;

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        if (batch === "weekday") {
          totalDays++;
          continue;
        }
        if (batch === "weekend") {
          const day = d.getDay();
          if (day === 0 || day === 6) {
            totalDays++;
          }
        }
      }

      return totalDays;
    };
    const totalClassDays = calculateClassDays(
      content?.class_start_date,
      content?.class_end_date,
      content?.batch_type,
    );
    // for show day/date count of total days
    const getClassDates = (startStr, endStr, batchType) => {
      if (!startStr || !endStr || !batchType) return [];

      const startDate = new Date(`${startStr}T00:00:00`);
      const endDate = new Date(`${endStr}T00:00:00`);
      if (isNaN(startDate) || isNaN(endDate)) return [];

      const batch = batchType.toLowerCase();
      const dates = [];

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const day = d.getDay();

        if (batch === "weekday") {
          dates.push(new Date(d));
        }

        if (batch === "weekend" && (day === 0 || day === 6)) {
          dates.push(new Date(d));
        }
      }

      return dates;
    };
    const classDates = getClassDates(
      content?.class_start_date,
      content?.class_end_date,
      content?.batch_type,
    );
    const formatDayDate = (date) => {
      const day = date
        .toLocaleDateString("en-US", { weekday: "short" })
        .toUpperCase();
      const dayNum = date.getDate();
      return `${day}/${dayNum}`;
    };
    const {
      totalOriginal,
      totalPrice,
      totalSave,
      discountPercent,
      isDiscountActive,
      offerFor,
    } = getTotals(content, qty);
    return (
      <div
        key={id}
        className="bg-white border-1 border-[#882CFB] rounded-md   hover:shadow-md p-3 relative"
      >
        {isDiscountActive && totalSave > 0 && (
          <div className="bg-gradient-to-r from-[#882CFB] to-[#882CFB] text-white text-xs px-3 py-1 rounded-br-md rounded-tl-md mb-4 absolute top-0 left-0 flex gap-2 items-center ">
            <FaCalendarDay className="" />
            <span className="font-semibold text-sm">
              {capitalizeFirst(content?.batch_type)}
              {/* {getOneCourseSchedules()
                ? isWeekend(getOneCourseSchedules()?.class_start_date)
                  ? "Weekend"
                  : "Weekday"
                : "No Course"} */}
            </span>
          </div>
        )}
        <div className={` ${isDiscountActive && totalSave > 0 ? "mt-7" : ""}`}>
          <div className="">
            {/* Learners Mini */}
            {/* <div className="flex gap-3 my-3">
            {[6, 7, 13, 14].map((day, idx) => (
              <div
                key={idx}
                className="w-10 border border-purple-200 rounded-sm shadow-sm bg-white"
              >
                <div className="h-2 bg-[#F7B439] rounded-t-sm"></div>
                <div className="flex flex-col items-center ">
                  <p className="text-sm font-bold">{day}</p>
                  <p className="text-gray-600 text-sm">{day % 2 === 0 ? "Sat" : "Sun"}</p>
                </div>
              </div>
            ))}
          </div> */}
          </div>
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2 ">
              <IoCalendarOutline className="text-[#2E318D] text-md" />
              <p className="font-semibold">
                {content?.class_start_date} – {content?.class_end_date}
              </p>
            </div>
            <div className="flex gap-3 items-center flex-wrap">
              {classDates.map((date, index) => {
                const day = date
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .slice(0, 2)
                  .toUpperCase();
                const dayNum = date.getDate();
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-[#FAF8FE] py-1 border border-[#882CFB] rounded-md p-3"
                  >
                    <span className="text-xs font-semibold text-gray-600 border-b">
                      {day}
                    </span>
                    <span className="text-sm font-bold  text-gray-600">
                      {dayNum}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* <div className="flex items-center gap-2">
              <SlCalender className="text-[#2E318D] text-md" />
              <span className="text-gray-600">Program Duration :</span>
              <div className="flex gap-3 items-center">
                <p className="">
                  {totalClassDays === 1 ? "1 Day " : `${totalClassDays} Days `}
                </p>
              </div>
            </div> */}
            {/* <div className="flex items-center gap-2">
              <LuTvMinimal className="text-[#2E318D] text-md" />
              <span className="text-gray-600">Class Start Time :</span>
              <div className="flex gap-3 items-center">
                <p className="">{content?.class_start_time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IoIosTimer className="text-[#2E318D] text-md" />
              <span className="text-gray-600">Class End Time :</span>
              <div className="flex gap-3 items-center">
                <p className=""> {content?.class_end_time}</p>
              </div>
            </div> */}
            <div className="flex items-center gap-2 flex-wrap">
              <HiOutlineVideoCamera className="text-[#2E318D] text-md" />
              <span className="text-gray-600">Mode :</span>
              <span className="">Live Online Classroom</span>
            </div>

            {/* <div className="flex items-center flex-wrap gap-2">
              <FiHash className="text-gray-500 text-md" />
              <span className="text-gray-600">Schedule ID :</span>
              <span className="font-medium text-gray-800">
                {content?.course_schedule_id || "NA"}
              </span>
            </div> */}

            <div className="flex items-center gap-2">
              <FiGlobe className="text-[#2E318D] text-md" />
              <span className="text-gray-600">Language :</span>
              <span className="font-medium text-gray-800">
                {content?.class_language || "NA"}
              </span>
            </div>

            {(() => {
              let includes = [];
              try {
                includes = JSON.parse(content?.course_includes || "[]");
              } catch {
                includes = [];
              }
              if (
                !Array.isArray(includes) ||
                includes.filter(Boolean).length === 0
              ) {
                return null;
              }
              return (
                <div className="flex gap-2 flex-wrap items-center space-y-1 mt-2">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-[#2E318D] text-md" />
                    <span className="text-gray-600 font-medium">
                      Includes :
                    </span>
                  </div>

                  <div>
                    {includes.filter(Boolean).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="mt-2 ">
            <div className="border-t-2 border-b-2 border-dashed py-2 border-gray-300 bg-gray-50 px-2">
              <div className="flex justify-between">
                <p className="font-semibold text-lg">Learners</p>
                <div className="inline-flex border rounded-lg overflow-hidden mt-2">
                  <button
                    title="Decrement"
                    className="px-4 py-2 hover:bg-gray-300 border-r"
                    onClick={() => decrement(id)}
                  >
                    <GrFormSubtract />
                  </button>
                  <span className="px-6 py-2">{qty}</span>
                  <button
                    title="Increment"
                    className="px-4 py-2 hover:bg-gray-300 border-l cursor-pointer"
                    onClick={() => increment(id)}
                  >
                    <IoIosAdd />
                  </button>
                </div>
              </div>
              <div className="flex items-center flex-wrap gap-2 mt-2">
                <p className="text-2xl font-bold text-[#2E318D]">
                  {totalPrice.toLocaleString()} {content?.fee_currency}
                </p>
                {isDiscountActive &&
                  Number(String(content?.discount_amt || "").replace("%", "")) >
                  0 && (
                    <p className="line-through text-[#797979]">
                      {totalOriginal.toLocaleString()}
                    </p>
                  )}
                {isDiscountActive && totalSave > 0 && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className=" ">
              {/* Discount Info */}
              {isDiscountActive && totalSave > 0 && (
                <div className="flex flex-col gap-2 mt-3 text-sm">
                  {/* Save */}
                  {/* <div className="flex items-center gap-2">
                    <IoMdCheckmarkCircleOutline className="text-green-600 text-md" />
                    <span className="text-gray-600">You Save :</span>
                    <span className="font-semibold text-green-700">
                      {discountPercent}% ({totalSave.toLocaleString()})
                    </span>
                  </div> */}

                  {/* Discount End Date */}
                  <div className="flex items-center gap-2">
                    <IoTimeOutline className="text-red-500 text-md" />
                    <span className="text-gray-600">Offer Ends :</span>
                    <span className="font-medium text-gray-800">
                      {content?.discount_end_date || "NA"}
                    </span>
                  </div>

                  {/* Offer For */}
                  {offerFor && (
                    <div className="flex items-center gap-2">
                      <FiTag className="text-[#2E318D] text-md" />
                      <span className="text-gray-600">Offer For :</span>
                      <span className="">{offerFor || "NA"}</span>
                    </div>
                  )}
                  {/* Discount End Date */}
                  <div className="flex items-center gap-2">
                    <PiCalendarCheckLight className="text-red-500 text-sm" />
                    <span className="text-gray-600">Registration Ends :</span>
                    <span className=" ">
                      {getTimeLeft(content?.enroll_end_date)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Enroll Button */}
            <div className="">
              <button
                title={expired ? "Enrollment Closed" : "Checkout"}
                disabled={expired}
                onClick={() => {
                  if (expired) return;
                  setCheckoutData({
                    ...content,
                    quantity: qty,
                    url_title: url_title,
                    totalClassDays: totalClassDays,
                    active_country: active_country,
                  });
                  router.push("/order-summary/checkout");
                }}
                className={`relative overflow-hidden w-full px-5 py-2 rounded-full mt-4 flex gap-1 items-center justify-center ${expired
                  ? "bg-red-500 cursor-not-allowed text-white"
                  : "bg-[#882CFB] hover:bg-[#3c40c0] cursor-pointer text-white"
                  }`}
              >
                {expired ? "Enrollment Closed" : "Enroll Now"}
                {!expired && <HiOutlineArrowNarrowRight className="" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            title="View All Schedules"
            onClick={() => scrollToSection("Schedule Courses")}
            className="text-[#2E318D] hover:text-[#882CFB] font-semibold text-sm mt-3 cursor-pointer hover:underline flex gap-1 item-center justify-center"
          >
            View All Schedules
            <HiMiniArrowLongRight className="mt-1" />
          </button>
        </div>
      </div>
    );
  };

  // 3️⃣ Get the course for this month
  const courseThisMonth = getOneCourseSchedules();

  const [Recentblogs, setRecentBlogs] = useState([]);
  useEffect(() => {
    if (!token || Recentblogs.length > 0) return;
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

  const [citylist, setcitylist] = useState([]);
  useEffect(() => {
    if (!token) return;
    const cleanCountry =
      active_country
        ?.replace(/[^a-zA-Z]/g, "")
        ?.trim()
        ?.toUpperCase() || "IN";

    const cleanState =
      active_state
        ?.replace(/[^a-zA-Z ]/g, " ")
        ?.replace(/\s+/g, " ")
        ?.trim()
        ?.toLowerCase()
        ?.replace(/\b\w/g, (c) => c.toUpperCase()) || null;

    const cacheKey = `citylist_${cleanCountry}_${cleanState || "all"}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setcitylist(JSON.parse(cached));
        return;
      }
    } catch (e) {}

    const fetchcity = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.CITY_LIST}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            country_id: cleanCountry,
            state_id: cleanState || null,
          }),
        });
        if (res.status === 429 || !res.ok) {
          return;
        }
        const data = await res.json();
        const list = data?.data || [];
        setcitylist(list);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(list));
        } catch (e) {}
      } catch (err) {}
    };
    fetchcity();
  }, [token, active_country, active_state]);

  const [statelist, setstatelist] = useState([]);

  useEffect(() => {
    if (!token) return;
    const cleanCountry =
      active_country
        ?.replace(/[^a-zA-Z]/g, "")
        ?.trim()
        ?.toUpperCase() || "IN";

    const cleanState =
      active_state
        ?.replace(/[^a-zA-Z ]/g, " ")
        ?.replace(/\s+/g, " ")
        ?.trim()
        ?.toLowerCase()
        ?.replace(/\b\w/g, (c) => c.toUpperCase()) || null;

    const cacheKey = `statelist_${cleanCountry}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setstatelist(JSON.parse(cached));
        return;
      }
    } catch (e) {}

    const fetchstate = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.STATE_LIST}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            country_id: cleanCountry,
            state_id: cleanState || null,
          }),
        });
        if (res.status === 429 || !res.ok) {
          return;
        }
        const data = await res.json();
        const list = data?.data || [];
        setstatelist(list);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(list));
        } catch (e) {}
      } catch (err) {}
    };
    fetchstate();
  }, [token, active_country, active_state]);

  // --- STATE ----
  const [faq, setfaq] = useState([]);
  const [openIndex2, setOpenIndex2] = useState(null);
  const [pageByCategory, setPageByCategory] = useState({});
  useEffect(() => {
    if (!token || !courseData?.course_id) return;
    const cacheKey = `faq_${courseData.course_id}_${active_country || "in"}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setfaq(JSON.parse(cached));
        return;
      }
    } catch (e) {}

    const timeout = setTimeout(() => {
      const Faq = async () => {
        const cleanCountry =
          active_country
            ?.replace(/[^a-zA-Z]/g, "")
            ?.trim()
            ?.toLowerCase() || null;

        const cleanState =
          active_state
            ?.replace(/[^a-zA-Z ]/g, " ")
            ?.replace(/\s+/g, " ")
            ?.trim()
            ?.toLowerCase()
            ?.replace(/\b\w/g, (c) => c.toLowerCase()) || null;
        try {
          const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.FAQ_LIST}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              course_id: courseData.course_id,
              country_id: cleanCountry,
              state_id: cleanState,
            }),
          });
          if (res.status === 429 || !res.ok) {
            return;
          }
          const data = await res.json();
          const list = data?.data || [];
          setfaq(list);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(list));
          } catch (e) {}
        } catch (err) {
          console.error("Recent faq error:", err);
        }
      };
      Faq();
    }, 300);
    return () => clearTimeout(timeout);
  }, [token, active_country, active_state, courseData?.course_id]);
            setfaq([]);
            return;
          }
          const data = await res.json();
          setfaq(data?.data || []);
        } catch (err) {
          console.error("Error Recent faq:", err);
        }
      };
      Faq();
    }, 300);
    return () => clearTimeout(timeout);
  }, [token, active_country, active_state, courseData?.course_id]);

  const [allowDownload, setAllowDownload] = useState(false);
  useEffect(() => {
    const onReady = () => {
      const allowed = sessionStorage.getItem("curriculum_download");
      const time = sessionStorage.getItem("curriculum_time");
      if (!allowed || !time) return;
      if (Date.now() - Number(time) > 3000) {
        sessionStorage.removeItem("curriculum_download");
        sessionStorage.removeItem("curriculum_time");
        return;
      }
      triggerDownload();
    };
    window.addEventListener("curriculum-download-ready", onReady);
    return () => {
      window.removeEventListener("curriculum-download-ready", onReady);
    };
  }, []);
  const pdfRef = useRef(null);
  useEffect(() => {
    if (courseData?.coursePDF?.curriculum_pdf_name) {
      pdfRef.current = courseData?.coursePDF?.curriculum_pdf_name;
    }
  }, [courseData]);
  const triggerDownload = () => {
    if (!pdfRef.current) return;
    const link = document.createElement("a");
    link.href = `${API_BASE_URL}/assets/courseCurriculum/${pdfRef.current}.pdf`;
    link.download = "Curriculum.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    sessionStorage.removeItem("curriculum_download");
    sessionStorage.removeItem("curriculum_time");
    window.location.reload();
  };

  // ---- CATEGORY MAP ----
  const categoryMap = {
    4: "Career",
    5: "Benefits",
    6: "Duration",
    7: "Certifications",
    8: "Resources",
    9: "Training",
  };

  // ---- GROUPING ----
  const grouped = faq?.reduce((acc, item) => {
    const tabName = categoryMap[item.category_id];
    if (!tabName) return acc;
    if (!acc[tabName]) acc[tabName] = [];
    acc[tabName].push(item);
    return acc;
  }, {});

  // --- FIXED TAB CONTENT  -----
  const TabContent = ({ items, currentPage, onPageChange }) => {
    const itemsPerPage = 5;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);
    const nextPage = () =>
      currentPage < totalPages && onPageChange(currentPage + 1);
    const prevPage = () => currentPage > 1 && onPageChange(currentPage - 1);

    return (
      <div className="mt-8">
        {items?.length > 0 ? (
          <>
            {paginatedItems?.map((item, index) => (
              <div
                key={startIndex + index}
                className="bg-white border border-[#882CFB] rounded-lg shadow my-3"
              >
                <button
                  onClick={() =>
                    setOpenIndex2(
                      openIndex2 === startIndex + index
                        ? null
                        : startIndex + index,
                    )
                  }
                  className="w-full flex justify-between cursor-pointer items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors font-medium text-gray-800 border-b rounded-lg border-[#882CFB]"
                >
                  <span className="text-semibold">{item?.title}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform duration-300 ${openIndex2 === startIndex + index ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all  duration-300 ${openIndex2 === startIndex + index
                    ? "max-h-screen  px-4"
                    : "max-h-0"
                    }`}
                >
                  <div
                    className="text-gray-700 summernote-content"
                    dangerouslySetInnerHTML={{ __html: item?.description }}
                  />
                </div>
              </div>
            ))}
            <div className="flex gap-2 item-center justify-end mt-5">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2  border rounded-full bg-[#882CFB] text-white cursor-pointer hover:bg-[#4347ca] ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <IoIosArrowBack />
              </button>
              <span className="text-gray-700 font-semibold mt-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border rounded-full bg-[#882CFB] text-white cursor-pointer hover:bg-[#4347ca] ${currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
                  }`}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No data available.</p>
        )}
      </div>
    );
  };

  // --- BUILD TABS WITH PERSISTANT PAGINATION ----------------
  const pmpcertificatetabs = Object.keys(grouped).map((tabName) => ({
    label: tabName,
    content: (
      <TabContent
        items={grouped[tabName]}
        currentPage={pageByCategory[tabName] || 1}
        onPageChange={(newPage) =>
          setPageByCategory((prev) => ({ ...prev, [tabName]: newPage }))
        }
      />
    ),
  }));

  // FAQ JS CODE
  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const RESOURCE_CATEGORY_MAP = {
    239: "Blog",
    240: "Webinar",
    241: "Article",
    242: "Info",
  };
  const safeJsonParse = (val, fallback = {}) => {
    if (!val) return fallback;
    if (typeof val === "object") return val;
    try {
      return JSON.parse(val);
    } catch (e) {
      return fallback;
    }
  };

  const sanitizedHtml = (() => {
    const raw = courseData?.courseOverview?.course_overview;
    if (!raw) return "";
    try {
      let sanitized = DOMPurify.sanitize(raw);
      sanitized = sanitized
        .replace(
          /linear-gradient\(135deg,\s*#1e3a8a\s*0%,\s*#2563eb\s*100%\)/gi,
          "linear-gradient(135deg, #882CFB 0%, #6366F1 100%)"
        )
        .replace(
          /linear-gradient\([^)]*?(?:#1e3a8a|#2563eb|#1d4ed8|#2e318d)[^)]*?\)/gi,
          "linear-gradient(135deg, #882CFB 0%, #6366F1 100%)"
        )
        .replace(
          /(background(?:-color)?\s*:\s*)(?:#2563eb|#1d4ed8|#1e40af|#1e3a8a|#2e318d|#3b82f6|rgb\(\s*37\s*,\s*99\s*,\s*235\s*\)|rgb\(\s*29\s*,\s*78\s*,\s*216\s*\)|rgb\(\s*30\s*,\s*58\s*,\s*138\s*\)|rgb\(\s*46\s*,\s*49\s*,\s*141\s*\))/gi,
          "$1#882CFB"
        )
        .replace(/\bbg-blue-(?:500|600|700|800|900)\b/gi, "bg-[#882CFB]")
        .replace(/\btext-blue-(?:500|600|700|800)\b/gi, "text-[#882CFB]")
        .replace(/\bborder-blue-(?:500|600|700|800)\b/gi, "border-[#882CFB]");
      return sanitized;
    } catch (e) {
      return raw;
    }
  })();

  const highlights = safeJsonParse(
    courseData?.courseHeading?.course_highlights_in_pointers,
    []
  );

  const whychooseusdata1 = safeJsonParse(
    courseData?.courseWhyScholarAcad?.record_one,
    {}
  );
  const whychooseusdata2 = safeJsonParse(
    courseData?.courseWhyScholarAcad?.record_two,
    {}
  );
  const whychooseusdata3 = safeJsonParse(
    courseData?.courseWhyScholarAcad?.record_three,
    {}
  );
  const whychooseusdata4 = safeJsonParse(
    courseData?.courseWhyScholarAcad?.record_four,
    {}
  );
  const whychooseusdata5 = safeJsonParse(
    courseData?.courseWhyScholarAcad?.record_five,
    {}
  );
  const whychooseusdata6 = safeJsonParse(
    courseData?.courseWhyScholarAcad?.record_six,
    {}
  );
  const whychooseusdata7 = safeJsonParse(
    courseData?.courseWhyScholarAcad?.record_seven,
    {}
  );
  const whychooseusdata8 = safeJsonParse(
    courseData?.courseWhyScholarAcad?.record_eight,
    {}
  );
  const whychooseusdata9 = safeJsonParse(
    courseData?.courseWhyScholarAcad?.record_nine,
    {}
  );

  const parseRoadmapPoint = (val) => {
    try {
      const obj = typeof val === "string" ? JSON.parse(val) : val;
      const heading = obj?.heading?.trim();
      return heading && heading !== "NA" && heading !== "Na" && heading.toLowerCase() !== "no details available" ? obj : null;
    } catch (e) {
      return null;
    }
  };

  const hasRoadmap = Boolean(
    courseData?.certificationPath && (
      parseRoadmapPoint(courseData.certificationPath.pointer_one) ||
      parseRoadmapPoint(courseData.certificationPath.pointer_two) ||
      parseRoadmapPoint(courseData.certificationPath.pointer_three) ||
      parseRoadmapPoint(courseData.certificationPath.pointer_four) ||
      parseRoadmapPoint(courseData.certificationPath.pointer_five) ||
      parseRoadmapPoint(courseData.certificationPath.pointer_six) ||
      parseRoadmapPoint(courseData.certificationPath.pointer_seven)
    )
  );

  const parseLearningObjective = (val) => {
    try {
      const obj = typeof val === "string" ? JSON.parse(val) : val;
      const heading = obj?.heading?.trim();
      if (!heading || heading === "NA" || heading === "Na" || heading.toLowerCase() === "no details available") {
        return null;
      }
      return {
        heading: heading,
        description: obj?.description && obj.description !== "NA" && obj.description !== "Na" ? obj.description : ""
      };
    } catch (e) {
      return null;
    }
  };

  const learningObjectivesList = [
    { data: parseLearningObjective(courseData?.courseLearningObjectives?.record_one), num: "01", color: "#F87C56" },
    { data: parseLearningObjective(courseData?.courseLearningObjectives?.record_two), num: "02", color: "#FECF65" },
    { data: parseLearningObjective(courseData?.courseLearningObjectives?.record_three), num: "03", color: "#FF9A9A" },
    { data: parseLearningObjective(courseData?.courseLearningObjectives?.record_four), num: "04", color: "#7FB77E" },
    { data: parseLearningObjective(courseData?.courseLearningObjectives?.record_five), num: "05", color: "#A4B7F1" },
    { data: parseLearningObjective(courseData?.courseLearningObjectives?.record_six), num: "06", color: "#F7A9F2" },
  ].filter((item) => Boolean(item.data));

  //   const parseAndDecode = (data, fallback = "{}") => {
  //   try {
  //     const parsed = JSON.parse(data || fallback);

  //     const decodeUnicode = (str) =>
  //       typeof str === "string"
  //         ? str.replace(/\\u[\dA-F]{4}/gi, (m) =>
  //             String.fromCharCode(parseInt(m.slice(2), 16))
  //           )
  //         : str;

  //     if (typeof parsed === "object") {
  //       Object.keys(parsed).forEach((key) => {
  //         parsed[key] = decodeUnicode(parsed[key]);
  //       });
  //     }

  //     return parsed;
  //   } catch {
  //     return {};
  //   }
  // };

  // const whychooseusdata1 = parseAndDecode(courseData?.courseWhyScholarAcad?.record_one);
  // const whychooseusdata2 = parseAndDecode(courseData?.courseWhyScholarAcad?.record_two);
  // const whychooseusdata3 = parseAndDecode(courseData?.courseWhyScholarAcad?.record_three);
  // const whychooseusdata4 = parseAndDecode(courseData?.courseWhyScholarAcad?.record_four);
  // const whychooseusdata5 = parseAndDecode(courseData?.courseWhyScholarAcad?.record_five);
  // const whychooseusdata6 = parseAndDecode(courseData?.courseWhyScholarAcad?.record_six);
  // const whychooseusdata7 = parseAndDecode(courseData?.courseWhyScholarAcad?.record_seven);
  // const whychooseusdata8 = parseAndDecode(courseData?.courseWhyScholarAcad?.record_eight);
  // const whychooseusdata9 = parseAndDecode(courseData?.courseWhyScholarAcad?.record_nine);

  let raw = courseData?.certificateEligibility?.eligibility_pointers || "[]";
  raw = raw
    .replace(/[\u0000-\u001F]+/g, "")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");

  let certificatelist = [];
  try {
    certificatelist = JSON.parse(raw);
  } catch (e) {
    console.error("JSON Parse Error", e);
    certificatelist = [];
  }

  //  Parse salary JSON
  // const parseSalary = (value) => {
  //   if (!value) return { min: 0, avg: 0, max: 0 };
  //   let obj;
  //   try {
  //     obj = typeof value === "string" ? JSON.parse(value) : value;
  //   } catch (err) {
  //     console.error("Invalid salary JSON:", value);
  //     return { min: 0, avg: 0, max: 0 };
  //   }
  //   const clean = (v) => {
  //     if (!v) return 0;
  //     const num = parseFloat(v);
  //     const unit = v.toUpperCase();
  //     if (unit.includes("L")) return num * 100;
  //     if (unit.includes("K")) return num;
  //     return num;
  //   };
  //   return {
  //     min: clean(obj.min),
  //     avg: clean(obj.avg),
  //     max: clean(obj.max),
  //   };
  // };

  // const salary = courseData?.courseSalary?.[0];
  // const s1 = parseSalary(salary?.position_one_salary);
  // const s2 = parseSalary(salary?.position_two_salary);
  // const s3 = parseSalary(salary?.position_three_salary);
  // const chartData = salary
  //   ? [
  //       {
  //         name: salary.position_one_name,
  //         bar1: s1.min,
  //         bar2: s1.avg,
  //         bar3: s1.max,
  //       },
  //       {
  //         name: salary.position_two_name,
  //         bar1: s2.min,
  //         bar2: s2.avg,
  //         bar3: s2.max,
  //       },
  //       {
  //         name: salary.position_three_name,
  //         bar1: s3.min,
  //         bar2: s3.avg,
  //         bar3: s3.max,
  //       },
  //     ]
  //   : [];
  // const selected = s1;
  // const minK = selected.min * 100;
  // const avgK = selected.avg * 100;
  // const maxK = selected.max * 100;
  // const wMin = (minK / maxK) * 100;
  // const wAvg = (avgK / maxK) * 100;
  // const wMax = 100;

  const parseSalary = (value) => {
    if (!value) {
      return {
        min: { num: 0, label: "" },
        avg: { num: 0, label: "" },
        max: { num: 0, label: "" },
      };
    }

    let obj;
    try {
      obj = typeof value === "string" ? JSON.parse(value) : value;
    } catch {
      return {
        min: { num: 0, label: "" },
        avg: { num: 0, label: "" },
        max: { num: 0, label: "" },
      };
    }

    const extract = (v) => {
      if (!v) return { num: 0, label: "" };
      return {
        num: parseFloat(v),
        label: v.toString().trim(),
      };
    };

    return {
      min: extract(obj.min),
      avg: extract(obj.avg),
      max: extract(obj.max),
    };
  };
  const salary = courseData?.courseSalary?.[0];

  const s1 = parseSalary(salary?.position_one_salary);
  const s2 = parseSalary(salary?.position_two_salary);
  const s3 = parseSalary(salary?.position_three_salary);

  const chartData = salary
    ? [
      {
        name: salary.position_one_name,
        min: s1.min.num,
        avg: s1.avg.num,
        max: s1.max.num,
        minLabel: s1.min.label,
        avgLabel: s1.avg.label,
        maxLabel: s1.max.label,
      },
      {
        name: salary.position_two_name,
        min: s2.min.num,
        avg: s2.avg.num,
        max: s2.max.num,
        minLabel: s2.min.label,
        avgLabel: s2.avg.label,
        maxLabel: s2.max.label,
      },
      {
        name: salary.position_three_name,
        min: s3.min.num,
        avg: s3.avg.num,
        max: s3.max.num,
        minLabel: s3.min.label,
        avgLabel: s3.avg.label,
        maxLabel: s3.max.label,
      },
    ]
    : [];

  const pointers = courseData?.whatyoulearn?.pointers
    ? JSON.parse(courseData.whatyoulearn.pointers)
    : [];

  // const pointers = courseData?.whatyoulearn?.pointers
  // ? JSON.parse(courseData?.whatyoulearn?.pointers).map(t =>
  //     t.replace(/\\u[\dA-F]{4}/gi, m =>
  //       String.fromCharCode(parseInt(m.slice(2), 16))
  //     )
  //   )
  // : [];

  const styles = [
    {
      icon: <BsCheck2Circle />,
      iconBg: "bg-sky-300",
      contentBg: "bg-sky-100",
    },
    {
      icon: <BsCheck2Circle />,
      iconBg: "bg-green-300",
      contentBg: "bg-green-100",
    },
    {
      icon: <BsCheck2Circle />,
      iconBg: "bg-purple-300",
      contentBg: "bg-purple-100",
    },
    {
      icon: <BsCheck2Circle />,
      iconBg: "bg-purple-300", contentBg: "bg-purple-100",
    },
  ];
  const rating = courseData?.ratings?.[0];
  function ChevronItem({ item }) {
    return (
      <div className="flex items-stretch overflow-hidden ">
        <div
          className={`${item?.iconBg} w-24 flex items-center justify-center text-white text-xl `}
        >
          {item?.icon}
        </div>

        <div
          className={`${item?.contentBg} flex items-center px-5 py-3 text-gray-700 font-medium w-full clip-chevron-right`}
        >
          {item?.text}
        </div>
      </div>
    );
  }

  const courseHeadingData =
    courseData?.dynamicCourseHeading ||
    courseData?.courseHeading ||
    {};

  const courseTitle =
    courseHeadingData?.meta_title ||
    courseHeadingData?.heading ||
    courseHeadingData?.title ||
    courseData?.course_title ||
    (url_title
      ? url_title
          .split("-")
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join(" ")
      : "Course Details");

  const courseDescription =
    courseHeadingData?.metaDescription ||
    courseHeadingData?.meta_description ||
    courseHeadingData?.description ||
    courseData?.courseDescription?.description ||
    courseData?.short_description ||
    courseData?.overview ||
    "";

  const courseKeywords =
    courseHeadingData?.meta_keywords ||
    courseData?.meta_keywords ||
    null;

  const firstSchedule =
    Array.isArray(courseData?.courseSchedule) &&
    courseData.courseSchedule.length > 0
      ? courseData.courseSchedule[0]
      : null;

  const coursePricing = useMemo(() => {
    if (!firstSchedule) return null;
    const baseFee = parseFloat(
      firstSchedule?.course_fees ??
        firstSchedule?.discounted_price ??
        firstSchedule?.fee_amount ??
        0
    );
    const discountPct = parseFloat(firstSchedule?.discount_amt ?? 0);
    const calculatedAmount =
      baseFee > 0 && discountPct > 0 && discountPct < 100
        ? Math.round(baseFee * (1 - discountPct / 100))
        : Math.round(baseFee || 0);

    return {
      amount: calculatedAmount,
      currency:
        firstSchedule?.currency_type ||
        firstSchedule?.fee_currency ||
        "INR",
    };
  }, [firstSchedule]);

  const courseImagePath =
    courseHeadingData?.image ||
    courseData?.courseHeading?.image ||
    courseData?.header_image ||
    courseData?.course_image ||
    null;

  const courseImageUrl = courseImagePath
    ? /^https?:\/\//i.test(courseImagePath)
      ? courseImagePath
      : `${API_BASE_URL.replace(/\/+$/, "")}/${String(
          courseImagePath
        ).replace(/^\/+/, "")}`
    : null;

  const courseSchema = useMemo(() => {
    if (!courseData && !url_title) return null;

    const mergedFaqs = [
      ...(Array.isArray(courseData?.CourseFaqs) ? courseData.CourseFaqs : []),
      ...(Array.isArray(courseData?.courseCurriculumFAQ)
        ? courseData.courseCurriculumFAQ
        : []),
      ...(Array.isArray(faq) ? faq : []),
    ];

    return (
      courseData?.schema ||
      courseData?.course?.schema ||
      generateCourseSchema({
        courseName: courseTitle,
        courseDescription,
        courseUrl: router.asPath || `/${url_title || ""}`,
        imageUrl: courseImageUrl,
        breadcrumbs: [
          { name: "Home", url: "/" },
          { name: "All Courses", url: "/all-courses" },
          {
            name: courseTitle,
            url: `/${url_title || ""}`,
          },
        ],
        faqs: mergedFaqs,
        reviews: Array.isArray(testimonialList) ? testimonialList : [],
        ratings: courseData?.ratings?.[0] || courseData?.ratings || null,
        pricing: coursePricing,
        schedules: Array.isArray(courseData?.courseSchedule)
          ? courseData.courseSchedule
          : [],
        courseCode: url_title,
        keywords: courseKeywords,
        courseData,
      })
    );
  }, [
    courseData,
    url_title,
    router.asPath,
    courseTitle,
    courseDescription,
    courseImageUrl,
    faq,
    testimonialList,
    coursePricing,
    courseKeywords,
  ]);

  if (isQuestionsScreen) {
    return (
      <DedicatedQuizQuestionsPage
        courseSlug={url_title}
        quizSlug={quiz_slug}
        initialData={courseData?.questions ? courseData : null}
        loading={loading}
        active_country={active_country}
        url_title={url_title}
      />
    );
  }

  if (isQuizDetail) {
    return (
      <DedicatedQuizDetailPage
        courseSlug={url_title}
        quizSlug={quiz_slug}
        initialQuizData={courseData?.quiz ? courseData : null}
        loading={loading}
        active_country={active_country}
        url_title={url_title}
      />
    );
  }

  if (isQuizzes) {
    return (
      <DedicatedQuizzesPage
        courseSlug={url_title}
        initialQuizzes={
          Array.isArray(courseData?.data)
            ? courseData.data
            : Array.isArray(courseData)
            ? courseData
            : null
        }
        courseData={courseData?.course || courseData}
        loading={loading}
        active_country={active_country}
        url_title={url_title}
      />
    );
  }

  if (isSupportPage && !isNotes) {
    return (
      <DedicatedSyllabusPage
        courseData={courseData}
        loading={loading}
        active_country={active_country}
        url_title={url_title}
        pageType={matchedSupportPage}
      />
    );
  }

  if (isNotes) {
    return (
      <DedicatedNotesPage
        courseData={courseData}
        loading={loading}
        active_country={active_country}
        url_title={url_title}
      />
    );
  }


  return (
    <>
      <DynamicSEO
        title={`${courseTitle} | ScholarAcad`}
        description={
          courseDescription ||
          `Learn ${courseTitle} with ScholarAcad professional certification training.`
        }
        canonicalUrl={router.asPath}
        keywords={courseKeywords}
        ogType="website"
        ogImage={courseImageUrl || undefined}
        schemaData={courseSchema}
        robots="index, follow"
      />
      <Navbar />
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white  rounded-xl shadow-lg w-96 text-center">
            <div className="flex justify-end p-2">
              <button
                title="Close"
                onClick={handleClose}
                className=" cursor-pointer text-xl text-gray-500 "
              >
                <IoClose />
              </button>
            </div>
            <div className="p-4 space-y-2 mb-2">
              <h2 className="text-xl font-semibold  text-red-600">
                Invalid URL
              </h2>
              <p className="text-gray-600">
                The requested source is not available.
              </p>
              {/* <p className="text-gray-600">
              URL can only contain 3 segments:
              <br />
              <span className="font-medium">/country/course/city</span>
            </p> */}
            </div>
          </div>
        </div>
      )}
      {error ? (
        <>
          <div className="flex items-center justify-center min-h-[80vh] bg-red-50 max-sm:p-3">
            <div className="text-center bg-white border border-red-200 rounded-2xl p-8 md:max-w-[40%] w-full shadow-sm">
              {/* <div className="flex justify-center mb-4">
              <IoWarningOutline className="text-red-600 text-6xl" />
            </div> */}
              <h2 className="md:text-6xl text-4xl font-bold text-red-700 mb-2">
                404
              </h2>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Page Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                Sorry, the page you’re looking for doesn’t exist or has been
                moved.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:gap-4 gap-2">
                <Link
                  href="/"
                  className="flex items-center gap-2 bg-[#882CFB] hover:bg-[#1f236a] transition text-white px-6 py-2 rounded-full text-sm"
                >
                  <IoHomeOutline className="text-lg" />
                  Go Back Home
                </Link>
                <Link
                  href="/all-courses"
                  className="flex items-center gap-2 bg-[#178bbd] hover:bg-[#0f6e95] transition text-white px-6 py-2 rounded-full text-sm"
                >
                  <IoBookOutline className="text-lg" />
                  Browse Courses
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : !courseData ? (
        <div>Loading...</div>
      ) : courseData?.length === 0 ? (
        <div className="flex items-center justify-center h-[80vh] bg-red-50">
          <div className="text-center bg-white border border-red-200  rounded-xl p-8 md:max-w-[40%] w-full">
            No data available for the selected course, country, or state.
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-5">
              <Link
                href="/"
                className="flex items-center gap-2 bg-[#882CFB] hover:bg-[#1f236a] transition text-white px-6 py-2 rounded-full text-sm"
              >
                <IoHomeOutline className="text-lg" />
                Go Back Home
              </Link>
              <Link
                href="/all-courses"
                className="flex items-center gap-2 text-sm bg-[#178bbd] hover:bg-[#0f6e95] transition text-white px-6 py-2 rounded-full"
              >
                <IoBookOutline className="text-lg" />
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full bg-white sticky top-[70px] z-30 border-b border-gray-200 max-sm:hidden ">
            {/*  Top Tabs Navbar */}
            <div className="max-w-7xl mx-auto bg-white   flex  ">
              <button
                onClick={() => scrollToSection("Course Highlights")}
                className={`px-6 py-3 border-b-2 transition cursor-pointer 
              ${activeId === "Course Highlights"
                    ? "border-purple-600 text-purple-600 font-semibold text-xs"
                    : "border-transparent hover:text-purple-600 text-xs"
                  }
            `}
              >
                Course Highlights
              </button>
              {courseData?.allHeadline?.program_overview && (
                <button
                  onClick={() => scrollToSection("Course overview")}
                  className={`px-6 py-3 border-b-2 transition cursor-pointer 
              ${activeId === "Course overview"
                      ? "border-purple-600 text-purple-600 font-semibold text-xs"
                      : "border-transparent hover:text-purple-600 text-xs"
                    }
            `}
                >
                  Course Overview
                </button>
              )}

              {Boolean(
                courseData?.keyfeatures?.record_one ||
                  courseData?.keyfeatures?.record_two ||
                  courseData?.keyfeatures?.record_three ||
                  courseData?.keyfeatures?.record_four ||
                  courseData?.keyfeatures?.record_five ||
                  courseData?.keyfeatures?.record_six ||
                  courseData?.keyfeatures?.read_more
              ) && (
                <button
                  onClick={() => scrollToSection("Key Features")}
                  className={`px-6 py-3 border-b-2 transition cursor-pointer 
              ${activeId === "Key Features"
                      ? "border-purple-600 text-purple-600 font-semibold text-xs"
                      : "border-transparent hover:text-purple-600 text-xs"
                    }
            `}
                >
                  Key Features
                </button>
              )}

              {Boolean(
                whychooseusdata1?.heading ||
                  whychooseusdata2?.heading ||
                  whychooseusdata3?.heading ||
                  whychooseusdata4?.heading
              ) && (
                <button
                  onClick={() => scrollToSection("Why Choose Us")}
                  className={`px-6 py-3 border-b-2 transition cursor-pointer 
              ${activeId === "Why Choose Us"
                      ? "border-purple-600 text-purple-600 font-semibold text-xs"
                      : "border-transparent hover:text-purple-600 text-xs"
                    }
            `}
                >
                  Why Choose Us
                </button>
              )}

              {Boolean(
                courseData?.allHeadline?.new_learning_objectives &&
                  (courseData?.whatyoulearn?.description ||
                    (Array.isArray(pointers) && pointers.length > 0))
              ) && (
                <button
                  onClick={() => scrollToSection("What You’ll Learn")}
                  className={`px-6 py-3 border-b-2 transition cursor-pointer 
              ${activeId === "What You’ll Learn"
                      ? "border-purple-600 text-purple-600 font-semibold text-xs"
                      : "border-transparent hover:text-purple-600 text-xs"
                    }
            `}
                >
                  What You’ll Learn
                </button>
              )}
              {Array.isArray(courseData?.coursePrice) &&
                courseData.coursePrice.length > 0 && (
                  <button
                    onClick={() => scrollToSection("Training Options")}
                    className={`px-6 py-3 border-b-2 transition cursor-pointer 
                  ${activeId === "Training Options"
                        ? "border-purple-600 text-purple-600 font-semibold text-xs"
                        : "border-transparent hover:text-purple-600 text-xs"
                      }
                `}
                  >
                    Training Options
                  </button>
                )}
              <button
                onClick={() => scrollToSection("Contact")}
                className={`px-6 py-3 border-b-2 transition cursor-pointer 
              ${activeId === "Contact"
                    ? "border-purple-600 text-purple-600 font-semibold text-xs"
                    : "border-transparent hover:text-purple-600 text-xs"
                  }
            `}
              >
                Contact
              </button>
              {courseData?.courseSchedule?.length > 0 && (
                <button
                  onClick={() => scrollToSection("Schedule Courses")}
                  className={`px-6 py-3 border-b-2 transition cursor-pointer 
              ${activeId === "Schedule Courses"
                      ? "border-purple-600 text-purple-600 font-semibold text-xs"
                      : "border-transparent hover:text-purple-600 text-xs"
                    }
            `}
                >
                  Schedule Courses
                </button>
              )}
              {hasRoadmap && (
                <button
                  onClick={() => scrollToSection("MSP Roadmap")}
                  className={`px-6 py-3 border-b-2 transition cursor-pointer 
                ${activeId === "MSP Roadmap"
                      ? "border-purple-600 text-purple-600 font-semibold text-xs"
                      : "border-transparent hover:text-purple-600 text-xs"
                    }
              `}
                >
                  Roadmap
                </button>
              )}
              {courseData?.courseCurriculumFAQ?.length > 0 && (
                <button
                  onClick={() => scrollToSection("FAQs")}
                  className={`px-6 py-3 border-b-2 transition cursor-pointer 
                  ${activeId === "FAQs"
                      ? "border-purple-600 text-purple-600 font-semibold text-xs"
                      : "border-transparent hover:text-purple-600 text-xs"
                    }
                `}
                >
                  FAQs
                </button>
              )}
            </div>
          </div>
          <section className="font-nunito bg-white ">
            {/*Herosection */}
            <section
              id="Course Highlights"
              className="herosection_section max-sm:p-3"
            >
              <div className="md:max-w-7xl mx-auto my-5 ">
                {/* Breadcrumb */}
                <nav
                  className="flex items-center flex-wrap gap-2 text-sm text-gray-600 font-medium "
                  aria-label="Breadcrumb"
                >
                  <Link
                    href="/"
                    className="flex items-center gap-1 hover:text-[#882CFB] transition"
                  >
                    <AiTwotoneHome className="text-[#2E318D]" />
                    Home
                  </Link>
                  <FaAngleRight className="text-gray-400" />
                  <Link
                    href="/all-courses"
                    className="hover:text-[#882CFB] transition"
                  >
                    Courses
                  </Link>
                  <FaAngleRight className="text-gray-400" />
                  <span className="text-[#2E318D] font-semibold cursor-not-allowed">
                    {url_title
                      ?.replace(/-/g, " ")
                      ?.replace(/\s+/g, " ")
                      ?.trim()
                      ?.replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                </nav>
              </div>
              <div className="max-w-7xl mx-auto  my-5 grid lg:grid-cols-2  items-start z-10 ">
                <div className="relative w-full max-w-[550px] border border-gray-200/90 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all overflow-hidden min-h-[240px] flex items-center justify-center p-3 group">
                  <img
                    src={normalizeImageUrl(
                      courseData?.header_image ||
                      courseData?.course?.header_image ||
                      courseData?.courseImage?.banner_image_path ||
                      courseData?.certificationImage?.image_path ||
                      courseData?.dynamicCourseHeading?.header_image,
                      url_title && url_title.toLowerCase().includes('prince2')
                        ? '/assets/img/prince2.jpg'
                        : '/assets/landingpage/courses/course1.jpg'
                    )}
                    alt={courseData?.courseHeading?.title || courseData?.course_title || courseData?.course?.course_title || "Course Image"}
                    onError={(e) => {
                      e.currentTarget.src =
                        url_title && url_title.toLowerCase().includes('prince2')
                          ? '/assets/img/prince2.jpg'
                          : '/assets/landingpage/courses/course1.jpg';
                    }}
                    className="
                      rounded-xl w-full h-auto max-h-[320px] object-contain
                      transition-transform duration-500 group-hover:scale-105
                    "
                  />
                </div>

                <div className="max-sm:mt-6">
                  {(() => {
                    const resolvedTitle =
                      courseData?.dynamicCourseHeading?.hone_tag ||
                      courseData?.dynamicCourseHeading?.heading ||
                      courseData?.courseHeading?.title ||
                      courseData?.courseHeading?.name ||
                      courseData?.course?.name ||
                      (url_title ? url_title.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Course");

                    const resolvedDescription =
                      courseData?.courseHeading?.course_description ||
                      courseData?.dynamicCourseHeading?.description ||
                      courseData?.course?.description ||
                      "";

                    return (
                      <>
                        <h1
                          title={resolvedTitle}
                          className="heading"
                        >
                          {resolvedTitle.length > 200
                            ? resolvedTitle.slice(0, 200) + "..."
                            : resolvedTitle}
                        </h1>
                        {resolvedDescription && resolvedDescription !== "Na" ? (
                          <h2 className="mt-4 Sub_heading_black">
                            {resolvedDescription.length > 200
                              ? resolvedDescription.slice(0, 200) + "..."
                              : resolvedDescription}
                          </h2>
                        ) : null}
                      </>
                    );
                  })()}

                  {/* Ratings Section */}
                  <div className="flex items-center flex-wrap gap-4 mt-5">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-lg">
                        <FcGoogle />
                        <FaStar className="text-yellow-400" />
                        <span className="text-black">{rating?.googleRating ?? "5.0"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-lg text-[#1877F2]">
                        <IoLogoFacebook />
                        <FaStar className="text-yellow-400" />
                        <span className="text-black"> {rating?.facebook ?? "5.0"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-lg text-[#E1306C]">
                        <FaSquareInstagram />
                        <FaStar className="text-yellow-400" />
                        <span className="text-black">  {rating?.installgram ?? "5.0"}</span>
                      </div>
                    </div>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <span className="text-lg text-[#ACACAC] whitespace-nowrap">
                      {rating?.enrolled ?? "6000+ Enrolled"}
                    </span>
                  </div>
                  <span className="flex gap-2 items-center mt-2">
                    <div className="para">
                      {highlights?.map((point, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-[20px_1fr] gap-3 items-start mt-4"
                        >
                          <FaCheckSquare className="text-[#2E318D] mt-1" />
                          <p className="para">{point}</p>
                        </div>
                      ))}
                    </div>
                  </span>

                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={() => scrollToSection("Contact")}
                      className="relative group border-none bg-transparent p-0  cursor-pointer  "
                    >
                      <div className="btn_primary ">
                        <span className="select-none">Contact Advisor</span>
                        <HiMiniArrowLongRight />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div
              className={` max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[25%_75%]  gap-3 transition-all duration-500`}
            >
              {/* LEFT SECTION */}
              {!collapsed && (
                <>
                  <div
                    className="leftsection mt-5 sticky grid grid-cols-1 gap-3 top-[120px] h-fit  bg-white max-sm:hidden
              "
                  >
                    {courseData?.courseSchedule?.length > 0 && (
                      <>
                        <div className="">
                          {renderSingleScheduleCard(courseThisMonth)}
                        </div>
                        <div className="relative  rounded-md  bg-[#f4e7cb]  overflow-hidden group ">
                          {/* <img
                          src="/assets/landingpage/schedule_courses_bg.svg"
                          className="absolute inset-0 w-full h-full object-cover"
                          alt="Course Schedule"
                        /> */}
                          {/* <div className="absolute inset-0 bg-black/10"></div> */}
                          {/* <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                            <h2 className="text-lg font-bold text-black">
                              COURSE SCHEDULE
                            </h2>

                            <ul className=" text-md  space-y-1 mt-2">
                              <li className="list-disc ml-4">
                                Wide range of Training dates
                              </li>
                              <li className="list-disc ml-4">
                                Impactful Instructor-Led training
                              </li>
                            </ul>
                            <button
                              onClick={() =>
                                scrollToSection("Schedule Courses")
                              }
                              className=" border-2 border-white cursor-pointer mt-4 px-6 py-2 bg-[#2E318D] text-white rounded-full flex items-center justify-center gap-1 hover:bg-[#4347ca] duration-300 shadow-md "
                            >
                              View Schedule <HiMiniArrowLongRight />
                            </button>
                          </div> */}
                        </div>
                      </>
                    )}
                    <div class="relative h-46 rounded-md border bg-[#F5DFD0] border-gray-300 overflow-hidden group ">
                      {/* <img
                      src="/assets/landingpage/coorporate_trainning_bg.svg"
                      className="absolute inset-0 w-full h-full object-cover"
                      alt="Corporate Training"
                    /> */}
                      {/* <div className="absolute inset-0 bg-black/10"></div> */}

                      <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                        <h2 className="text-lg font-bold text-black">
                          CORPORATE TRAINING
                        </h2>

                        <ul className=" text-md  space-y-1 mt-2">
                          <li className="list-disc ml-4">
                            Wide range of Training dates
                          </li>
                          <li className="list-disc ml-4">
                            Impactful Instructor-Led training
                          </li>
                        </ul>

                        <button
                          type="button"
                          onClick={() => scrollToSection("Contact")}
                          className=" border-2 border-white cursor-pointer mt-4 px-6 py-2 bg-[#882CFB] text-white rounded-full flex items-center justify-center gap-1 hover:bg-[#4347ca] duration-300 shadow-md"
                        >
                          Contact For Training <HiMiniArrowLongRight />
                        </button>
                      </div>
                    </div>

                    <div className="relative h-46 bg-[#E1F3F0] rounded-md border border-gray-300 overflow-hidden group">
                      {/* <img
                      src="/assets/landingpage/trending_courses_bg.svg"
                      className="absolute inset-0 w-full h-full object-cover"
                      alt="Trending Courses"
                    /> */}
                      {/* <div className="absolute inset-0 bg-black/10"></div> */}
                      <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                        <h2 className="text-lg font-bold text-black">
                          TRENDING COURSES
                        </h2>
                        <ul className=" text-md   space-y-1 mt-2">
                          <li className="list-disc ml-4">
                            Wide range of Training courses
                          </li>
                          <li className="list-disc ml-4">
                            Impactful Instructor-Led training
                          </li>
                        </ul>
                        <Link
                          href="/all-courses"
                          className=" border-2 border-white cursor-pointer mt-4 px-6 py-2 bg-[#882CFB] text-white rounded-full flex items-center justify-center gap-1 hover:bg-[#4347ca] duration-300 shadow-md"
                        >
                          View Courses <HiMiniArrowLongRight />
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className={`Rightsection  `}>
                {/* Course Overview Section */}
                <section className="">
                  {courseData?.allHeadline?.program_overview &&
                    courseData?.courseOverview?.course_overview && (
                      <div id="Course overview" className="py-5 max-sm:p-3">
                        <div className=" md:p-5 p-3 bg-[#EDE3FF] rounded-md border border-gray-300 ">
                          <h2 className="heading">
                            {courseData?.allHeadline?.program_overview}
                          </h2>
                          <div
                            className="summernote-content prose max-w-none mt-3 text-[#554E4E]"
                            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                          ></div>
                        </div>
                      </div>
                    )}
                </section>
                {/* Key Features Section */}
                {(() => {
                  const validKeyFeatures = [
                    { text: courseData?.keyfeatures?.record_one, icon: "/assets/landingpage/keyfeature/keyfeature_icon1.svg" },
                    { text: courseData?.keyfeatures?.record_two, icon: "/assets/landingpage/keyfeature/keyfeature_icon2.svg" },
                    { text: courseData?.keyfeatures?.record_three, icon: "/assets/landingpage/keyfeature/keyfeature_icon3.svg" },
                    { text: courseData?.keyfeatures?.record_four, icon: "/assets/landingpage/keyfeature/keyfeature_icon4.svg" },
                    { text: courseData?.keyfeatures?.record_five, icon: "/assets/landingpage/keyfeature/keyfeature_icon5.svg" },
                    { text: courseData?.keyfeatures?.record_six, icon: "/assets/landingpage/keyfeature/keyfeature_icon6.svg" },
                  ].filter(
                    (item) =>
                      item.text &&
                      typeof item.text === "string" &&
                      item.text.trim() !== "" &&
                      item.text.trim().toLowerCase() !== "na" &&
                      item.text.trim().toLowerCase() !== "no data"
                  );

                  const hasValidReadMore = (() => {
                    const raw = courseData?.keyfeatures?.read_more;
                    if (!raw || typeof raw !== "string") return false;
                    const stripped = raw.replace(/<[^>]*>/g, "").trim().toLowerCase();
                    return (
                      stripped !== "" &&
                      stripped !== "no data" &&
                      stripped !== "na" &&
                      stripped !== "&nbsp;"
                    );
                  })();

                  if (validKeyFeatures.length === 0 && !hasValidReadMore) {
                    return null;
                  }

                  return (
                    <section id="Key Features" className="bg-white py-5 max-sm:p-3">
                      <div>
                        {courseData?.allHeadline?.training_highlights && (
                          <div className="flex justify-center items-center flex-col">
                            <h2 className="heading max-w-[80%] m-auto text-center">
                              {courseData.allHeadline.training_highlights}
                            </h2>
                          </div>
                        )}

                        {validKeyFeatures.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            {validKeyFeatures.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-start flex-col justify-center rounded"
                              >
                                <img
                                  src={item.icon}
                                  alt="Keyfeature"
                                  className="h-12 w-auto object-contain"
                                />
                                <p className="text-start p-3 font-bold text-[#535353] text-[15px]">
                                  {item.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {hasValidReadMore && (
                        <div className="mt-4">
                          <div className="flex justify-center">
                            <button
                              title="Read More"
                              onClick={() => keyfeaturesetIsOpen(!keyfeatureisOpen)}
                              className="text-purple-600 font-semibold cursor-pointer hover:text-purple-800 transition text-sm"
                            >
                              {keyfeatureisOpen ? "Read Less" : "Read More"}
                            </button>
                          </div>

                          <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                              keyfeatureisOpen
                                ? "max-h-full opacity-100 mt-3"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="bg-[#FAF8FE] p-4 border rounded-xl border-purple-100">
                              <div
                                className="summernote-content text-sm text-gray-700"
                                dangerouslySetInnerHTML={{
                                  __html: courseData.keyfeatures.read_more,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </section>
                  );
                })()}
                {courseFaq?.length > 0 && (
                  <section
                    className="bg-[#FAF8FE] border border-purple-100 rounded-2xl p-5"
                  >
                    <h2 className="heading max-w-[80%] m-auto text-center">
                      Course FAQs
                    </h2>

                    <div className="w-full grid grid-cols-1 gap-2 mt-4">
                      {visibleCourseFaq?.map((faq, i) => (
                        <div
                          key={i}
                          className={`rounded-lg border border-gray-300 transition-all duration-500 ease-in-out self-start ${openIndex === i
                            ? "bg-white text-gray-800"
                            : "bg-white text-gray-500"
                            }`}
                        >
                          <button
                            title={faq?.title || "NA"}
                            onClick={() => toggleFAQ(i)}
                            className="w-full cursor-pointer flex justify-between items-center px-6 py-3 text-left font-medium text-md focus:outline-none border-b border-gray-200"
                          >
                            <span>
                              {faq?.title?.length > 150
                                ? faq.title.slice(0, 150) + "..."
                                : faq?.title}
                            </span>

                            <div
                              className={`w-5 h-5 flex items-center justify-center rounded-md transition-all duration-300 ${openIndex === i
                                ? "bg-gray-200 text-black rotate-180"
                                : "bg-[#9B7CFF] text-white"
                                }`}
                            >
                              {openIndex === i ? (
                                <FaMinus className="text-xs" />
                              ) : (
                                <FaPlus className="text-xs" />
                              )}
                            </div>
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === i
                              ? "max-h-[400px] overflow-y-auto opacity-100 px-6 pb-3"
                              : "max-h-0 opacity-0 px-6"
                              }`}
                          >
                            <div
                              className="summernote-content"
                              dangerouslySetInnerHTML={{
                                __html: faq?.description,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Read More / Read Less Button */}
                    {totalCourseFaq > DEFAULT_VISIBLE && (
                      <div className="flex justify-center mt-3">
                        <button
                          onClick={() => {
                            if (hasMoreCourseFaq) {
                              setVisibleCourseFaqCount((prev) =>
                                Math.min(
                                  prev + LOAD_MORE_COUNT,
                                  totalCourseFaq,
                                ),
                              );
                            } else {
                              setVisibleCourseFaqCount(DEFAULT_VISIBLE);
                              setOpenIndex(null);
                            }
                          }}
                          className="text-[#882CFB] cursor-pointer hover:text-[#7221D8]  transition"
                        >
                          {hasMoreCourseFaq ? "Read More" : "Read Less"}
                        </button>
                      </div>
                    )}
                  </section>
                )}

                {/*  Why Choose Us Section */}
                {Boolean(whychooseusdata1?.heading || whychooseusdata2?.heading || whychooseusdata3?.heading || whychooseusdata4?.heading) && (
                <section id="Why Choose Us" className="py-5   max-sm:hidden ">
                  <div className="flex justify-center items-center flex-col ">
                    <div>
                      {/* <RiGraduationCapFill className="text-[#2E318D] text-4xl rotate-350 ml-[-15px] mb-[-5px] " /> */}
                      {/* <h2 className="font-bold text-xl text-[#2E318D] ">
                        Why Choose Us
                      </h2> */}
                    </div>
                    {courseData?.allHeadline?.advantage && (
                      <h2 className="heading max-w-[80%] m-auto  text-center">
                        {courseData?.allHeadline?.advantage ||
                          "Your Advantage with ScholarAcad"}
                      </h2>
                    )}
                  </div>

                  <div className="container  mx-auto w-full h-full">
                    <div className="relative  wrap overflow-hidden p-10 h-full">
                      <div className="absolute border-2 border-[#2E318D] border-opacity-20 h-full left-1/2 transform -translate-x-1/2"></div>
                      {/* Card1 */}
                      {whychooseusdata1?.heading && (
                        <>
                          <div className="mb-2  flex justify-between flex-row-reverse items-center w-full left-timeline relative">
                            <div className="order-1 w-5/12"></div>
                            <div className="z-20 flex items-center order-1 relative">
                              <div className="bg-[#2E318D] w-6 h-6 rounded-full flex items-center justify-center shadow-xl z-20">
                                <h2 className="text-white font-semibold text-lg"></h2>
                              </div>
                              <div className="absolute top-1/2 right-full w-[60px]  h-0.5 bg-[#2E318D] transform -translate-y-1/2"></div>
                            </div>
                            <div className="order-1 relative w-5/12 bg-[#F7F3FF] rounded-2xl  overflow-visible">
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#F07F39] text-white flex flex-col justify-center items-center w-25 h-25 rounded-r-full    z-10">
                                <span className="text-2xl font-bold border-b">
                                  01
                                </span>
                                <div className="mt-3">
                                  <img
                                    src="/assets/landingpage/courses/check.svg"
                                    alt="Logo 1"
                                    className="h-8 w-auto object-contain"
                                  />
                                </div>
                              </div>
                              <div className="p-3 pl-20 text-left">
                                <h3 className="text-gray-800 font-semibold text-lg">
                                  {whychooseusdata1?.heading?.length > 150
                                    ? whychooseusdata1?.heading.slice(0, 150) +
                                    "..."
                                    : whychooseusdata1?.heading}
                                </h3>
                                <p
                                  title={whychooseusdata1?.description}
                                  className="text-gray-600 text-sm mt-2 leading-relaxed"
                                >
                                  {whychooseusdata1?.description?.length > 300
                                    ? whychooseusdata1?.description.slice(
                                      0,
                                      300,
                                    ) + "..."
                                    : whychooseusdata1?.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Card2 */}
                      {whychooseusdata2?.heading && (
                        <>
                          <div className="mb-2 flex justify-between items-center w-full right-timeline relative">
                            <div className="order-1 w-5/12"></div>
                            <div className="z-20 flex items-center order-1 relative">
                              <div className="bg-[#2E318D] w-6 h-6 rounded-full flex items-center justify-center shadow-xl z-20">
                                <h2 className="text-white font-semibold text-lg"></h2>
                              </div>
                              <div className="absolute top-1/2 left-full w-[58px] h-0.5 bg-gray-700 transform -translate-y-1/2"></div>
                            </div>
                            <div className="order-1 relative w-5/12 bg-[#F7F3FF] rounded-2xl  overflow-visible flex justify-between items-center">
                              <div className="p-3 pr-20 z-20  text-left">
                                <h3 className="text-gray-800 font-semibold text-lg">
                                  {whychooseusdata2?.heading?.length > 150
                                    ? whychooseusdata2?.heading.slice(0, 150) +
                                    "..."
                                    : whychooseusdata2?.heading}
                                </h3>
                                <p
                                  title={whychooseusdata2?.description}
                                  className="text-gray-600 text-sm mt-2 leading-relaxed"
                                >
                                  {whychooseusdata2?.description?.length > 300
                                    ? whychooseusdata2?.description.slice(
                                      0,
                                      300,
                                    ) + "..."
                                    : whychooseusdata2?.description}
                                </p>
                              </div>
                              <div className="absolute right-[-40px] top-1/2 -translate-y-1/2  bg-[#F49D9D] text-white flex flex-col justify-center items-center w-25 h-25 rounded-r-full   z-10">
                                <span className="text-2xl font-bold border-b">
                                  02
                                </span>
                                <div className="mt-3">
                                  <img
                                    src="/assets/landingpage/courses/growth.svg"
                                    alt="Logo 1"
                                    className="h-8 w-auto object-contain"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {/* Card3 */}
                      {whychooseusdata3?.heading && (
                        <>
                          <div className="mb-2  flex justify-between flex-row-reverse items-center w-full left-timeline relative">
                            <div className="order-1 w-5/12"></div>
                            <div className="z-20 flex items-center order-1 relative">
                              <div className="bg-[#2E318D] w-6 h-6 rounded-full flex items-center justify-center shadow-xl z-20">
                                <h2 className="text-white font-semibold text-lg"></h2>
                              </div>
                              <div className="absolute top-1/2 right-full w-[60px]  h-0.5 bg-[#2E318D] transform -translate-y-1/2"></div>
                            </div>
                            <div className="order-1 relative w-5/12 bg-[#F7F3FF] rounded-2xl  overflow-visible">
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#FFCD7D] text-white flex flex-col justify-center items-center w-25 h-25 rounded-r-full   z-10">
                                <span className="text-2xl font-bold border-b">
                                  03
                                </span>
                                <div className="mt-3">
                                  <img
                                    src="/assets/landingpage/courses/setting.svg"
                                    alt="Logo 1"
                                    className="h-8 w-auto object-contain"
                                  />
                                </div>
                              </div>
                              <div className="p-3 pl-20  text-left">
                                <h3 className="text-gray-800 font-semibold text-lg">
                                  {whychooseusdata3?.heading?.length > 150
                                    ? whychooseusdata3?.heading.slice(0, 150) +
                                    "..."
                                    : whychooseusdata3?.heading}
                                </h3>
                                <p
                                  title={whychooseusdata3?.description}
                                  className="text-gray-600 text-sm mt-2 leading-relaxed"
                                >
                                  {whychooseusdata3?.description?.length > 300
                                    ? whychooseusdata3?.description.slice(
                                      0,
                                      300,
                                    ) + "..."
                                    : whychooseusdata3?.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {/* Card4 */}
                      {whychooseusdata4?.heading && (
                        <>
                          <div className="mb-2 flex justify-between items-center w-full right-timeline relative">
                            <div className="order-1 w-5/12"></div>
                            <div className="z-20 flex items-center order-1 relative">
                              <div className="bg-[#2E318D] w-6 h-6 rounded-full flex items-center justify-center shadow-xl z-20">
                                <h2 className="text-white font-semibold text-lg"></h2>
                              </div>
                              <div className="absolute top-1/2 left-full w-[58px] h-0.5 bg-gray-700 transform -translate-y-1/2"></div>
                            </div>
                            <div className="order-1 relative w-5/12 bg-[#F7F3FF] rounded-2xl  overflow-visible flex justify-between items-center">
                              <div className="p-3 pr-20 z-20  text-left">
                                <h3 className="text-gray-800 font-semibold text-lg">
                                  {whychooseusdata4?.heading?.length > 150
                                    ? whychooseusdata4?.heading.slice(0, 150) +
                                    "..."
                                    : whychooseusdata4?.heading}
                                </h3>
                                <p
                                  title={whychooseusdata4?.description}
                                  className="text-gray-600 text-sm mt-2 leading-relaxed"
                                >
                                  {whychooseusdata4?.description?.length > 300
                                    ? whychooseusdata4?.description.slice(
                                      0,
                                      300,
                                    ) + "..."
                                    : whychooseusdata4?.description}
                                </p>
                              </div>
                              <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 bg-[#78A736] text-white flex flex-col justify-center items-center w-25 h-25 rounded-r-full   z-10">
                                <span className="text-2xl font-bold border-b">
                                  04
                                </span>
                                <div className="mt-3">
                                  <img
                                    src="/assets/landingpage/courses/skill.svg"
                                    alt="Logo 1"
                                    className="h-8 w-auto object-contain"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Card5 */}
                      {whychooseusdata5?.heading && (
                        <>
                          <div className="mb-2  flex justify-between flex-row-reverse items-center w-full left-timeline relative">
                            <div className="order-1 w-5/12"></div>
                            <div className="z-20 flex items-center order-1 relative">
                              <div className="bg-[#2E318D] w-6 h-6 rounded-full flex items-center justify-center shadow-xl z-20">
                                <h2 className="text-white font-semibold text-lg"></h2>
                              </div>
                              <div className="absolute top-1/2 right-full w-[60px]  h-0.5 bg-[#2E318D] transform -translate-y-1/2"></div>
                            </div>
                            <div className="order-1 relative w-5/12 bg-[#F7F3FF] rounded-2xl  overflow-visible">
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#535D9D] text-white flex flex-col justify-center items-center w-25 h-25 rounded-r-full   z-10">
                                <span className="text-2xl font-bold border-b">
                                  05
                                </span>
                                <div className="mt-3">
                                  <img
                                    src="/assets/landingpage/courses/leadership.svg"
                                    alt="Logo 1"
                                    className="h-8 w-auto object-contain"
                                  />
                                </div>
                              </div>
                              <div className="p-3 pl-20  text-left">
                                <h3 className="text-gray-800 font-semibold text-lg">
                                  {whychooseusdata5?.heading?.length > 150
                                    ? whychooseusdata5?.heading.slice(0, 150) +
                                    "..."
                                    : whychooseusdata5?.heading}
                                </h3>
                                <p
                                  title={whychooseusdata5?.description}
                                  className="text-gray-600 text-sm mt-2 leading-relaxed"
                                >
                                  {whychooseusdata5?.description?.length > 300
                                    ? whychooseusdata5?.description.slice(
                                      0,
                                      300,
                                    ) + "..."
                                    : whychooseusdata5?.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Card6 */}
                      {whychooseusdata6?.heading && (
                        <>
                          <div className="mb-2 flex justify-between items-center w-full right-timeline relative">
                            <div className="order-1 w-5/12"></div>
                            <div className="z-20 flex items-center order-1 relative">
                              <div className="bg-[#2E318D] w-6 h-6 rounded-full flex items-center justify-center shadow-xl z-20">
                                <h2 className="text-white font-semibold text-lg"></h2>
                              </div>
                              <div className="absolute top-1/2 left-full w-[58px] h-0.5 bg-gray-700 transform -translate-y-1/2"></div>
                            </div>
                            <div className="order-1 relative w-5/12 bg-[#F7F3FF] rounded-2xl  overflow-visible flex justify-between items-center">
                              <div className="p-3 pr-20 z-20  text-left">
                                <h3 className="text-gray-800 font-semibold text-lg">
                                  {whychooseusdata6?.heading?.length > 150
                                    ? whychooseusdata6?.heading.slice(0, 150) +
                                    "..."
                                    : whychooseusdata6?.heading}
                                </h3>
                                <p
                                  title={whychooseusdata6?.description}
                                  className="text-gray-600 text-sm mt-2 leading-relaxed"
                                >
                                  {whychooseusdata6?.description?.length > 300
                                    ? whychooseusdata6?.description.slice(
                                      0,
                                      300,
                                    ) + "..."
                                    : whychooseusdata6?.description}
                                </p>
                              </div>
                              <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 bg-[#E16AE8] text-white flex flex-col justify-center items-center w-25 h-25 rounded-r-full   z-10">
                                <span className="text-2xl font-bold border-b">
                                  06
                                </span>
                                <div className="mt-3">
                                  <img
                                    src="/assets/landingpage/courses/premiumn_expert.svg"
                                    alt="Logo 1"
                                    className="h-8 w-auto object-contain"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Card7 */}
                      {whychooseusdata7?.heading && (
                        <>
                          <div className="mb-2  flex justify-between flex-row-reverse items-center w-full left-timeline relative">
                            <div className="order-1 w-5/12"></div>
                            <div className="z-20 flex items-center order-1 relative">
                              <div className="bg-[#2E318D] w-6 h-6 rounded-full flex items-center justify-center shadow-xl z-20">
                                <h2 className="text-white font-semibold text-lg"></h2>
                              </div>
                              <div className="absolute top-1/2 right-full w-[60px]  h-0.5 bg-[#2E318D] transform -translate-y-1/2"></div>
                            </div>
                            <div className="order-1 relative w-5/12 bg-[#F7F3FF] rounded-2xl  overflow-visible">
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#17AFA8] text-white flex flex-col justify-center items-center w-25 h-25 rounded-r-full   z-10">
                                <span className="text-2xl font-bold border-b">
                                  07
                                </span>
                                <div className="mt-3">
                                  <img
                                    src="/assets/landingpage/courses/leadership.svg"
                                    alt="Logo 1"
                                    className="h-10 w-auto object-contain"
                                  />
                                </div>
                              </div>
                              <div className="p-3 pl-20  text-left">
                                <h3 className="text-gray-800 font-semibold text-lg">
                                  {whychooseusdata7?.heading?.length > 150
                                    ? whychooseusdata7?.heading.slice(0, 150) +
                                    "..."
                                    : whychooseusdata7?.heading}
                                </h3>
                                <p
                                  title={whychooseusdata7?.description}
                                  className="text-gray-600 text-sm mt-2 leading-relaxed"
                                >
                                  {whychooseusdata7?.description?.length > 300
                                    ? whychooseusdata7?.description.slice(
                                      0,
                                      300,
                                    ) + "..."
                                    : whychooseusdata7?.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {/* Card8 */}
                      {whychooseusdata8?.heading && (
                        <>
                          <div className="mb-2 flex justify-between items-center w-full right-timeline relative">
                            <div className="order-1 w-5/12"></div>
                            <div className="z-20 flex items-center order-1 relative">
                              <div className="bg-[#2E318D] w-6 h-6 rounded-full flex items-center justify-center shadow-xl z-20">
                                <h2 className="text-white font-semibold text-lg"></h2>
                              </div>
                              <div className="absolute top-1/2 left-full w-[58px] h-0.5 bg-gray-700 transform -translate-y-1/2"></div>
                            </div>
                            <div className="order-1 relative w-5/12 bg-[#F7F3FF] rounded-2xl  overflow-visible flex justify-between items-center">
                              <div className="p-3 pr-20 z-20  text-left">
                                <h3 className="text-gray-800 font-semibold text-lg">
                                  {whychooseusdata8?.heading?.length > 150
                                    ? whychooseusdata8?.heading.slice(0, 150) +
                                    "..."
                                    : whychooseusdata8?.heading}
                                </h3>
                                <p
                                  title={whychooseusdata8?.description}
                                  className="text-gray-600 text-sm mt-2 leading-relaxed"
                                >
                                  {whychooseusdata8?.description?.length > 300
                                    ? whychooseusdata8?.description.slice(
                                      0,
                                      300,
                                    ) + "..."
                                    : whychooseusdata8?.description}
                                </p>
                              </div>
                              <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 bg-[#6386FF] text-white flex flex-col justify-center items-center w-25 h-25 rounded-r-full  z-10">
                                <span className="text-2xl font-bold border-b">
                                  08
                                </span>
                                <div className="mt-3">
                                  <img
                                    src="/assets/landingpage/courses/premiumn_expert.svg"
                                    alt="Logo 1"
                                    className="h-8 w-auto object-contain"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {/* Card9 */}
                      {whychooseusdata9?.heading && (
                        <>
                          <div className="mb-2  flex justify-between flex-row-reverse items-center w-full left-timeline relative">
                            <div className="order-1 w-5/12"></div>
                            <div className="z-20 flex items-center order-1 relative">
                              <div className="bg-[#2E318D] w-6 h-6 rounded-full flex items-center justify-center shadow-xl z-20">
                                <h2 className="text-white font-semibold text-lg"></h2>
                              </div>
                              <div className="absolute top-1/2 right-full w-[60px]  h-0.5 bg-[#2E318D] transform -translate-y-1/2"></div>
                            </div>
                            <div className="order-1 relative w-5/12 bg-[#F7F3FF] rounded-2xl  overflow-visible">
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#5ED3FF] text-white flex flex-col justify-center items-center w-25 h-25 rounded-r-full   z-10">
                                <span className="text-2xl font-bold border-b">
                                  09
                                </span>
                                <div className="mt-3">
                                  <img
                                    src="/assets/landingpage/courses/leadership.svg"
                                    alt="Logo 1"
                                    className="h-8 w-auto object-contain"
                                  />
                                </div>
                              </div>
                              <div className="p-3 pl-20  text-left">
                                <h3 className="text-gray-800 font-semibold text-lg">
                                  {whychooseusdata9?.heading?.length > 150
                                    ? whychooseusdata9?.heading.slice(0, 150) +
                                    "..."
                                    : whychooseusdata9?.heading}
                                </h3>
                                <p
                                  title={whychooseusdata9?.description}
                                  className="text-gray-600 text-sm mt-2 leading-relaxed"
                                >
                                  {whychooseusdata9?.description?.length > 300
                                    ? whychooseusdata9?.description.slice(
                                      0,
                                      300,
                                    ) + "..."
                                    : whychooseusdata9?.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </section>
                )}
                {/* What You’ll Learn Section */}
                {courseData?.allHeadline?.new_learning_objectives && (
                  <section
                    id="What You’ll Learn"
                    className="py-5 bg-white rounded-md border border-gray-300"
                  >
                    <div className="relative  max-sm:p-3  px-4">
                      <div className="">
                        <div className="flex   flex-col ">
                          <div>
                            {courseData?.allHeadline?.new_learning_objectives && (
                              <h2 className="heading text-center md:max-w-[80%] m-auto">
                                {courseData.allHeadline.new_learning_objectives}
                              </h2>
                            )}
                            {courseData?.whatyoulearn?.description && (
                              <div
                                className="summernote-content prose mt-3"
                                dangerouslySetInnerHTML={{
                                  __html: courseData.whatyoulearn.description,
                                }}
                              ></div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* <div>
                        <img
                          className="md:w-[70%]"
                          src="/assets/landingpage/whatwill_learn.svg"
                          alt="What You Learn"
                        />
                      </div> */}
                      <div className="">
                        <div className="my-4 w-full grid grid-cols-1 md:grid-cols-2 gap-1  text-sm">
                          {pointers?.length > 0 ? (
                            pointers?.map((text, index) => {
                              const style = styles[index % styles.length];
                              return (
                                <ChevronItem
                                  key={index}
                                  item={{
                                    text,
                                    icon: style.icon,
                                    iconBg: style.iconBg,
                                    contentBg: style.contentBg,
                                  }}
                                />
                              );
                            })
                          ) : (
                            <p className="para text-center col-span-full">
                              No learning points available.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* What You’ll Learn new Section */}
                {/* <section className="py-7 ">
                  <div class="w-full my-10 py-20 rounded-md flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
                    <div
                      className="relative flex items-center justify-center 
            w-[900px] md:w-[700px] sm:w-[500px] xs:w-[380px] 
            transition-all duration-300"
                    >
                      <div
                        className="flex items-center justify-center rounded-full m-10
              w-64 h-64 md:w-52 md:h-52 sm:w-40 sm:h-40 xs:w-32 xs:h-32
              bg-[radial-gradient(circle,rgba(0,0,0,0)_0%,rgba(0,0,0,0.20)_50%)]"
                      >
                        <h2
                          className="text-2xl md:text-xl sm:text-lg xs:text-base font-semibold 
                  text-[#4347CA] text-center leading-tight"
                        >
                          What You’ll <br /> Learn
                        </h2>
                      </div>
                      <div
                        className="absolute top-4 right-16
                  bg-sky-400 text-white px-4 py-2 rounded-bl-[20px] rounded-tr-[20px] shadow w-[200px]"
                      >
                        Item 1
                      </div>
                      <div
                        className="absolute top-18 right-4
                  bg-green-500 text-white px-4 py-2 rounded-bl-[20px] rounded-tr-[20px] shadow w-[200px]"
                      >
                        Item 2
                      </div>
                      <div
                        className="absolute top-31 right-0
                  bg-[#882CFB] text-white px-4 py-2 rounded-bl-[20px] rounded-tr-[20px] shadow w-[200px]"
                      >
                        Item 3
                      </div>
                      <div
                        className="absolute right-4 top-49 -translate-y-1/2
                  bg-indigo-500 text-white px-4 py-2 rounded-bl-[20px] rounded-tr-[20px] shadow w-[200px]"
                      >
                        Item 4
                      </div>
                      <div
                        className="absolute bottom-5 right-15
                  bg-indigo-300 text-white px-4 py-2 rounded-bl-[20px] rounded-tr-[20px] shadow w-[200px]"
                      >
                        Item 5
                      </div>
                      <div
                        className="absolute -bottom-8 right-24
                  bg-purple-400 text-white px-4 py-2 rounded-bl-[20px] rounded-tr-[20px] shadow w-[200px]"
                      >
                        Item 6
                      </div>
                      <div
                        className="absolute -bottom-8  left-30
                  bg-orange-400 text-white px-4 py-2 rounded-bl-[20px] rounded-tr-[20px] shadow w-[200px]"
                      >
                        Item 7
                      </div>
                      <div
                        className="absolute bottom-5 left-18
                  bg-orange-500 text-white px-4 py-2 rounded-bl-[20px] rounded-tr-[20px] shadow w-[200px]"
                      >
                        Item 8
                      </div>
                      <div
                        className="absolute bottom-18 left-4
                  bg-red-400 text-white px-4 py-2 rounded-bl-[20px] rounded-tr-[20px] shadow w-[200px]"
                      >
                        Item 9
                      </div>
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2
                  bg-yellow-400 text-white px-4 py-2 rounded-bl-[20px] rounded-tr-[20px] shadow w-[200px]"
                      >
                        Item 10
                      </div>
                      <div
                        className="absolute top-18 left-4
                  bg-pink-500 text-white px-4 py-2 rounded-bl-[20px] rounded-tr-[20px] shadow w-[200px]"
                      >
                        Item 11
                      </div>
                      <div
                        className="absolute top-4 left-16
                  bg-pink-400 text-white px-4 py-2 rounded-bl-[20px] rounded-tr-[20px] shadow w-[200px]"
                      >
                        Item 12
                      </div>
                    </div>
                  </div>
                </section> */}

                {(courseData?.courseCurriculumFAQ?.length > 0 ||
                  (courseData?.courseDescription?.curriculum &&
                    courseData.courseDescription.curriculum.replace(/<[^>]*>/g, "").trim() !== "") ||
                  courseData?.coursePDF) && (
                  <div className="max-sm:p-4 py-5    ">
                    <div className="bg-[#F7F3FF] rounded-md border border-gray-300 p-3">
                      <div className="mt-1">
                        {courseData?.courseCurriculumFAQ?.length > 0 ? (
                          <>
                            <h2 className="heading text-center md:max-w-[80%] m-auto">
                              {courseData?.allHeadline?.curriculum}
                            </h2>
                          </>
                        ) : (
                          <>
                            <RiGraduationCapFill className="text-[#2E318D] text-4xl rotate-350 ml-[-15px] mb-[-5px]" />
                            <h2 className="font-bold text-xl text-[#2F328F]">
                              {courseData?.allHeadline?.curriculum || "Curriculum"}
                            </h2>
                          </>
                        )}
                      </div>
                      <div className=" my-2">
                        <div className="flex justify-between items-center ">
                          <div
                            className="summernote-content"
                            dangerouslySetInnerHTML={{
                              __html: courseData?.courseDescription?.curriculum,
                            }}
                          />
                          {courseData?.coursePDF && (
                            <div className="flex justify-end items-end">
                              {!allowDownload && (
                                <FormModal
                                  buttonText="Download Curriculum"
                                  modalType="register"
                                  service="Download Curriculum"
                                />
                              )}

                              {allowDownload && (
                                <button
                                  className="bg-[#882CFB] text-white px-6 py-2 rounded-full"
                                  disabled
                                >
                                  Downloading...
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-full grid grid-cols-1  gap-2 mt-4">
                        {courseData?.courseCurriculumFAQ?.map((faq, i) => (
                          <div
                            key={i}
                            className={`rounded-lg  border border-gray-300 transition-all duration-500 ease-in-out self-start ${openIndex === i
                              ? "bg-white text-gray-800"
                              : "bg-white text-gray-500"
                              }`}
                          >
                            <button
                              title={faq?.title || "NA"}
                              onClick={() => toggleFAQ(i)}
                              className="w-full cursor-pointer flex justify-between items-center px-6 py-3 text-left font-medium text-md focus:outline-none border-b border-gray-200"
                            >
                              <span>
                                {faq?.title?.length > 150
                                  ? faq.title.slice(0, 150) + "..."
                                  : faq?.title}
                              </span>

                              <div
                                className={`w-5 h-5 flex items-center justify-center rounded-md transition-all duration-300 ${openIndex === i
                                  ? "bg-gray-200 text-black rotate-180"
                                  : "bg-[#9B7CFF] text-white"
                                  }`}
                              >
                                {openIndex === i ? (
                                  <FaMinus className="text-xs" />
                                ) : (
                                  <FaPlus className="text-xs" />
                                )}
                              </div>
                            </button>
                            <div
                              className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === i
                                ? "max-h-[400px] overflow-y-auto opacity-100 px-6 "
                                : "max-h-0 opacity-0 px-6"
                                }`}
                            >
                              <div
                                className="summernote-content"
                                dangerouslySetInnerHTML={{
                                  __html: faq?.description,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Corporate Training Section */}
                <div className="py-5 max-sm:p-3 mt-5 ">
                  <div className="corporate_trainning_bg p-5  text-[#2E318D] rounded-md border border-gray-300   ">
                    <div className="grid md:grid-cols-3 grid-cols-1 md:max-w-[90%] w-full m-auto ">
                      <div>
                        <h2 className="font-bold text-2xl">
                          Corporate Training
                        </h2>
                        <ul className="list-disc pl-5 text-gray-700 mt-3">
                          <li>Impactful Instructor Led Training</li>
                          <li>Wide range of Training dates.</li>
                        </ul>
                      </div>

                      <div className="mt-8 flex gap-4">
                        <FormModal
                          buttonText="Contact Advisor"
                          modalType="register"
                        />
                      </div>
                      <div className="">
                        <img
                          src="/assets/landingpage/girlwith-laptop.png"
                          alt="Corporate Trainning"
                          className="object-contain transform scale-105 translate-y-4  md:-mt-[80px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Exam Structure Section */}
                {courseData?.newExamstructure?.exam_structure ? (
                  <>
                    <section className="py-5 max-sm:p-3 ">
                      <div className=" rounded-2xl ">
                        <h2 className="heading text-center md:max-w-[80%] m-auto">
                          {courseData?.allHeadline?.exam_structure}
                        </h2>
                        <div className="text-center bg-[#F7F3FF] p-5 rounded-md border border-gray-300  mt-5">
                          <div
                            className={`summernote-content prose max-w-none    transition-all duration-500 ease-in-out overflow-hidden  ${expanded ? "max-h-[2000px]" : "max-h-[200px]"
                              }`}
                            dangerouslySetInnerHTML={{
                              __html:
                                courseData?.newExamstructure?.exam_structure,
                            }}
                          ></div>

                          <button
                            onClick={toggleExpand}
                            className="mt-3 flex items-center justify-center gap-2 text-[#882CFB] hover:text-[#7221D8] mx-auto transition-colors duration-300 cursor-pointer"
                          >
                            {expanded ? (
                              <>
                                Read Less{" "}
                              </>
                            ) : (
                              <>
                                Read More{" "}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </section>
                  </>
                ) : (
                  ""
                )}

                {/* Certification Eligibility New Section */}
                {(courseData?.allHeadline?.eligibility ||
                  (courseData?.courseDescription?.eligibility &&
                    courseData.courseDescription.eligibility.replace(/<[^>]*>/g, "").trim() !== "") ||
                  (Array.isArray(certificatelist) && certificatelist.length > 0)) && (
                  <section className="py-5 max-sm:p-3">
                    <div className="relative rounded-md overflow-hidden ">
                      <div
                        className="absolute inset-0 bg-cover bg-center object-contain"
                        style={{
                          backgroundImage:
                            "url('/assets/landingpage/certificate_bg.png')",
                        }}
                      ></div>
                      <div className="relative grid grid-cols-1 md:grid-cols-[70%_30%] p-5">
                        <div className="text-left text-white">
                          {courseData?.allHeadline?.eligibility && (
                            <h2 className="heading_white ">
                              {courseData.allHeadline.eligibility}
                            </h2>
                          )}
                          {courseData?.courseDescription?.eligibility && (
                            <div
                              className="summernote-content2 prose max-w-none mt-2 force-text-color"
                              dangerouslySetInnerHTML={{
                                __html: courseData.courseDescription.eligibility,
                              }}
                            ></div>
                          )}

                          <div className=" mt-2">
                            {Array?.isArray(certificatelist) &&
                              certificatelist?.map((point, i) => (
                                <div
                                  key={i}
                                  className="flex gap-3 items-start mb-3"
                                >
                                  <IoCheckmarkCircleSharp className="text-white text-lg shrink-0 mt-1" />
                                  <p className="text-white text-[15px]">
                                    {point}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                        <div></div>
                      </div>
                    </div>
                  </section>
                )}

                <section>
                  {/* Graph Card Section */}
                  {courseData?.allHeadline?.salaries && (
                    <section className="py-5 max-sm:p-3 ">
                      <div className="max-w-7xl mx-auto  ">
                        <div className=" ">
                          {/* grid grid-cols-1 md:grid-cols-[4fr_6fr] justify-between */}
                          <div className=" ">
                            <div className="flex flex-col ">
                              <div>
                                {/* <RiGraduationCapFill className="text-[#2E318D] text-4xl rotate-350 ml-[-15px] mb-[-5px] " /> */}
                                {/* <h2 className="font-bold text-xl text-[#2E318D] ">
                                  Module: Identifying & Programme
                                </h2> */}
                              </div>
                              <h2 className="heading max-w-[80%] m-auto  text-center ">
                                {courseData?.allHeadline?.salaries || "Na"}
                              </h2>
                              {/* <div className="py-6 w-full max-w-md  ">
                                <div className="space-y-5">
                                 
                                  <div className="flex flex-col gap-2">
                                    <p className="text-gray-700 text-sm">
                                      <span className="font-semibold">
                                        Minimum
                                      </span>{" "}
                                     
                                      {minK}K - {avgK}K
                                    </p>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                      <div
                                        className="bg-[#007BCE] h-3 rounded-full"
                                        style={{ width: `${wMin}%` }}
                                      ></div>
                                    </div>
                                  </div>

                                
                                  <div className="flex flex-col gap-2">
                                    <p className="text-gray-700 text-sm">
                                      <span className="font-semibold">
                                        Average
                                      </span>{" "}
                                      
                                      {avgK}K - {maxK}K
                                    </p>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                      <div
                                        className="bg-[#00AEEF] h-3 rounded-full"
                                        style={{ width: `${wAvg}%` }}
                                      ></div>
                                    </div>
                                  </div>

                              
                                  <div className="flex flex-col gap-2">
                                    <p className="text-gray-700 text-sm">
                                      <span className="font-semibold">
                                        Maximum
                                      </span>{" "}
                                     
                                       {maxK}K - {maxK + 20}K
                                    </p>
                                    <div className="w-full bg-gray-100 rounded-full h-3">
                                      <div
                                        className="bg-[#6FE7E7] h-3 rounded-full"
                                        style={{ width: `${wMax}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div> */}
                            </div>
                          </div>
                          <div className="  ">
                            {/* <SalaryChart /> */}
                            <div className="w-full h-[250px] bg-white rounded-lg mt-5">
                              {/* <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={chartData}
                                  margin={{
                                    top: 30,
                                    right: 20,
                                    left: 20,
                                    bottom: 40,
                                  }}
                                  barCategoryGap="15%"
                                >
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    horizontal={false}
                                  />

                                  <XAxis
                                    dataKey="name"
                                    tick={{
                                      fill: "#333",
                                      fontSize: 14,
                                      fontWeight: 600,
                                    }}
                                    axisLine={{
                                      stroke: "#2E3192",
                                      strokeWidth: 2,
                                    }}
                                    tickLine={false}
                                  />
                                  <YAxis hide />
                                  <Tooltip
                                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                                  />
                                  <Bar
                                    dataKey="bar1"
                                    fill="#0D6EFD"
                                    radius={[8, 8, 0, 0]}
                                  >
                                    <LabelList
                                      dataKey="bar1"
                                      position="top"
                                      formatter={(v) => `${v} LPA`}
                                      fill="#444"
                                      fontSize={12}
                                    />
                                  </Bar>

                                  <Bar
                                    dataKey="bar2"
                                    fill="#009CDE"
                                    radius={[8, 8, 0, 0]}
                                  >
                                    <LabelList
                                      dataKey="bar2"
                                      position="top"
                                      formatter={(v) => `${v} LPA`}
                                      fill="#444"
                                      fontSize={12}
                                    />
                                  </Bar>

                                  <Bar
                                    dataKey="bar3"
                                    fill="#69E3E3"
                                    radius={[8, 8, 0, 0]}
                                  >
                                    <LabelList
                                      dataKey="bar3"
                                      position="top"
                                      formatter={(v) => `${v} LPA`}
                                      fill="#444"
                                      fontSize={12}
                                    />
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer> */}
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={chartData}
                                  margin={{
                                    top: 30,
                                    right: 20,
                                    left: 20,
                                    bottom: 10,
                                  }}
                                  barCategoryGap="30%"
                                >
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    horizontal={true}
                                  />
                                  <XAxis dataKey="name" />
                                  <YAxis hide />
                                  {/* <Tooltip /> */}

                                  <Bar
                                    dataKey="min"
                                    fill="#0D6EFD"
                                    radius={[8, 8, 0, 0]}
                                  >
                                    <LabelList
                                      content={({ x, y, index }) => {
                                        const label =
                                          chartData?.[index]?.minLabel;
                                        if (!label) return null;
                                        return (
                                          <text
                                            x={x + 22}
                                            y={y - 10}
                                            textAnchor="middle"
                                            fill="#333"
                                            fontSize={12}
                                          >
                                            {label}
                                          </text>
                                        );
                                      }}
                                    />
                                  </Bar>

                                  <Bar
                                    dataKey="avg"
                                    fill="#009CDE"
                                    radius={[8, 8, 0, 0]}
                                  >
                                    <LabelList
                                      content={({ x, y, index }) => {
                                        const label =
                                          chartData?.[index]?.avgLabel;
                                        if (!label) return null;

                                        return (
                                          <text
                                            x={x + 22}
                                            y={y - 10}
                                            textAnchor="middle"
                                            fill="#333"
                                            fontSize={12}
                                          >
                                            {label}
                                          </text>
                                        );
                                      }}
                                    />
                                  </Bar>

                                  <Bar
                                    dataKey="max"
                                    fill="#69E3E3"
                                    radius={[8, 8, 0, 0]}
                                  >
                                    <LabelList
                                      content={({ x, y, index }) => {
                                        const label =
                                          chartData?.[index]?.maxLabel;
                                        if (!label) return null;

                                        return (
                                          <text
                                            x={x + 22}
                                            y={y - 10}
                                            textAnchor="middle"
                                            fill="#333"
                                            fontSize={12}
                                          >
                                            {label}
                                          </text>
                                        );
                                      }}
                                    />
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="flex items-center justify-center gap-6">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#0D6EFD]"></span>
                                <span className="text-sm text-gray-700">
                                  Minimum
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#009CDE]"></span>
                                <span className="text-sm text-gray-700">
                                  Average
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#69E3E3]"></span>
                                <span className="text-sm text-gray-700">
                                  Maximum
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Company image Card Section */}
                  <div className="py-5 max-sm:p-3  overflow-hidden ">
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
                </section>
                {/* Trainning Options Section */}
                {Array?.isArray(courseData?.coursePlan) &&
                  courseData?.coursePlan?.length > 0 ? (
                  <section id="Training Options" className="py-5 max-sm:p-3">
                    <div className="flex justify-center items-center flex-col ">
                      <div>
                        {/* <RiGraduationCapFill className="text-[#2E318D] text-4xl rotate-350 ml-[-15px] mb-[-5px] " /> */}
                        {/* <h3 className="font-bold text-xl text-[#2E318D] ">
                          Training Options
                        </h3> */}
                      </div>
                      {courseData?.allHeadline?.training_options && (
                        <h2 className="heading md:max-w-[70%]  text-center">
                          {courseData?.allHeadline?.training_options || "NA"}
                        </h2>
                      )}
                    </div>
                    <div className="">
                      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-[100px] gap-[50px] md:pt-[70px] max-sm:pt-[50px] px-4">
                        {Array.isArray(courseData?.coursePlan) &&
                          courseData?.coursePlan?.length > 0 ? (
                          courseData?.coursePlan?.map((plan, index) => {
                            const bgColors = [
                              "bg-[#FFBCBD]",
                              "bg-[#C1E1C1]",
                              "bg-[#CFE2FF]",
                            ];
                            const bgClass = bgColors[index % bgColors.length];

                            return (
                              <div className="ribbon_card" key={index}>
                                <div className={`ribbon_label ${bgClass}`}>
                                  <h2 className="font-bold text-[#2E318D] text-xl">
                                    {plan?.plan_name}
                                  </h2>
                                </div>

                                <div className="ribbon_card__container">
                                  <div className="ribbon_card__body">
                                    <div className="min-h-[270px] max-h-[250px] overflow-y-auto">
                                      <ul className="mt-2 space-y-2">
                                        {plan?.features?.map(
                                          (feature, featureIndex) => (
                                            <li key={featureIndex}>
                                              {featureIndex + 1}. {feature}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>

                                    <div className="mt-6 flex md:flex-row flex-col gap-2">
                                      <FormModal
                                        buttonText="Contact Advisor"
                                        modalType="register"
                                      />
                                      <button
                                        onClick={() =>
                                          scrollToSection("Contact")
                                        }
                                        className="flex-1 border border-[#882CFB] text-[#882CFB] hover:bg-[#882CFB] hover:text-white cursor-pointer py-2 px-2 rounded-full"
                                      >
                                        Contact For Bulk Discount
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="md:col-span-10 flex flex-col items-center justify-center mt-5 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3 text-center ">
                            <p className="text-gray-600 text-lg font-medium">
                              No course plans available
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                              Please check back later or contact support for
                              more information.
                            </p>
                          </div>
                        )}
                        {/* <div className="ribbon_card">
                        <div className="ribbon_label bg-[#C1C2DD]">
                          <h2 className="font-bold text-[#2E318D] text-xl">
                            Basic Voucher
                          </h2>
                          <span className="text-[#2E318D] font-light bg-gray-100 px-2 py-1  text-xs mt-2 rounded-md">
                            Learn in Expert-Led Sessions
                          </span>
                        </div>
                        <div className=" ribbon_card__container">
                          <div className="ribbon_card__body">
                            <div
                              className="summernote-content prose max-w-none mt-3"
                              dangerouslySetInnerHTML={{
                                __html: (() => {
                                  try {
                                    const arr = JSON.parse(
                                      courseData?.courseTutionFee
                                        ?.classroom_pointers || "[]"
                                    );
                                    return `<ul>${arr
                                      .map((item) => `<li>${item}</li>`)
                                      .join("")}</ul>`;
                                  } catch (e) {
                                    return "No Details Available";
                                  }
                                })(),
                              }}
                            ></div>

                            <div className=" mt-6 flex md:flex-row flex-col gap-2">
                              <FormModal
                                buttonText="Contact Advisor"
                                modalType="register"
                              />
                              <button
                                onClick={() => scrollToSection("Contact")}
                                className="flex-1 border border-[#2E318D] text-[#2E318D] hover:bg-[#2E318D] hover:text-white cursor-pointer py-2 px-2 whitespace-nowrap rounded-full"
                              >
                                Contact For Bulk Discount
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ribbon_card">
                        <div className="ribbon_label bg-[#9C999E]">
                          <h2 className="font-bold text-[#2E318D] text-xl">
                            Standard Voucher
                          </h2>
                          <span className="text-[#2E318D] font-light bg-gray-100 px-2 py-1  text-xs mt-2 rounded-md">
                            Learn in Expert-Led Sessions
                          </span>
                        </div>
                        <div className="ribbon_card__container">
                          <div className="ribbon_card__body">
                            <div
                              className="summernote-content prose max-w-none mt-3"
                              dangerouslySetInnerHTML={{
                                __html: (() => {
                                  try {
                                    const arr = JSON.parse(
                                      courseData?.courseTutionFee
                                        ?.classroom_pointers || "[]"
                                    );
                                    return `<ul>${arr
                                      .map((item) => `<li>${item}</li>`)
                                      .join("")}</ul>`;
                                  } catch (e) {
                                    return "No Details Available";
                                  }
                                })(),
                              }}
                            ></div>
                            <div className=" mt-6 flex md:flex-row flex-col gap-2">
                              <FormModal
                                buttonText="Contact Advisor"
                                modalType="register"
                              />
                              <button
                                onClick={() => scrollToSection("Contact")}
                                className="flex-1 border border-[#2E318D] text-[#2E318D] hover:bg-[#2E318D] hover:text-white cursor-pointer py-2 px-2 whitespace-nowrap rounded-full"
                              >
                                Contact For Bulk Discount
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ribbon_card">
                        <div className="ribbon_label bg-[linear-gradient(to_right,#AA8C4F,#C6A962)]">
                          <h2 className="font-bold text-[#2E318D] text-xl">
                            Premium Voucher
                          </h2>
                          <span className="text-[#2E318D] font-light bg-gray-100 px-2 py-1  text-xs mt-2 rounded-md">
                            Learn in Expert-Led Sessions
                          </span>
                        </div>
                        <div className="ribbon_card__container">
                          <div className="ribbon_card__body">
                            <div
                              className="summernote-content prose max-w-none mt-3"
                              dangerouslySetInnerHTML={{
                                __html: (() => {
                                  try {
                                    const arr = JSON.parse(
                                      courseData?.courseTutionFee
                                        ?.classroom_pointers || "[]"
                                    );
                                    return `<ul>${arr
                                      .map((item) => `<li>${item}</li>`)
                                      .join("")}</ul>`;
                                  } catch (e) {
                                    return "No Details Available";
                                  }
                                })(),
                              }}
                            ></div>

                            <div className=" mt-6 flex md:flex-row flex-col gap-2">
                              <FormModal
                                buttonText="Contact Advisor"
                                modalType="register"
                              />
                              <button
                                onClick={() => scrollToSection("Contact")}
                                className="flex-1 border border-[#2E318D] text-[#2E318D] hover:bg-[#2E318D] hover:text-white cursor-pointer py-2 px-2 whitespace-nowrap rounded-full"
                              >
                                Contact For Bulk Discount
                              </button>
                            </div>
                          </div>
                        </div>
                      </div> */}
                      </div>
                    </div>
                  </section>
                ) : null}

                {/* Career Transformations Section */}
                <section className="max-sm:p-3 py-5">
                  <div className="bg-[#2E318D] counter_bg  p-3 text-[#2E318D] rounded-2xl  ">
                    <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x max-sm:divide-y divide-[#2E318D]  gap-2 my-8">
                      <div className="flex justify-center items-center">
                        <div className="flex flex-col md:items-start items-center gap-4 py-2">
                          <h2 className="md:text-4xl text-2xl font-bold">
                            400k+
                          </h2>
                          <p className="text-md text-left font-semibold">
                            Career Transformations
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center items-center">
                        <div className="flex flex-col md:items-start items-center gap-4 py-2">
                          <h2 className="md:text-4xl text-2xl font-bold">
                            200+
                          </h2>
                          <p className="text-md text-left font-semibold">
                            Workshops every month
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center items-center">
                        <div className="flex flex-col md:items-start items-center gap-4 py-2">
                          <h2 className="md:text-4xl text-2xl font-bold">
                            100+
                          </h2>
                          <p className="text-md text-left font-semibold">
                            Countries and Counting
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Set Your Learning Calendar Section */}
                <section id="Contact" className="max-sm:p-3 py-5">
                  <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-4">
                    <div>
                      <h2 className="heading   text-start">
                        Set Your Learning Calendar
                      </h2>
                      {/* <div className="calendar-container mt-4 ">
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          showTimeSelect
                          timeFormat="hh:mm aa"
                          timeIntervals={30}
                          dateFormat="dd/MM/yyyy hh:mm aa"
                          inline
                          dropdownMode="select"
                          todayButton="Today"
                          highlightDates={[selectedDate]}
                          minDate={new Date()}
                        />
                      </div> */}

                      <div className="bg-white border border-gray-300 p-5 rounded-md w-full mt-3">
                        <div className="flex items-center justify-between mb-4">
                          <button
                            title="Previous Month"
                            onClick={handlePrevMonth}
                            className="text-gray-500 cursor-pointer hover:text-black"
                          >
                            ←
                          </button>
                          <h2 className="font-semibold text-lg">
                            {currentDate.toLocaleString("default", {
                              month: "long",
                              year: "numeric",
                            })}
                          </h2>
                          <button
                            title="Next Month"
                            onClick={handleNextMonth}
                            className="text-gray-500 hover:text-black cursor-pointer"
                          >
                            →
                          </button>
                        </div>
                        {/* Weekdays */}
                        <div className="grid grid-cols-7 text-center text-sm text-gray-400 mb-2">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                            (d) => (
                              <div key={d}>{d}</div>
                            ),
                          )}
                        </div>

                        {/* Calendar */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {[...Array(firstDay)].map((_, i) => (
                            <div key={`empty-${i}`} />
                          ))}

                          {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const date = new Date(year, month, day);
                            date.setHours(0, 0, 0, 0);
                            const isPast = date < today;
                            const isSelected =
                              selectedDate &&
                              selectedDate.getTime() === date.getTime();
                            return (
                              <button
                                title={day}
                                key={day}
                                disabled={isPast}
                                onClick={() => handleDateSelect(day)}
                                className={`py-2 rounded-lg transition cursor-pointer
                                ${isPast
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "hover:bg-purple-50"
                                  }
                                ${isSelected ? "bg-[#4347CA] text-white " : ""}
                              `}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                        {/* Time Picker */}
                        <div className="mt-6">
                          <label className="block text-sm font-medium mb-2">
                            Select Time
                          </label>
                          <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-[#882CFB] cursor-pointer"
                          >
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Selected Value */}
                        <div className="mt-4 text-sm text-gray-600">
                          <strong>Selected:</strong>{" "}
                          {selectedDate
                            ? `${selectedDate.toDateString()} at ${selectedTime}`
                            : "None"}
                        </div>
                      </div>
                      <div className="bg-white rounded-md p-4 border border-gray-300 space-y-2 mt-4">
                        {/* Selected Date & Course */}
                        {/* <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="text-lg font-semibold text-gray-800">
                            Selected Date & Time :
                          </span>
                          <span className="font-semibold text-[#2E318D]">
                            {selectedDate.toDateString()}
                          </span>
                          <span className="font-semibold text-[#2E318D]">
                            {selectedDate.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div> */}
                        {/* Course Details */}
                        <div className="space-y-2">
                          <h2 className="text-sm font-semibold text-gray-700">
                            ScholarAcad Learning
                          </h2>
                          <hr className="text-gray-200" />
                          <p className="text-sm text-[#2E318D] font-medium">
                            Duration: 30 Minutes
                          </p>
                          <p className="para ">
                            Learn everything about your certification —
                            including fees, syllabus, benefits, courseware,
                            corporate enquiries, and custom schedules.
                          </p>
                        </div>
                        {/* <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-2">
                          <FaMapMarkerAlt className="text-[#2E318D] text-lg mt-1" />

                          <div>
                            <h2 className="text-sm font-semibold text-gray-700 mb-1">
                              Location
                            </h2>

                            <div className="flex flex-wrap gap-4 items-center">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <FaCity className="text-[#2E318D] text-sm" />
                                <span>{userLocation?.city}</span>
                              </div>

                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MdLocationCity className="text-[#2E318D] text-sm" />
                                <span>{userLocation?.state}</span>
                              </div>

                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <FaGlobe className="text-[#2E318D] text-sm" />
                                <span>{userLocation?.country}</span>
                              </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>

                    <div>
                      <div className="bg-black p-3 rounded-md">
                        <form
                          className="max-w-4xl mx-auto p-3 space-y-3"
                          onSubmit={handleSubmit}
                        >
                          {/* Full Name */}
                          <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-200">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="full_name"
                              value={formData.full_name}
                              onChange={handleChange}
                              className="border border-gray-300 rounded-md p-2 w-full bg-white text-gray-900"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Contact Number */}
                            <div className="flex flex-col">
                              <label className="mb-2 font-medium text-gray-200">
                                Contact Number{" "}
                                {/* <span className="text-red-500">*</span> */}
                              </label>
                              <input
                                type="text"
                                name="contact_number"
                                value={formData.contact_number}
                                onChange={(e) => {
                                  let value = e.target.value;
                                  if (!/^[+\d]*$/.test(value)) return;
                                  const digitsOnly = value.replace("+", "");
                                  if (digitsOnly.length > 10) return;
                                  handleChange(e);
                                }}
                                className="border border-gray-300 rounded-md p-2 bg-white text-gray-900"
                              />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col">
                              <label className="mb-2 font-medium text-gray-200">
                                Email ID <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2 bg-white text-gray-900"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Country */}
                            <div className="flex flex-col">
                              <label className="mb-2 font-medium text-gray-200">
                                Country <span className="text-red-500">*</span>
                              </label>
                              <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2 bg-white text-gray-900"
                              >
                                <option value="">Select Country</option>
                                {countryLists?.map((country) => (
                                  <option key={country.name} value={country.id}>
                                    {country?.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Course */}
                            <div className="flex flex-col">
                              <label className="mb-2 font-medium text-gray-200">
                                Course <span className="text-red-500">*</span>
                              </label>
                              <select
                                name="course"
                                value={formData?.course}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2 bg-white text-gray-900"
                              >
                                <option value="">Select Course</option>

                                {categories?.flatMap((category) =>
                                  category?.cources?.map((course) => (
                                    <option
                                      key={`${category?.id}-${course?.id}`}
                                      value={course?.id}
                                    >
                                      {course?.course_short_name}
                                    </option>
                                  )),
                                )}
                              </select>
                            </div>

                            {/* <div className="flex flex-col">
                              <label className="mb-2 font-medium text-gray-200">
                                Size of Group Training
                                <span className="text-red-500">*</span>
                              </label>
                              <select
                                name="group_size"
                                value={formData.group_size}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2 bg-white text-gray-900"
                              >
                                <option value="">Please Select</option>
                                <option value="1-10">1-10</option>
                                <option value="11-20">11-20</option>
                                <option value="21-30">21-30</option>
                                <option value="31-60">31-60</option>
                                <option value="61-100">61-100</option>
                                <option value="nolimit">No Limit</option>
                              </select>
                            </div> */}
                          </div>

                          {/* Enquiry For */}
                          <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-200">
                              Enquiry For{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 bg-white p-2 rounded-md text-gray-700">
                              <label className="flex gap-2 items-center">
                                <input
                                  type="radio"
                                  name="enquiry_for"
                                  value="individual"
                                  onChange={handleChange}
                                  checked={
                                    formData.enquiry_for === "individual"
                                  }
                                />
                                Individual
                              </label>

                              <label className="flex gap-2 items-center">
                                <input
                                  type="radio"
                                  name="enquiry_for"
                                  value="corporate"
                                  onChange={handleChange}
                                  checked={formData.enquiry_for === "corporate"}
                                />
                                Corporate
                              </label>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Corporate Only: Company Name */}
                            {formData.enquiry_for === "corporate" && (
                              <div className="flex flex-col">
                                <label className="mb-2 font-medium text-gray-200">
                                  Company Name
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="company_name"
                                  placeholder="Company Name*"
                                  value={formData.company_name}
                                  onChange={handleChange}
                                  className="border border-gray-300 rounded-md p-2 bg-white text-gray-900"
                                />
                              </div>
                            )}

                            {/* Corporate Only: Job Title */}
                            {formData.enquiry_for === "corporate" && (
                              <div className="flex flex-col">
                                <label className="mb-2 font-medium text-gray-200">
                                  Job Title
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="job_title"
                                  placeholder="Job Title*"
                                  value={formData.job_title}
                                  onChange={handleChange}
                                  className="border border-gray-300 rounded-md p-2 bg-white text-gray-900"
                                />
                              </div>
                            )}

                            {/* Corporate Only: Group Size */}
                            {formData.enquiry_for === "corporate" && (
                              <div className="flex flex-col">
                                <label className="mb-2 font-medium text-gray-200">
                                  Size Of Group Training
                                  <span className="text-red-500">*</span>
                                </label>
                                <select
                                  name="group_size"
                                  value={formData.group_size}
                                  onChange={handleChange}
                                  className="border border-gray-300 rounded-md p-2 bg-white text-gray-900"
                                >
                                  <option value="">
                                    Size of Group Training*
                                  </option>
                                  <option value="1-10">1-10</option>
                                  <option value="11-20">11-20</option>
                                  <option value="21-30">21-30</option>
                                  <option value="31-60">31-60</option>
                                  <option value="61-100">61-100</option>
                                  <option value="nolimit">No Limit</option>
                                </select>
                              </div>
                            )}
                          </div>
                          {/* Training Delivery Mode */}
                          <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-200">
                              Training Delivery Mode{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="training_delivery_mode"
                              value={formData.training_delivery_mode}
                              onChange={handleChange}
                              className="border border-gray-300 rounded-md p-2 bg-white text-gray-900"
                            >
                              <option value="">Please Select</option>
                              <option value="offline">Offline</option>
                              <option value="online">Online</option>
                            </select>
                          </div>
                          {/* Preferred Contact Mode */}
                          <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-200">
                              Select Your Preferred Mode of Contact{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-3 bg-white p-2 rounded-md text-gray-700">
                              {["phone", "email", "both"].map((mode) => (
                                <label
                                  key={mode}
                                  className="flex gap-2 items-center"
                                >
                                  <input
                                    type="radio"
                                    name="preferred_contact_mode"
                                    value={mode}
                                    onChange={handleChange}
                                    checked={
                                      formData.preferred_contact_mode === mode
                                    }
                                  />
                                  <span className="capitalize">{mode}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Message */}
                          <div className="flex flex-col">
                            <label className="mb-2 font-medium text-gray-200">
                              Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              name="message"
                              rows="2"
                              maxLength={500}
                              value={formData.message}
                              onChange={handleChange}
                              className="border border-gray-300 rounded-md p-2 bg-white text-gray-900"
                            />
                          </div>

                          {/* Agree Terms */}
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="agree_terms"
                              checked={formData.agree_terms === 1}
                              onChange={handleChange}
                              className="w-4 h-4"
                            />
                            <label className="text-gray-200 text-sm">
                              I agree to the{" "}
                              <Link
                                target="_blank"
                                href={{
                                  pathname: `/term-and-condition`,
                                }}
                                className="font-semibold hover:underline"
                              >
                                Terms and Conditions
                              </Link>
                            </label>
                          </div>

                          <div className="flex ">
                            <button
                              type="submit"
                              disabled={loading}
                              className={`bg-[#882CFB] border-2 border-white w-full hover:bg-[#4347ca] px-8 text-white py-2 rounded-full flex gap-1 item-center justify-center cursor-pointer ${loading ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                            >
                              {loading ? "Sending..." : "Submit"}
                              <HiArrowLongRight className="mt-1" />
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Schedule Courses Section */}
                {courseData?.courseSchedule?.length > 0 && (
                  <section id="Schedule Courses" className="max-sm:p-3 py-5">
                    <div className="mb-4">
                      <h2 className="heading   text-start">
                        Explore Schedules
                      </h2>
                      <p className="para">
                        {courseData?.allHeadline?.schedule || "Na"}
                      </p>
                    </div>
                    <Tabs tabs={tabs} />
                  </section>
                )}

                {/* Course Schedule Card Section */}
                <section className="max-sm:p-3 py-5">
                  <div
                    className="course_schedule_bg  p-5 text-[#2E318D] rounded-md border border-gray-300 Course Schedule
 "
                  >
                    <div className="grid md:grid-cols-3 grid-cols-1 md:max-w-[90%] m-auto">
                      <div>
                        <h3 className="font-bold text-2xl">
                          {" "}
                          Course Schedule{" "}
                        </h3>
                        <ul className="list-disc pl-5 text-gray-700 mt-3">
                          <li>Impactful Instructor Led Training</li>
                          <li>Wide range of Training dates.</li>
                        </ul>
                      </div>
                      <div className="mt-8 flex gap-4">
                        <FormModal buttonText="Training" modalType="register" />
                      </div>
                      <div>
                        <img
                          src="/assets/landingpage/man_seat.png"
                          alt=""
                          className="object-contain transform scale-105 translate-y-4  md:-mt-[93px]"
                        />
                      </div>
                    </div>
                  </div>
                </section>
                {/* Certification Eligibility Section */}
                {/* <div className="max-sm:p-3 py-7">
                <section className="relative grid grid-cols-1 lg:grid-cols-[65%_30%] gap-10 items-center max-sm:p-3">
                  <div className="">
                    {courseData?.allHeadline?.eligibility && (
                      <h2 className="heading">
                        {courseData?.allHeadline?.eligibility || "Na"}
                      </h2>
                    )}

                    <p className="para my-4">
                      A leading player in the training and certifications space,
                      Scholaracad has transformed the lives of thousands of IT and
                      business professionals, by helping them upgrade their
                      skills. In response to the changing industry landscape,
                      Scholaracad is now offering management and soft skills
                      training too. Know More
                    </p>

                    <div className="mt-4">
                      {certificatelist?.map((point, i) => (
                        <div key={i} className="flex gap-3 items-start mb-3">
                          <IoCheckmarkCircleSharp className="text-[#2E318D] text-lg shrink-0 mt-1" />
                          <p className="para">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex md:justify-end justify-center items-center">
                    <img
                      src="/assets/landingpage/certificate_image.png"
                      alt=""
                      className="w-[200px] object-contain"
                    />
                  </div>
                </section>
              </div> */}

                {/* MSP Roadmap Section */}
                {hasRoadmap && (
                  <section id="MSP Roadmap" className="max-sm:p-3 py-5">
                    <div>
                      <div className="flex justify-center items-center flex-col">
                        {courseData?.allHeadline?.path && (
                          <h2 className="heading md:max-w-[80%] text-center">
                            {courseData.allHeadline.path}
                          </h2>
                        )}
                      </div>
                      <div className="mt-8">
                        <div className="roadmap">
                          {(() => {
                            const rawPoints = [
                              {
                                data: parseRoadmapPoint(courseData?.certificationPath?.pointer_one),
                                bg: "#FFD9D9",
                                badge: "W1",
                                badgeColor: "#FFB3B3",
                                icon: "/assets/landingpage/msp_three_weekicon/studying_exam.svg",
                              },
                              {
                                data: parseRoadmapPoint(courseData?.certificationPath?.pointer_two),
                                bg: "#FFD9D9",
                                badge: "W1",
                                badgeColor: "#FFB3B3",
                                icon: "/assets/landingpage/msp_three_weekicon/write.svg",
                              },
                              {
                                data: parseRoadmapPoint(courseData?.certificationPath?.pointer_three),
                                bg: "#FDF2CD",
                                badge: "W2",
                                badgeColor: "#F9DF8D",
                                icon: "/assets/landingpage/msp_three_weekicon/plan.svg",
                              },
                              {
                                data: parseRoadmapPoint(courseData?.certificationPath?.pointer_four),
                                bg: "#FDF2CD",
                                badge: "W2",
                                badgeColor: "#F9DF8D",
                                icon: "/assets/landingpage/msp_three_weekicon/practise_exam.svg",
                              },
                              {
                                data: parseRoadmapPoint(courseData?.certificationPath?.pointer_five),
                                bg: "#E2F0CC",
                                badge: "W3",
                                badgeColor: "#9DC75C",
                                icon: "/assets/landingpage/msp_three_weekicon/bulb.svg",
                              },
                              {
                                data: parseRoadmapPoint(courseData?.certificationPath?.pointer_six),
                                bg: "#E2F0CC",
                                badge: "W3",
                                badgeColor: "#9DC75C",
                                icon: "/assets/landingpage/msp_three_weekicon/test_exam.svg",
                              },
                              {
                                data: parseRoadmapPoint(courseData?.certificationPath?.pointer_seven),
                                bg: "#E2F0CC",
                                badge: "W3",
                                badgeColor: "#9DC75C",
                                icon: "/assets/landingpage/msp_three_weekicon/teacher.svg",
                              },
                            ].filter((p) => p.data && p.data.heading);

                            return rawPoints.map((item, idx) => (
                              <div key={idx} className="point">
                                <div
                                  className="relative w-full grid grid-cols-[10%_90%] gap-3 rounded-2xl shadow-md py-8 px-4 items-center overflow-hidden"
                                  style={{ backgroundColor: item.bg }}
                                >
                                  <div>
                                    <img
                                      src={item.icon}
                                      alt={item.data.heading}
                                      className="h-10 w-auto object-contain"
                                    />
                                  </div>
                                  <div>
                                    <h2 className="text-2xl font-black mb-3">
                                      {item.data.heading}
                                    </h2>
                                    <p className="text-[#747474]">
                                      {item.data.text || ""}
                                    </p>
                                  </div>
                                  <div className="absolute bottom-5 -right-2 translate-y-1/2">
                                    <div className="bg-white rounded-full w-[80px] h-[80px] flex items-center justify-center shadow-md">
                                      <h2
                                        className="font-bold text-2xl"
                                        style={{ color: item.badgeColor }}
                                      >
                                        {item.badge}
                                      </h2>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </section>
                )}
                {courseData?.courseInstructor?.length > 0 && (
                  <div className="max-sm:p-3 bg-[#F7F3FF] border border-gray-200 pb-2 pt-6 px-3 rounded-md">
                    <h2 className="heading max-w-[80%] mx-auto text-center ">
                      {courseData?.allHeadline?.trainers ||
                        "Meet the Instructors"}
                    </h2>
                    <div className="read-more-wrapper">
                      <input
                        type="checkbox"
                        id="toggle-desc-trainers"
                        className="read-more-toggle"
                      />

                      <div
                        className="summernote-content prose max-w-none read-more-content"
                        dangerouslySetInnerHTML={{
                          __html: courseData?.courseDescription?.trainers,
                        }}
                      />

                      <label
                        htmlFor="toggle-desc-trainers"
                        className="read-more-btn"
                      >
                        <span className="more">Read More</span>
                        <span className="less">Read Less</span>
                      </label>
                    </div>
                    <div className="overflow-hidden mt-8 py-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-[50px] transition-all ml-10 duration-700 ease-in-out">
                        {getVisibleInstructors().map((trainer, index) => (
                          // <div
                          //   key={index}
                          //   className="relative flex flex-col items-center"
                          // >
                          //   <div className="absolute -top-10  rounded-full border-4 border-white shadow-md overflow-hidden flex items-center justify-center bg-white">
                          //     {trainer?.image ? (
                          //       <img
                          //         src={trainer.image}
                          //         alt={trainer.trainer_name}
                          //         className="w-full h-full object-cover"
                          //       />
                          //     ) : (
                          //       <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200">
                          //         <span className="text-gray-600 font-semibold text-xl">
                          //           {trainer?.trainer_name
                          //             ?.split(" ")
                          //             .map((word) => word[0])
                          //             .join("")
                          //             .slice(0, 2)
                          //             .toUpperCase()}
                          //         </span>
                          //       </div>
                          //     )}
                          //   </div>
                          //   <div className="bg-white p-4 pt-16 rounded-xl border border-[#A1A4FF] text-center shadow-sm w-full h-[300px]">
                          //     <h2 className="text-[25px] font-semibold">
                          //       {trainer?.trainer_name}
                          //     </h2>
                          //     <p className="text-[#2E318D]">
                          //       Experience : {trainer?.trainer_experience}
                          //     </p>
                          //     <div className="summernote-content prose max-w-none mt-1 max-h-30 overflow-hidden">
                          //       <div
                          //         dangerouslySetInnerHTML={{
                          //           __html:
                          //             trainer?.trainer_description ||
                          //             "No Details Available",
                          //         }}
                          //       />
                          //     </div>
                          //     <button
                          //       onClick={() => setSelectedTrainer(trainer)}
                          //       className="mt-2 text-sm font-medium text-[#2563eb] hover:underline cursor-pointer"
                          //     >
                          //       Read More
                          //     </button>

                          //     {selectedTrainer && (
                          //       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                          //         <div className="bg-white w-full max-w-3xl mx-4 rounded-xl shadow-lg relative animate-fadeIn">
                          //           <button
                          //             onClick={() => setSelectedTrainer(null)}
                          //             className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-black text-xl"
                          //           >
                          //             <IoCloseOutline />
                          //           </button>
                          //           <div className="p-2 border-b">
                          //             <h2 className="text-2xl font-semibold">
                          //               {selectedTrainer?.trainer_name || "NA"}
                          //             </h2>
                          //             <p className="text-[#2E318D]">
                          //               Experience :{" "}
                          //               {selectedTrainer?.trainer_experience ||
                          //                 "NA"}
                          //             </p>
                          //           </div>
                          //           <div className="p-3 max-h-[60vh] overflow-y-auto">
                          //             <div
                          //               className="summernote-content prose max-w-none"
                          //               dangerouslySetInnerHTML={{
                          //                 __html:
                          //                   selectedTrainer?.trainer_description ||
                          //                   "No Details Available",
                          //               }}
                          //             />
                          //           </div>
                          //         </div>
                          //       </div>
                          //     )}
                          //   </div>
                          // </div>
                          <div key={index} className="relative flex justify-center py-14">
                            {/* Review Badge */}
                            <div className="absolute top-7 left-[-30px] w-[250px] bg-[#882CFB] text-white px-5 py-3 rounded-tr-2xl border-none">
                              <p className="text-sm font-semibold uppercase ">
                                {trainer?.trainer_name}
                              </p>
                              <div className="flex justify-between items-center  text-sm mt-1">
                                <p className="uppercase text-white">Experience</p>  {trainer?.trainer_experience || "NA"}
                              </div>
                              <div className="absolute -bottom-3 left-[1px] w-0 h-0 border-l-[30px] border-l-transparent border-r-[1px] border-r-transparent border-t-[12px] border-t-[#882CFB]"></div>
                            </div>
                            <div className="absolute top-6 right-2 w-26 h-26 rounded-full border-[10px] border-white  overflow-hidden bg-white flex items-center justify-center">
                              <div class="bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center">
                                {trainer?.image ? (
                                  <img
                                    src={trainer.image}
                                    alt={trainer.trainer_name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-gray-600 font-semibold text-lg">
                                    {trainer?.trainer_name
                                      ?.split(" ")
                                      .map((word) => word[0])
                                      .join("")
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Card */}
                            <div className="bg-white pt-16 pb-6 px-6 rounded-sm   border-[#E5E5E5] text-center w-full max-w-md min-h-[260px]">
                              <div className="summernote-content prose max-w-none text-sm text-gray-600 line-clamp-6">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: trainer?.trainer_description || "No Details Available",
                                  }}
                                />
                              </div>
                              {/* Read More */}
                              <div class="flex justify-end">
                                <button
                                  onClick={() => setSelectedTrainer(trainer)}
                                  className="mt-3 text-sm font-medium text-[#882CFB] hover:text-[#7221D8] flex gap-1 items-center  cursor-pointer"
                                >
                                  Explore <MdOutlineExplore />

                                </button>
                              </div>
                            </div>

                            {/* Modal */}
                            {selectedTrainer && (
                              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ">
                                <div className="bg-white w-full max-w-xl rounded-2xl  relative p-1 ">
                                  {/* Close Button */}
                                  <button
                                    onClick={() => setSelectedTrainer(null)}
                                    className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-black text-2xl"
                                  >
                                    <IoCloseOutline />
                                  </button>
                                  {/* Header */}
                                  <div className="p-4  text-center border-b border-gray-300 bg-gradient-to-br from-[#882CFB]/25 to-[#FAF8FE] rounded-xl">
                                    <div class="flex gap-2 ">
                                      <div class="bg-[#882CFB] text-white w-16 h-16 rounded-full flex items-center justify-center">
                                        {trainer?.image ? (
                                          <img
                                            src={trainer.image}
                                            alt={trainer.trainer_name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <span className="text-white font-semibold text-lg">
                                            {trainer?.trainer_name
                                              ?.split(" ")
                                              .map((word) => word[0])
                                              .join("")
                                              .slice(0, 2)
                                              .toUpperCase()}
                                          </span>
                                        )}
                                      </div>
                                      <div class="text-left">
                                        <h2 className="text-xl font-semibold">
                                          {selectedTrainer?.trainer_name || "NA"}
                                        </h2>
                                        <p className="text-[#2E318D] text-xs mt-1 font-bold bg-white border rounded-full px-1  border-gray-100">
                                          Experience : {selectedTrainer?.trainer_experience || "NA"}
                                        </p>
                                      </div>

                                    </div>
                                  </div>
                                  {/* Content */}
                                  <div className="p-5 max-h-[60vh] overflow-y-auto  ">
                                    <div
                                      className="summernote-content prose max-w-none"
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          selectedTrainer?.trainer_description ||
                                          "No Details Available",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Certificate Section */}
                {(courseData?.allHeadline?.certifications ||
                  (courseData?.certificationText?.description &&
                    courseData.certificationText.description.replace(/<[^>]*>/g, "").trim() !== "") ||
                  courseData?.certificationImage?.image_path) && (
                  <section className=" max-sm:p-3 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-sm:gap-10 item-start justify-center">
                      <div>
                        <h2 className="heading md:max-w-[90%] w-full  ">
                          {courseData?.allHeadline?.certifications}
                        </h2>
                        {courseData?.certificationText?.description && (
                          <div
                            className="summernote-content prose max-w-none  "
                            dangerouslySetInnerHTML={{
                              __html: courseData.certificationText.description,
                            }}
                          ></div>
                        )}
                      </div>
                      {courseData?.certificationImage?.image_path && (
                        <div className="flex md:justify-end justify-center ">
                          <div className="bg-gray-50 border-1 border-gray-200 rounded-lg  p-3 max-w-[70%]  flex justify-center item-center  w-full  ">
                            <img
                              src={normalizeImageUrl(
                                courseData.certificationImage.image_path,
                                "/assets/images/new-dynamic-course/certificate.jpg"
                              )}
                              alt="Certificate"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                              className="object-contain w-full h-auto rounded-md shadow-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Get  Certified Section */}
                {courseData?.allHeadline?.course_benefits && (
                  <section className="py-5 max-sm:p-3">
                    <div className="p-6 bg-[#EDE3FF] rounded-md border border-gray-300 ">
                      <h2 className="heading text-center md:max-w-[80%] m-auto">
                        {courseData?.allHeadline?.course_benefits}
                      </h2>
                      <div
                        className="summernote-content prose max-w-none mt-3"
                        dangerouslySetInnerHTML={{
                          __html:
                            courseData?.courseBenefits
                              ?.why_course_important_readmore ||
                            "No Details Available",
                        }}
                      ></div>
                    </div>
                  </section>
                )}

                {/* Trending Courses Card Section */}
                <section className="max-sm:p-3 py-7">
                  <div className="trending_coursesbg p-5 text-[#2E318D] rounded-md border border-gray-300 ">
                    <div className="grid md:grid-cols-3 grid-cols-1 md:max-w-[90%] m-auto">
                      <div>
                        <img
                          src="/assets/landingpage/menwith_laptop.png"
                          alt=""
                          className="object-contain transform scale-105 translate-y-4  md:-mt-[80px] max-sm:mb-12"
                        />
                      </div>
                      <div>
                        <h2 className="font-bold text-2xl">
                          {" "}
                          Trending Courses{" "}
                        </h2>
                        <ul className="list-disc pl-5 text-gray-700 mt-3">
                          <li>Impactful Instructor Led Training</li>
                          <li>Wide range of Training dates.</li>
                        </ul>
                      </div>
                      <div className="mt-8 flex gap-4">
                        <FormModal
                          buttonText="View Schedule"
                          modalType="register"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/*Learning Benefits - Dynamic from backend only */}
                {learningObjectivesList && learningObjectivesList.length > 0 && (
                  <section className="py-5 max-sm:p-3 max-sm:pb-12 rounded-md">
                    <div className="flex justify-center items-center flex-col ">
                      <h2 className="heading md:max-w-[70%] m-auto text-center">
                        {courseData?.allHeadline?.old_learning_objectives ||
                          "Learning Objective - Skills & knowledge you will get from this course"}
                      </h2>
                    </div>
                    <section className="mt-12">
                      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-[70px] gap-[50px]">
                        {learningObjectivesList.map((item, idx) => (
                          <div key={idx} className="relative">
                            <div
                              className="text-white text-2xl font-bold w-full h-30 rounded-lg flex items-center pl-5"
                              style={{ backgroundColor: item.color }}
                            >
                              {item.num}
                            </div>
                            <div className="absolute -top-[20px] left-0 right-0 ml-[70px] mx-auto bg-white rounded-lg p-2 md:w-[90%] h-30 overflow-hidden border border-gray-200">
                              <h3 className="text-lg font-semibold mb-2">
                                {item.data.heading}
                              </h3>
                              <p className="text-gray-500 text-sm leading-relaxed">
                                {item.data.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </section>
                )}

                {/* Hub for Technology Section */}
                {Array.isArray(courseData?.aboutGeography) &&
                  courseData.aboutGeography.length > 0 && (
                    <section className="py-5 max-sm:p-3">
                      <div className="flex justify-center items-center flex-col ">
                        <h2 className=" heading text-center max-w-[80%] m-auto">
                          {courseData?.allHeadline?.about_geography ? (
                            <>{courseData.allHeadline.about_geography}</>
                          ) : (
                            <>A Hub for Technology, Learning, and Careers</>
                          )}
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-3 mt-3">
                        <div className="flex gap-4 flex-col">
                          {courseData.aboutGeography.map((item, index) => (
                            <div
                              key={index}
                              className="bg-white border border-gray-200   rounded-md p-3"
                            >
                              <div className="read-more-wrapper">
                                <input
                                  type="checkbox"
                                  id="toggle-desc-aboutgeography"
                                  className="read-more-toggle"
                                />
                                <div
                                  className="summernote-content  prose max-w-none read-more-content"
                                  dangerouslySetInnerHTML={{
                                    __html: item?.description,
                                  }}
                                />

                                <label
                                  htmlFor="toggle-desc-aboutgeography"
                                  className="read-more-btn"
                                >
                                  <span className="more">Read More</span>
                                  <span className="less">Read Less</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                {/* YouTube Video Section */}
                <>
                  {courseData?.youtubeVideos?.length > 0 && (
                    <section className="py-5 max-sm:p-3 ">
                      <h2 className="heading text-center">
                        Initiate Your Journey with These Essential Resources
                      </h2>

                      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                        {courseData?.youtubeVideos
                          ?.slice(0, 3)
                          .map((video, index) => {
                            const videoId = getVideoId(video?.video_url);
                            return (
                              <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-xl  overflow-hidden hover:shadow-xl transition p-3"
                              >
                                <div
                                  className="w-full h-48 bg-black cursor-pointer rounded-lg overflow-hidden"
                                  onClick={() => setActiveVideo(index)}
                                >
                                  <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                  ></iframe>
                                </div>
                                <h3 className="mt-3 Sub_heading_black">
                                  {video?.video_description?.length > 30
                                    ? video?.video_description.slice(0, 30) +
                                    "..."
                                    : video?.video_description}
                                </h3>
                                <button
                                  title="Watch Now"
                                  onClick={() =>
                                    window.open(video?.video_url, "_blank")
                                  }
                                  className="bg-[#882CFB] cursor-pointer hover:bg-[#7221D8] text-white w-full mt-4 py-2 rounded-lg font-medium"
                                >
                                  Watch Now
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </section>
                  )}
                </>

                {/* Expert Articles  Section */}
                <section className="py-5 max-sm:p-3">
                  <div className="relative max-w-7xl mx-auto text-center rounded-md overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center object-contain"
                      style={{
                        backgroundImage:
                          "url('/assets/landingpage/courses/course2.svg')",
                      }}
                    ></div>
                    <div className="absolute top-0 bottom-0 left-0 w-[90%] bg-gradient-to-r from-indigo-800 to-indigo-700/10"></div>
                    <div className="relative grid grid-cols-1 md:grid-cols-2 max-sm:gap-6 md:p-10 p-5 text-white">
                      <div className="text-left flex flex-col justify-center">
                        <h2 className="heading_white ">
                          Expert Articles on{" "}
                          <span>
                            {url_title
                              ?.replace(/-/g, " ")
                              ?.replace(/\s+/g, " ")
                              ?.trim()
                              ?.replace(/\b\w/g, (c) => c.toUpperCase())}
                          </span>
                        </h2>
                        <div className="w-[180px] mt-5">
                          {/* <FormModal
                            buttonText="Expert Articles"
                            modalType="register"
                          /> */}
                          <Link href="/resource/article">
                            <button className="btn_primary cursor-pointer ">
                              <span className="select-none">Expert Articles</span>
                              <HiMiniArrowLongRight />
                            </button>
                          </Link>
                        </div>

                      </div>
                      <div></div>
                    </div>
                  </div>
                </section>
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
                    <div className="grid grid-cols-1  md:grid-cols-3 gap-6 flex-1 my-5">
                      {Recentblogs && Recentblogs?.length > 0 ? (
                        Recentblogs?.slice(0, 3)?.map((blog) => (
                          <div
                            key={blog.id}
                            className="bg-white border border-gray-300 shadow-sm rounded-lg  overflow-hidden hover:shadow-lg transition"
                          >
                            <img
                              src={
                                blog.header_image
                                  ? `${API_BASE_URL}/master/secure-documents?path=${blog?.header_image}`
                                  : ""
                              }
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

                {/* Learner Segment Section */}
                {Boolean(courseData?.allHeadline?.segment) && (
                  <section className="py-5 max-sm:p-3">
                    <div className="flex justify-center items-center flex-col ">
                      <h2 className=" heading text-center md:max-w-[85%] w-full m-auto">
                        {courseData.allHeadline.segment}
                      </h2>
                    </div>
                    <div className="mt-10 flex justify-center items-center">
                      <img
                        src="/assets/landingpage/msp_practitioner_certificate_img.png"
                        alt=""
                        className="bg-cover bg-center object-contain"
                      />
                    </div>
                  </section>
                )}

                {/* Cities we serve */}
                <section className="py-5 max-sm:p-3">
                  <div className="flex justify-center items-center flex-col ">
                    <h2 className="heading text-center max-w-[80%] m-auto">
                      We also deliver{" "}
                      <span className="px-2">
                        {url_title
                          ?.replace(/-/g, " ")
                          ?.replace(/\s+/g, " ")
                          ?.trim()
                          ?.replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>{" "}
                      across multiple locations
                    </h2>
                  </div>
                  <div className="practitioner_location_bg mt-7 ">
                    <div className="  max-h-[70vh] overflow-y-auto">
                      <div className="flex flex-col justify-center items-center">
                        <h2 className="text-xl text-[#2F328F] font-bold py-4 text-center  ">
                          State and Cities We Serve
                        </h2>
                        {/* <div className="h-[5px] w-[120px] bg-white"></div> */}
                      </div>
                      <hr className="text-black" />
                      <div className="p-8   w-full  ">
                        <div className="grid  grid-cols-1 md:grid-cols-4 gap-8 mt-3 mb-10">
                          {/* {statelist?.map((state, index) => (
                            <Link
                              key={index}
                              href={{
                                pathname: `/${active_country}/${url_title}/${state?.name
                                  ?.toLowerCase()
                                  .trim()
                                  .replace(/\s+/g, "-")}`,
                              }}
                              className="flex gap-2 items-center text-md  transition hover:underline hover:text-[#882CFB]"
                            >
                              <TfiLocationPin className="" />
                              <span>{state?.name || "NA"}</span>
                            </Link>
                          ))} */}
                          {statelist?.map((state, index) => {
                            if (state?.url === active_state_city) return null;
                            return (
                              <Link
                                key={index}
                                href={{
                                  pathname: `/${url_title}/${state?.url}`,
                                }}
                                className="flex gap-2 items-center text-md transition hover:underline hover:text-[#882CFB]"
                              >
                                <TfiLocationPin />
                                <span>{state?.name || "NA"}</span>
                              </Link>
                            );
                          })}
                          {/* {citylist?.map((city, index) => (
                            <Link
                              title={city?.name}
                              key={index}
                              href={{
                                pathname: `/${active_country}/${url_title}/${city?.name
                                  ?.toLowerCase()
                                  .trim()
                                  .replace(/\s+/g, "-")}`,
                              }}
                              className="flex gap-2 items-center text-md  transition hover:underline hover:text-[#882CFB]"
                            >
                              <TfiLocationPin className="" />
                              <span>{city?.name || "NA"}</span>
                            </Link>
                          ))} */}
                          {citylist?.map((city, index) => {
                            const cityUrl =
                              city?.url ||
                              city?.name
                                ?.toLowerCase()
                                ?.trim()
                                ?.replace(/\s+/g, "-");
                            if (city?.url === active_state_city || cityUrl === active_state_city) return null;
                            return (
                              <Link
                                title={city?.name}
                                key={index}
                                href={{
                                  pathname: `/${url_title}/${cityUrl}`,
                                }}
                                className="flex gap-2 items-center text-md transition hover:underline hover:text-[#882CFB]"
                              >
                                <TfiLocationPin />
                                <span>{city?.name || "NA"}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Course Curriculum FAQ Section */}
                <section className="py-2 max-sm:p-3">
                  {courseData?.courseCurriculumFAQ?.description && (
                    <div className="flex justify-center items-center flex-col">
                      <h2 className=" heading text-center">
                        {courseData?.allHeadline?.curriculum}
                      </h2>
                    </div>
                  )}
                  <div className="">
                    {faq?.title && (
                      <Accordion singleOpen defaultOpen={0}>
                        <Accordion.Item
                          title={
                            faq?.title.length > 10
                              ? faq?.title.slice(0, 10) + "..."
                              : faq?.title
                          }
                        >
                          <div
                            className="summernote-content"
                            dangerouslySetInnerHTML={{
                              __html: faq?.description,
                            }}
                          />
                        </Accordion.Item>
                      </Accordion>
                    )}
                  </div>
                </section>

                {/* FAQ Section */}
                {pmpcertificatetabs && pmpcertificatetabs.length > 0 && (
                <section id="FAQs" className="">
                  <section className="pb-7 max-sm:p-3">
                    <div className="flex justify-center mb-3 ">
                      <div>
                        {/* <RiGraduationCapFill className="text-[#2E318D] text-4xl rotate-350 ml-[-15px] mb-[-5px] " /> */}
                        <h2 className="heading  ">General FAQs</h2>
                      </div>
                    </div>
                    <div className="bg-[#F7F3FF] border border-gray-200 pb-2 pt-6 px-3 rounded-md">
                      <Tabs tabs={pmpcertificatetabs} />
                    </div>
                  </section>
                </section>
                )}

                {/* Contact Advisor card Section */}
                <section className="py-2 max-sm:p-3">
                  <div className="relative  text-center rounded-md overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center object-contain"
                      style={{
                        backgroundImage:
                          "url('/assets/landingpage/courses/course2.svg')",
                      }}
                    ></div>
                    <div className="absolute top-0 bottom-0 left-0 w-[90%] bg-gradient-to-r from-indigo-800 to-indigo-700/10"></div>
                    <div className="relative grid grid-cols-1 md:grid-cols-2 max-sm:gap-6 md:p-10 p-5 text-white">
                      <div className="text-left flex flex-col justify-center py-12">
                        <h2 className="heading_white">
                          Have more questions or need personalized guidance ?
                        </h2>
                        <div className="w-[200px] mt-8">
                          <FormModal
                            buttonText=" Contact Advisor"
                            modalType="register"
                          />
                        </div>
                      </div>
                      <div></div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            {/* Top Companies Section */}
            {Array.isArray(courseData?.hiringCompanies) &&
              courseData.hiringCompanies.length > 0 && (
                <section className="max-w-7xl mx-auto  py-10 max-sm:p-3">
                  <div className="flex justify-center items-center flex-col ">
                    <h2 className=" heading text-center max-w-[80%] m-auto">
                      {courseData?.allHeadline?.hiring_company ? (
                        <>{courseData?.allHeadline?.hiring_company}</>
                      ) : (
                        <>Top Hiring Companies</>
                      )}
                    </h2>
                  </div>
                  <div className="overflow-x-auto mt-10 border border-gray-100 rounded-md">
                    <div className="min-w-[600px] grid grid-cols-4 font-semibold bg-gray-100 text-gray-600 text-sm sm:text-md p-3 mb-2">
                      <div className="text-left">Company Name</div>
                      <div className="text-left">Role</div>
                      <div className="text-left">Job Description</div>
                      <div className="text-right">Job Link</div>
                    </div>
                    {/* <hr className="border-1 border-gray-300 my-2"/> */}
                    <div className="min-w-[600px]">
                      {courseData?.hiringCompanies &&
                        courseData?.hiringCompanies?.length > 0 ? (
                        courseData?.hiringCompanies
                          .slice(0, 5)
                          .map((item, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-4 items-center bg-white hover:bg-gray-100 text-gray-800   p-3 border-b border-gray-200 transition duration-200"
                            >
                              <div className="truncate">
                                {item?.company_name}
                              </div>
                              <div className="font-medium truncate">
                                {item?.job_role}
                              </div>

                              <div
                                className="truncate cursor-pointer text-[#882CFB] hover:underline"
                                onClick={() => openModal(item)}
                              >
                                {item?.job_description}
                              </div>

                              <div className="text-right">
                                <Link
                                  title={item?.job_link}
                                  href={item?.job_link || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="border border-[#4B2ECC] text-[#4B2ECC] bg-white rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm hover:bg-[#4B2ECC] hover:text-white transition"
                                >
                                  View Job
                                </Link>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-xl">
                          No data available
                        </div>
                      )}

                      {isModalOpen && (
                        <div
                          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-start justify-center pt-10 z-50 transition-opacity duration-300"
                          onClick={closeModal}
                        >
                          <div
                            className="bg-white w-11/12 sm:w-2/3 md:w-1/2 rounded-lg overflow-hidden animate-[fadeInScale_.25s_ease-out]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex justify-between items-center bg-[#882CFB] px-6 py-4">
                              <h2 className="text-md  font-semibold text-white leading-tight">
                                {selectedJob?.job_role} Job Description at{" "}
                                {selectedJob?.company_name}
                              </h2>
                              <button
                                title="Close Modal"
                                onClick={closeModal}
                                className="w-6 h-6 cursor-pointer flex items-center justify-center bg-white rounded-full text-[#4B2ECC] font-bold hover:bg-gray-100 transition"
                              >
                                <IoClose />
                              </button>
                            </div>
                            <div className="p-6 para max-h-[65vh] overflow-y-auto whitespace-pre-line">
                              {selectedJob?.job_description}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}
            {/* PPM Certificate Section */}
            {Array.isArray(courseData?.courseAlumni) &&
              courseData.courseAlumni.length > 0 && (
                <section className=" py-5 max-sm:p-4">
                  <div className="max-w-7xl mx-auto  bg-[#372AAB] rounded-md">
                    <div className="flex  items-center p-8">
                      <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-6 w-full">
                        <div className=" text-white ">
                          <h2 className="Sub_heading_white ">
                            {courseData?.allHeadline?.alumni ? (
                              <>{courseData.allHeadline.alumni}</>
                            ) : (
                              <>Alumni Success Stories</>
                            )}
                          </h2>
                        </div>
                        <div className=" text-white max-sm:p-3 p-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {courseData.courseAlumni
                              .slice(0, 6)
                              .map((item, index) => (
                                <Link
                                  href={item?.company_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  key={index}
                                  className="bg-white text-gray-800 text-center p-3 transform skew-x-[-18deg] shadow-lg hover:scale-105 transition-transform duration-300 block"
                                >
                                  <div className="transform skew-x-[12deg] text-wrap">
                                    {item?.company_name || "NA"}
                                  </div>
                                </Link>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

            {/* Recommended Course Section */}
            {courseData?.allHeadline?.recommended_course && (
              <section className="max-w-7xl mx-auto py-5 max-sm:p-3  ">
                <div className="view-all_instructor_bg rounded-md">
                  <div className=" grid grid-cols-1 md:grid-cols-2 max-sm:gap-6 md:p-10 p-5 text-white">
                    <div className="text-left flex flex-col justify-center">
                      <h2 className="Sub_heading_white ">
                        {courseData?.allHeadline?.recommended_course ||
                          "Recommended Course"}
                      </h2>
                      <div className="flex flex-col gap-4 mt-3">
                        <p className="flex gap-2 item-center">
                          <span>
                            <GiCheckMark className="mt-1" />
                          </span>
                          <span>
                            {courseData?.allHeadline?.roc_option1 || "Na"}
                          </span>
                        </p>
                        <p className="flex gap-2 item-center">
                          <span>
                            <GiCheckMark className="mt-1" />
                          </span>
                          <span>
                            {courseData?.allHeadline?.roc_option2 || "Na"}
                          </span>
                        </p>
                        <p className="flex gap-2 item-center">
                          <span>
                            <GiCheckMark className="mt-1" />
                          </span>
                          <span>
                            {courseData?.allHeadline?.roc_option3 || "Na"}
                          </span>
                        </p>
                      </div>
                      <div className="mt-8 flex gap-4">
                        <div className="w-[300px] ">
                          <FormModal
                            buttonText="Enroll Now"
                            modalType="register"
                          />
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              </section>
            )}
            {/* Top Catagories Section */}
            <section
              id="topcourses"
              className="max-w-7xl mx-auto  py-5 max-sm:p-3"
            >
              <div>
                <h3 className="font-bold text-lg ">Top Catagories</h3>
                <div className="mt-2 flex flex-wrap">
                  {categories?.map((item, index) => (
                    <Link
                      href={{
                        pathname: `/category-courses/${item?.page_link}`,
                        query: { id: encryptId(item?.id) },
                      }}
                      key={item?.id}
                      className={`hover:text-[#2E318D] cursor-pointer transition text-[#696969] pr-3 ${index !== categories.length - 1
                        ? "border-r border-[#696969] pr-3"
                        : "pl-3"
                        } pl-3`}
                    >
                      {item?.category_name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <h3 className="font-bold text-lg ">Trending Courses</h3>
                <div className="mt-2 flex flex-wrap">
                  {/* {categories?.flatMap((category) =>
                    category?.cources?.map((course) => (
                      <Link
                        key={course?.id}
                        href={{
                          pathname: `/${active_country}/${slugify(
                            course?.url_title,
                          )}`,
                        }}
                        className="hover:text-[#2E318D] cursor-pointer transition text-[#696969] px-3 border-r border-[#696969]"
                      >
                        {course?.course_short_name}
                      </Link>
                    )),
                  )} */}

                  {categories?.flatMap((category) =>
                    category?.cources?.map((course) =>
                      course?.isTranding === "Yes" ? (
                        <Link
                          key={course?.id}
                          href={{
                            pathname: `/${slugify(course?.url_title)}`,
                          }}
                          className="hover:text-[#2E318D] cursor-pointer transition text-[#696969] px-3 border-r border-[#696969]"
                        >
                          {course?.course_short_name}
                        </Link>
                      ) : null
                    )
                  )}
                </div>
              </div>
            </section>
            {/* <Testimonials /> */}
            <section className="">
              <div className="grid grid-cols-1 md:grid-cols-2  w-full">
                <div className="w-full p-4 bg-[#F7F3FF]">
                  <div className="max-w-[500px]  mx-auto ">
                    <h1
                      data-aos="fade-up"
                      className="md:max-w-[90%] heading mt-3 "
                    >
                      Testimonials
                    </h1>

                    <div className="w-full max-w-lg mx-auto relative overflow-hidden my-5">
                      {Array.isArray(testimonialList) &&
                        testimonialList.length > 0 ? (
                        <>
                          {/* SLIDER */}
                          <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                              transform: `translateX(-${activeSlidetestimonials * 100}%)`,
                            }}
                          >
                            {testimonialList
                              .slice(0, 10)
                              .map((testimonial, index) => (
                                <div
                                  key={index}
                                  data-aos="fade-up"
                                  className="flex-shrink-0 w-full flex flex-col items-center bg-white rounded-sm p-6 min-h-[250px] space-y-4 border-b-[4px] border-[#882CFB]"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                                      {testimonial?.image ? (
                                        <img
                                          src={testimonial?.image}
                                          alt={testimonial?.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <span className="text-gray-600 font-semibold text-xl">
                                          {testimonial?.name
                                            ?.split(" ")
                                            .map((word) => word[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                        </span>
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="text-2xl font-bold text-gray-900">
                                        {testimonial?.name}
                                      </h3>
                                      <p className="text-gray-500">
                                        {testimonial?.job_position}
                                      </p>
                                      {/* Stars */}
                                      <div className="flex gap-1 text-yellow-400 mt-2">
                                        {[...Array(5)].map((_, i) => (
                                          <svg
                                            key={i}
                                            className="w-5 h-5 fill-current"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                          >
                                            <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.955L10 0l2.95 5.955 6.562.955-4.756 4.635 1.122 6.545z" />
                                          </svg>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <p className="text-center text-gray-700 italic mt-3 flex items-start justify-center gap-2">
                                    <span>"{testimonial?.comment}"</span>
                                  </p>
                                </div>
                              ))}
                          </div>

                          {/* DOTS NAVIGATION */}
                          {testimonialList.length > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                              {testimonialList.slice(0, 10).map((_, index) => (
                                <button
                                  key={index}
                                  className={`w-3 h-3 rounded-full transition-all ${activeSlidetestimonials === index
                                    ? "bg-gray-800"
                                    : "bg-gray-300"
                                    }`}
                                  onClick={() =>
                                    setActiveSlidetestimonials(index)
                                  }
                                />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        /* EMPTY STATE */
                        <div className="flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-md p-8 min-h-[200px]">
                          <span className="text-4xl mb-3">💬</span>
                          <h3 className="text-lg font-semibold text-gray-700">
                            No testimonials
                          </h3>
                        </div>
                      )}
                    </div>

                    <img
                      data-aos="fade-up"
                      src="/assets/landingpage/rating_group_img.svg"
                      alt="Rating Image"
                    />
                  </div>
                </div>
                {/* Second Column */}
                <div className="w-full bg-gray-900  p-4 shadow-lg space-y-6 ">
                  <div className="max-w-[90%]  mx-auto my-3">
                    <h1 className="md:max-w-[90%] heading_white px-2">
                      Contact Us
                    </h1>
                    <Contactus />
                  </div>
                </div>
              </div>
            </section>
          </section>
        </>
      )}
      {/* Footer */}
      <Footer />
    </>
  );
}

export default DynamicPage;
export async function getServerSideProps({ req, params }) {
  const token = req.cookies?.access_token || null;
  const rawSlug = params.slug || [];
  const slug = Array.isArray(rawSlug) ? rawSlug : [rawSlug];

  // 1. If URL starts with "/in/", 308 permanent redirect to clean URL without "/in/"
  if (slug.length > 0 && slug[0]?.toLowerCase() === "in") {
    const cleanSegments = slug.slice(1);
    const destination = cleanSegments.length > 0 ? `/${cleanSegments.join("/")}` : "/";
    return {
      redirect: {
        destination,
        permanent: true,
      },
    };
  }

  const quizIdx = slug.findIndex(
    (s) => ["quizzes", "quiz", "quizz"].includes(s?.toLowerCase())
  );

  const SUPPORT_PAGE_SLUGS = [
    "syllabus",
    "notes",
    "exam",
    "exam-format",
    "eligibility",
    "study-plan",
    "corporate-training",
    "practice-test",
    "faqs",
    "certification-benefits",
    "certification-guide",
  ];

  const isCountryPrefix =
    slug.length >= 2 && slug[0]?.length === 2;
  const active_country = isCountryPrefix ? slug[0] : "in";
  const url_title = isCountryPrefix
    ? slug[1]
    : slug.length >= 1
    ? slug[0]
    : null;
  const candidateSubSlug =
    quizIdx === -1
      ? (isCountryPrefix ? slug[2] : slug[1])?.toLowerCase() || null
      : null;

  let matchedSupportPage =
    candidateSubSlug && SUPPORT_PAGE_SLUGS.includes(candidateSubSlug)
      ? candidateSubSlug
      : null;
  let customSupportData = null;

  if (!matchedSupportPage && url_title && candidateSubSlug) {
    try {
      const probeRes = await fetch(
        `${API_BASE_URL}/api/courses/${url_title}/support/${candidateSubSlug}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (probeRes.ok) {
        const probeJson = await probeRes.json();
        if (probeJson?.status && probeJson?.data) {
          matchedSupportPage = candidateSubSlug;
          customSupportData = probeJson.data;
        }
      }
    } catch (e) {
      // not a support page, continue
    }
  }

  const isSyllabus = matchedSupportPage === "syllabus";
  const isNotes = matchedSupportPage === "notes";
  const isSupportPage = Boolean(matchedSupportPage);

  const isQuestionsScreen =
    quizIdx !== -1 &&
    slug.length > quizIdx + 2 &&
    ["questions", "start", "exam", "practice"].includes(
      slug[quizIdx + 2]?.toLowerCase()
    );
  const isQuizDetail =
    quizIdx !== -1 && slug.length > quizIdx + 1 && !isQuestionsScreen;
  const quiz_slug =
    isQuizDetail || isQuestionsScreen ? slug[quizIdx + 1] : null;
  const isQuizzes = quizIdx !== -1 && !isQuizDetail && !isQuestionsScreen;

  const filteredSlug = slug.filter(
    (s, idx) =>
      !SUPPORT_PAGE_SLUGS.includes(s?.toLowerCase()) &&
      (!matchedSupportPage || s?.toLowerCase() !== matchedSupportPage.toLowerCase()) &&
      !["quizzes", "quiz", "quizz"].includes(s?.toLowerCase()) &&
      (!isQuizDetail && !isQuestionsScreen ? true : idx !== quizIdx + 1) &&
      (!isQuestionsScreen ? true : idx !== quizIdx + 2)
  );

  const active_state = isCountryPrefix
    ? filteredSlug[2] || null
    : filteredSlug[1] || null;

  const protocol = req.headers["x-forwarded-proto"] || "http";
  const pageUrl = `${protocol}://${req.headers.host}${req.url}`;

  if (customSupportData) {
    const seoData = customSupportData?.seo || {};
    const supportPage = customSupportData?.support_page || {};
    const course = customSupportData?.course || {};
    const pageLabel = matchedSupportPage
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const metaTitle =
      seoData?.title ||
      supportPage?.title ||
      `${course?.name || url_title} ${pageLabel} | ScholarAcad`;
    const metaDescription =
      seoData?.description ||
      `Explore ${pageLabel.toLowerCase()} and details for ${course?.name || url_title}.`;

    const schemaData =
      customSupportData?.schema ||
      customSupportData?.course?.schema ||
      generateSupportPageSchema({
        title: metaTitle,
        description: metaDescription,
        pageUrl,
        courseName: course?.name || course?.course_title || url_title,
        courseData: customSupportData,
        breadcrumbs: [
          { name: "Home", url: "/" },
          { name: "All Courses", url: "/all-courses" },
          { name: course?.name || url_title, url: `/${url_title}` },
          { name: pageLabel, url: pageUrl },
        ],
      });

    return {
      props: {
        title: metaTitle,
        description: metaDescription,
        keywords: null,
        ogTitle: metaTitle,
        ogDescription: metaDescription,
        ogUrl: pageUrl,
        courseData: customSupportData,
        isSupportPage: true,
        matchedSupportPage: matchedSupportPage,
        schemaData,
      },
    };
  }

  if (isQuestionsScreen && url_title && quiz_slug) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/courses/${url_title}/quizzes/${quiz_slug}/questions`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (res.status === 404 || !res.ok) {
        return { notFound: true };
      }
      const json = await res.json();
      if (!json?.status || !json?.data || !json?.data?.questions || json.data.questions.length === 0) {
        return { notFound: true };
      }
      const quizTitle = json?.data?.quiz?.title || "Exam Simulator";
      const courseName = json?.data?.course?.name || url_title;
      const metaTitle = `${quizTitle} — Questions | ScholarAcad`;
      const metaDescription = `Interactive question screen for ${quizTitle} - ${courseName}`;
      return {
        props: {
          title: metaTitle,
          description: metaDescription,
          keywords: `${quizTitle}, questions, mock exam`,
          ogTitle: metaTitle,
          ogDescription: metaDescription,
          ogUrl: pageUrl,
          courseData: json?.data || null,
          schemaData:
            json?.data?.schema ||
            json?.schema ||
            generateSupportPageSchema({
              title: metaTitle,
              description: metaDescription,
              pageUrl,
              courseName,
              courseData: json?.data || null,
            }),
        },
      };
    } catch (e) {
      return { notFound: true };
    }
  }

  if (isQuizDetail && url_title && quiz_slug) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/courses/${url_title}/quizzes/${quiz_slug}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (res.status === 404 || !res.ok) {
        return { notFound: true };
      }
      const json = await res.json();
      if (!json?.status || !json?.data || !json?.data?.quiz) {
        return { notFound: true };
      }
      const quizTitle = json?.data?.quiz?.title || "Quiz Details";
      const courseName = json?.data?.course?.name || url_title;
      const metaTitle = `${quizTitle} — ${courseName} | ScholarAcad`;
      const metaDescription =
        json?.data?.quiz?.description ||
        `Practice ${quizTitle} at ScholarAcad`;
      return {
        props: {
          title: metaTitle,
          description: metaDescription,
          keywords: `${quizTitle}, ${courseName}, mock exam`,
          ogTitle: metaTitle,
          ogDescription: metaDescription,
          ogUrl: pageUrl,
          courseData: json?.data || null,
          schemaData:
            json?.data?.schema ||
            json?.schema ||
            generateSupportPageSchema({
              title: metaTitle,
              description: metaDescription,
              pageUrl,
              courseName,
              courseData: json?.data || null,
            }),
        },
      };
    } catch (e) {
      return { notFound: true };
    }
  }

  if (isQuizzes && url_title) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/courses/${url_title}/quizzes`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      // Agar backend ne 404 bheja (No permission / Not published):
      if (res.status === 404 || !res.ok) {
        return { notFound: true };
      }
      const json = await res.json();
      if (!json?.status || !json?.data || json.data.length === 0) {
        return { notFound: true };
      }
      const courseName =
        json?.course?.name ||
        url_title
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      const metaTitle = `${courseName} Quizzes & Mock Exams | ScholarAcad`;
      const metaDescription = `Practice interactive quizzes and realistic mock exams for ${courseName}.`;

      return {
        props: {
          title: metaTitle,
          description: metaDescription,
          keywords: `${courseName}, mock exam, quizzes, practice test`,
          ogTitle: metaTitle,
          ogDescription: metaDescription,
          ogUrl: pageUrl,
          courseData: json,
          schemaData:
            json?.data?.schema ||
            json?.schema ||
            json?.course?.schema ||
            generateSupportPageSchema({
              title: metaTitle,
              description: metaDescription,
              pageUrl,
              courseName,
              courseData: json,
            }),
        },
      };
    } catch (e) {
      return { notFound: true };
    }
  }

  if (isSupportPage && !isNotes && url_title) {
    try {
      let supportEndpoint = `${API_BASE_URL}/api/courses/${url_title}/support/${matchedSupportPage}`;
      let res = await fetch(supportEndpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      // If matchedSupportPage === 'exam' and /support/exam returned 404, check /support/exam-format and /exam
      if (res.status === 404 && matchedSupportPage === "exam") {
        const altRes = await fetch(
          `${API_BASE_URL}/api/courses/${url_title}/support/exam-format`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        if (altRes.ok) {
          res = altRes;
        } else {
          const directExamRes = await fetch(
            `${API_BASE_URL}/api/courses/${url_title}/exam`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            }
          );
          if (directExamRes.ok) {
            res = directExamRes;
          }
        }
      }

      if (res.status === 404 || !res.ok) {
        return { notFound: true };
      }

      const json = await res.json();
      if (!json?.status || !json?.data) {
        return { notFound: true };
      }

      const seoData = json?.data?.seo || {};
      const supportPage = json?.data?.support_page || {};
      const course = json?.data?.course || {};
      const pageLabel = matchedSupportPage
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      const metaTitle =
        seoData?.title ||
        supportPage?.title ||
        `${course?.name || url_title} ${pageLabel} | ScholarAcad`;
      const metaDescription =
        seoData?.description ||
        `Explore ${pageLabel.toLowerCase()} and details for ${course?.name || url_title}.`;

      const initialSupportSchema = json?.data?.schema || null;

      // Enrich support page with core course data (including header_image) and dynamic sections in parallel
      if (url_title) {
        try {
          const [courseRes, dynRes] = await Promise.all([
            fetch(`${API_BASE_URL}/course/view-course`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({
                course_id: url_title,
                country_id: active_country,
              }),
            }).catch(() => null),
            fetch(`${API_BASE_URL}${APIENDPOINTS.DYNAMIC_PAGE}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({
                course_id: url_title,
                country_id: active_country || "IN",
                state_id: active_state || null,
              }),
            }).catch(() => null),
          ]);

          if (courseRes && courseRes.ok) {
            const courseJson = await courseRes.json();
            if (courseJson?.data) {
              json.data.course = { ...(json?.data?.course || {}), ...courseJson.data };
              if (!json.data.header_image && courseJson.data.header_image) {
                json.data.header_image = courseJson.data.header_image;
              }
            }
          }

          if (dynRes && dynRes.ok) {
            const dynJson = await dynRes.json();
            if (dynJson?.data) {
              const supportCourse = json.data.course;
              Object.assign(json.data, dynJson.data);
              if (supportCourse) {
                json.data.course = supportCourse;
              }
              if (initialSupportSchema) {
                json.data.schema = initialSupportSchema;
              }
            }
          }
        } catch (e) {
          // ignore
        }
      }

      if (json?.data) {
        json.data = sanitizeDynamicCourseData(json.data);
      }

      const supportSchemaData =
        initialSupportSchema ||
        json?.data?.schema ||
        json?.data?.course?.schema ||
        generateSupportPageSchema({
          title: metaTitle,
          description: metaDescription,
          pageUrl,
          courseName: course?.name || course?.course_title || url_title,
          courseData: json?.data || null,
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "All Courses", url: "/all-courses" },
            { name: course?.name || url_title, url: `/${url_title}` },
            { name: pageLabel, url: pageUrl },
          ],
        });

      return {
        props: {
          title: metaTitle,
          description: metaDescription,
          keywords: null,
          ogTitle: metaTitle,
          ogDescription: metaDescription,
          ogUrl: pageUrl,
          courseData: json?.data || null,
          isSupportPage: true,
          matchedSupportPage: matchedSupportPage,
          schemaData: supportSchemaData,
        },
      };
    } catch (e) {
      return { notFound: true };
    }
  }

  try {
    let courseInfo = null;
    let json = null;

    if (url_title) {
      try {
        const [courseRes, dynRes] = await Promise.all([
          fetch(`${API_BASE_URL}/course/view-course`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              course_id: url_title,
              country_id: active_country,
              state_id: active_state || null,
            }),
          }).catch(() => null),
          fetch(`${API_BASE_URL}${APIENDPOINTS.DYNAMIC_PAGE}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(
              isNotes
                ? {
                    slug: "Notes",
                    course_id: url_title || null,
                    country_id: active_country,
                    state_id: active_state || null,
                  }
                : {
                    course_id: url_title,
                    country_id: active_country,
                    state_id: active_state || null,
                  }
            ),
          }).catch(() => null),
        ]);

        if (courseRes && courseRes.ok) {
          const courseJson = await courseRes.json();
          courseInfo = courseJson?.data || null;
        }

        if (dynRes && dynRes.ok) {
          json = await dynRes.json();
        }
      } catch (e) {
        // Continue if view-course is not reachable
      }
    } else {
      const res = await fetch(`${API_BASE_URL}${APIENDPOINTS.DYNAMIC_PAGE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(
          isNotes
            ? {
                slug: "Notes",
                course_id: null,
                country_id: active_country,
                state_id: active_state || null,
              }
            : {
                course_id: null,
                country_id: active_country,
                state_id: active_state || null,
              }
        ),
      }).catch(() => null);
      if (res && res.ok) {
        json = await res.json();
      }
    }

    if (!json) {
      if (candidateSubSlug) return { notFound: true };
    }
    const data = json?.data?.dynamicCourseHeading || {};
    if (!data?.id && !data?.course_title && !data?.heading && !courseInfo && candidateSubSlug) {
      return { notFound: true };
    }
    const metaTitle =
      data?.meta_title ||
      courseInfo?.page_title ||
      courseInfo?.course_title ||
      null;
    const metaDescription =
      data?.metaDescription ||
      data?.meta_description ||
      courseInfo?.meta_description ||
      courseInfo?.short_description ||
      null;
    const metaKeywords = data?.meta_keywords || courseInfo?.meta_keywords || null;

    const mergedData = sanitizeDynamicCourseData({
      ...(json?.data || {}),
      schema: courseInfo?.schema || json?.data?.schema || null,
      course: courseInfo || json?.data?.course || null,
      header_image: courseInfo?.header_image || json?.data?.header_image || null,
      course_title: courseInfo?.course_title || json?.data?.course_title || null,
      short_description: courseInfo?.short_description || json?.data?.short_description || null,
    });

    const resolvedCourseTitle =
      data?.course_title ||
      data?.heading ||
      courseInfo?.course_title ||
      (url_title
        ? url_title
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : "Certification Training");

    const schemaData =
      courseInfo?.schema ||
      json?.data?.schema ||
      (isNotes
        ? generateSupportPageSchema({
            title: metaTitle || `${resolvedCourseTitle} - Complete Study Notes & Revision Guide | ScholarAcad`,
            description: metaDescription,
            pageUrl,
            courseName: resolvedCourseTitle,
            courseData: mergedData,
            breadcrumbs: [
              { name: "Home", url: "/" },
              { name: resolvedCourseTitle, url: `/${url_title || ""}` },
              { name: "Notes & Revision Guide", url: pageUrl },
            ],
          })
        : generateCourseSchema({
            courseName: resolvedCourseTitle,
            courseDescription: metaDescription,
            courseUrl: pageUrl,
            courseCode: url_title,
            keywords: metaKeywords,
            courseData: mergedData,
            breadcrumbs: [
              { name: "Home", url: "/" },
              { name: "All Courses", url: "/all-courses" },
              { name: resolvedCourseTitle, url: `/${url_title || ""}` },
            ],
          }));

    return {
      props: {
        title: metaTitle,
        description: metaDescription,
        keywords: metaKeywords,
        ogTitle: metaTitle,
        ogDescription: metaDescription,
        ogUrl: pageUrl,
        courseData: mergedData,
        schemaData,
      },
    };
  } catch (e) {
    if (candidateSubSlug) return { notFound: true };
    const fallbackTitle = url_title
      ? url_title
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "Certification Training";
    return {
      props: {
        title: null,
        description: null,
        keywords: null,
        ogTitle: null,
        ogDescription: null,
        ogUrl: pageUrl,
        courseData: null,
        schemaData: url_title
          ? generateCourseSchema({
              courseName: fallbackTitle,
              courseUrl: pageUrl,
              courseCode: url_title,
            })
          : null,
      },
    };
  }
}
