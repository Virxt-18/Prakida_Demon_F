import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ParallaxElement from './ui/ParallaxElement';

import gallery1 from '../assets/gallery-1.jpg';
import gallery2 from '../assets/gallery-2.jpg';
import gallery3 from '../assets/gallery-3.jpg';
import gallery4 from '../assets/gallery-4.jpg';
import gallery5 from '../assets/gallery-5.jpg';
import gallery6 from '../assets/gallery-6.jpg';
import gallery7 from '../assets/gallery-7.jpg';
import gallery8 from '../assets/gallery-8.jpg';
import gallery9 from '../assets/gallery-9.jpg';
import gallery10 from '../assets/gallery-10.jpg';

const images = [
    { src: gallery1, alt: "DJ Night", span: "md:col-span-2 md:row-span-2", speed: 0.1 }, // 1. DJ (Anchor, slow)
    { src: gallery3, alt: "Board Games", span: "md:col-span-1 md:row-span-2", speed: 0.3 }, // 2. Board (Faster)
    { src: gallery6, alt: "Badminton Smash", span: "md:col-span-1 md:row-span-2", speed: -0.5 }, // 3. Smash (Reverse depth)
    { src: gallery4, alt: "Football Kick", span: "md:col-span-2 md:row-span-2", speed: 0.2 }, // 5. Football
    { src: gallery10, alt: "Speech & Crowd", span: "md:col-span-2 md:row-span-2", speed: -0.6 }, // 7. Speech (Anchor)
    { src: gallery7, alt: "Chess Focus", span: "md:col-span-2 md:row-span-2", speed: 0.3 }, // 8. Chess
    { src: gallery8, alt: "Table Tennis", span: "md:col-span-2 md:row-span-2", speed: -0.6 }, // 9. TT
    { src: gallery9, alt: "Basketball Dribble", span: "md:col-span-2 md:row-span-2", speed: 0.2 }, // 10. Basketball
    { src: gallery5, alt: "Badminton", span: "md:col-span-1 md:row-span-2", speed: -0.4 }, // 6. Badminton
    { src: gallery2, alt: "Carrom Match", span: "md:col-span-1 md:row-span-2", speed: 0.1 },// 4. Carrom
];

const Gallery = () => {
    const scrollContainerRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const scrollWidth = scrollContainer.scrollWidth;
        const clientWidth = scrollContainer.clientWidth;

        // Only auto-scroll if content is scrollable
        if (scrollWidth <= clientWidth) return;

        const interval = setInterval(() => {
            if (isPaused) return;

            // Calculate exact width of one card + gap (85vw + 1rem/16px gap)
            // 85vw is roughly window.innerWidth * 0.85
            // But checking actual element width is safer
            const firstCard = scrollContainer.firstElementChild;
            const cardWidth = firstCard ? firstCard.clientWidth + 16 : 0; // 16px for gap-4

            if (cardWidth > 0) {
                const maxScrollLeft = scrollWidth - clientWidth;

                // If we are close to the end, reset to start
                if (scrollContainer.scrollLeft >= maxScrollLeft - 10) {
                    scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollContainer.scrollBy({ left: cardWidth, behavior: 'smooth' });
                }
            }
        }, 3000); // Scroll every 3 seconds

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <section id="gallery" className="py-24 bg-prakida-bg relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-prakida-mist/10 via-transparent to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-prakida-flame font-bold tracking-[0.2em] mb-4 text-sm md:text-base">ARCHIVES</h2>
                    <h3 className="text-4xl md:text-5xl font-display font-bold text-white">HEROIC MOMENTS</h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto mt-6"></div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex md:grid md:grid-cols-4 gap-4 md:auto-rows-[200px] overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-8 md:pb-0 scrollbar-hide touch-pan-x"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                >
                    {images.map((img, idx) => (
                        <ParallaxElement
                            key={idx}
                            speed={img.speed}
                            className={`relative group overflow-hidden rounded-sm border border-white/10 bg-white/5 ${img.span} min-w-[85vw] md:min-w-0 h-[300px] md:h-auto flex-shrink-0 snap-center`}
                            enableMobile={false}
                        >
                            <motion.div
                                className="h-full w-full"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <div className="h-full w-full overflow-hidden">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <p className="text-white font-display uppercase tracking-wider text-lg font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {img.alt}
                                    </p>
                                </div>
                            </motion.div>
                        </ParallaxElement>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
