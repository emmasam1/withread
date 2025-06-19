// components/WithReadLoader.jsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import PropTypes from "prop-types";

/**
 * WithReadLoader
 * @param {number}  size       Diameter (px) of the logo. Ring is 25 % larger.
 * @param {string}  ringColor  Tailwind background‑color class for the ring.
 * @param {string}  className  Extra classes for the outer wrapper.
 */
const WithReadLoader = ({
  size = 144,           // default 144 px logo
  ringColor = "bg-blue-200",
  className = "",
}) => {
  const ringSize = size * 1.25; // 25 % larger ring

  const pulseRing = {
    animate: { scale: [1, 1.5], opacity: [0.8, 0] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeOut" },
  };

  const logoPulse = {
    animate: { scale: [1, 1.1, 1], opacity: [1, 0.9, 1] },
    transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
  };

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Pulse ring */}
      <motion.div
        className={`absolute rounded-full ${ringColor}`}
        style={{ width: ringSize, height: ringSize, zIndex: 0 }}
        {...pulseRing}
      />

      {/* Logo */}
      <motion.div
        className="flex items-center justify-center z-10"
        style={{ width: size, height: size }}
        {...logoPulse}
      >
        <Image
          src="/images/login_logo.png"
          alt="WithRead Logo"
          width={size}
          height={size}
          priority
        />
      </motion.div>
    </div>
  );
};

WithReadLoader.propTypes = {
  size: PropTypes.number,
  ringColor: PropTypes.string,
  className: PropTypes.string,
};

export default WithReadLoader;
