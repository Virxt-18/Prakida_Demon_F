import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// supabase import removed (refactored to service)
// tiqrClient import removed (refactored to service)
import { sectionSlide, buttonHover, buttonTap } from '../utils/motion';
import { Ticket, Music, Calendar, MapPin, Zap, Star } from 'lucide-react';

// Client already initialized in lib

const Tickets = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const EVENT_DETAILS = {
        title: "STAR NIGHT 2026",
        artist: "THE MYSTERY HEADLINER",
        date: "Feb 14, 2026",
        time: "19:00 Onwards",
        venue: "Main Arena, BIT Mesra",
        price: 499.00
    };

    const handlePurchase = async () => {
        if (!user) {
            navigate('/login?redirect=/tickets');
            return;
        }

        setLoading(true);
        try {
            const { ticketService } = await import('../services/api/tickets');
            const { paymentService } = await import('../services/paymentService');

            // 1. Create Pending Ticket in DB (via Service)
            const ticket = await ticketService.createTicket({
                user_id: user.id,
                user_email: user.email,
                ticket_type: 'star_night_pass',
                price: EVENT_DETAILS.price,
                payment_status: 'pending'
            });

            // 2. Initiate TiQR Booking (via Service)
            const bookingResponse = await paymentService.initiatePayment({
                amount: EVENT_DETAILS.price,
                currency: 'INR',
                description: `Star Night Pass - ${user.email}`,
                meta_data: {
                    ticket_id: ticket.id,
                    type: 'star_night_pass'
                }
            });

            // 3. Update Ticket with TiQR UID (via Service)
            await ticketService.updateBookingUid(ticket.id, bookingResponse.booking_uid);

            // 4. Redirect to Payment
            window.location.href = bookingResponse.payment_url;

        } catch (error) {
            console.error("Purchase Error:", error);
            alert("Failed to initiate purchase: " + error.message);
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[128px] animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-prakida-flame rounded-full filter blur-[128px] animate-pulse-slow animation-delay-2000"></div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <motion.div
                    variants={sectionSlide}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                >
                    {/* Visual Side */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-prakida-flame rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-black border border-white/10 rounded-lg p-8 aspect-[4/5] flex flex-col justify-between overflow-hidden">

                            <img
                                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop"
                                alt="Concert Crowd"
                                className="absolute inset-0 w-full h-full object-cover opacity-50 contrast-125 saturate-0 group-hover:saturate-100 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur border border-white/20 text-xs font-mono tracking-widest text-white rounded mb-4">
                                    OFFICIAL EVENT
                                </span>
                                <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-none">
                                    STAR<br />NIGHT
                                </h2>
                            </div>

                            <div className="relative z-10 flex justify-between items-end">
                                <div>
                                    <p className="text-gray-300 font-mono text-sm">{EVENT_DETAILS.date}</p>
                                    <p className="text-prakida-flame font-bold">{EVENT_DETAILS.venue}</p>
                                </div>
                                <Zap className="text-yellow-400 fill-yellow-400 animate-pulse" size={32} />
                            </div>
                        </div>
                    </div>

                    {/* Details Side */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-display text-white mb-2 flex items-center gap-3">
                                <Music className="text-purple-500" /> THE MAIN EVENT
                            </h1>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Experience the climax of Prakida '26. A night of electrifying performances,
                                thumping bass, and the unity of thousands. Don't miss the biggest
                                cultural extravaganza of the year.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 p-4 rounded text-center">
                                <Calendar className="mx-auto text-gray-500 mb-2" size={20} />
                                <div className="text-xl font-bold text-white">{EVENT_DETAILS.date}</div>
                                <div className="text-xs text-gray-400">Mark the date</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded text-center">
                                <MapPin className="mx-auto text-gray-500 mb-2" size={20} />
                                <div className="text-xl font-bold text-white">BIT Arena</div>
                                <div className="text-xs text-gray-400">Open Ground</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-900/20 to-prakida-flame/20 border border-white/10 p-6 rounded-lg flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Entry Pass</div>
                                <div className="text-4xl font-display text-white">₹{EVENT_DETAILS.price}</div>
                                <div className="text-xs text-green-400 flex items-center gap-1 mt-1">
                                    <Star size={10} className="fill-current" /> Limited Availability
                                </div>
                            </div>

                            <motion.button
                                whileHover={buttonHover}
                                whileTap={buttonTap}
                                onClick={handlePurchase}
                                disabled={loading}
                                className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold font-display tracking-wider text-xl hover:bg-gray-200 transition-colors rounded skew-x-[-12deg]"
                            >
                                <span className="block skew-x-[12deg]">
                                    {loading ? 'PROCESSING...' : user ? 'BUY TICKET' : 'LOGIN TO BUY'}
                                </span>
                            </motion.button>
                        </div>

                        <div className="text-xs text-gray-500 text-center font-mono">
                            * Includes access to concert area only. Standard club rules apply.
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Tickets;
