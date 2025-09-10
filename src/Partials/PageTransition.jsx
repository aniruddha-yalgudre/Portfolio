import { motion, AnimatePresence } from "framer-motion"
import {useTheme } from "../utils/themeContext";


const overlayVariants = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "-100%",transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] } },
}

const PageTransition = ({ isActive }) => {

  const { isDarkMode } = useTheme();
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className={`fixed transition_page top-0 left-0 w-full h-full ${isDarkMode ? "bg-[#E0E0E0]":"bg-[#393939]"} z-[9999] pointer-events-none`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={overlayVariants}
          transition={{ duration:1.3, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ height: "200vh", width: "100%" }}
        />
      )}
    </AnimatePresence>
  );
}

export default PageTransition
