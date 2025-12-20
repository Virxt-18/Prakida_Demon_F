import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Users, Trophy, Zap } from 'lucide-react';

const About = () => {
    const pillars = [
        { icon: Shield, title: "DISCIPLINE", desc: "Forged through rigorous training." },
        { icon: Users, title: "TEAMWORK", desc: "Unity is our greatest weapon." },
        { icon: Trophy, title: "HONOR", desc: "Victory with grace and dignity." },
        { icon: Zap, title: "SPIRIT", desc: "Burning passion that never fades." },
    ];

    return (
        <section id="about" className="py-24 bg-prakida-bg relative overflow-hidden">
            {/* Decorative Background Text */}
            <motion.div
                style={{ x: useTransform(useScroll().scrollYProgress, [0, 1], [0, -200]) }}
                className="absolute top-10 left-0 text-[10rem] md:text-[15rem] font-black text-white/5 opacity-50 select-none pointer-events-none whitespace-nowrap z-0"
            >
                P R A K I D A
            </motion.div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-1 bg-prakida-water"></div>
                            <h2 className="text-prakida-water font-bold tracking-widest text-lg">ABOUT THE FEST</h2>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 leading-tight">
                            Where Sportsmanship Meets <span className="text-prakida-flame">The Hashira Spirit</span>
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                            PRAKRIDA is not just a sports fest; it's a battleground where potential meets opportunity. Inspired by the legendary Demon Slayer Corps, we bring you an arena where every athlete channels the strength, speed, and precision of the Hashira.
                        </p>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Join us for 3 days of intense competition, camaraderie, and celebration. Whether you strike like lightning or flow like water, this is your stage to ascend.
                        </p>
                    </motion.div>

                    {/* Pillars Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {pillars.map((pillar, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="p-6 bg-white/5 border border-white/10 hover:border-prakida-water/50 hover:bg-white/10 transition-all duration-300 group"
                            >
                                <pillar.icon className="w-10 h-10 text-prakida-water group-hover:text-prakida-flame transition-colors mb-4" />
                                <h4 className="text-xl font-display font-bold text-white mb-2">{pillar.title}</h4>
                                <p className="text-sm text-gray-500">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
