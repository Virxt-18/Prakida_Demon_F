import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { sectionSlide } from '../utils/motion';
import { User, Trophy, Calendar, Users, Shield } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegistrations = async () => {
            if (!user) return;

            try {
                console.log("Fetching dashboard data for:", user.email);

                // 1. Fetch teams where user is a MEMBER (matching by email, case-insensitive)
                const { data: memberData, error: memberError } = await supabase
                    .from('team_members')
                    .select(`
                        id,
                        role,
                        registrations (
                            id,
                            team_name,
                            sport,
                            category,
                            team_unique_id,
                            created_at
                        )
                    `)
                    .ilike('email', user.email); // Case-insensitive match

                if (memberError) {
                    console.error("Member fetch error:", memberError);
                }

                // 2. Fetch teams CREATED by the user (as Captain)
                // This acts as a fallback if the team_members entry has a typo or is missing
                const { data: creatorData, error: creatorError } = await supabase
                    .from('registrations')
                    .select(`
                        id,
                        team_name,
                        sport,
                        category,
                        team_unique_id,
                        created_at
                    `)
                    .eq('user_id', user.id);

                if (creatorError) {
                    console.error("Creator fetch error:", creatorError);
                }

                // 3. Merge and Deduplicate
                const formattedMemberData = (memberData || []).map(m => ({
                    id: m.id, // member id
                    role: m.role,
                    ...m.registrations
                })).filter(item => item.id); // filter out null registrations

                const formattedCreatorData = (creatorData || []).map(r => ({
                    id: r.id, // registration id (using as unique key proxy)
                    role: 'Captain', // Creator is always Captain (or at least admin)
                    ...r
                }));

                // Combine: Use a Map to deduplicate based on Registration ID (team_unique_id)
                const combined = new Map();

                formattedMemberData.forEach(item => {
                    if (item.team_unique_id) combined.set(item.team_unique_id, item);
                });

                formattedCreatorData.forEach(item => {
                    if (item.team_unique_id && !combined.has(item.team_unique_id)) {
                        combined.set(item.team_unique_id, item);
                    }
                });

                const finalData = Array.from(combined.values());
                console.log("Final Dashboard Data:", finalData);
                setRegistrations(finalData);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-prakida-flame font-display tracking-widest">
                LOADING DATA...
            </div>
        );
    }

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
