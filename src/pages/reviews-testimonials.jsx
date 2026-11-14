import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { RiGraduationCapFill } from "react-icons/ri";
import Testimonials from "@/Components/testimonials";
import { FaQuoteLeft } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL, APIENDPOINTS } from "../../apiconfig";
import { getLiveDocumentUrl } from "@/utils/imageHelper";
import { useEffect, useMemo, useState } from "react";

function Reviewtestimonails() {
  const { token } = useAuth();
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [testimonialList, setTestimonialList] = useState([]);
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
          }
        );
        if (!res.ok) {
          console.warn("HTTP error! Status:", res?.status);
          setTestimonialList([]);
          return;
        }
        const data = await res.json();
        setTestimonialList(data?.data || []);
      } catch (err) {
        console.error("Error fetching blogs by type:", err);
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchTestimonials();
  }, [token]);
  return (
    <>
      <Navbar />
      <section className="font-nunito bg-white  ">
        <div className="aboutusbg md:relative max-sm:p-3">
          <section
            data-aos="zoom-in"
            className="relative max-w-7xl mx-auto md:py-[150px] py-12  z-10"
          >
            <div className="flex flex-col justify-center items-center">
              <h1 className="heading_blue">Reviews Testimonials</h1>
              <p className="max-w-[70%] mx-auto mt-4 text-lg text-black">
                HERE'S WHAT ARE CUSTOMERS HAVE BEEN SAYING ABOUT US
              </p>
            </div>
          </section>
        </div>
        <section className="relative max-w-7xl mx-auto py-10 mb-12 ">
          <div className="text-center">
            <h1 className="heading">Testimonial</h1>
            <p className=" mt-4 text-lg text-black">Customer Speak</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {testimonialList?.map((item, index) => (
              <div
                key={index}
                className="max-w-md mx-auto p-6 bg-white shadow-sm border border-gray-200 rounded-2xl relative mt-10"
              >
                <div className="w-16 h-16 m-auto flex justify-center items-center bg-indigo-600 text-white p-3 rounded-full shadow-md">
                  <FaQuoteLeft size={22} />
                </div>

                <p className="mt-6 para">
                  {item?.comment?.length > 180
                    ? item?.comment?.slice(0, 180) + "..."
                    : item?.comment}
                </p>

                <div className="flex items-center gap-4 mt-6 border-t pt-4">
                  <div className="w-14 h-14 rounded-full border-2 border-indigo-600 flex items-center justify-center overflow-hidden bg-indigo-100">
                    {item?.image ? (
                      <img
                        src={getLiveDocumentUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-indigo-700 font-semibold text-sm">
                        {item?.name
                          ?.split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-indigo-700 text-xl font-semibold">
                      {item?.name}
                    </h3>
                    <span className="text-gray-500 text-sm">
                      {item.designation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative max-w-7xl mx-auto py-5 grid lg:grid-cols-2 gap-10 max-sm:p-3">
          <div className="">
            <h1 className=" heading">
              Upskilling Professionals of Leading{" "}
              <span className=" text-orange-500">Organizations Worldwide</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-lg">
              Scholaracad, a Global Training organization, has emerged as a
              market leader in providing professional training solutions to more
              than 100,000 individuals across many Small, Medium and large
              enterprises worldwide. Scholaracad is a trusted partner who caters
              to the training and certification requirements for enterprises
              which can be customized as per the business requirements.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                data-aos="flip-up"
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
        </section>
        <hr className="text-gray-200" />
        {/* <Testimonials /> */}
      </section>
      <Footer />
    </>
  );
}

export default Reviewtestimonails;
