import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const SportDetailsModal = ({ sport, onClose }) => {
    const [currentThumb, setCurrentThumb] = useState(0);

    useEffect(() => {
        if (!sport || !sport.images || sport.images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentThumb((prev) => (prev + 1) % sport.images.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [sport]);

    if (!sport) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center overflow-y-auto p-4 md:p-6 lg:p-8 pt-20 pb-20">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-prakida-bg border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(239,68,68,0.15)] rounded-sm my-auto"
            >
                {/* Accents */}
                <div className="absolute top-0 left-0 w-32 h-[2px] bg-prakida-flame z-20" />
                <div className="absolute bottom-0 right-0 w-32 h-[2px] bg-prakida-flame z-20" />
                <div className="absolute top-0 right-0 w-[2px] h-32 bg-prakida-flame z-20 hidden md:block" />
                <div className="absolute bottom-0 left-0 w-[2px] h-32 bg-prakida-flame z-20 hidden md:block" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white hover:text-prakida-flame transition-colors rounded-full border border-white/10 hover:border-prakida-flame/50"
                >
                    <X size={24} />
                </button>

                {/* Left Side: Photo Slideshow */}
                <div className="w-full md:w-1/2 aspect-video md:aspect-square relative overflow-hidden bg-white/5 group shrink-0">
                    <AnimatePresence mode="wait">
                        {sport.images && sport.images.length > 0 ? (
                            <motion.img
                                key={currentThumb}
                                src={sport.images[currentThumb]}
                                alt={`${sport.title} Action`}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 0.6, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.8, ease: "circOut" }}
                                className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                                <Camera size={48} className="mb-2 opacity-20" />
                                <span className="text-xs font-mono tracking-widest uppercase opacity-40">Memorial Image Missing</span>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Slideshow HUD */}
                    <div className="absolute bottom-6 left-6 z-20">
                        <div className="flex gap-2">
                            {sport.images?.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1 transition-all duration-500 rounded-full ${idx === currentThumb ? "w-8 bg-prakida-flame" : "w-2 bg-white/20"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <h4 className="text-[6rem] md:text-[10rem] font-display font-black text-white/5 whitespace-nowrap overflow-hidden select-none">
                            {sport.title}
                        </h4>
                    </div>
                </div>

                {/* Right Side: Brief & Registration */}
                <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16 flex flex-col justify-center relative bg-gradient-to-br from-black/80 to-transparent md:bg-gradient-to-br md:from-black md:to-transparent overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-full flex flex-col justify-center"
                    >
                        <div className="flex items-center gap-3 text-prakida-flame mb-2">
                            <div className="w-8 h-[1px] bg-prakida-flame" />
                            <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase">Tournament Intel</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-white mb-4 md:mb-6 uppercase italic tracking-tighter">
                            {sport.title}
                        </h2>

                        <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                            <p className="text-gray-400 text-sm md:text-lg leading-relaxed font-light">
                                {sport.detailedDesc || sport.desc}
                            </p>

                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div className="p-3 md:p-4 bg-white/5 border border-white/10 rounded-sm">
                                    <span className="block text-[8px] md:text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Combat Format</span>
                                    <span className="text-xs md:text-base text-white font-bold">{sport.players}</span>
                                </div>
                                <div className="p-3 md:p-4 bg-white/5 border border-white/10 rounded-sm">
                                    <span className="block text-[8px] md:text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Legion Category</span>
                                    <span className="text-xs md:text-base text-white font-bold">{sport.category}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-auto md:mt-0 pb-4 md:pb-0">
                            <Link
                                to="/register"
                                className="flex-1 px-6 py-4 bg-prakida-flame text-white font-black text-sm md:text-lg tracking-widest hover:bg-orange-600 transition-all duration-300 transform skew-x-[-12deg] flex items-center justify-center gap-2 group/btn"
                            >
                                <span className="block skew-x-[12deg] flex items-center gap-2">
                                    JOIN THE CORPS <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                                </span>
                            </Link>

                            <a
                                href={sport.rulebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-4 border border-white/20 text-white font-bold tracking-wider hover:bg-white/10 transition-all duration-300 skew-x-[-12deg] text-center text-sm md:text-base"
                            >
                                <span className="block skew-x-[12deg]">RULEBOOK</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default SportDetailsModal;
