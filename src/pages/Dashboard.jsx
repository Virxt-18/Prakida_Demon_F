import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
// supabase import removed (refactored to service)
import { sectionSlide } from '../utils/motion';
import { User, Trophy, Calendar, Users, Shield } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegistrations = async () => {
            if (!user) return;

            try {
                console.log("Fetching dashboard data for:", user.email);

                // REFACTOR: Use Service for complex registration fetching
                const { registrationService } = await import('../services/api/registrations');
                const finalData = await registrationService.getUserRegistrations(user);

                console.log("Final Dashboard Data:", finalData);
                setRegistrations(finalData);

                // --- Fetch Tickets (via Service) ---
                const { ticketService } = await import('../services/api/tickets');
                const ticketData = await ticketService.getUserTickets(user.id);
                setTickets(ticketData);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();

        // Mock Payment Success Handler (TESTING ONLY)
        const params = new URLSearchParams(window.location.search);
        const isMockMode = import.meta.env.VITE_TIQR_MOCK_MODE !== 'false';

        if (isMockMode && params.get('mock_payment_success') === 'true' && params.get('uid')) {
            const uid = params.get('uid');
            const confirmPayment = async () => {
                const { paymentService } = await import('../services/paymentService');
                const result = await paymentService.verifyMockPayment(uid);

                if (result.success) {
                    console.log("Payment Confirmed! Refreshing...");
                    await fetchRegistrations();
                    window.history.replaceState({}, document.title, window.location.pathname);
                    alert("Payment Successful! Verification complete.");
                } else {
                    console.warn(result.message);
                    alert("Payment Verification Failed: " + result.message);
                }
            };
            confirmPayment();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-prakida-flame font-display tracking-widest">
                LOADING DATA...
            </div>
        );
    }

    // Helper to determine if we show Mock Payment Button
    const showMockPay = import.meta.env.VITE_TIQR_MOCK_MODE !== 'false';

    return (
        <section className="min-h-screen bg-black pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    variants={sectionSlide}
                    initial="hidden"
                    animate="visible"
                    className="mb-12 border-b border-white/10 pb-8"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-prakida-flame/20 p-3 rounded-full">
                            <User size={32} className="text-prakida-flame" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-white uppercase">
                                Welcome, {user.user_metadata?.full_name?.split(' ')[0] || 'Slayer'}
                            </h1>
                            <p className="text-gray-400 mt-1 font-mono text-sm tracking-wide">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* --- TICKETS SECTION --- */}
                {tickets.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                            YOUR TICKETS
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tickets.map(ticket => (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 p-6 rounded-sm relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-display font-bold text-white">STAR NIGHT</h3>
                                            <p className="text-purple-400 text-sm font-mono tracking-widest">ADMIT ONE</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-bold uppercase border ${ticket.payment_status === 'confirmed'
                                            ? 'bg-green-900/30 text-green-400 border-green-500/30'
                                            : 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
                                            }`}>
                                            {ticket.payment_status}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end border-t border-white/10 pt-4">
                                        <div className="text-sm text-gray-400">
                                            <p>Pass ID: <span className="text-white font-mono">{ticket.id.slice(0, 8)}</span></p>
                                            <p>Price: <span className="text-white">₹{ticket.price}</span></p>
                                        </div>
                                        {ticket.payment_status === 'confirmed' ? (
                                            <button className="bg-white text-black px-4 py-2 font-bold text-xs hover:bg-gray-200">
                                                VIEW QR CODE
                                            </button>
                                        ) : (
                                            showMockPay ? (
                                                <button
                                                    onClick={() => window.location.href = `/dashboard?mock_payment_success=true&uid=${ticket.tiqr_booking_uid}`}
                                                    className="bg-prakida-flame text-white px-4 py-2 font-bold text-xs hover:bg-red-600"
                                                >
                                                    PAY NOW (MOCK)
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-500 font-mono">Payment Pending via TiQR</span>
                                            )
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                    <Trophy className="text-prakida-flame" /> YOUR BATTLES
                </h2>

                {registrations.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 p-8 text-center rounded-sm">
                        <p className="text-gray-400 mb-4">You have not registered for any events yet.</p>
                        <a href="/#register" className="inline-block px-6 py-2 bg-prakida-flame text-white font-bold skew-x-[-12deg]">
                            <span className="skew-x-[12deg] block">REGISTER NOW</span>
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {registrations.map((reg) => (
                            <motion.div
                                key={reg.team_unique_id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 border border-white/10 p-6 rounded-sm relative group overflow-hidden hover:border-prakida-flame/50 transition-colors"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Trophy size={80} />
                                </div>

                                <div className="relative z-10 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-display font-bold text-white mb-1">
                                                {reg.sport?.toUpperCase()}
                                            </h3>
                                            <span className="inline-block px-2 py-0.5 bg-white/10 text-xs font-bold text-gray-300 rounded apple-system">
                                                {reg.category?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-xs text-gray-500 font-mono">TEAM ID</span>
                                            <span className="text-prakida-flame font-mono font-bold tracking-wider">
                                                {reg.team_unique_id || 'PENDING'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-4 space-y-2">
                                        <div className="flex items-center gap-3 text-sm text-gray-300">
                                            <Shield size={16} className="text-gray-500" />
                                            <span className="text-gray-500 w-24 uppercase text-xs font-bold">Team Name</span>
                                            <span className="font-bold">{reg.team_name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-300">
                                            <Users size={16} className="text-gray-500" />
                                            <span className="text-gray-500 w-24 uppercase text-xs font-bold">Your Role</span>
                                            <span>{reg.role}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-300">
                                            <Calendar size={16} className="text-gray-500" />
                                            <span className="text-gray-500 w-24 uppercase text-xs font-bold">Registered</span>
                                            <span>{new Date(reg.created_at).toLocaleDateString()}</span>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex items-center gap-3 mt-4 pt-2 border-t border-white/5">
                                            {reg.payment_status === 'confirmed' ? (
                                                <a
                                                    href={reg.ticket_pdf_url || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 bg-green-900/40 text-green-400 border border-green-500/30 py-2 text-center text-xs font-bold hover:bg-green-800/50 transition-colors"
                                                >
                                                    DOWNLOAD TICKET
                                                </a>
                                            ) : (
                                                showMockPay ? (
                                                    <button
                                                        onClick={async () => {
                                                            let uid = reg.tiqr_booking_uid;

                                                            // Self-healing: If UID is missing, generate and save one
                                                            if (!uid) {
                                                                console.log("Missing UID, generating new one...");
                                                                uid = `mock_uid_healed_${Date.now()}`;

                                                                const { error } = await supabase
                                                                    .from('registrations')
                                                                    .update({ tiqr_booking_uid: uid })
                                                                    .eq('id', reg.id || reg.registration_id); // Handle different id fields depending on query

                                                                if (error) {
                                                                    console.error("Failed to heal UID:", error);
                                                                    alert("Error initiating payment. Please contact support.");
                                                                    return;
                                                                }
                                                            }

                                                            // Proceed to mock payment success
                                                            window.location.href = `/dashboard?mock_payment_success=true&uid=${uid}`;
                                                        }}
                                                        className="flex-1 bg-prakida-flame/80 text-white border border-transparent py-2 text-center text-xs font-bold hover:bg-prakida-flame transition-colors"
                                                    >
                                                        COMPLETE PAYMENT (MOCK)
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-500 font-mono w-full text-center block pt-2">Payment Pending via TiQR</span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Dashboard;
