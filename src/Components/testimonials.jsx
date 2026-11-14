import React, { useEffect, useMemo, useState } from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { API_BASE_URL, APIENDPOINTS } from "../../apiconfig";
import Contactus from "@/Components/contact";

function testimonials() {
  const { token } = useAuth();
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [testimonialList, setTestimonialList] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
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
    return userLocation?.state;
  }, [userLocation]);

  // FETCH TESTIMONIALS
  useEffect(() => {
    const cacheKey = `home_testimonials_${active_country || "in"}_${active_state || "all"}`;
    try {
      const saved = sessionStorage.getItem(cacheKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTestimonialList(parsed);
          setActiveSlide(0);
          return;
        }
      }
    } catch (e) {}

    if (!token) return;

    const timer = setTimeout(() => {
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
                country_id: active_country || "in",
                state_id: active_state || null,
              }),
            },
          );

          if (!res.ok) {
            setTestimonialList([]);
            setActiveSlide(0);
            return;
          }
          const data = await res.json();
          const list = Array.isArray(data?.data) ? data.data.slice(0, 10) : [];
          setTestimonialList(list);
          setActiveSlide(0);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(list));
          } catch (e) {}
        } catch (err) {
          console.error("Error fetching testimonials:", err);
          setTestimonialList([]);
          setActiveSlide(0);
        } finally {
          setLoadingBlogs(false);
        }
      };

      fetchTestimonials();
    }, 150);
    return () => clearTimeout(timer);
  }, [token, active_country, active_state]);

  useEffect(() => {
    if (!testimonialList || testimonialList.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonialList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonialList]);
  const handleDotClick = (index) => {
    setActiveSlide(index);
  };

  return (
    <>
      <section className="">
        <div className="grid grid-cols-1 md:grid-cols-2  w-full">
          {/* First Column */}
          <div className="w-full p-4 bg-[#F7F3FF]">
            <div className="max-w-[500px]  mx-auto ">
              <h1 data-aos="fade-up" className="md:max-w-[90%] heading mt-3 ">
                Testimonials
              </h1>
              <div className="w-full max-w-lg mx-auto relative overflow-hidden my-5 ">
                {/* Slider Container */}
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${activeSlide * 100}%)`,
                  }}
                >
                  {Array?.isArray(testimonialList) &&
                    testimonialList.slice(0, 10)?.map((testimonial, index) => (
                      <div
                        data-aos="fade-up"
                        key={index}
                        className="flex-shrink-0 w-full flex flex-col items-center bg-white rounded-sm p-6  min-h-[250px] space-y-4 border-b-[4px] border-[#882CFB]"
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
                            <div className="flex gap-1 text-yellow-400 mt-2">
                              {[...Array(5)]?.map((_, i) => (
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
                        <div className="flex gap-2">
                          {/* <FaQuoteLeft className="text-[#0C6CAB14] text-3xl mt-1" /> */}
                          <p className="text-center text-gray-700 italic mt-3 flex items-start justify-center gap-2">
                            <span>"{testimonial?.comment}"</span>
                          </p>
                          {/* <FaQuoteRight className="text-[#0C6CAB14] text-3xl mt-1" /> */}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  {testimonialList.slice(0, 10)?.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all ${
                        activeSlide === index ? "bg-gray-800" : "bg-gray-300"
                      }`}
                      onClick={() => setActiveSlide(index)}
                    ></button>
                  ))}
                </div>
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
              <h1 className="md:max-w-[90%] heading_white px-2">Contact Us</h1>
              <Contactus />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default testimonials;
