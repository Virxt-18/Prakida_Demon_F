import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const ScrollPath = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const pathString = `
        M 20 5
        Q 35 50 20 100
        T 20 200
        T 20 300
        T 20 400
        T 20 500
        T 20 600
    `;

  const offsetDistance = useTransform(scaleX, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:block h-[550px] w-[40px] pointer-events-none">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 40 605"
        className="overflow-visible"
      >
        {}
        <path
          d={pathString}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {}
        <motion.path
          d={pathString}
          fill="none"
          stroke="#FF5722"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: scaleX }}
        />

        {}
        {}
        <motion.div
          className="w-3 h-3 bg-prakida-flame rounded-full shadow-[0_0_10px_#FF5722]"
          style={{
            offsetPath: `path('${pathString.replace(/\s+/g, " ").trim()}')`,
            offsetDistance: offsetDistance,
          }}
        />
      </svg>
    </div>
  );
};

export default ScrollPath;
