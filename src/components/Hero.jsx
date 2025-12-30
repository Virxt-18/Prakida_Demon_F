
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { heroPunchIn, buttonHover, buttonTap } from '../utils/motion';
import ParallaxElement from './ui/ParallaxElement';

const Hero = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Performance optimization: Use motion values instead of state to prevent re-renders on mouse move
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for the mouse values
    const springConfig = { damping: 30, stiffness: 200 };
    const mouseXSpring = useSpring(mouseX, springConfig);
    const mouseYSpring = useSpring(mouseY, springConfig);

    // Transform values for parallax layers
    const rotateX = useTransform(mouseYSpring, [-500, 500], [5, -5]);
    const rotateY = useTransform(mouseXSpring, [-500, 500], [-5, 5]);

    const orb1X = useTransform(mouseXSpring, (val) => val * -0.05);
    const orb1Y = useTransform(mouseYSpring, (val) => val * -0.05);

    const orb2X = useTransform(mouseXSpring, (val) => val * 0.05);
    const orb2Y = useTransform(mouseYSpring, (val) => val * 0.05);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const moveX = clientX - window.innerWidth / 2;
            const moveY = clientY - window.innerHeight / 2;
            mouseX.set(moveX);
            mouseY.set(moveY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    useEffect(() => {
        // Set target date to January 13, 2026
        const targetDate = new Date('2026-01-13T09:00:00');

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
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
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 perspective-1000">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-prakida-bg via-transparent to-prakida-bg z-10" />
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay animate-pulse" />

                {/* Parallax Orbs */}
                <motion.div
                    style={{
                        x: orb1X,
                        y: orb1Y,
                    }}
                    className="absolute top-0 right-0 w-full h-full will-change-transform"
                >
                    <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-prakida-water/30 rounded-full blur-[120px] mix-blend-screen" />
                </motion.div>

                <motion.div
                    style={{
                        x: orb2X,
                        y: orb2Y,
                    }}
                    className="absolute bottom-0 left-0 w-full h-full will-change-transform"
                >
                    <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-prakida-flame/20 rounded-full blur-[150px] mix-blend-screen" />
                </motion.div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="mb-4">
                        <span className="px-4 py-1 border border-prakida-flame/50 text-prakida-flame text-[16px] md:text-lg font-bold tracking-widest md:tracking-[0.3em] uppercase backdrop-blur-sm inline-block">
                            BIT PATNA PRESENTS
                        </span>
                    </motion.div>


                    <div className="relative z-20 mix-blend-overlay opacity-90 mb-2">
                        <ParallaxElement speed={0.5} direction="down">
                            <motion.div variants={heroPunchIn} initial="hidden" animate="visible">
                                <h1
                                    className="text-5xl md:text-9xl lg:text-[12rem] font-display font-black text-white tracking-tighter leading-[0.8]"
                                    style={{ textShadow: '0 0 40px rgba(255,255,255,0.1)', fontFamily: "'Nosifer', cursive" }}
                                >
                                    PRAKRIDA
                                </h1>
                            </motion.div>
                        </ParallaxElement>
                    </div>

                    <motion.p
                        variants={heroPunchIn}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                        className="text-gray-300 text-xl md:text-[26px] max-w-3xl mx-auto mt-8 mb-12 font-light tracking-wide leading-relaxed"
                    >
                        The arena awaits. Unleash your inner <span className="text-prakida-water font-bold drop-shadow-glow">HASHIRA</span>.<br />
                        <span className="text-white/60 text-lg">Victory is not given. It is taken.</span>
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
                                <span className="relative z-10 group-hover:tracking-[0.2em] transition-all duration-300">ENTER ARENA</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                            </Link>
                        </motion.div>

                        <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                            <Link
                                to="/register"
                                className="block group px-6 py-3 md:px-8 md:py-5 border border-white/20 text-white font-bold text-base md:text-lg tracking-widest hover:border-white/50 backdrop-blur-sm"
                            >
                                REGISTER NOW
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Countdown */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 max-w-4xl mx-auto border-t border-white/10 pt-10"
                    >
                        {[
                            { label: 'DAYS', value: timeLeft.days },
                            { label: 'HOURS', value: timeLeft.hours },
                            { label: 'MINUTES', value: timeLeft.minutes },
                            { label: 'SECONDS', value: timeLeft.seconds }
                        ].map((item, idx) => (
                            <div key={idx} className="text-center group cursor-default">
                                <div className="text-4xl md:text-6xl font-display font-black text-white mb-2 group-hover:text-prakida-flame transition-colors duration-300">
                                    {String(item.value).padStart(2, '0')}
                                </div>
                                <div className="text-xs md:text-sm text-gray-500 tracking-[0.3em] font-medium group-hover:text-white transition-colors duration-300">{item.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}

        </section>
    );
};

export default Hero;
