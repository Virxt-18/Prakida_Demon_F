import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const GlitchLink = ({ to, text, kanji }) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`font-medium whitespace-nowrap truncate tracking-wide text-sm max-[1000px]:text-[12px] relative group px-2 py-1 transition-colors duration-300 ${isActive ? "text-prakida-flame" : "text-gray-300 hover:text-white"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="glitch-wrapper relative inline-block text-center">
        {}
        <span
          className={`block relative z-10 transition-opacity duration-100 whitespace-nowrap ${isHovered ? "opacity-0" : "opacity-100"}`}
        >
          {text}
        </span>

        {}
        <span
          className={`absolute inset-0 z-10 glitch-text transition-opacity duration-100 flex items-center justify-center pointer-events-none whitespace-nowrap ${isHovered ? "opacity-100" : "opacity-0"}`}
          data-text={kanji}
        >
          {kanji}
        </span>
      </span>

      {}
      <span
        className={`absolute bottom-0 left-0 w-full h-0.5 bg-prakida-water transform transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
      ></span>
    </Link>
  );
};

export default GlitchLink;
