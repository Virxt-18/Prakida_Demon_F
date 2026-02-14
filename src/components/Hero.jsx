import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { heroPunchIn, buttonHover, buttonTap } from "../utils/motion";
import ParallaxElement from "./ui/ParallaxElement";
import GradientText from "./ui/GradientText";

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "/assets/aesthetic-1.jpg",
    "/assets/aesthetic-2.jpg",
    "/assets/aesthetic-3.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const targetDate = new Date("2026-03-12T09:00:00");

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 perspective-1000">
      {}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Background images removed
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={images[currentImageIndex]}
              alt="Background"
              className="w-full h-full object-cover opacity-80"
            />
          </motion.div>
        </AnimatePresence>
        */}

        {}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-prakida-bg z-10" />
        <div className="absolute inset-0 z-10 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 relative z-10 w-[100vw] text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <span className="px-4 py-1 border border-prakida-flame/50 text-prakida-flame text-[14px] md:text-lg font-bold tracking-widest md:tracking-[0.3em] uppercase backdrop-blur-sm inline-block">
              BIT PATNA PRESENTS
            </span>
          </motion.div>

          <div className="relative z-20 mix-blend-overlay opacity-90 w-full h-full mb-2 pt-2">
            <ParallaxElement speed={0.5} direction="down">
              <motion.div
                variants={heroPunchIn}
                initial="hidden"
                animate="visible"
              >
                <h1
                  className="hero-font text-[clamp(45px,12vw,1200px)] font-display font-black tracking-wide leading-[1]"
                  style={{
                    textShadow: "0 0 40px rgba(255,255,255,0.1)",
                  }}
                >
                  <GradientText>PRAKRIDA</GradientText>
                </h1>
              </motion.div>
            </ParallaxElement>
          </div>

          <motion.p
            variants={heroPunchIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="text-gray-200 text-md md:text-[26px] max-w-3xl mx-auto mt-8 mb-12 font-light tracking-wide leading-relaxed drop-shadow-md"
          >
            The arena awaits. Unleash your inner{" "}
            <span className="text-prakida-flame font-bold drop-shadow-glow">
              HASHIRA
            </span>
            .<br />
            <span className="text-white/80 text-md md:text-[26px]">
              Victory is not given. It is taken.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center mb-20"
          >
            <motion.div whileHover={buttonHover} whileTap={buttonTap}>
              <Link
                to="/sports"
                className="block group relative px-6 py-3 md:px-10 md:py-5 bg-prakida-flame text-white font-bold text-lg md:text-xl tracking-widest overflow-hidden clip-path-slant shadow-lg shadow-prakida-flame/50"
              >
                <span className="relative z-10 group-hover:tracking-[0.2em] transition-all duration-300">
                  ENTER ARENA
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </Link>
            </motion.div>

            <motion.div whileHover={buttonHover} whileTap={buttonTap}>
              <Link
                to="/register"
                className="block group px-6 py-3 md:px-8 md:py-5 border border-white/40 bg-black/30 text-white font-bold text-base md:text-lg tracking-widest hover:border-white/80 backdrop-blur-sm transition-all"
              >
                REGISTER NOW
              </Link>
            </motion.div>
          </motion.div>

          {}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 max-w-4xl mx-auto border-t mb-6 border-white/20 pt-10"
          >
            {[
              { label: "DAYS", value: timeLeft.days },
              { label: "HOURS", value: timeLeft.hours },
              { label: "MINUTES", value: timeLeft.minutes },
              { label: "SECONDS", value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="text-center group cursor-default">
                <div className="text-4xl md:text-6xl font-display font-black text-white mb-2 group-hover:text-prakida-flame transition-colors duration-300 drop-shadow-md">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-xs md:text-sm text-gray-400 tracking-[0.3em] font-medium group-hover:text-white transition-colors duration-300">
                  {item.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
