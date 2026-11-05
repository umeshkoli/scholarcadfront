const rawApiUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();

// On Vercel deployment domains (*.vercel.app), use same-origin proxy `/backend-api` to bypass browser CORS
const isVercelBrowser =
  typeof window !== "undefined" &&
  (window.location.hostname.endsWith(".vercel.app") || window.location.hostname.includes("vercel.app"));

export const API_BASE_URL = isVercelBrowser
  ? "/backend-api"
  : (
    rawApiUrl && !rawApiUrl.includes("187.127.154.235")
      ? rawApiUrl
      : "https://knowledgeadmin.scholaracad.com"
  ).replace(/\/+$/, "");

const rawClientUrl = (process.env.NEXT_PUBLIC_CLIENT_BASE_URL || "").trim();
export const CLIENT_BASE_URL = (
  rawClientUrl || "https://scholaracad.com"
).replace(/\/+$/, "");

export const APIENDPOINTS = {
  LOGIN: "/login-check",
  COURSE_CATEGORIES: "/course/category-and-course",
  RECENT_POSTS: "/api/list/recent-posts",
  ALL_COURSES: "/api/all-courses",
  SECTION_LIST: "/api/section-list",
  SECTION_DETAILS: "/api/section-view",
  ALL_PAGES: "/api/list/all-pages",
  PAGE_DETAIL: "/api/list/pages-detail",
  COUNTRY_LIST: "/api/address/country-list",
  COUNTRY_SHOW: "/api/address/country-show",
  CONTACT_DETAILS: "/api/list/contact-details",
  BLOG_TYPE: "/api/list/blog-types",
  BLOG_LIST: "/api/list/blogs",
  BLOG_DETAIL: "/api/list/blogs-detail",
  CATEGORIES_COURSES_LIST: "/api/categorised-course-list",
  TESTIMONIALS_LIST: "/api/testimonials/list",
  ALLTESTIMONIALS_LIST: "/api/testimonials/all-list",

  DYNAMIC_PAGE: "/api/dynamic-page",
  CONTACT_STORE: "/api/contact-store",
  FAQ_LIST: "/api/faq/list",
  CITY_LIST: "/api/address/city-list",
  CITY_SHOW: "/api/address/city-show",
  LEARNING_CALENDER_FORM: "/api/learning-calendar-store",
  APPOINTMENT_FORM: "/api/appointment-store",
  ADD_CONSULTATION_FORM: "/api/consultation-store",
  TEAM_APPLICATION_FORM: "/api/team-application-store",
  SEND_OTP: "/api/send-otp",
  VERIFY_OTP: "/api/verify-otp",
  STORE_REQUEST_FOR_SEVICE: "/api/store-request-for-service",
  CREATE_RAZORPAY_PAYMENT: "/api/payment/create-order",
  VERIFY_RAZORPAY_PAYMENT: "/api/payment/verify-payment",
  CCAVENUE_PAYMENT: "/api/payment/ccavenue/pay",
  COURSE_PLANS: "/api/course-plans",
  STATE_LIST: "/api/address/state-list",
  STATE_SHOW: "/api/address/state-show",
  CATEGORY_DETAILS: "/api/get-course-category",
  CONSULTING_LIST: "/api/consulting/list",
  CONSULTING_DETAILS: "/api/consulting/view",
  BLOG_SEARCH: "/api/blog-search",
  ENROLLMENTS_STORE: "/api/enrollments-store",
  PROMO_LIST: "/api/course/promo-list",
  PROMO_VERIFY: "/api/course/verify-promo",
  STORE_PAYMENTDATA: "/api/enrollments-update",
  DOWNLOAD_PAYMENT_INVOICE: "/api/download",
  SITEMAP_URL: "/api/state-url",
  API_FOOTER_CONTENT: "/api/footer-disclamier",
  API_ALLCOURSES_CONTENT: "/api/all-courses-content",
  COURSE_LIST: "/api/course/course-list",
  VIEW_COURSE: "/api/course/view-course",
  COURSE_SYLLABUS: "/api/courses",
  COURSE_QUIZZES: "/api/courses",
  RESOURCE_QUIZZES: "/api/resource/quizzes",
  RESOURCE_SUPPORT_PAGES: "/api/resource/support-pages",
};
