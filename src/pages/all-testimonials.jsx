import { FaQuoteLeft, FaEye } from "react-icons/fa";
import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL, APIENDPOINTS } from "../../apiconfig";
import { getLiveDocumentUrl } from "@/utils/imageHelper";
import Pagination from "@/Components/Pagination";

export default function Sitemap() {
  const { token } = useAuth();
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [testimonialList, setTestimonialList] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(20);
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
        const payload = {
          page: currentPage,
          per_page: perPage,
        };
        setLoadingBlogs(true);
        const res = await fetch(
          `${API_BASE_URL}${APIENDPOINTS.ALLTESTIMONIALS_LIST}`,
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
          console.warn("HTTP error! Status:", res?.status);
          setTestimonialList([]);

          return;
        }
        const data = await res.json();
        setTestimonialList(data?.data || []);
        setCurrentPage(data?.pagination?.current_page || 1);
        setTotalPages(data?.pagination?.last_page);
        setPerPage(data?.pagination?.per_page || 20);
      } catch (err) {
        console.error("Error fetching blogs by type:", err);
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchTestimonials();
  }, [token, currentPage]);

  const truncateWords = (text = "", limit = 30) => {
    const words = text.split(" ");
    return {
      preview: words.slice(0, limit).join(" "),
      isLong: words.length > limit,
    };
  };
  const [openModal, setOpenModal] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  return (
    <>
      <Navbar />
      <main className="font-nunito bg-white">
        <section className="relative max-w-7xl mx-auto py-10 max-sm:p-3">
          <h1 className="heading_blue text-center mb-8">All Testimonials</h1>
          <div className="grid grid-cols-1 gap-6 max-md:grid-cols-1">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {testimonialList?.map((item, index) => {
                const { preview, isLong } = truncateWords(item?.comment, 30);

                return (
                  <div
                    key={index}
                    className="bg-white hover:bg-gray-50 p-6 my-2 rounded-2xl hover:shadow-sm border border-gray-300 relative"
                  >
                    <div className="absolute -top-6 left-6 bg-[#882CFB] text-white p-3 rounded-full">
                      <FaQuoteLeft size={20} />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mt-6">
                      {item?.title}
                    </h2>

                    <p className="text-gray-600 mt-3 leading-relaxed">
                      {preview}
                      {isLong && (
                        <>
                          <span>...</span>
                          <button
                            title="Read More"
                            onClick={() => {
                              setActiveItem(item);
                              setOpenModal(true);
                            }}
                            className="ml-2 text-[#882CFB] font-medium hover:underline cursor-pointer"
                          >
                            Read more
                          </button>
                        </>
                      )}
                    </p>

                    <div className="flex items-center gap-4 mt-6 border-t pt-4">
                      <div className="w-14 h-14 rounded-full border-2 border-[#882CFB] flex items-center justify-center overflow-hidden bg-indigo-100">
                        {item?.image ? (
                          <img
                            src={getLiveDocumentUrl(item?.image)}
                            alt={item?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[#882CFB] font-semibold text-sm">
                            {item?.name
                              ?.split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(item?.created_at).toLocaleString("en-US", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* RIGHT RECENT TESTIMONIAL LIST */}
            {/* <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Testimonials
              </h3>
              {testimonialList.slice(1).map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-300 flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-[#882CFB] flex items-center justify-center overflow-hidden bg-indigo-100">
                    {item?.image ? (
                      <img
                        src={`${API_BASE_URL}/master/secure-documents?path=${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[#882CFB] font-semibold text-sm">
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
                    <h4 className="text-gray-800 font-semibold">
                      {item?.name}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {item?.title}
                    </p>
                  </div>
                </div>
              ))}
            </div> */}
          </div>
          <div className="flex justify-end">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  if (page < 1 || page > totalPages) return;
                  setCurrentPage(page);
                }}
              />
            )}
          </div>
        </section>
        <hr className="text-gray-200" />
      </main>
      {openModal && activeItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-3xl w-full mx-4 p-6 rounded-2xl shadow-lg relative">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-md  cursor-pointer"
            >
              ✕
            </button>

            <div className="flex gap-4 items-center mb-4">
              <div className="w-16 h-16 rounded-full border-2 border-[#882CFB] overflow-hidden bg-indigo-100 flex items-center justify-center">
                {activeItem?.image ? (
                  <img
                    src={getLiveDocumentUrl(activeItem?.image)}
                    alt={activeItem?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[#882CFB] font-semibold text-lg">
                    {activeItem?.name
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold">{activeItem?.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(activeItem?.created_at).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-3">{activeItem?.title}</h2>

            <p className="text-gray-700 leading-relaxed max-h-[60vh] overflow-y-auto">
              {activeItem?.comment}
            </p>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title:
        "Scholaracad Testimonials | Real Reviews from Certified Professionals",
      description:
        "Read true testimonials from Scholaracad members. Learn how professional skills and careers are enhanced by our expert-led training programs.",
      keywords:
        "Scholaracad testimonials, Scholaracad reviews, Scholaracad Online certification feedback, Scholaracad Success Stories",
    },
  };
}
