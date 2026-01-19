import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { sectionSlide } from '../utils/motion';
import { Shield, DollarSign, Users, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [view, setView] = useState('teams'); // 'teams' or 'tickets'
    const [registrations, setRegistrations] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        teamRevenue: 0,
        ticketRevenue: 0,
        totalTeams: 0,
        totalTickets: 0,
        pending: 0,
        confirmed: 0
    });
    const [loading, setLoading] = useState(true);

    const { isAdmin, loading: authLoading } = useAdmin();

    useEffect(() => {
        if (authLoading) return; // Wait for auth check

        if (isAdmin) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [isAdmin, authLoading]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // REFACTOR: Use Services
            const { registrationService } = await import('../services/api/registrations');
            const { ticketService } = await import('../services/api/tickets');

            // 1. Fetch Registrations
            const regData = await registrationService.getAllRegistrations();

            // 2. Fetch Tickets
            const ticketData = await ticketService.getAllTickets();

            setRegistrations(regData || []);
            setTickets(ticketData || []);
            calculateStats(regData || [], ticketData || []);

        } catch (error) {
            console.error("Admin Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (regs, tix) => {
        const confirmedRegs = regs.filter(r => r.payment_status === 'confirmed');
        const confirmedTix = tix.filter(t => t.payment_status === 'confirmed');

        const regRevenue = confirmedRegs.reduce((acc, curr) => acc + (Number(curr.payment_amount) || 0), 0);
        const ticketRevenue = confirmedTix.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

        const pendingCount = regs.filter(r => r.payment_status === 'pending').length + tix.filter(t => t.payment_status === 'pending').length;
        const confirmedCount = confirmedRegs.length + confirmedTix.length;

        setStats({
            totalRevenue: regRevenue + ticketRevenue,
            teamRevenue: regRevenue,
            ticketRevenue: ticketRevenue,
            totalTeams: regs.length,
            totalTickets: tix.length,
            pending: pendingCount,
            confirmed: confirmedCount
        });
    };

    const handleMarkPaid = async (id, currentStatus, type = 'registration') => {
        const table = type === 'registration' ? 'registrations' : 'tickets';
        const action = currentStatus === 'confirmed' ? 'REVOKE' : 'MARK PAID';

        if (!confirm(`Are you sure you want to ${action} this ${type}?`)) return;

        const newStatus = currentStatus === 'confirmed' ? 'pending' : 'confirmed';
        const updatePayload = { payment_status: newStatus };

        // For registrations, set default amount if confirming
        if (type === 'registration') {
            updatePayload.payment_amount = newStatus === 'confirmed' ? 100 : 0;
        }

        try {
            const { error } = await supabase
                .from(table)
                .update(updatePayload)
                .eq('id', id);

            if (error) throw error;
            fetchData(); // Refresh
        } catch (err) {
            alert("Update failed: " + err.message);
        }
    };

    if (!user) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Access Denied</div>;
    }

    if (!isAdmin && !loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-8">
                <Shield size={64} className="text-red-500 mb-4" />
                <h1 className="text-3xl font-display text-white mb-2">RESTRICTED ACCESS</h1>
                <p className="text-gray-400">You are not authorized to view the Captain's Log.</p>
                <p className="text-xs text-gray-600 mt-4">Logged in as: {user.email}</p>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-black pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    variants={sectionSlide}
                    initial="hidden"
                    animate="visible"
                    className="mb-8 flex justify-between items-end"
                >
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                            <Shield className="text-prakida-flame" /> COMMAND CENTER
                        </h1>
                        <p className="text-gray-400 font-mono text-sm mt-1">
                            ADMINISTRATOR: {user.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded">
                        <button
                            onClick={() => setView('teams')}
                            className={`px-4 py-2 text-sm font-bold rounded transition-colors ${view === 'teams' ? 'bg-prakida-flame text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            TEAMS
                        </button>
                        <button
                            onClick={() => setView('tickets')}
                            className={`px-4 py-2 text-sm font-bold rounded transition-colors ${view === 'tickets' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            TICKETS
                        </button>
                        <button
                            onClick={fetchData}
                            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded transition-colors ml-2"
                            title="Refresh Data"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                        <div className="text-gray-400 text-xs font-bold uppercase mb-1">Total Sales</div>
                        <div className="text-3xl font-display text-white flex items-center gap-2">
                            <Users size={24} className="text-prakida-water" /> {stats.confirmed}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Teams: {stats.totalTeams} | Tickets: {stats.totalTickets}
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                        <div className="text-gray-400 text-xs font-bold uppercase mb-1">Total Revenue</div>
                        <div className="text-3xl font-display text-emerald-400 flex items-center gap-2">
                            <DollarSign size={24} /> ₹{stats.totalRevenue}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Teams: ₹{stats.teamRevenue} | Tickets: ₹{stats.ticketRevenue}
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                        <div className="text-gray-400 text-xs font-bold uppercase mb-1">Confirmed</div>
                        <div className="text-3xl font-display text-green-500 flex items-center gap-2">
                            <CheckCircle size={24} /> {stats.confirmed}
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                        <div className="text-gray-400 text-xs font-bold uppercase mb-1">Pending</div>
                        <div className="text-3xl font-display text-yellow-500 flex items-center gap-2">
                            <XCircle size={24} /> {stats.pending}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/5 border border-white/10 rounded-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/50 text-gray-500 text-xs uppercase border-b border-white/10">
                                {view === 'teams' ? (
                                    <>
                                        <th className="p-4">Team Details</th>
                                        <th className="p-4">Sport / Category</th>
                                        <th className="p-4">Contact</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="p-4">Ticket ID</th>
                                        <th className="p-4">User / Email</th>
                                        <th className="p-4">Type / Price</th>
                                    </>
                                )}
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {view === 'teams' ? (
                                registrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{reg.team_name}</div>
                                            <div className="text-xs text-gray-500 font-mono">{reg.team_unique_id}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white">{reg.sport}</div>
                                            <div className="text-xs text-gray-400 bg-white/10 inline-block px-1 rounded mt-1">{reg.category}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-gray-300">{reg.contact_email}</div>
                                            <div className="text-xs text-gray-500">{reg.contact_phone}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold uppercase ${reg.payment_status === 'confirmed'
                                                ? 'bg-green-900/30 text-green-400 border border-green-500/20'
                                                : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/20'
                                                }`}>
                                                {reg.payment_status === 'confirmed' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                {reg.payment_status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleMarkPaid(reg.id, reg.payment_status, 'registration')}
                                                className="text-white/50 hover:text-white hover:bg-white/10 p-2 rounded transition-colors text-xs font-bold"
                                            >
                                                {reg.payment_status === 'confirmed' ? 'REVOKE' : 'MARK PAID'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                tickets.map((tix) => (
                                    <tr key={tix.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-sm text-gray-300">
                                            {tix.id.slice(0, 8)}...
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white font-bold">{tix.user_email || 'Unknown User'}</div>
                                            <div className="text-xs text-gray-500 font-mono">UID: {tix.user_id?.slice(0, 8)}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-purple-400 font-bold uppercase text-xs">{tix.ticket_type}</div>
                                            <div className="text-white">₹{tix.price}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold uppercase ${tix.payment_status === 'confirmed'
                                                ? 'bg-green-900/30 text-green-400 border border-green-500/20'
                                                : 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/20'
                                                }`}>
                                                {tix.payment_status === 'confirmed' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                {tix.payment_status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleMarkPaid(tix.id, tix.payment_status, 'ticket')}
                                                className="text-white/50 hover:text-white hover:bg-white/10 p-2 rounded transition-colors text-xs font-bold"
                                            >
                                                {tix.payment_status === 'confirmed' ? 'REVOKE' : 'MARK PAID'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            {/* Empty States */}
                            {view === 'teams' && registrations.length === 0 && !loading && (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No team registrations found.</td></tr>
                            )}
                            {view === 'tickets' && tickets.length === 0 && !loading && (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No tickets sold yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;
