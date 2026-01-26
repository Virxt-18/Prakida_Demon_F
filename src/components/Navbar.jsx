import { useState, useEffect } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import GlitchLink from './ui/GlitchLink';
import logo from '../assets/prakida-logo.png';
import { buttonHover, buttonTap } from '../utils/motion';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../hooks/useAdmin';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const { isAdmin } = useAdmin();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', kanji: 'ホーム', path: '/' },
        { name: 'Pro Night', kanji: 'プロナイト', path: '/tickets' },
        { name: 'Dashboard', kanji: 'ダッシュボード', path: '/dashboard' },
        { name: 'Events', kanji: 'イベント', path: '/events' },
        { name: 'Merchandise', kanji: 'グッズ', path: '/merchandise' },
        { name: 'Sports', kanji: '競技', path: '/sports' },
        { name: 'Alumni', kanji: '卒業生', path: '/alumni' },
        { name: 'Contact', kanji: '連絡', path: '/contact' },
    ];

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src={logo}
                            alt="PRAKIDA Logo"
                            className="h-10 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    { }
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <GlitchLink
                                key={link.name}
                                to={link.path}
                                text={link.name}
                                kanji={link.kanji}
                            />
                        ))}

                        {isAdmin && (
                            <GlitchLink
                                to="/admin"
                                text="ADMIN"
                                kanji="管理"
                                className="text-red-500"
                            />
                        )}

                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-400 font-mono tracking-widest uppercase border-r border-gray-700 pr-4">
                                    <User size={14} className="text-prakida-flame" />
                                    <span className="hidden xl:block">{user.user_metadata?.full_name?.split(' ')[0] || 'SLAYER'}</span>
                                </div>
                                <motion.button
                                    whileHover={buttonHover}
                                    whileTap={buttonTap}
                                    onClick={signOut}
                                    className="flex items-center gap-2 px-6 py-2 bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white font-bold transition-all duration-300 rounded-sm skew-x-[-12deg] hover:skew-x-0 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                >
                                    <span className="block skew-x-[12deg] hover:skew-x-0 flex items-center gap-2 text-sm"><LogOut size={16} /> LOGOUT</span>
                                </motion.button>
                            </div>
                        ) : (
                            <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                                <Link
                                    to="/login"
                                    className="block px-6 py-2 bg-transparent border border-prakida-flame text-prakida-flame hover:bg-prakida-flame hover:text-white font-bold transition-all duration-300 rounded-sm skew-x-[-12deg] hover:skew-x-0 hover:shadow-[0_0_15px_rgba(244,140,6,0.5)]"
                                >
                                    <span className="block skew-x-[12deg] hover:skew-x-0">LOGIN</span>
                                </Link>
                            </motion.div>
                        )}
                    </div>

                    { }
                    <button
                        className="md:hidden text-white sm:z-50 relative"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={32} className="relative z-[70]" /> : <Menu size={32} />}
                    </button>
                </div>
            </nav>

            { }
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ clipPath: "circle(0% at 100% 0)" }}
                        animate={{ clipPath: "circle(150% at 100% 0)" }}
                        exit={{ clipPath: "circle(0% at 100% 0)" }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[60] bg-prakida-bg flex flex-col justify-between p-8 md:hidden overflow-y-auto max-h-screen"
                    >
                        { }
                        <div className="absolute top-0 right-0 w-64 h-64 bg-prakida-flame/10 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-prakida-water/10 rounded-full blur-[100px] pointer-events-none" />

                        { }
                        <div className="flex justify-between items-center mb-8 relative z-10 w-full">
                            <span className="text-sm font-mono text-gray-500 tracking-widest">MENU</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-white hover:text-prakida-flame transition-colors"
                            >
                                <X size={40} />
                            </button>
                        </div>

                        { }
                        <div className="flex flex-col gap-0 relative z-10 h-full justify-center">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                                    className="group"
                                >
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`block text-[3.5rem] leading-[1.1] font-display font-black uppercase tracking-tighter border-b border-white/10 py-2 transition-all duration-300 ${location.pathname === link.path ? 'text-prakida-flame pl-4 border-prakida-flame' : 'text-gray-400 hover:text-white hover:pl-4 hover:border-white'}`}
                                    >
                                        <span className="flex items-end justify-between w-full">
                                            {link.name}
                                            <span className="text-lg text-gray-600 font-sans font-normal tracking-normal mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {link.kanji}
                                            </span>
                                        </span>
                                    </Link>
                                </motion.div>
                            ))}

                            { }
                            {isAdmin && (
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                >
                                    <Link
                                        to="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="block text-[3.5rem] leading-[1.1] font-display font-black uppercase tracking-tighter border-b border-red-900/30 py-2 text-red-500 hover:pl-4 transition-all"
                                    >
                                        ADMIN PANEL
                                    </Link>
                                </motion.div>
                            )}
                        </div>

                        { }
                        <div className="relative z-10 mt-8 space-y-4">
                            {user ? (
                                <button
                                    onClick={() => { signOut(); setIsOpen(false); }}
                                    className="w-full py-4 border border-red-500/50 text-red-400 font-bold tracking-widest text-xl uppercase hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    LOGOUT
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center py-4 bg-prakida-flame text-white font-bold tracking-widest text-xl uppercase skew-x-[-6deg]"
                                >
                                    <span className="block skew-x-[6deg]">LOGIN / JOIN</span>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
