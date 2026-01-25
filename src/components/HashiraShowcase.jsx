import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  sectionSlide,
  gridStagger,
  cardSnap,
  cardHover,
} from "../utils/motion";

const sportsData = [
  {
    sport: "Cricket",
    hashira: "Water Hashira",
    name: "Giyu Tomioka",
    desc: "Calm, strategic, flowing. Adapt to the game and strike with fluid precision.",
    color: "from-blue-600 to-cyan-400",
    accent: "border-blue-500",
    kanji: "水",
    tags: ["Strategy", "Flow"],
  },
  {
    sport: "Volleyball",
    hashira: "Wind Hashira",
    name: "Sanemi Shinazugawa",
    desc: "Aggressive stamina and gale-force momentum. Cut through the defense like a storm.",
    color: "from-lime-500 to-green-700",
    accent: "border-lime-400",
    kanji: "風",
    tags: ["Stamina", "Aggression"],
  },
  {
    sport: "Badminton",
    hashira: "Insect Hashira",
    name: "Shinobu Kocho",
    desc: "Agility, finesse, and deadly precision. Float like a butterfly, sting like a bee.",
    color: "from-purple-600 to-emerald-400",
    accent: "border-purple-500",
    kanji: "蟲",
    tags: ["Agility", "Precision"],
  },
  {
    sport: "Basketball",
    hashira: "Sound Hashira",
    name: "Tengen Uzui",
    desc: "Flashy, stylish, and high tempo. Dominate the court with flamboyant moves.",
    color: "from-fuchsia-600 to-purple-400",
    accent: "border-fuchsia-500",
    kanji: "音",
    tags: ["Speed", "Flashy"],
  },
  {
    sport: "Football",
    hashira: "Flame Hashira",
    name: "Kyojuro Rengoku",
    desc: "Burning passion and explosive offense. Set your heart ablaze and dominate the field.",
    color: "from-orange-500 to-red-600",
    accent: "border-orange-400",
    kanji: "炎",
    tags: ["Passion", "Offense"],
  },
  {
    sport: "Chess",
    hashira: "Serpent Hashira",
    name: "Obanai Iguro",
    desc: "Twisting strategies and calculated strikes. Corner your opponent with precision.",
    color: "from-slate-700 to-indigo-900",
    accent: "border-indigo-400",
    kanji: "蛇",
    tags: ["Strategy", "Intellect"],
  },
  {
    sport: "Carrom",
    hashira: "Mist Hashira",
    name: "Muichiro Tokito",
    desc: "Obscured strikes and mental clarity. Cloud the opponent's judgement.",
    color: "from-cyan-200 to-blue-300",
    accent: "border-cyan-200",
    kanji: "霞",
    tags: ["Clarity", "Focus"],
  },
  {
    sport: "Lawn Tennis",
    hashira: "Love Hashira",
    name: "Mitsuri Kanroji",
    desc: "Flexibility and whipping power. Play with grace and overwhelming strength.",
    color: "from-pink-500 to-green-300",
    accent: "border-pink-400",
    kanji: "恋",
    tags: ["Power", "Flexibility"],
  },
  {
    sport: "Table Tennis",
    hashira: "Thunder Hashira",
    name: "Zenitsu Agatsuma",
    desc: "Godspeed reflexes. Strike faster than the eye can see.",
    color: "from-yellow-400 to-orange-500",
    accent: "border-yellow-400",
    kanji: "雷",
    tags: ["Speed", "Reflexes"],
  },
];

const TiltCard = ({ item, index }) => {
  const ref = useRef(null);
  const rectRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseEnter = () => {
    rectRef.current = ref.current.getBoundingClientRect();
  };

  const handleMouseMove = (e) => {
    if (!rectRef.current) return;

    const width = rectRef.current.width;
    const height = rectRef.current.height;

    const mouseX = e.clientX - rectRef.current.left;
    const mouseY = e.clientY - rectRef.current.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      variants={cardSnap}
      whileHover={cardHover}
      viewport={{ once: true }}
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`group relative h-[400px] border border-white/10 bg-white/5 rounded-sm overflow-hidden`}
    >
      { }
      <div
        className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
      ></div>

      { }
      <motion.div
        style={{
          opacity: useTransform(x, [-0.5, 0, 0.5], [0, 0.3, 0]),
          background:
            "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
          transform: useTransform(x, (range) => `translateX(${range * 100}%)`),
        }}
        className="absolute inset-0 w-full h-full z-20 pointer-events-none"
      />

      { }
      <div
        className="absolute -bottom-10 -right-10 text-9xl font-black text-white/5 group-hover:text-white/10 transition-colors duration-500 select-none font-display"
        style={{ transform: "translateZ(20px)" }}
      >
        {item.kanji}
      </div>

      <div
        className="p-8 h-full flex flex-col relative z-10"
        style={{ transform: "translateZ(50px)" }}
      >
        { }
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-prakida-text/60 text-sm font-bold tracking-wider mb-1 uppercase">
              {item.hashira}
            </h4>
            <h3 className="text-3xl font-display font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
              {item.sport}
            </h3>
          </div>
          <div
            className={`w-3 h-3 rounded-full bg-gradient-to-br ${item.color} shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
          ></div>
        </div>

        { }
        <p className="text-gray-400 mb-8 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {item.desc}
        </p>

        <div className="mt-auto">
          <div className="text-sm font-bold text-white/80 mb-2">
            {item.name}
          </div>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-white/10 border border-white/10 rounded text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      { }
      <div
        className={`absolute inset-0 border-2 ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      ></div>
    </motion.div>
  );
};

const HashiraShowcase = ({ limit }) => {
  const displayedData = limit ? sportsData.slice(0, limit) : sportsData;

  return (
    <section id="hashira" className="py-24 bg-black relative perspective-1000">
      <div className="container mx-auto px-6">
        <motion.div
          variants={sectionSlide}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-prakida-flame font-bold tracking-[0.2em] mb-4 text-sm md:text-base">
            THE ARENA
          </h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold text-white">
            HASHIRA x SPORTS
          </h3>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto mt-6"></div>
        </motion.div>

        <motion.div
          variants={gridStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayedData.map((item, idx) => (
            <TiltCard key={idx} item={item} index={idx} />
          ))}
        </motion.div>

        {limit && (
          <div className="mt-16 text-center">
            <Link
              to="/sports"
              className="inline-block px-6 py-2 md:px-8 md:py-3 border border-prakida-flame text-prakida-flame font-bold tracking-widest hover:bg-prakida-flame hover:text-white transition-all duration-300 skew-x-[-12deg]"
            >
              <span className="block skew-x-[12deg] text-sm md:text-base">
                VIEW ALL SPORTS
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HashiraShowcase;
