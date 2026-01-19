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

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', kanji: 'ホーム', path: '/' },
        { name: 'Star Night', kanji: 'スターナイト', path: '/tickets' },
        { name: 'Dashboard', kanji: 'ダッシュボード', path: '/dashboard' },
        { name: 'Events', kanji: 'イベント', path: '/events' },
        { name: 'Merchandise', kanji: 'グッズ', path: '/merchandise' },
        { name: 'Sports', kanji: '競技', path: '/sports' },
        { name: 'Alumni', kanji: '卒業生', path: '/alumni' },
        { name: 'Contact', kanji: '連絡', path: '/contact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <img
                        src={logo}
                        alt="PRAKIDA Logo"
                        className="h-10 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                {/* Desktop Menu */}
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

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-black/95 border-b border-gray-800 md:hidden"
                    >
                        <div className="flex flex-col items-center py-8 gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-xl font-display tracking-widest ${location.pathname === link.path ? 'text-prakida-flame' : 'text-gray-300 hover:text-white'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user ? (
                                <button
                                    onClick={() => { signOut(); setIsOpen(false); }}
                                    className="mt-4 px-6 py-2 md:px-8 md:py-3 bg-red-900/50 border border-red-500 text-red-400 font-bold tracking-wider w-full text-center"
                                >
                                    LOGOUT
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="mt-4 px-6 py-2 md:px-8 md:py-3 bg-prakida-flame text-white font-bold tracking-wider"
                                >
                                    LOGIN
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
