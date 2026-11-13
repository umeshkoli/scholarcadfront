import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";
import { FaRegEdit } from "react-icons/fa";
import { RiGraduationCapFill } from "react-icons/ri";
import Link from "next/link";
import { HiMiniArrowLongRight } from "react-icons/hi2";
import { IoCheckmark } from "react-icons/io5";
import {
  FaChalkboardTeacher,
  FaVideo,
  FaUsers,
  FaLaptop,
  FaUserGraduate,
} from "react-icons/fa";
import { useState } from "react";
function Resources() {
  const [activeIndex, setActiveIndex] = useState(0);

  const trainingOptions = [
    {
      id: 1,
      title: "Learning Resources Based on LMSs ",
      description:
        "Get access to a centralized learning management system that offers downloadable resources, articles, practice exams, and instructions. Students can effectively monitor their progress and learn at any time.",
      icon: FaChalkboardTeacher,
    },
    {
      id: 2,
      title: "Expert Sessions and Live Webinars ",
      description:
        "Interactive webinars with professionals in the field to explain ideas, talk about test-taking techniques, and look at practical applications.",
      icon: FaVideo,
    },
    {
      id: 3,
      title: "Practice Exams for Certification ",
      description:
        "Practice questions and exam-aligned mock exams to assist students in determining their level of preparedness, filling in any gaps, and enhancing their performance. ",
      icon: FaUsers,
    },
    {
      id: 4,
      title: "Templates and Case Studies",
      description:
        "Practical application of principles across projects and organizations is supported by real-world case studies and ready-to-use templates.",
      icon: FaLaptop,
    },
    {
      id: 5,
      title: "Knowledge Sessions and Podcasts",
      description:
        "Information sessions and expert podcasts that provide trends, insights, and best practices in a range of professional fields. ",
      icon: FaUserGraduate,
    },
  ];
  const cards = [
    {
      title: "Blog",
      description:
        "Be part of exclusive webinars delivered by experts across various industry sectors",
      icon: <FaRegEdit className="text-[#2E318D] text-2xl" />,
      bgColor: "bg-[#F5A7A766]",
      url: "/blog",
      animation: "fade-up",
    },
    {
      title: "Webinar",
      description:
        "Be part of exclusive webinars delivered by experts across various industry sectors",
      icon: <FaRegEdit className="text-[#2E318D] text-2xl" />,
      bgColor: "bg-[#FFDEAA66]",
      url: "/webinar",
      animation: "fade-down",
    },
    {
      title: "Article",
      description:
        "Be part of exclusive webinars delivered by experts across various industry sectors",
      icon: <FaRegEdit className="text-[#2E318D] text-2xl" />,
      bgColor: "bg-[#B9D09A66]",
      url: "/article",
      animation: "fade-up",
    },
    {
      title: "Info",
      description:
        "Be part of exclusive webinars delivered by experts across various industry sectors",
      icon: <FaRegEdit className="text-[#2E318D] text-2xl" />,
      bgColor: "bg-[#F4B08866]",
      url: "/info",
      animation: "fade-down",
    },
    {
      title: "Quiz",
      description:
        "Test your knowledge and practice with category-wise mock exams, practice quizzes, and real test questions",
      icon: <FaLaptop className="text-[#2E318D] text-2xl" />,
      bgColor: "bg-[#D2E0FB66]",
      url: "/quiz",
      animation: "fade-up",
    },
    {
      title: "Support Page",
      description:
        "Explore course syllabuses, exam formats, notes, and preparation guides organized category-wise",
      icon: <FaChalkboardTeacher className="text-[#2E318D] text-2xl" />,
      bgColor: "bg-[#E8D5C466]",
      url: "/support-page",
      animation: "fade-down",
    },
  ];
  const ActiveIcon = trainingOptions[activeIndex].icon;
  return (
    <>
      <Navbar />
      <section className="font-nunito bg-white  ">
        
        <div className="Personalized_Coaching md:relative max-sm:p-3">
          <section className="relative max-w-7xl mx-auto md:py-[100px] py-12  z-10 grid grid-cols-1 md:grid-cols-[40%_60%] items-start gap-2">
            <div data-aos="fade-up" className="">
              <div className=" gap-2 mt-2">
                {/* <RiGraduationCapFill className="text-[#29A6DD] text-4xl rotate-350 " /> */}
                <h1 className="font-bold text-xl text-[#2E318D]">
                  Training Delivery Modes
                </h1>
              </div>
              <h2 className="heading ">
                Get the right leverage for your Hard-Earned Expertise
              </h2>
            </div>
            <div>
              <div className=" flex items-center justify-center ">
                {/* <div className="grid  grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="flex gap-3 justify-end flex-col ">
                    <Link href="/blogs">
                      <div
                        data-aos="fade-up"
                        className="bg-[#F5A7A766] rounded-tl-[60px] rounded-br-[60px] border border-gray-300 px-10 py-10 "
                      >
                        <div className="">
                          <FaRegEdit className="text-[#2E318D] text-3xl" />
                        </div>
                        <div className="mt-2">
                          <h2 className="text-lg font-semibold text-gray-800">
                            Blogs
                          </h2>
                          <p className="text-gray-700 text-sm leading-relaxed font-semibold mt-1">
                            Be part of exclusive webinars delivered by experts
                            across various industry sectors
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/blogs">
                      <div
                        data-aos="fade-down"
                        className="bg-[#FFDEAA66] rounded-tl-[60px] rounded-br-[60px] border border-gray-300 px-10 py-10 "
                      >
                        <div className="">
                          <FaRegEdit className="text-[#2E318D] text-3xl" />
                        </div>
                        <div className="mt-2">
                          <h2 className="text-lg font-semibold text-gray-800">
                            Webinars
                          </h2>
                          <p className="text-gray-700 text-sm leading-relaxed font-semibold mt-1">
                            Be part of exclusive webinars delivered by experts
                            across various industry sectors
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="flex gap-3 justify-end flex-col mb-[100px]">
                    <Link href="/blogs">
                      <div
                        data-aos="fade-up"
                        className="bg-[#B9D09A66] rounded-tl-[60px] rounded-br-[60px] border border-gray-300 px-10 py-10 "
                      >
                        <div className="">
                          <FaRegEdit className="text-[#2E318D] text-3xl" />
                        </div>
                        <div className="mt-2">
                          <h2 className="text-lg font-semibold text-gray-800">
                            Article
                          </h2>
                          <p className="text-gray-700 text-sm leading-relaxed font-semibold mt-1">
                            Be part of exclusive webinars delivered by experts
                            across various industry sectors
                          </p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/blogs">
                      <div
                        data-aos="fade-down"
                        className="bg-[#F4B08866] rounded-tl-[60px] rounded-br-[60px] border border-gray-300 px-10 py-10 "
                      >
                        <div className="">
                          <FaRegEdit className="text-[#2E318D] text-3xl" />
                        </div>
                        <div className="mt-2">
                          <h2 className="text-lg font-semibold text-gray-800">
                            Info
                          </h2>
                          <p className="text-gray-700 text-sm leading-relaxed font-semibold mt-1">
                            Be part of exclusive webinars delivered by experts
                            across various industry sectors
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div> */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
                  {cards?.map((card, index) => (
                    <Link
                      key={index}
                      href={{
                        pathname: `/resource/${(card?.url || "").replace(/^\/+/, "")}`,
                      }}
                    >
                      <div
                        data-aos={card.animation}
                        className={`${card.bgColor} rounded-tl-[45px] rounded-br-[45px] border border-gray-300 px-6 py-6 sm:px-7 sm:py-6 cursor-pointer hover:shadow-md transition-all`}
                      >
                        <div>{card?.icon}</div>
                        <div className="mt-2">
                          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                            {card?.title}
                          </h2>
                          <p className="text-gray-700 text-xs sm:text-[13px] leading-relaxed font-medium mt-1">
                            {card?.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="max-w-7xl mx-auto px-4 max-sm:p-3">
          <div className="grid grid-cols-1 md:grid-cols-[25%_50%_25%]  relative">
            <div data-aos="fade-down" className="flex items-end justify-start">
              <img
                src="/assets/landingpage/resources_leftside_img.svg"
                alt="Resources Left"
                className="w-full h-auto object-contain"
              />
            </div>
            <div
              data-aos="zoom-in"
              className="flex justify-center items-center text-center"
            >
              <div className="flex flex-col justify-center items-center gap-4 p-6">
                <h1 className="heading">The Scholaracad Resource </h1>
                <p className=" para text-left">
                  A comprehensive and organized learning support system,
                  Scholaracad Resource was created to help professionals,
                  students, and organizations increase certification success and
                  deepen their expertise. Study guides, whitepapers, real-world
                  case studies, mock exams, and downloadable templates that are
                  in line with international certification requirements are all
                  part of our carefully selected resource library.
                </p>
                <p className="mt-2 para text-left">
                  Scholaracad Resources help students stay current, practice
                  efficiently, and apply concepts with confidence in real-world
                  situations by fusing exam-focused materials with useful
                  industry insights. Self-paced learning and ongoing
                  professional development are supported by our adaptable and
                  frequently updated materials.
                </p>
                <div className="mt-2 flex justify-center">
                  <Link href="/all-courses">
                    <button className="relative group border-none bg-transparent cursor-pointer">
                      <div className="btn_primary">
                        <span className="select-none">Explore</span>
                        <HiMiniArrowLongRight />
                      </div>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div
              data-aos="fade-up"
              className="flex items-start justify-end max-sm:mt-4"
            >
              <img
                src="/assets/landingpage/resources_rightside_img.png"
                alt="Resources Right"
                className="w-full h-auto object-contain mb-[100px]"
              />
            </div>
          </div>
        </div>

        <div className="md:max-w-7xl mx-auto max-sm:p-4 py-5    ">
          <div className="bg-[#F7F3FF] rounded-md border border-gray-300 p-5">
            <h2 className=" heading ">Why Choose Scholaracad Resource</h2>
            <p className="para  mt-3 ">
              The goal of Scholaracad Resource is to provide students with
              dependable, current, and exam-aligned study materials that promote
              skill development and career success in a variety of professions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Excellent resources in line with internationally accepted
                  certifications
                </p>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Information that has been carefully chosen based on actual
                  industrial procedures
                </p>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Frequent revisions to reflect the most recent frameworks and
                  exam patterns
                </p>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Simple access via a user-friendly, learner-friendly LMS
                  platform
                </p>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Resources intended for both practical application and exam
                  preparation
                </p>
              </div>
            </div>
          </div>
        </div>
        <section className=" bg-[#E1F3F0] max-sm:p-3">
          <div className=" max-w-7xl mx-auto py-5 ">
            <div className="">
              <h1 className="heading">
                Who Can Benefit from Scholaracad Resource
              </h1>
            </div>

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />

                  <p className="para">
                    Students getting ready to become certified professionals
                  </p>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">
                    Professionals in the workforce looking to improve their
                    skills
                  </p>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">IT specialists and project managers</p>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">
                    Professionals in quality, operations, and processes
                  </p>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">Corporate groups and companies</p>
                </div>
                <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                  <IoCheckmark className="mt-1" />
                  <p className="para">
                    Students concentrated on ongoing professional growth
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative  max-sm:p-3 max-w-7xl mx-auto py-5 grid lg:grid-cols-2 gap-10 items-start">
          <div className="">
            <h2 className="heading">Key Benefits of Scholaracad Resource </h2>
            <p className="para my-4">
              Scholaracad Resource offers organized, dependable, and useful
              study materials to facilitate efficient learning. With
              well-structured curriculum and real-world examples, learners
              acquire clarity, confidence, and preparedness.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Enhanced confidence and preparedness for exams
                </p>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Availability of useful resources, case studies, and templates
                </p>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Flexible and self-paced learning assistance
                </p>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Improved intellectual comprehension and application{" "}
                </p>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-2 items-start">
                <IoCheckmark className="mt-1" />
                <p className="para">
                  Constant learning with current and pertinent stuff
                </p>
              </div>
            </div>
          </div>

          <div>
            <img
              src="/assets/landingpage/Transform _individuals_bg.svg"
              alt=""
              className=" border-1 border-gray-200 rounded-md"
            />
          </div>
        </section>

        <section className="tranning_delivery_bg  text-[#2E318D] max-sm:p-3">
          <div className="md:max-w-7xl mx-auto py-[200px] ">
            <div className="flex justify-center items-center flex-col mt-2">
              <h1 className="heading text-center">Resource Access Modes</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 my-3 ">
              <div className="">
                <div class="md:max-w-md mx-auto mt-10 max-sm:p-7">
                  <ul className="relative border">
                    {trainingOptions.map((item, index) => (
                      <li
                        key={item.id}
                        onClick={() => setActiveIndex(index)}
                        className={`relative border-b py-4 cursor-pointer transition
                                  ${
                                    activeIndex === index
                                      ? "bg-[#E4D3FF]"
                                      : "hover:bg-gray-50"
                                  }
                                `}
                      >
                        <span
                          className={`absolute -left-5 top-0 my-4 w-8 h-8 flex items-center justify-center 
                                text-white font-bold rounded
                                ${
                                  activeIndex === index
                                    ? "bg-[#882CFB]"
                                    : "bg-gray-400"
                                }
                              `}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          className={`font-bold text-lg ml-10
                                    ${
                                      activeIndex === index
                                        ? "text-[#2E318D]"
                                        : "text-gray-600"
                                    }
                                  `}
                        >
                          {item.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-3 p-10">
                <div className="w-[250px] h-[250px] rounded-full bg-white flex justify-center items-center shadow">
                  <ActiveIcon
                    className={`w-[100px] h-[100px] transition animate-pulse
                      ${
                        activeIndex !== null
                          ? "text-[#882CFB]"
                          : "text-gray-400"
                      }
                    `}
                  />
                </div>

                <p className="text-center font-bold md:max-w-[90%]">
                  {trainingOptions[activeIndex].description}
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* <hr className="text-gray-200" /> */}
      </section>
      <Footer />
    </>
  );
}

export default Resources;

export async function getStaticProps() {
  return {
    props: {
      title: "Continuous Learning Resources & LMS Access | ScholarAcad",
      description:
        "Use ScholarAcad to go beyond the syllabus. Get online templates, papers, case studies, PMP, PRINCE2, ITIL, DevOps, Six Sigma, COBIT5, and more.",
      keywords:
        "COBIT5 learning resources, ITIL certification resources, Online learning LMS, Professional certification resources,",
    },
  };
}
