import { motion } from 'framer-motion';
import { sectionSlide, gridStagger, cardSnap } from '../utils/motion';
import { Trophy, BookOpen, Users, ArrowRight, Target, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const SPORTS_DATA = [
    {
        id: 'cricket',
        title: 'CRICKET',
        icon: Target,
        players: '11 vs 11',
        category: 'Men Only',
        desc: "The gentleman's game, played with warrior spirit. Determine supremacy on the 22 yards.",
        color: 'from-blue-600 to-indigo-900',
        rulebook: '#'
    },
    {
        id: 'football',
        title: 'FOOTBALL',
        icon: Activity,
        players: '11 vs 11',
        category: 'Men Only',
        desc: "Passion, precision, and power. 90 minutes of pure adrenaline on the field.",
        color: 'from-emerald-600 to-teal-900',
        rulebook: '#'
    },
    {
        id: 'basketball',
        title: 'BASKETBALL',
        icon: Zap,
        players: '5 vs 5',
        category: 'Men & Women',
        desc: "Speed, skill, and gravity-defying action on the court. Dominate the paint.",
        color: 'from-orange-600 to-red-900',
        rulebook: '#'
    },
    {
        id: 'badminton',
        title: 'BADMINTON',
        icon: Activity,
        players: 'Singles / Doubles',
        category: 'Men & Women',
        desc: "Agility and reflexes pushed to the limit. Smash your way to victory.",
        color: 'from-purple-600 to-fuchsia-900',
        rulebook: '#'
    },
    {
        id: 'volleyball',
        title: 'VOLLEYBALL',
        icon: Users,
        players: '6 vs 6',
        category: 'Men & Women',
        desc: "Teamwork makes the dream work. Spike, block, and defend your glory.",
        color: 'from-yellow-500 to-amber-800',
        rulebook: '#'
    },
    {
        id: 'chess',
        title: 'CHESS',
        icon: Trophy,
        players: '1 vs 1',
        category: 'Open',
        desc: "The ultimate battle of minds. Checkmate your opponent in silence.",
        color: 'from-gray-600 to-gray-900',
        rulebook: '#'
    }
];

const Sports = () => {
    return (
        <section className="bg-black min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
            {/* Background Gradients */}
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
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 tracking-tighter">
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-prakida-flame to-yellow-500">ARENA</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm md:text-base">
                        Choose your battlefield. Prove your mettle. Glory awaits the victors in
                        Prakida's most intense sporting showdowns.
                    </p>
                </motion.div>

                <motion.div
                    variants={gridStagger}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {SPORTS_DATA.map((sport) => {
                        const Icon = sport.icon;
                        return (
                            <motion.div
                                key={sport.id}
                                variants={cardSnap}
                                className="group relative bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-all duration-300"
                            >
                                {/* Card Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${sport.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                                <div className="p-8 relative z-10 h-full flex flex-col">
                                    <div className="mb-6 flex justify-between items-start">
                                        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-md">
                                            <sport.icon className="text-white" size={32} />
                                        </div>
                                        <span className="text-xs font-mono text-gray-400 border border-white/10 px-2 py-1 rounded uppercase bg-black/50">
                                            {sport.category}
                                        </span>
                                    </div>

                                    <h3 className="text-3xl font-display font-bold text-white mb-2 italic tracking-wide">
                                        {sport.title}
                                    </h3>

                                    <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                                        {sport.desc}
                                    </p>

                                    <div className="space-y-4 pt-6 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-xs text-gray-300 font-mono">
                                            <Users size={14} className="text-prakida-flame" />
                                            <span>Format: {sport.players}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link
                                                to={`/?scrollTo=register`}
                                                className="flex-1 bg-white text-black text-center py-2 text-xs font-bold uppercase hover:bg-gray-200 transition-colors rounded items-center justify-center flex gap-1"
                                            >
                                                Register <ArrowRight size={12} />
                                            </Link>
                                            <a
                                                href={sport.rulebook}
                                                className="px-3 py-2 border border-white/20 text-white hover:bg-white/10 transition-colors rounded"
                                                title="Download Rulebook"
                                            >
                                                <BookOpen size={16} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Sports;
