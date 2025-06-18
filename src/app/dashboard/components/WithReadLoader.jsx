// components/WithReadLoader.jsx
import { motion } from "framer-motion";
import Image from "next/image";

const pulseRing = {
  animate: {
    scale: [1, 1.5],
    opacity: [0.8, 0],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeOut",
  },
};

const logoPulse = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.9, 1],
  },
  transition: {
    duration: 1.2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const WithReadLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white relative">
      {/* Animated pulse ring behind the logo */}
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-blue-200"
        style={{ zIndex: 0 }}
        animate={pulseRing.animate}
        transition={pulseRing.transition}
      />

      {/* Animated logo with scale and fade */}
      <motion.div
        className="w-36 h-36 z-10 flex items-center justify-center"
        animate={logoPulse.animate}
        transition={logoPulse.transition}
      >
        <Image
          src="/images/login_logo.png"
          alt="WithRead Logo"
          width={144}
          height={144}
          priority
        />
      </motion.div>
    </div>
  );
};

export default WithReadLoader;
