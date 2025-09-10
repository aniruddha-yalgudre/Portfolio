import { useRef, useState, useEffect, useContext } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Transformtext from "../Partials/Transformtext";
import { useTheme } from "../utils/themeContext";
import { getCalApi } from "@calcom/embed-react";

import logob from "../assets/logo/logob.svg";
import logow from "../assets/logo/logow.svg";
import resume from "../assets/Software_Dev_Aniruddha_Resume_2025.pdf";

gsap.registerPlugin(ScrollTrigger);

const Navbar = ({ onNavClick, activeSection}) => {
  const Links = [
    { name: "Home", path: "hero" },
    { name: "Works", path: "works" },
    { name: "About", path: "about" },
    { name: "FAQ", path: "faq" },
    { name: "Connect", path: "connect" },
  ];

  const TopNavbarRef = useRef(null);
  const scrollNavRef = useRef(null);
  const scrollImgRef = useRef(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isVisibleRef = useRef(null);

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  const handleNavClick = (path) => {
    if (onNavClick) {
      onNavClick(path);
    }
  };

  
 useEffect(() => {
  const tl = gsap.timeline();
  
  tl.to(scrollNavRef.current, {
    scrollTrigger: {
      trigger: scrollNavRef.current,
      start: "top 0%",
      end: "top -8%",
      scrub: 2,
      // markers: true,
    },
    duration: 1.5,
    y: `${isMobile ? "-125%" : "0%"}`,
    ease: "power1",
  },"a");

  tl.to(scrollImgRef.current, {
    scrollTrigger: {
      trigger: scrollNavRef.current,
      start: "top 0%",
      end: "top -8%",
      scrub: 1,
    },
    opacity:`${isMobile ? "1" : "0"}`,
    duration: 2,
    ease: "none"
  },"a");
}, [isMobile]);






  return (
    <nav
      ref={TopNavbarRef}
      className="navbar fixed  z-[999] w-full flex flex-col justify-between items-center"
    >
      <div className="h-20 w-full flex justify-between items-start p-3 text-[10px]  md:overflow-hidden  ">
        <div className="w-3/5 ">
          <div className="w-full flex items-start  justify-between ">
            <div
              onClick={() => handleNavClick("hero")}
              className={`relative  flex flex-col justify-start  w-full  md:w-1/3 text-left  md:leading-3  uppercase cursor-pointer transition-all duration-100  `}
            >

              <p 
                ref={scrollNavRef}
                className={` h-fit  absolute top-0 left-0 right-0 leading-snug transition-transform duration-100   ${isMobile ? "-translate-y-[0%]" : "-translate-y-[0%]" } `}
              >
                a branding and design visionary who fuses multicultural insights
                with bold, innovative visuals to craft unforgettable,
                award‑worthy brand identities that truly resonate.
              </p>
              
              <img
                ref={scrollImgRef}
                className={`h-5 self-start opacity-0  object-contain object-center transition-all duration-100  mix-blend-difference `}
                src={isDarkMode ? logow : logob}
                alt="logo"
                srcSet={isDarkMode ? logow : logob}
              />

            </div>

            <div className="freelance-section hidden md:w-1/3 md:flex md:flex-col md:items-end md:gap mr-[17.88vw]">
              <button className="flex items-center">
                <span className="inline-block rounded-full leading-none mr-1.5">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0"
                    className="h-2.5 w-4 leading-none"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" fill="#289f28" />
                    <filter id="glow">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                    </filter>
                  </svg>
                </span>

                <Transformtext
                  textcontent={"Available for Freelancing"}
                  classname={"uppercase leading-none"}
                />
              </button>

              <button
                data-cal-namespace="30min"
                data-cal-link="aniruddha-yalgudre/30min"
                data-cal-config='{"layout":"month_view"}'
                className="mix-blend-difference mt-0.5"
              >
                <Transformtext
                  textcontent={"let's talk"}
                  classname={
                    "uppercase hover:font-semibold leading-none mix-blend-difference"
                  }
                />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`flex items-start md:w-2/5 h-fit w-full ${
            isMobile ? "justify-end" : "justify-between"
          }`}
        >
          {!isMobile && (
            <p
              ref={isVisibleRef}
              className="w-2/3 leading-3 mix-blend-difference uppercase"
            >
              Passionately blending modern frameworks, pixel-perfect UI, and
              captivating animations to craft seamless, responsive web
              experiences, interactive, high-performance interfaces built with
              love to engage, inspire, and leave a lasting impression on every
              device.
            </p>
          )}

          <div className=" links-part flex flex-col items-end md:w-1/3">
            {Links.slice(1).map((link, index) => {
              const isActive = activeSection === link.path;
              return (
                <button
                  key={index}
                  onClick={() => handleNavClick(link.path)}
                  className={`relative leading-none shrink-0 cursor-pointer mb-0.5 mix-blend-difference uppercase hover:font-semibold transition-all duration-100 
                    ${isActive ? "font-semibold " : "font-normal"}`}
                >
                  <Transformtext
                    textcontent={link.name}
                    classname={`mix-blend-difference ${
                      isActive ? "font-bold" : ""
                    }`}
                  />
                  {isActive && (
                    <div
                      className={`absolute -left-2 top-0 w-1 h-full ${
                        isDarkMode ? "bg-white" : "bg-black"
                      } mix-blend-difference `}
                    />
                  )}
                </button>
              );
            })}
            <a
              href={resume}
              download="Aniruddha_Yalgudre_Resume.pdf"
              className="uppercase hover:font-bold  text-[10px] transition-all duration-100 mix-blend-difference"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Transformtext
                textcontent={"Resume"}
                classname={"uppercase mix-blend-difference leading-none"}
              />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

const BottomNavbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="relative ">
      <div className="fixed bottom-0 w-full h-9 z-[999] text-[10px]">
        <div className="relative z-10 w-full h-full p-3 flex justify-between items-center uppercase transition-all duration-100">
          <div className="part1 leading-none flex justify-start">
            <p className="mix-blend-difference hidden md:block">
              based in 【 india | Pune 】
            </p>

            <button className="mix-blend-difference uppercase text-left md:hidden">
              <p>
                © 2024-2025 aniruddha <br />／ All rights reserved.
              </p>
            </button>
          </div>

          <div className="part2 leading-none flex justify-end">
            <button
              onClick={() => toggleTheme()}
              className="absolute md:bottom-7 -mr-1.5 mix-blend-difference uppercase leading-none"
            >
              <Transformtext
                textcontent={isDarkMode ? "【light-mode】" : "【dark-mode】"}
                classname={""}
              />
            </button>

            <button className="hidden md:block mix-blend-difference uppercase w-full">
              <p>© 2024-2025 aniruddha ／ All rights reserved.</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Navbar, BottomNavbar };
