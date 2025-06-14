// components/WithReadLoader.jsx
import { motion } from "framer-motion";
import Image from "next/image";

const heartbeatAnimation = {
  scale: [1, 1.2, 1],
  transition: {
    duration: 0.8,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

const WithReadLoader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        animate={heartbeatAnimation}
        className="w-28 h-28" // slightly larger than default
      >
        <Image
          src="/images/login_logo.png"
          alt="WithRead Logo"
          width={112}
          height={112}
          priority
        />
      </motion.div>
    </div>
  );
};

export default WithReadLoader;
