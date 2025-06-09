import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import logob from "../assets/logo/logob.svg";

const Loader = () => {
  const loaderRef = useRef(null);
  const logoRef = useRef(null);
  const counterRef = useRef(null);
  const [counter, setCounter] = useState(0);


  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])





  useEffect(() => {
    // Lock scroll position
    const lockScroll = () => {
      window.scrollTo(0, 0);
    };

    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Apply locks
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("scroll", lockScroll);
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    let count = 0;
    const interval = setInterval(() => {
      count = Math.min(count + 1, 100);
      setCounter(count.toString().padStart(2, "0"));

      gsap.to(counterRef.current, {
        duration: 2.5,
        ease: "power2.out",
      });

      if (count === 100) {
        clearInterval(interval);

        const tl = gsap.timeline();

        tl.to(counterRef.current, {
          opacity: 1,
          duration: 1,
          ease: "power2.in",
        });

        tl.to(
          counterRef.current,
          {
            opacity: 0,
            delay: 1,
            duration: 0.5,
            ease: "power2.in",
          },
          "a"
        );

        tl.to(
          logoRef.current,
          {
            opacity: 0,
            delay: 1,
            duration: 0.8,
            ease: "power2.in",
          },
          "a"
        );

        tl.to(loaderRef.current, {
          opacity: 0.2,
          backdropFilter: "blur(30px)",
          delay: 0.2,
          duration:1.5,
          ease: "power2.in",
        });

        tl.to(loaderRef.current, {
          opacity: 0,
          backdropFilter: "blur(0px)",
          delay: 0.3,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            // Re-enable scroll
            document.body.style.overflow = "auto";
            document.documentElement.style.overflow = isMobile ? "auto" : "hidden";
            window.removeEventListener("scroll", lockScroll);
            window.removeEventListener("wheel", preventScroll);
            window.removeEventListener("touchmove", preventScroll);

            // Hide loader
            gsap.set(loaderRef.current, {
              display: "none",
            });
          },
        });
      }
    }, 100);

    return () => {
      clearInterval(interval);
      document.body.style.overflow ="auto";
      document.documentElement.style.overflow = isMobile ? "auto" : "hidden";
      window.removeEventListener("scroll", lockScroll);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed h-screen w-full bg-white flex flex-col gap-4 justify-center items-center z-[1000] "
    >
      <img
        ref={logoRef}
        className="h-24 w-fit object-contain object-center flex-shrink-0"
        src={logob}
        alt="loader_logo"
      />
      <h1 ref={counterRef} className="counter flex-shrink-0">
        【{counter}】
      </h1>
    </div>
  );
};

export default Loader;
