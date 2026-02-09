import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sectionSlide, gridStagger, cardSnap } from "../utils/motion";
import {
  Trophy,
  BookOpen,
  Users,
  ArrowRight,
  Target,
  Activity,
  Zap,
  Maximize2,
  Gamepad2,
  Swords,
  RefreshCw,
  LogIn,
  Goal,
  Dribbble,
  Volleyball,
  Brain,
  Table,
  Disc,
} from "lucide-react";
import { Link } from "react-router-dom";
import SportDetailsModal from "../components/ui/SportDetailsModal";
import { SPORTS_CONFIG } from "../lib/sportsConfig";
import { summarizeFee } from "../lib/pricing";
import { useAuth } from "../context/AuthContext";

// Import images
import img1 from "../assets/gallery-1.webp";
import img2 from "../assets/gallery-2.webp";
import img3 from "../assets/gallery-3.webp";
import img4 from "../assets/gallery-4.webp";
import img5 from "../assets/gallery-5.webp";
import img6 from "../assets/gallery-6.webp";
import img7 from "../assets/gallery-7.webp";
import img8 from "../assets/gallery-8.webp";
import img9 from "../assets/gallery-9.webp";
import img10 from "../assets/gallery-10.webp";

const SPORTS_DATA = [
  {
    id: "cricket",
    title: "CRICKET",
    icon: "icons/cricket.png",
    configSport: "Cricket",
    players: "11-15 Players",
    category: "Men & Women",
    desc: "The gentleman's game, played with warrior spirit. Determine supremacy on the 22 yards.",
    detailedDesc: "Cricket at Prakida is more than just a game; it's a battle of nerves and precision. Played on the iconic BIT Mesra grounds, teams from all over the region compete for the 'Crimson Willow' trophy. Expect high-voltage action, strategic depth, and the roar of the crowd as every boundary brings us closer to glory.",
    color: "from-blue-600 to-indigo-900",
    rulebook: "#",
    images: ["https://i.ibb.co/JFr3Qdh9/cricket1-1.jpg","https://i.ibb.co/jPwgb4mH/IMG-9696.jpg", "https://i.ibb.co/9mnvK5Q8/IMG-9695.jpg"],
  },
  {
    id: "football",
    title: "FOOTBALL",
    icon: "icons/football.png",
    configSport: "Football",
    players: "11 vs 11",
    category: "Men & Women",
    desc: "Passion, precision, and power. 90 minutes of pure adrenaline on the field.",
    detailedDesc: "The beautiful game takes on a fierce intensity in the Arena. Football at Prakida demands stamina, teamwork, and tactical mastery. From lightning-fast wingers to rock-solid defenders, every player must surpass their limits to secure victory in the knockout stages.",
    color: "from-emerald-600 to-teal-900",
    rulebook: "#",
    images: ["https://i.ibb.co/Lhqkdj3B/IMG-0189.jpg", "https://i.ibb.co/KjwkbQPf/DSC-0352.jpg", "https://i.ibb.co/b8M3G8t/DSC-0110-1.jpg"],
  },
  {
    id: "basketball",
    title: "BASKETBALL",
    icon: "icons/basketball.png",
    configSport: "Basketball",
    players: "5-10 Players",
    category: "Men & Women",
    desc: "Speed, skill, and gravity-defying action on the court. Dominate the paint.",
    detailedDesc: "The rhythm of the court, the squeak of sneakers, and the swish of the net. Basketball here is about explosive speed and clinical finishing. Whether it's a clutch three-pointer or a defensive block, the energy in the Arena is unmatched as teams compete for court supremacy.",
    color: "from-orange-600 to-red-900",
    rulebook: "#",
    images: ["https://i.ibb.co/rRwSSxgk/DSC-0148.jpg", "https://i.ibb.co/PZMR6CFk/DSC-0143.jpg", "https://i.ibb.co/nNxkNZgJ/ABH-0324.jpg"],
  },
  {
    id: "badminton",
    title: "BADMINTON",
    icon: "icons/badminton.png",
    configSport: "Badminton",
    players: "Singles / Doubles",
    category: "Men & Women",
    desc: "Agility and reflexes pushed to the limit. Smash your way to victory.",
    detailedDesc: "A test of lightning reflexes and iron endurance. The badminton courts witness high-octane smashes and delicate drops. In the singles and doubles categories, slayers must demonstrate exceptional control and speed to outplay their opponents under the bright lights.",
    color: "from-purple-600 to-fuchsia-900",
    rulebook: "#",
    images: ["https://i.ibb.co/4wRvTGvY/DSC-0166.jpg", "https://i.ibb.co/B2KtrG6t/DSCF1675.jpg",
       "https://i.ibb.co/tTJYb6mS/DSCF1768.jpg"],
  },
  {
    id: "volleyball",
    title: "VOLLEYBALL",
    icon: "icons/volleyball.png",
    configSport: "Volleyball",
    players: "6-9 Players",
    category: "Men & Women",
    desc: "Teamwork makes the dream work. Spike, block, and defend your glory.",
    detailedDesc: "Coordination is the ultimate weapon on the volleyball court. Every set, every dig, and every spike is a testament to the team's synchronicity. Experience the power of the 'Thunder Spike' as teams battle it out in a series of intense sets to reach the finals.",
    color: "from-yellow-500 to-amber-800",
    rulebook: "#",
    images: ["https://i.ibb.co/nNjtGKxh/ABH-0254.jpg","https://i.ibb.co/krh0nq6/DSC-0028.jpg",
       "https://i.ibb.co/1fcbWMCW/DSC-0364.jpg"],
  },
  {
    id: "chess",
    title: "CHESS",
    icon: "icons/chess.png",
    configSport: "Chess",
    players: "5-6 Players",
    category: "Men & Women",
    desc: "The ultimate battle of minds. Checkmate your opponent in silence.",
    detailedDesc: "A war fought without a single sound. Chess at Prakida is the pinnacle of intellectual combat. In the quiet hall of the Arena, Grandmasters and novices alike engage in a strategic struggle where every move could be their last. Checkmate your way to the top.",
    color: "from-gray-600 to-gray-900",
    rulebook: "#",
    images: ["https://i.ibb.co/xSg1gNjt/DSC-0075.jpg","https://i.ibb.co/dsnLhgKJ/DSC-0120.jpg",
         "https://i.ibb.co/q8QYzF5/DSC-0121.jpg"],
  },
  {
    id: "lawn-tennis",
    title: "LAWN TENNIS",
    icon: "icons/lawn tennis.png",
    configSport: "Lawn Tennis",
    players: "Per Head (1-12 Players)",
    category: "Men & Women",
    desc: "Precision, footwork, and killer instincts. Per-head registration.",
    detailedDesc:
      "Lawn Tennis at Prakida is a test of composure under pressure. Lightning serves, ruthless volleys, and long rallies decide who earns the right to lift the trophy. Registration is per head.",
    color: "from-lime-600 to-green-900",
    rulebook: "#",
    images: ["https://i.ibb.co/ZRLHX12j/ABH-0296.jpg","https://i.ibb.co/WvM2FJS6/DSCF1715.jpg",
     "https://i.ibb.co/VWvw8byW/DSCF1716.jpg"],
  },
  {
    id: "table-tennis",
    title: "TABLE TENNIS",
    icon: "icons/table tennis.png",
    configSport: "Table Tennis",
    players: "Team / Singles / Mixed",
    category: "Mixed",
    desc: "Blink and you’ll miss it. Speed, spin, and control on the table.",
    detailedDesc:
      "From team battles to singles duels and mixed doubles, Table Tennis is pure reflex warfare. Spin-heavy serves and razor-sharp counters decide every point.",
    color: "from-cyan-600 to-sky-900",
    rulebook: "#",
    images: ["https://i.ibb.co/hRz3C0Zp/DSCF1328.jpg","https://i.ibb.co/s91NxMRT/IMG-0151.jpg",
         "https://i.ibb.co/gZqqW2WZ/IMG-0158.jpg"],
  },
  {
    id: "carrom",
    title: "CARROM",
    icon: "icons/carrom.png",
    configSport: "Carrom",
    players: "Team / Mixed Doubles",
    category: "Men / Women / Mixed",
    desc: "Calm hands, sharp angles, and perfect strikes. Pocket to prevail.",
    detailedDesc:
      "Carrom at Prakida blends finesse with clutch decision-making. A single mistake can flip the board—keep your aim steady and finish with style.",
    color: "from-rose-600 to-pink-900",
    rulebook: "#",
    images: ["https://i.ibb.co/cc6q49Qz/DSCF1727.jpg",
           "https://i.ibb.co/MxJFtrtt/DSCF1732.jpg","https://i.ibb.co/nsn6LSsL/DSCF1735.jpg"],
  },
];

const getPlayersRange = (sportKey, categoryId) => {
  const config = SPORTS_CONFIG[sportKey];
  const category = config?.categories?.find((c) => c.id === categoryId);
  if (!category) return "";
  if (category.minPlayers === category.maxPlayers) return `${category.minPlayers} Players`;
  return `${category.minPlayers}-${category.maxPlayers} Players`;
};

const getPlayersLabelForSportCard = (sport) => {
  const configKey = sport?.configSport;
  const config = configKey ? SPORTS_CONFIG[configKey] : null;
  const categories = config?.categories || [];

  const scoped = sport?.focusCategoryId
    ? categories.filter((c) => c.id === sport.focusCategoryId)
    : categories;

  if (!scoped.length) return sport?.players || "";

  const ranges = scoped
    .map((c) => {
      const min = Number(c?.minPlayers);
      const max = Number(c?.maxPlayers);
      if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
      if (min === max) return `${min}`;
      return `${min}-${max}`;
    })
    .filter(Boolean);

  const uniqueRanges = Array.from(new Set(ranges));
  if (!uniqueRanges.length) return sport?.players || "";

  const perHead = scoped.some((c) => c?.feeUnit === "per_head");
  const suffix = perHead ? " (Per Head)" : "";

  if (uniqueRanges.length === 1) return `${uniqueRanges[0]} Players${suffix}`;
  if (uniqueRanges.length <= 3) return `${uniqueRanges.join(" / ")} Players${suffix}`;
  return `Varies by category${suffix}`;
};

const getCategoriesForSportCard = (sport) => {
  const configKey = sport?.configSport;
  const config = configKey ? SPORTS_CONFIG[configKey] : null;
  const categories = config?.categories || [];
  if (sport?.focusCategoryId) {
    return categories.filter((c) => c.id === sport.focusCategoryId);
  }
  return categories;
};

const ESPORTS_DATA = [
  {
    id: "bgmi",
    title: "BGMI",
    icon: "icons/bgmi.png",
    configSport: "E-Sports",
    focusCategoryId: "bgmi",
    players: getPlayersRange("E-Sports", "bgmi"),
    category: "E-Sports",
    desc: "Squad tactics, rotations, and clutch fights. Rule the drop zone.",
    detailedDesc:
      "BGMI at Prakrida is full-throttle squad warfare. Clean comms, smart rotations, and disciplined fights decide who survives the bracket.",
    color: "from-fuchsia-700 to-violet-950",
    rulebook: "#",
    images: [img8, img9, img10],
  },
  {
    id: "valorant",
    title: "VALORANT",
    icon: "icons/valorant.png",
    configSport: "E-Sports",
    focusCategoryId: "valorant",
    players: getPlayersRange("E-Sports", "valorant"),
    category: "E-Sports",
    desc: "Aim, utility, and teamwork. Take the site, win the round.",
    detailedDesc:
      "VALORANT demands coordination and composure. Execute strategies, trade kills, and close rounds under pressure to claim victory.",
    color: "from-fuchsia-700 to-violet-950",
    rulebook: "#",
    images: [img9, img10, img1],
  },
  {
    id: "free-fire",
    title: "FREE FIRE",
    icon: "icons/ff.png",
    configSport: "E-Sports",
    focusCategoryId: "free_fire",
    players: getPlayersRange("E-Sports", "free_fire"),
    category: "E-Sports",
    desc: "Fast fights, sharp movement, and clean finishes. Outlast everyone.",
    detailedDesc:
      "FREE FIRE is about tempo and decision-making. Choose your fights, manage resources, and finish strong to top the leaderboard.",
    color: "from-fuchsia-700 to-violet-950",
    rulebook: "#",
    images: [img10, img1, img2],
  },
];

const getCategoryLabelForSport = (sport) => {
  const configKey = sport?.configSport;
  const config = configKey ? SPORTS_CONFIG[configKey] : null;
  const categoryIds = config?.categories?.map((c) => c.id) || [];

  if (configKey === "E-Sports") return "BGMI / Valorant / Free Fire";

  if (categoryIds.includes("men") && categoryIds.includes("women")) {
    return "Men & Women";
  }

  if (categoryIds.includes("men_team") && categoryIds.includes("women_team")) {
    return categoryIds.includes("mixed_double")
      ? "Men / Women / Mixed"
      : "Men & Women";
  }

  if (categoryIds.includes("mixed_double")) return "Mixed";

  if (categoryIds.includes("men")) return "Men Only";
  if (categoryIds.includes("women")) return "Women Only";

  return sport?.category || "";
};

const Sports = () => {
  const { user } = useAuth();
  const [selectedSport, setSelectedSport] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [registeredLoading, setRegisteredLoading] = useState(false);
  const [registeredRefreshedAt, setRegisteredRefreshedAt] = useState(null);

  const getRegisterTo = (sport) => {
    const params = new URLSearchParams();
    if (sport?.configSport) params.set("sport", sport.configSport);
    if (sport?.focusCategoryId) params.set("category", sport.focusCategoryId);
    const qs = params.toString();
    return qs ? `/register?${qs}` : "/register";
  };

  const refreshRegisteredEvents = useCallback(async ({ refreshStatuses = false } = {}) => {
    if (!user) {
      setRegisteredEvents([]);
      return;
    }

    setRegisteredLoading(true);
    try {
      const { eventsService } = await import("../services/api/events");
      const data = await eventsService.getRegisteredEvents();
      const raw = Array.isArray(data?.events) ? data.events : [];

      if (!refreshStatuses) {
        setRegisteredEvents(raw);
        setRegisteredRefreshedAt(new Date());
        return;
      }

      const shouldRefreshStatus = (e) => {
        const s = String(e?.status || "").toLowerCase();
        return !s || s.includes("pending");
      };

      const refreshed = await Promise.all(
        raw.map(async (e) => {
          if (!shouldRefreshStatus(e)) return e;
          try {
            const statusRes = await eventsService.getEventStatus(e.eventId);
            return { ...e, ...statusRes };
          } catch {
            return e;
          }
        }),
      );

      setRegisteredEvents(refreshed);
      setRegisteredRefreshedAt(new Date());
    } catch (err) {
      console.error("Failed to load registered events:", err);
      setRegisteredEvents([]);
      setRegisteredRefreshedAt(new Date());
    } finally {
      setRegisteredLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Lightweight refresh on page load: no per-event status calls.
    refreshRegisteredEvents({ refreshStatuses: false });
  }, [refreshRegisteredEvents]);

  const registeredByEventId = useMemo(() => {
    const map = new Map();
    for (const e of registeredEvents) {
      const key = e?.eventId != null ? String(e.eventId) : null;
      if (key) map.set(key, e);
    }
    return map;
  }, [registeredEvents]);

  const getRegistrationForCard = (sport) => {
    const configKey = sport?.configSport;
    const categories = configKey ? SPORTS_CONFIG[configKey]?.categories || [] : [];
    const scoped = sport?.focusCategoryId
      ? categories.filter((c) => c.id === sport.focusCategoryId)
      : categories;

    for (const c of scoped) {
      const id = c?.eventID;
      if (id == null) continue;
      const reg = registeredByEventId.get(String(id));
      if (reg) return reg;
    }
    return null;
  };

  const getStatusPillClass = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "confirmed") return "bg-green-900/30 text-green-400 border-green-500/30";
    if (s.includes("pending")) return "bg-yellow-900/30 text-yellow-400 border-yellow-500/30";
    if (s.includes("failed") || s.includes("cancel"))
      return "bg-red-900/30 text-red-400 border-red-500/30";
    return "bg-white/10 text-gray-200 border-white/20";
  };

  return (
    <section className="bg-black min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-prakida-flame rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900 rounded-full blur-[150px] animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          variants={sectionSlide}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 border border-prakida-flame/30 rounded-full mb-6">
            <span className="text-prakida-flame text-xs font-mono tracking-widest uppercase">Select your battlefield</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-4 tracking-tighter uppercase italic">
            THE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-prakida-flame to-yellow-500">
              ARENA
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm md:text-base leading-relaxed">
            Choose your battlefield. Prove your mettle. Glory awaits the victors
            in Prakida's most intense sporting showdowns.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => refreshRegisteredEvents({ refreshStatuses: true })}
              disabled={!user || registeredLoading}
              className="inline-flex items-center gap-2 px-5 py-2 border border-white/15 bg-white/5 text-white font-bold text-xs tracking-widest uppercase hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                !user
                  ? "Login required to refresh status"
                  : registeredLoading
                    ? "Refreshing..."
                    : "Refresh registration status"
              }
            >
              <RefreshCw size={16} className={registeredLoading ? "animate-spin" : ""} />
              {registeredLoading ? "Refreshing" : "Refresh Status"}
            </button>

            {!user ? (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2 bg-prakida-flame text-white font-bold text-xs tracking-widest uppercase hover:bg-prakida-flameDark"
              >
                <LogIn size={16} /> Login
              </Link>
            ) : (
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500">
                {registeredRefreshedAt
                  ? `Last refresh: ${registeredRefreshedAt.toLocaleTimeString()}`
                  : ""}
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={gridStagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {SPORTS_DATA.map((sport) => {
            const reg = getRegistrationForCard(sport);
            const categories = getCategoriesForSportCard(sport);
            const feeSummary = summarizeFee(categories);
            const playersLabel = getPlayersLabelForSportCard(sport);
            const categoryLabel = getCategoryLabelForSport(sport);
            const sportForModal = {
              ...sport,
              players: playersLabel,
              category: categoryLabel,
            };
            return (
              <motion.div
                key={sport.id}
                variants={cardSnap}
                onClick={() => setSelectedSport(sportForModal)}
                className="group sport-box relative bg-white/5 border border-white/10 rounded-sm overflow-hidden hover:border-prakida-flame/50 transition-all duration-500 cursor-pointer"
              >
                {reg && (
                  <div className="absolute left-4 top-4 z-20">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusPillClass(
                        reg.status,
                      )}`}
                      title={registeredLoading ? "Updating..." : "Registered"}
                    >
                      {String(reg.status || "registered").replace(/_/g, " ")}
                    </span>
                  </div>
                )}

                {/* Visual Flair */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${sport.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
                ></div>

                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-prakida-flame/10 transition-all duration-500" />

                <div className="p-10 relative z-10 h-full flex flex-col">
                  <div className="mb-8 flex justify-between items-start">
                    <div className="p-4 bg-white/5 rounded-sm border border-white/10 group-hover:border-prakida-flame/30 group-hover:bg-prakida-flame/5 transition-all duration-500">
                      <img src={sport.icon} className="sport-icon w-[32px] h-[32px]"/>
                      {/* <sport.icon className="text-white group-hover:text-prakida-flame transition-colors" size={32} /> */}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-mono text-gray-500 tracking-[0.2em] uppercase">
                        {categoryLabel}
                      </span>
                      <Maximize2 className="text-gray-600 group-hover:text-prakida-flame transition-colors" size={16} />
                    </div>
                  </div>

                  <h3 className="text-4xl font-display font-black text-white mb-3 italic tracking-wide group-hover:translate-x-2 transition-transform duration-500 uppercase">
                    {sport.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-8 flex-grow leading-relaxed font-light">
                    {sport.desc}
                  </p>

                  <div className="space-y-6 pt-8 border-t border-white/10 group-hover:border-prakida-flame/20 transition-colors">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono tracking-widest uppercase">
                      <Users size={14} className="text-prakida-flame" />
                      <span>{playersLabel}</span>
                    </div>

                    {feeSummary && (
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-sm">
                          <span className="block text-[9px] text-gray-500 font-mono tracking-widest uppercase mb-1">
                            Fee
                          </span>
                          <span className="text-sm font-bold text-white">
                            {feeSummary}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        className="flex-1 bg-white text-black py-4 text-xs font-black uppercase hover:bg-prakida-flame hover:text-white transition-all duration-300 transform group-hover:translate-y-[-2px]"
                      >
                        View Intel
                      </button>
                      <Link
                        to={user ? getRegisterTo(sport) : "/login"}
                        onClick={(e) => e.stopPropagation()}
                        className="px-6 py-4 border border-white/10 text-white hover:bg-white/10 transition-colors"
                        title={user ? "Register" : "Login required to register"}
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* E-Sports Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1 border border-prakida-flame/30 rounded-full mb-4">
              <span className="text-prakida-flame text-xs font-mono tracking-widest uppercase">E-Sports Arena</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white tracking-tighter uppercase italic">
              E-SPORTS
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-mono text-xs md:text-sm leading-relaxed mt-3">
              Choose your game. Each title has its own Event ID.
            </p>
          </div>

          <motion.div
            variants={gridStagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {ESPORTS_DATA.map((game) => (
              <motion.div
                key={game.id}
                variants={cardSnap}
                onClick={() => setSelectedSport(game)}
                className="group sport-box relative bg-white/5 border border-white/10 rounded-sm overflow-hidden hover:border-prakida-flame/50 transition-all duration-500 cursor-pointer"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
                ></div>

                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-prakida-flame/10 transition-all duration-500" />

                <div className="p-10 relative z-10 h-full flex flex-col">
                  {(() => {
                    const categories = getCategoriesForSportCard(game);
                    const feeSummary = summarizeFee(categories);
                    return (
                      <>
                  <div className="mb-8 flex justify-between items-start">
                    <div className="p-4 bg-white/5 rounded-sm border border-white/10 group-hover:border-prakida-flame/30 group-hover:bg-prakida-flame/5 transition-all duration-500">
                      <img src={game.icon} className="sport-icon w-[32px] h-[32px]"/>
                      {/* <game.icon className="text-white group-hover:text-prakida-flame transition-colors" size={32} /> */}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-mono text-gray-500 tracking-[0.2em] uppercase">
                        EVENT #{SPORTS_CONFIG["E-Sports"].categories.find((c) => c.id === game.focusCategoryId)?.eventID}
                      </span>
                      <Maximize2 className="text-gray-600 group-hover:text-prakida-flame transition-colors" size={16} />
                    </div>
                  </div>

                  <h3 className="text-4xl font-display font-black text-white mb-3 italic tracking-wide group-hover:translate-x-2 transition-transform duration-500 uppercase">
                    {game.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-8 flex-grow leading-relaxed font-light">
                    {game.desc}
                  </p>

                  <div className="space-y-6 pt-8 border-t border-white/10 group-hover:border-prakida-flame/20 transition-colors">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono tracking-widest uppercase">
                      <Users size={14} className="text-prakida-flame" />
                      <span>{game.players || "Team"}</span>
                    </div>

                    {feeSummary && (
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-sm">
                          <span className="block text-[9px] text-gray-500 font-mono tracking-widest uppercase mb-1">
                            Fee
                          </span>
                          <span className="text-sm font-bold text-white">
                            {feeSummary}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button className="flex-1 bg-white text-black py-4 text-xs font-black uppercase hover:bg-prakida-flame hover:text-white transition-all duration-300 transform group-hover:translate-y-[-2px]">
                        View Intel
                      </button>
                      <Link
                        to={user ? getRegisterTo(game) : "/login"}
                        onClick={(e) => e.stopPropagation()}
                        className="px-6 py-4 border border-white/10 text-white hover:bg-white/10 transition-colors"
                        title={user ? "Register" : "Login required to register"}
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedSport && (
          <SportDetailsModal
            sport={selectedSport}
            onClose={() => setSelectedSport(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Sports;
