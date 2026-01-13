import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Smooth settings for the follower
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        const handleMouseDown = () => setIsActive(true);
        const handleMouseUp = () => setIsActive(false);

        // Add magnetic effect listeners to clickable elements
        const handleLinkHover = () => setIsHovered(true);
        const handleLinkLeave = () => setIsHovered(false);

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        // Attach listeners to all interactables
        // Using a dynamic check interval or mutation observer would be better for SPA,
        // but for now, we'll delegate via event propagation if possible, or just attach to body
        // A cleaner way in React is usually Context, but global event delegation works well for cursors.

        const updateHoverables = () => {
            const hoverables = document.querySelectorAll('a, button, input, select, textarea, .hover-trigger');
            hoverables.forEach((el) => {
                el.addEventListener('mouseenter', handleLinkHover);
                el.addEventListener('mouseleave', handleLinkLeave);
            });
        };

        updateHoverables();

        // Re-attach listeners on route change (hacky but functional for simple implementation)
        const observer = new MutationObserver(updateHoverables);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            observer.disconnect();
        };
    }, [cursorX, cursorY]);

    return (
        <>
            {/* Main Dot */}
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 bg-prakida-flame rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '50%',
                    translateY: '50%',
                    scale: isHovered ? 0 : 1, // Hide dot when hovering to show only ring? Or scale it up? 
                    // Design Choice: Hide dot, expand ring for clear view
                }}
            />

            {/* Trailing Ring / Halo */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '25%', // Center adjust (size diff)
                    translateY: '25%',
                    scale: isHovered ? 2.5 : isActive ? 0.8 : 1,
                    backgroundColor: isHovered ? 'rgba(255,255,255,1)' : 'transparent',
                    borderColor: isHovered ? 'transparent' : 'white',
                    borderWidth: '1.5px'
                }}
                transition={{ type: "spring", ...springConfig }}
            >
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full flex items-center justify-center"
                    >
                        {/* Optional: Icon or Text inside cursor when hovering */}
                        {/* <div className="text-[4px] text-black font-black tracking-widest uppercase">OPEN</div> */}
                    </motion.div>
                )}
            </motion.div>
        </>
    );
};

export default CustomCursor;
