import { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import SportDetailsModal from "../components/ui/SportDetailsModal";

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
    icon: Target,
    players: "11 vs 11",
    category: "Men Only",
    desc: "The gentleman's game, played with warrior spirit. Determine supremacy on the 22 yards.",
    detailedDesc: "Cricket at Prakida is more than just a game; it's a battle of nerves and precision. Played on the iconic BIT Mesra grounds, teams from all over the region compete for the 'Crimson Willow' trophy. Expect high-voltage action, strategic depth, and the roar of the crowd as every boundary brings us closer to glory.",
    color: "from-blue-600 to-indigo-900",
    rulebook: "#",
    images: [img1, img2, img3],
  },
  {
    id: "football",
    title: "FOOTBALL",
    icon: Activity,
    players: "11 vs 11",
    category: "Men Only",
    desc: "Passion, precision, and power. 90 minutes of pure adrenaline on the field.",
    detailedDesc: "The beautiful game takes on a fierce intensity in the Arena. Football at Prakida demands stamina, teamwork, and tactical mastery. From lightning-fast wingers to rock-solid defenders, every player must surpass their limits to secure victory in the knockout stages.",
    color: "from-emerald-600 to-teal-900",
    rulebook: "#",
    images: [img4, img5, img6],
  },
  {
    id: "basketball",
    title: "BASKETBALL",
    icon: Zap,
    players: "5 vs 5",
    category: "Men & Women",
    desc: "Speed, skill, and gravity-defying action on the court. Dominate the paint.",
    detailedDesc: "The rhythm of the court, the squeak of sneakers, and the swish of the net. Basketball here is about explosive speed and clinical finishing. Whether it's a clutch three-pointer or a defensive block, the energy in the Arena is unmatched as teams compete for court supremacy.",
    color: "from-orange-600 to-red-900",
    rulebook: "#",
    images: [img7, img8, img9],
  },
  {
    id: "badminton",
    title: "BADMINTON",
    icon: Activity,
    players: "Singles / Doubles",
    category: "Men & Women",
    desc: "Agility and reflexes pushed to the limit. Smash your way to victory.",
    detailedDesc: "A test of lightning reflexes and iron endurance. The badminton courts witness high-octane smashes and delicate drops. In the singles and doubles categories, slayers must demonstrate exceptional control and speed to outplay their opponents under the bright lights.",
    color: "from-purple-600 to-fuchsia-900",
    rulebook: "#",
    images: [img10, img1, img2],
  },
  {
    id: "volleyball",
    title: "VOLLEYBALL",
    icon: Users,
    players: "6 vs 6",
    category: "Men & Women",
    desc: "Teamwork makes the dream work. Spike, block, and defend your glory.",
    detailedDesc: "Coordination is the ultimate weapon on the volleyball court. Every set, every dig, and every spike is a testament to the team's synchronicity. Experience the power of the 'Thunder Spike' as teams battle it out in a series of intense sets to reach the finals.",
    color: "from-yellow-500 to-amber-800",
    rulebook: "#",
    images: ["/volley01.jpg", "/volley02.jpg", "/volley03.jpg.jpeg"],
  },
  {
    id: "chess",
    title: "CHESS",
    icon: Trophy,
    players: "1 vs 1",
    category: "Open",
    desc: "The ultimate battle of minds. Checkmate your opponent in silence.",
    detailedDesc: "A war fought without a single sound. Chess at Prakida is the pinnacle of intellectual combat. In the quiet hall of the Arena, Grandmasters and novices alike engage in a strategic struggle where every move could be their last. Checkmate your way to the top.",
    color: "from-gray-600 to-gray-900",
    rulebook: "#",
    images: [img6, img7, img8],
  },
];

const Sports = () => {
  const [selectedSport, setSelectedSport] = useState(null);

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
        </motion.div>

        <motion.div
          variants={gridStagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {SPORTS_DATA.map((sport) => {
            return (
              <motion.div
                key={sport.id}
                variants={cardSnap}
                onClick={() => setSelectedSport(sport)}
                className="group relative bg-white/5 border border-white/10 rounded-sm overflow-hidden hover:border-prakida-flame/50 transition-all duration-500 cursor-pointer"
              >
                {/* Visual Flair */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${sport.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
                ></div>

                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-prakida-flame/10 transition-all duration-500" />

                <div className="p-10 relative z-10 h-full flex flex-col">
                  <div className="mb-8 flex justify-between items-start">
                    <div className="p-4 bg-white/5 rounded-sm border border-white/10 group-hover:border-prakida-flame/30 group-hover:bg-prakida-flame/5 transition-all duration-500">
                      <sport.icon className="text-white group-hover:text-prakida-flame transition-colors" size={32} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-mono text-gray-500 tracking-[0.2em] uppercase">
                        {sport.category}
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
                      <span>{sport.players}</span>
                    </div>

                    <div className="flex gap-4">
                      <button
                        className="flex-1 bg-white text-black py-4 text-xs font-black uppercase hover:bg-prakida-flame hover:text-white transition-all duration-300 transform group-hover:translate-y-[-2px]"
                      >
                        View Intel
                      </button>
                      <Link
                        to="/register"
                        onClick={(e) => e.stopPropagation()}
                        className="px-6 py-4 border border-white/10 text-white hover:bg-white/10 transition-colors"
                        title="Direct Registration"
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
