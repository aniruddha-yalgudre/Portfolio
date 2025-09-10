import { useContext, useEffect, useRef, useState } from "react"
import LocomotiveScroll from "locomotive-scroll"
import Loader from "./Partials/Loader"
import Hero from "./Components/Hero"
import { Navbar, BottomNavbar } from "./Components/Navbar"
import Contact from "./Components/Contact"
import Works from "./Components/Works"
import About from "./Components/About"
import FAQ from "./Components/FAQ"
import Footer from "./Components/Footer"
import Footer2 from "./Components/Footer2"
import {useTheme } from "./utils/themeContext"
import gsap from "gsap"
import PageTransition from "./Partials/PageTransition"
import _ from "lodash"
import { Route, Routes } from "react-router-dom"

import ProjectDetail from "./Components/ProjectDetail"

function App() {
  const containerRef = useRef(null)
  const locomotiveScrollRef = useRef(null)
  const { isDarkMode } = useTheme();

  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 640 : false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [locomotiveReady, setLocomotiveReady] = useState(false)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Mouse trail effect
  useEffect(() => {
    const svg = document.querySelector("svg.trail")
    if (!svg) return
    const path = svg.querySelector("path")
    const points = []

    const resizeVP = () => {
      const ww = window.innerWidth
      const wh = window.innerHeight
      svg.setAttribute("width", ww)
      svg.setAttribute("height", wh)
      svg.setAttribute("viewBox", `0 0 ${ww} ${wh}`)
    }

    const move = (e) => {
      if (!svg || !path) return
      const x = e.clientX
      const y = e.clientY
      points.push({ x, y })
      if (points.length > 8) points.shift()
      const d = `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`
      gsap.to(path, {
        attr: { d: d },
        duration: 0.3,
        ease: "power1",
      })
    }

    resizeVP()
    window.addEventListener("mousemove", move)
    window.addEventListener("resize", resizeVP)

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("resize", resizeVP)
    }
  }, [])

  // Locomotive Scroll: Only initialize for desktop, but always allow native scroll
  useEffect(() => {
    // Clean up existing instance
    if (locomotiveScrollRef.current) {
      locomotiveScrollRef.current.destroy()
      locomotiveScrollRef.current = null
      setLocomotiveReady(false)
    }

    // Only initialize LocomotiveScroll for desktop, but do NOT set overflow: hidden on desktop
    if (!isMobile && containerRef.current) {
      const timer = setTimeout(() => {
        try {
          locomotiveScrollRef.current = new LocomotiveScroll({
            el: containerRef.current,
            smooth: true,
            smoothMobile: false,
            lerp: 0.1,
            multiplier: 0.8,
            direction: "vertical",
            gestureDirection: "vertical",
            // Using transform over top, left, height for smoother animations
            style: {
              transform: "translate3d(0, 0, 0)",
            },
          })

          if (locomotiveScrollRef.current) {
            setLocomotiveReady(true)
            // console.log("✅ Locomotive Scroll initialized successfully")

            // Using requestAnimationFrame for smoother scroll events
            const handleScroll = () => {
              requestAnimationFrame(() => {
                const scrollY = locomotiveScrollRef.current.scroll.y
                const sections = document.querySelectorAll("section[id]")

                sections.forEach((section) => {
                  const rect = section.getBoundingClientRect()
                  const sectionTop = rect.top + scrollY
                  const sectionHeight = rect.height

                  if (scrollY >= sectionTop - 200 && scrollY < sectionTop + sectionHeight - 200) {
                    setActiveSection(section.id)
                  }
                })
              })
            }

            // Using GSAP .refresh() after resize for layout updates
            const handleResize = () => {
              gsap.refresh()
              locomotiveScrollRef.current.update()
            }

            // Throttling high-frequency layout code to avoid performance issues
            const throttledHandleScroll = _.throttle(handleScroll, 100)
            const throttledHandleResize = _.throttle(handleResize, 100)

            locomotiveScrollRef.current.on("scroll", throttledHandleScroll)
            window.addEventListener("resize", throttledHandleResize)

            // Cleanup function to remove event listeners and destroy Locomotive Scroll instance
            const cleanup = () => {
              locomotiveScrollRef.current.off("scroll", throttledHandleScroll)
              window.removeEventListener("resize", throttledHandleResize)
              locomotiveScrollRef.current.destroy()
              locomotiveScrollRef.current = null
              setLocomotiveReady(false)
            }

            return cleanup
          } else {
            // console.error("❌ Locomotive Scroll initialization failed: locomotiveScrollRef.current is not defined")
            setLocomotiveReady(false)
          }
        } catch (error) {
          // console.error("❌ Locomotive Scroll initialization failed:", error)
          setLocomotiveReady(false)
        }
      }, 200)

      return () => {
        clearTimeout(timer)
        if (locomotiveScrollRef.current) {
          locomotiveScrollRef.current.destroy()
          locomotiveScrollRef.current = null
          setLocomotiveReady(false)
        }
      }
    } else {
      setLocomotiveReady(false)
    }
  }, [isMobile])

  // Intersection Observer for active section tracking (mobile + desktop fallback)
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        threshold: [0.3, 0.7],
        rootMargin: "-20% 0px -20% 0px",
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  // Handle navigation clicks with better fallback
  const handleNavClick = (id) => {
    if (isTransitioning) return

    const target = document.getElementById(id)
    if (!target) {
      console.error(`❌ Target section "${id}" not found`)
      return
    }

    console.log(`🎯 Navigating to: ${id}`)
    setIsTransitioning(true)
    setActiveSection(id)

    // Start page transition
    setTimeout(() => {
      // Always allow native scroll (desktop and mobile), but use Locomotive if available
      if (!locomotiveReady || !locomotiveScrollRef.current) {
        // Fallback: Use native scroll
        console.log("📱 Using native scroll")
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      } else {
        // Desktop: Use Locomotive Scroll
        console.log("🖥️ Using Locomotive Scroll")
        try {
          locomotiveScrollRef.current.scrollTo(target, {
            duration: 1200,
            easing: [0.25, 0.0, 0.35, 1.0],
            offset: 0,
          })
          console.log("✅ Locomotive scroll executed")
        } catch (error) {
          console.error("❌ Locomotive scroll failed, using fallback:", error)
          target.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
      setIsTransitioning(false)
    }, 1350)
  }

  // Only one scrollbar: let the body scroll, don't set overflow/height on the container
  return (
    <>
    <div
      ref={containerRef}
      data-scroll-container
      className="w-full "
    >
      <svg
        className="hidden trail top-0 left-0 md:block fixed w-full pointer-events-none transition-all duration-100 z-[998]"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5px"
      >
        <path d="M 10 10 L 20 20 " />
      </svg>
       
 
      <Loader/>
      <Navbar onNavClick={handleNavClick} activeSection={activeSection}  />
      <PageTransition isActive={isTransitioning} />
 
      {/* Debug info - remove in production
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-20 right-4 z-[1000] bg-black text-white p-2 text-xs">
          <div>Mobile: {isMobile ? "Yes" : "No"}</div>
          <div>Locomotive Ready: {locomotiveReady ? "Yes" : "No"}</div>
          <div>Active Section: {activeSection}</div>
        </div>
      )} */}


      <section id="hero" data-scroll-section className="min-h-screen">
        <Hero onNavClick={handleNavClick} />
        {/* <ProjectDetail/> */}
      </section>

      <section id="works" data-scroll-section className="min-h-screen">
        <Works />
      </section>
      
      {/* <section id="works" data-scroll-section className="min-h-screen"> */}
        {/* <ProjectDetail /> */}
      {/* </section> */}

      <section id="about" data-scroll-section className="min-h-screen">
        <About />
      </section>

      <section id="faq" data-scroll-section className="min-h-screen">
        <FAQ />
      </section>

      <section id="connect" data-scroll-section className="min-h-screen">
        <Contact parentContainerRef={containerRef} />
      </section>

      <section data-scroll-section className="min-h-screen">
        <Footer2 />
      </section>

      <BottomNavbar />

      {/* <Routes>
        <Route path="/work/:projectId" element={ <ProjectDetail/>}/>
      </Routes> */}

    </div>
      </>
  )
}

export default App
