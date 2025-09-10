import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectsData } from "../utils/projectsData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  //   const { scrollTo, isReady } = useSmoothScroll()
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const projectData = projectsData.find((p) => p.id === parseInt(1));
    if (projectData) {
      setProject(projectData);
    }
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    if (!project || loading) return;
    // Hero animation
    gsap.fromTo(
      heroRef.current,
      {
        opacity: 0,
        scale: 1.1,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
      }
    );

    // Content animation
    gsap.fromTo(
      contentRef.current?.children || [],
      {
        y: 60,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.5,
        ease: "power2.out",
      }
    );

    // Parallax effect for images
    // const images = document.querySelectorAll(".project-image");
    // images.forEach((img, index) => {
    //   gsap.fromTo(
    //     img,
    //     {
    //       y: 100,
    //       scale: 0.95,
    //       opacity: 0,
    //     },
    //     {
    //       y: 0,
    //       scale: 1,
    //       opacity: 1,
    //       duration: 1,
    //       // delay: 0,
    //       ease: "power2.out",
    //       scrollTrigger: {
    //         trigger: img,
    //         start: "top 80%",
    //         // markers:true,
    //         end: "bottom 20%",
    //         toggleActions: "play none none reverse",
    //       },
    //     }
    //   );
    // });
  }, [project, loading]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-lg mb-4">Project not found</div>
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:underline"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const isVideoFile = (url) => {
    if (!url) return false;
    if (typeof url === "string") {
      return (
        url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg")
      );
    }
    if (url.type) {
      return url.type.includes("video");
    }
    return false;
  };

  return (
    <div
      ref={containerRef}
      className="panel absolute  top-0 left-0 w-full  md:h-screen flex-shrink-0  text-[10px] uppercase "
    >
      {/* Navigation */}
      {/* <nav className="top-0 left-0 right-0 z-50 backdrop-blur-sm border-b pt-36 md:pt-24 "> */}
      <nav className="top-0 hidden left-0 right-0 z-50 backdrop-blur-sm border-b pt-0 md:pt-0 ">
        <div className=" flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            {/* <ArrowLeft className="w-4 h-4" /> */}
            <span className="text-sm font-medium">Back to Works</span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            {/* <X className="w-5 h-5" /> */}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full h-screen flex flex-col md:flex-row md:justify-between ">
        <div
          ref={heroRef}
          className="w-full h-full md:h-fit overflow-hidden"
          style={{ backgroundColor: project.bgColor || "#000" }}
        >
          <img
            data-scroll
            data-scroll-speed="-0.3"
            src={project.images[0] || "/placeholder.svg"}
            alt={project.name}
            className="w-full h-full object-cover object-center"
          />
          {/* <div className="absolute inset-0 bg-black/20" /> */}

          {/* Project Title Overlay */}
          <div
            data-scroll
            data-scroll-speed="-0.2"
            className="absolute h-full w-full top-0 left-0 px-3 right-8 text-white bg-blue-300/0 py-24"
          >
            <div className=" h-full flex flex-col justify-between ">
              <div className="top-part ">
                <h1 className="text-4xl md:text-6xl  text-nowrap font-bold mb-4 leading-3 bg-red-600">
                  {project.name}
                </h1>

                <div className="flex flex-wrap gap-4 opacity-90 leading-none w-full md:w-[43%] pr-4 ">
                  <span>{project.typology}</span>
                  <span>•</span>
                  <span>{project.location}</span>
                  <span>•</span>
                  <span>{project.year}</span>
                </div>
              </div>
              <div className="flex flex-wrap  w-full md:w-[43%]   md:pr-4  ">
                <p className="  md:text-[12px]">{project.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 bg-blue-400 ">
        <div className=" ">
          <div
            ref={contentRef}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-3  mb-16 bg-green-500"
          >
            {/* Project Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-[14px] font-semibold mb-6">
                  Project Details
                </h2>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-semibold ">Location:</span>
                    <p>{project.location}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Typology:
                    </span>
                    <p>{project.typology}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Status:
                    </span>
                    <p>{project.status}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Year:
                    </span>
                    <p>{project.year}</p>
                  </div>
                  {project.buildArea && (
                    <div>
                      <span className="font-semibold text-muted-foreground">
                        Build Area:
                      </span>
                      <p>{project.buildArea}</p>
                    </div>
                  )}
                  {project.siteArea && (
                    <div>
                      <span className="font-semibold text-muted-foreground">
                        Site Area:
                      </span>
                      <p>{project.siteArea}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Scope:
                    </span>
                    <p>{project.scope}</p>
                  </div>
                  {project.team && (
                    <div>
                      <span className="font-semibold text-muted-foreground">
                        Team:
                      </span>
                      <p>{project.team}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">About the Project</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {project.desc || "Project details coming soon."}
              </p>
            </div>
          </div>

          {/* Project Images Gallery */}
          <div className="space-y-0">
            {project.images.map((assetURL, index) =>
              isVideoFile(assetURL) ? (
                <video
                  className="w-fit h-fit object-cover  object-center"
                  src={assetURL}
                  muted
                  playsInline
                  autoPlay
                  loop
                />
              ) : (
                <div
                  key={index}
                  className={`project-image ${
                    index % 2 === 0
                      ? "ml-0 md:ml-0 "
                      : "ml-0 md:ml-auto md:w-4/5"
                  }`}
                >
                  <img
                    src={assetURL}
                    alt={`${project.name} - Image ${index + 1}`}
                    className="w-full h-auto object-cover  shadow-lg"
                  />
                </div>
              )
            )}
          </div>

          {/* Navigation to other projects */}
          <div className="mt-24  px-3 h-full w-full  ">
            <h3 className="text-[14px] font-semibold mb-8">Related Projects</h3>
            <div className="relative w-full overflow-hidden content ">
              <motion.div
                className="flex gap-4"
                animate={{
                  x: [0, -1000],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                  },
                }}
              >
                {projectsData
                  .filter((p) => p.id !== project.id)
                  .map((otherProject) => (
                    <motion.div
                      key={otherProject.id}
                      className="cursor-pointer group  h-fit  w-fit max-w-80  flex-shrink-0 "
                      onClick={() => navigate(`/work/${otherProject.id}`)}
                    >
                      <div className="mb-0.5  flex-col items-start  overflow-hidden ">
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          src={otherProject.images[0]}
                          alt={otherProject.name}
                          className="w-full h-full object-contain md:object-cover object-top    "
                        />
                      </div>
                      <h4 className="font-semibold leading-snug ">
                        {otherProject.name}
                      </h4>
                      <p className=" text-muted-foreground leading-none ">
                        {otherProject.typology} • {otherProject.year}
                      </p>
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          </div>

          {/* smaller footer for project  */}
          <div className="mt-12  border-t px-3 bg-yellow-500 ">
            <h3 className="text-xl font-bold mb-8">Other Projects</h3>

            <div className="relative flex justify-between items-center">
              <div className="md:absolute top-0 left-0  w-full md:h-full md:w-[60%] flex md:justify-start items-center">
                <h1 className="text-[1vw] md:text-[1vw] font-['Secondary'] tracking-tighter leading-none">
                  let's do something epic
                </h1>
              </div>

              {/* const newBgColor = isDarkMode ? '#1E1E1E' : '#'; */}
              {/* const newTextColor = isDarkMode ? '#dadada' : '#393939'; */}

              <div className="md:absolute top-0 right-0  w-full md:h-full md:w-[40%]">
                <div className="h-full w-full flex flex-shrink-0 justify-start items-center">
                  <h1>hello</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
