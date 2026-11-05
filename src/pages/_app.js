import "@/styles/globals.css";
import { Nunito } from "next/font/google";
import { useEffect, useState } from "react";
import HybridLocation from "@/Components/location";
import Loader from "@/Components/loader";
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700"],
});
import Head from "next/head";
import "aos/dist/aos.css";
import AOS from "aos";
import Promocode from "@/Components/promocode";
import ScrollToTopButton from "@/Components/ScrollToTopButton";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import { Toaster } from "react-hot-toast";
import Chatbot from "@/Components/chatbot";
import GlobalTooltip from "@/Components/tooltip";
import { useRouter } from "next/router";
import { CLIENT_BASE_URL } from "../../apiconfig";
import Script from "next/script";
import {
  GoogleAnalytics,
  GoogleTagManager,
  WebsiteSchema,
} from "@/lib/seoScripts";
import { getCleanCanonicalUrl } from "@/lib/seoHelper";
import CookieConsent from "@/Components/CookieConsent";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
    const handleScroll = () => AOS.refresh();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLocation = (loc) => {
    // console.log("Final location", loc);
  };

  // Disable right click / Dev Tools in production
  // if (process.env.NODE_ENV !== "production") return;
  // useEffect(() => {
  //   const disableContextMenu = (e) => e.preventDefault();
  //   document.addEventListener("contextmenu", disableContextMenu);
  //   const disableShortcuts = (e) => {
  //     if (
  //       e.key === "F12" ||
  //       (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
  //       (e.ctrlKey && e.key === "U")
  //     ) {
  //       e.preventDefault();
  //     }
  //   };
  //   document.addEventListener("keydown", disableShortcuts);
  //   const interval = setInterval(() => {
  //     const devtoolsOpen =
  //       window.outerWidth - window.innerWidth > 160 ||
  //       window.outerHeight - window.innerHeight > 160;
  //     document.body.style.filter = devtoolsOpen ? "blur(6px)" : "none";
  //   }, 1000);
  //   return () => {
  //     document.removeEventListener("contextmenu", disableContextMenu);
  //     document.removeEventListener("keydown", disableShortcuts);
  //     clearInterval(interval);
  //   };
  // }, []);

  // Disable copy / cut / paste , text selection , keyboard shortcuts
  // useEffect(() => {
  //   if (process.env.NODE_ENV !== "production") return;
  //   const disableSelect = (e) => e.preventDefault();
  //   const disableClipboard = (e) => e.preventDefault();
  //   const disableKeys = (e) => {
  //     if (
  //       (e.ctrlKey && ["c", "x", "v", "a"].includes(e.key.toLowerCase())) ||
  //       e.key === "F12"
  //     ) {
  //       e.preventDefault();
  //     }
  //   };
  //   document.addEventListener("selectstart", disableSelect);
  //   document.addEventListener("copy", disableClipboard);
  //   document.addEventListener("cut", disableClipboard);
  //   document.addEventListener("paste", disableClipboard);
  //   document.addEventListener("keydown", disableKeys);
  //   return () => {
  //     document.removeEventListener("selectstart", disableSelect);
  //     document.removeEventListener("copy", disableClipboard);
  //     document.removeEventListener("cut", disableClipboard);
  //     document.removeEventListener("paste", disableClipboard);
  //     document.removeEventListener("keydown", disableKeys);
  //   };
  // }, []);

  const pageUrl = "https://scholaracad.com/";
  const {
    title = "ScholarAcad | Professional Certification Training in Agile, ITIL, PMP, COBIT & PRINCE2",
    description = "ScholarAcad offers globally recognized certification training in PMP, Agile, ITIL, COBIT, DevOps & IT Governance. Live online & corporate training worldwide.",
    keywords = "Certification Courses online ,Certification Training online , PMP Bootcamps ,Professional Bootcamps, Corporate Training, In-Demand Skills, Career-Boosting Certifications, Agile Management, Project Management,Cloud Computing, DevOps, Data Science, Cybersecurity, IT Service Management, Business Management, Quality Management, BI and Visualization (Business Intelligence), Professional Bootcamps and Certification Courses, Learn In-Demand Skills for Tomorrow's Jobs, Leap Ahead with Career-Boosting Certifications, High-Impact Skills for the Future of Work, Choose From 25+ In-Demand Domains, CSM Certification (Certified ScrumMaster), PMP Certification training, CSPO Certification, Leading SAFe 6.0 Certification, ITIL Foundation Certification, Microsoft Power BI, Lean Six Sigma Green Belt Certification, SAFe 6.0 Scrum Master Certification, Agile Master's Program, Project Management Courses, Cloud Computing Courses, DevOps Courses, Data Science Courses",
    schemaData = null,
  } = pageProps;
  const cleanCanonicalUrl = getCleanCanonicalUrl(router.asPath);

  return (
    <>
      <Toaster position="top-right" />
      <GoogleAnalytics />
      {!schemaData && <GoogleTagManager />}
      {!schemaData && <WebsiteSchema />}
      <Head>
        <title key="title">{title}</title>
        <meta key="description" name="description" content={description} />
        {keywords && <meta key="keywords" name="keywords" content={keywords} />}
        <meta key="robots" name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:site_name" property="og:site_name" content="ScholarAcad" />
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:description" property="og:description" content={description} />
        <meta key="og:url" property="og:url" content={cleanCanonicalUrl} />
        <link key="canonical" rel="canonical" href={cleanCanonicalUrl} />
        {schemaData && (
          <script
            key="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
          />
        )}
      </Head>
      <main className={nunito.className}>
        <AuthProvider>
          <CheckoutProvider>
            <AppLoader>
              <Promocode />
              <CookieConsent />
              <Component {...pageProps} />
            </AppLoader>
            <HybridLocation onLocation={handleLocation} />
            <ScrollToTopButton />
            <GlobalTooltip />
            <Chatbot />
          </CheckoutProvider>
        </AuthProvider>
      </main>
    </>
  );
}
// Loader wrapper ensures critical routes wait for token without blocking public pages
const AppLoader = ({ children }) => {
  const router = useRouter();
  const { loading } = useAuth();
  const isProtectedRoute =
    router.pathname?.startsWith("/order-summary") ||
    router.pathname?.startsWith("/checkout");

  if (isProtectedRoute && loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }
  return children;
};
