import React, { useContext, useEffect, useRef } from "react";
import Transformtext from "../Partials/Transformtext";
import signw from "../assets/signature.webp";
import {useTheme } from "../utils/themeContext";

// import privacyPage from "/Privacy-Policy.html";
// import termsConditionsPage from "/Terms-Conditions.html";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { motion} from "framer-motion"


const socialsLinks = [
  { name: "linkedin", url: "#linkedin" },
  { name: "github", url: "#github" },
  { name: "twitter", url: "#twitter" },
  { name: "behance", url: "#behance" },
  { name: "dribble", url: "#dribble" },
  { name: "read.cv", url: "#read.cv" },
];


import stick1 from "../assets/stickers/sticker(1).webp"
import stick3 from "../assets/stickers/sticker(3).webp"
import stick4 from "../assets/stickers/sticker(4).webp"
import stick5 from "../assets/stickers/sticker(5).webp"
import stick6 from "../assets/stickers/sticker(6).webp"
import stick7 from "../assets/stickers/sticker(7).webp"
import stick8 from "../assets/stickers/sticker(8).webp"
import stick9 from "../assets/stickers/sticker(9).webp"


const sticks = {
  items: [
    { 
      className:"h-16 w-16 bottom-0 flex justify-center  -rotate-90 items-center bg-fuchsia-900 rounded-full",
      text: "h",
      img:stick1
    },
    { 
      className:"h-16 w-16 bottom-0 left-0 flex justify-center items-center bg-black rounded-full",
      text: "b",
      img:stick3
    },
    { 
      className:"h-16 w-16 bottom-6 left-16 flex justify-center items-center bg-green-300 rounded-full",
      text: "g",
      img:stick4
    },
    { 
      className:"h-16 w-16 bottom-16 left-26 flex justify-center items-center bg-sky-400 rounded-full",
      text: "k",
      img:stick5
    },
    { 
      className:"h-16 w-16 bottom-20 left-16 flex justify-center items-center bg-lime-500 rounded-full",
      text: "l",
      img:stick6
    },
    { 
      className:"h-16 w-16 bottom-16 left-1 flex justify-center items-center bg-amber-600 rounded-full",
      text: "m",
      img:stick7
    },
    { 
      className:"h-16 w-16 bottom-32 right-4 flex justify-center items-center bg-neutral-500 rounded-full",
      text: "n",
      img:stick8
    },
    { 
      className:"h-16 w-16 bottom-[8rem] left-5 flex justify-center items-center bg-orange-500 rounded-full",
      text: "o",
      img:stick9
    },
    { 
      className:"h-16 w-16 bottom-[11rem] left-16 flex justify-center items-center bg-orange-800 rounded-full",
      text: "b",
      img:stick1
    },
    { 
      className: "h-6 w-16 bottom-[12rem] left-1 flex justify-center items-center bg-green-600 rounded-full",
      text: "green",
      img:stick3
    }
  ]
};







const Footer2 = () => {

  gsap.registerPlugin(ScrollTrigger);
  
  const { isDarkMode } = useTheme();
 
 const ContainerRef = useRef(null);
 const dragContainerRef = useRef(null);

  useEffect(() => {
     
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ContainerRef.current,
          start:"-50% top",
          // markers: true,
          // scrub:true,
          // duration:1, 
          ease:"none",
        },
      });
  
      tl.from(".stick", {
        duration: 1,
        y:-100,
        ease: "bounce.out",
        delay: 0.1,
        position: "absolute",
        stagger: 0.13, // apply stagger to bounce effect one by one
      });
  
      tl.to(".stick", {
        duration:0.6,
        ease: "bounce.out",
        y: 0,
        rotation: "-6deg",
        stagger: 0.2, // apply stagger to bounce effect one by one
      });
  
      tl.to(".stick", {
        duration:1,
        ease: "bounce.out",
        y: 0,
        x: -1,
        // rotation: `${Math.random() * 360}%`,
        // repeat:-1,
        // delay: -1,
        stagger: 0.1, // apply stagger to bounce effect one by one
      });
  
      tl.to(".stick", {
        duration: 1,
        ease: "bounce.out",
        y:0,
        x:1,
        delay: -1,
        // repeat:-1,
        stagger: 0.1, // apply stagger to bounce effect one by one
      });

  }, []);


  

  return (
    <div  className="w-full h-full md:h-screen flex-shrink-0 p-3 pt-36 md:py-0  md:pb-12  text-[10px] uppercase  overflow-hidden  ">
      
      <div ref={ContainerRef}  className=" relative  h-full w-full flex flex-col justify-between items-end md:flex-row md:justify-between md:items-end gap-2 md:gap-0 overflow-hidden  ">
       
       
        {/* Left section - Profile and Socials */}
        <div className="relative w-full  md:w-3/5  md:h-[50vh] flex flex-col md:flex-row md:justify-between  border-y-[1px] border-zinc-600  py-3 md:py-6 ">
          

          {/* Profile section */}
          <div className="relative w-full flex flex-col justify-between items-start  md:mb-0  ">
           
            <div className=" relative flex justify-between items-start w-full h-full  ">

            <div className="w-fit relative flex-col justify-between items-center ">

              <h1 className="text-xs font-semibold  uppercase leading-none">
                From Sketches to Stories <br />
                This Is Me
              </h1>

              <div className=" relative h-1/2 w-fit   ">
                <img className=" h-fit w-fit object-contain select-none  object-center" src="https://optim.tildacdn.com/tild3339-3933-4062-b438-313763643762/-/resize/200x/-/format/webp/IMG_1359-removebg_1.png.webp" alt="" srcset="" />
              </div> 
            </div>

            <div className="w-fit h-full overflow-visible">   
              <img
                className={`h-full w-full md:hidden  object-contain object-center  select-none pointer-events-none
                  ${isDarkMode ? "opacity-30" : "opacity-70" } 
                   scale-[1.2]  rotate-[0deg] transition-opacity select-none duration-700    `}
                src={signw}
                alt="Profile"
              />
            </div> 

            {/* signature img-desk */}
          <div className=" hidden  w-full h-full  md:block absolute pointer-events-none select-none  md:left-16 md:top-[26%]  -translate-y-1/2 md:w-full md:h-auto  md:mt-0 overflow-visible">
            <img
              className="h-full w-full object-cover  object-top   select-none scale-[0.79]  rotate-[18deg]  "
              src={signw}
              alt="Profile"
            />
          </div>   
            
            </div>
            <div className="w-full flex justify-between  md:pr-[17.88vw]   ">
               
              <p className=" leading-none ">
                <Transformtext textcontent="© 2024-2025" />
              </p>

              <div className="w-full  flex  justify-end  gap-5 ">
                <a
                  href="https://www.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-none"
                >
                  <Transformtext textcontent="Terms and Conditions" />
                </a>

                <a
                  href="https://www.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-none"
                >
                  <Transformtext textcontent="Privacy Policy" />
                </a>
              </div>
            </div>
              

            

          </div>

        </div>

        {/* Right section - Approach and Services */}
        <div   className="w-full   md:w-2/5 flex flex-col md:flex-row md:h-[50vh]   overflow-hidden  border-b-[1px] border-zinc-600  md:border-y-[1px]  md:border-zinc-600 py-1  md:py-6 ">
          {/* Approach section */}
          <div className="w-full md:w-2/3  flex flex-col justify-between  uppercase md:pr-16  mb-8 md:mb-0 ">
            <h1 className="text-xs font-semibold uppercase mb-4 leading-none tracking-widest md:mb-10 ">
              Feel free to connect with me on...
            </h1>

            {/* <div className=" "> */}
            <div>
              <h1 className="font-bold my-1 ">Just hit me up on email </h1>

              <a href="mailto:aniruddhayalgudre@gmail.com">
                <Transformtext
                  textcontent={`【aniruddhayalgudre@gmail.com 】`}
                  classname={"uppercase leading-none -ml-1 md:-mr-1"}
                />
              </a>
            </div>

            <div className=" my-3 ">
              <h1 className="font-bold  my-1  ">boringgg ! Just ring me.</h1>

              <a href="tel:+918999749572">
                <Transformtext
                  textcontent={`【+91 8999749572】`}
                  classname={"uppercase leading-none  w-fit  -ml-1 md:-mr-1"}
                />
              </a>
            </div>

            
            <div className=" ">
              <h5 className="font-bold mb-3 ">socials</h5>
              <div className="flex flex-row flex-wrap gap-2 md:flex-row md:gap-x-5 md:gap-y-2 md:items-start md:0 md:w-1/2  ">
                {socialsLinks.map((link, index) => (
                  <a key={index} href={link.url} className="mr-4 md:mr-0">
                    <Transformtext
                      textcontent={`【${link.name}】`}
                      classname={"uppercase leading-none -ml-1 md:-mr-1"}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* stickers */}
          <div ref={dragContainerRef} className=" hidden  relative w-full  md:w-1/3  md:flex  flex-col justify-between md:items-end leading-none  uppercase md:text-right ">
            <h1 className="text-xs font-semibold uppercase  tracking-widest leading-none">
              Services
            </h1>
                 
                 
            {sticks.items.map((sticker, index) => (
              <motion.div key={index} className={`stick footer ${sticker.className} absolute hover:cursor-grab active:cursor-grabbing `} 
                drag 
                
                // dragConstraints={dragContainerRef}
                dragConstraints={{ top: 30, bottom: 0, left: 30, right: 20 }} 
                dragElastic={0.3} 
                dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }} 
                
              >
                <img className="pointer-events-none object-contain object-center " src={sticker.img} alt={`Sticker ${index + 1}`} srcSet={sticker.img} />
              </motion.div>
            ))}
            

            <div className="flex flex-col ">
            <button  className=" leading-none  md:-mr-[0.356rem] ">
                <Transformtext
                  textcontent={`【Back to Vibe】`}
                  classname={"uppercase leading-none  "}
                />
              </button>
            </div>

            {/* <div className="flex flex-col gap-1">
              <h5 className="font-bold mb-3">beyond design</h5>

              <p>Freelance Creative Collaboration</p>
              <p>Design Consulting & Supervision</p>
              <p>Project Direction & Oversight</p>
              <p>Talks, Guest Sessions & Panels</p>
              <p>Workshops, Mentorship & Design Education</p>
            </div>*/}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer2;
