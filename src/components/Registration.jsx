import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { SPORTS_CONFIG } from '../lib/sportsConfig';
import { buttonHover, buttonTap, sectionSlide } from '../utils/motion';
import { Plus, Trash2, Trophy, Users, Shield, Crown } from 'lucide-react';

const Registration = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    // Selection State
    const [selectedSport, setSelectedSport] = useState(Object.keys(SPORTS_CONFIG)[0]);
    const [selectedCategory, setSelectedCategory] = useState(SPORTS_CONFIG[Object.keys(SPORTS_CONFIG)[0]].categories[0].id);

    // User Role State (Only Captain or VC allowed to register)
    const [userRole, setUserRole] = useState('Captain');

    // Team Data State
    const [teamName, setTeamName] = useState('');
    const [college, setCollege] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    // Members State (Start with empty list of ADDITIONAL members)
    // Structure: { name, role, email, contact }
    const [members, setMembers] = useState([]);

    const getCurrentConfig = () => {
        return SPORTS_CONFIG[selectedSport].categories.find(c => c.id === selectedCategory);
    };

    // Update members when configuration changes
    useEffect(() => {
        const config = getCurrentConfig();
        // The User counts as 1. So max additional members = maxPlayers - 1
        const maxAdditional = config.maxPlayers - 1;

        if (members.length > maxAdditional) {
            setMembers(members.slice(0, maxAdditional));
        }
    }, [selectedSport, selectedCategory]);

    const handleSportChange = (e) => {
        const newSport = e.target.value;
        setSelectedSport(newSport);
        // Reset category to first one of new sport
        setSelectedCategory(SPORTS_CONFIG[newSport].categories[0].id);
        setMembers([]); // Reset roster on sport change
    };

    const handleMemberChange = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const addMember = () => {
        const config = getCurrentConfig();
        const maxAdditional = config.maxPlayers - 1;

        if (members.length < maxAdditional) {
            setMembers([...members, { name: '', role: 'Player', email: '', contact: '' }]);
        }
    };

    const removeMember = (index) => {
        const newMembers = members.filter((_, i) => i !== index);
        setMembers(newMembers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        const config = getCurrentConfig();
        const totalTeamSize = 1 + members.length; // User + Roster

        // 1. Min Player Validation
        if (totalTeamSize < config.minPlayers) {
            setStatus({ type: 'error', message: `Minimum ${config.minPlayers} players required (You + ${config.minPlayers - 1} others).` });
            return;
        }

        // 2. Captain Validation (Exactly ONE Captain)
        const rosterCaptains = members.filter(m => m.role === 'Captain').length;
        const totalCaptains = (userRole === 'Captain' ? 1 : 0) + rosterCaptains;

        if (totalCaptains === 0) {
            setStatus({ type: 'error', message: "Every team must have a Captain. Please assign one." });
            return;
        }
        if (totalCaptains > 1) {
            setStatus({ type: 'error', message: "There can be only one Captain per team." });
            return;
        }

        // 3. Vice-Captain Validation (Max ONE Vice-Captain)
        const rosterVCs = members.filter(m => m.role === 'Vice-Captain').length;
        const totalVCs = (userRole === 'Vice-Captain' ? 1 : 0) + rosterVCs;

        if (totalVCs > 1) {
            setStatus({ type: 'error', message: "There can be only one Vice-Captain per team." });
            return;
        }

        // 4. Contact Validation (Phone mandatory for Captain/VC, Email mandatory for all)
        // User (Registrant) validation
        if (!contactEmail || !contactPhone) {
            setStatus({ type: 'error', message: "Your contact details are incomplete." });
            return;
        }

        // Roster validation
        for (let i = 0; i < members.length; i++) {
            const m = members[i];
            if (!m.email) {
                setStatus({ type: 'error', message: `Player #${i + 2} (${m.name || 'Unknown'}) is missing an Email.` });
                return;
            }
            if ((m.role === 'Captain' || m.role === 'Vice-Captain') && !m.contact) {
                setStatus({ type: 'error', message: `${m.role} (${m.name}) must have a phone number.` });
                return;
            }
        }

        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        // Generate Unique Team ID
        const sanitizedName = (teamName || user.user_metadata?.full_name || 'Individual').toLowerCase().replace(/[^a-z0-9]/g, '');
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        const teamUniqueId = `${sanitizedName}@${randomCode}`;

        try {
            // 1. Create Registration
            const { data: regData, error: regError } = await supabase
                .from('registrations')
                .insert({
                    user_id: user.id,
                    sport: selectedSport,
                    category: selectedCategory,
                    team_name: teamName || user.user_metadata?.full_name || 'Individual',
                    college: college,
                    contact_email: contactEmail || user.email,
                    contact_phone: contactPhone,
                    team_unique_id: teamUniqueId
                })
                .select()
                .single();

            if (regError) throw regError;

            // 2. Add Team Members
            // First, add the User (Registrant)
            const userEntry = {
                registration_id: regData.id,
                name: user.user_metadata?.full_name || 'Registrant',
                role: userRole,
                email: contactEmail || user.email,
                contact_info: contactPhone
            };

            const rosterEntries = members.map(m => ({
                registration_id: regData.id,
                name: m.name,
                role: m.role,
                email: m.email,
                contact_info: m.contact // Can be empty if role is Player
            }));

            const { error: membersError } = await supabase
                .from('team_members')
                .insert([userEntry, ...rosterEntries]);

            if (membersError) throw membersError;

            setStatus({ type: 'success', message: 'Registration Successful! The corps awaits your arrival.' });
            setMembers([]);
            setTeamName('');
            setCollege('');
            setContactPhone('');

        } catch (error) {
            console.error('Registration Error:', error);
            setStatus({ type: 'error', message: error.message || 'Failed to register. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-3xl font-display font-bold text-white mb-4">AUTHENTICATION REQUIRED</h2>
                <p className="text-gray-400 mb-8">You must be logged in to register for the Final Selection.</p>
                <div className="flex gap-4">
                    <motion.button
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                        onClick={() => navigate('/login')}
                        className="px-8 py-3 bg-prakida-flame text-white font-bold tracking-wider skew-x-[-12deg]"
                    >
                        <span className="skew-x-[12deg] block">LOGIN</span>
                    </motion.button>
                    <motion.button
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                        onClick={() => navigate('/signup')}
                        className="px-8 py-3 border border-white/20 text-white font-bold tracking-wider skew-x-[-12deg]"
                    >
                        <span className="skew-x-[12deg] block">SIGN UP</span>
                    </motion.button>
                </div>
            </div>
        );
    }

    const config = getCurrentConfig();
    const totalTeamSize = 1 + members.length;

    return (
        <section id="register" className="py-12 bg-black relative border-t border-white/5">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header */}
                <motion.div variants={sectionSlide} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center lg:text-left">
                    <h2 className="text-prakida-flame font-bold tracking-[0.2em] mb-2">JOIN THE CORPS</h2>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-white">TEAM REGISTRATION</h3>
                </motion.div>

                {status.message && (
                    <div className={`mb-8 p-4 rounded border text-center font-bold ${status.type === 'success' ? 'bg-green-900/20 border-green-500/50 text-green-400' : 'bg-red-900/20 border-red-500/50 text-red-400'}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                    {/* Left Column: Team Details */}
                    <div className="lg:w-1/3 space-y-6">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Trophy size={64} className="text-prakida-flame" />
                            </div>

                            <h4 className="text-xl font-display font-bold text-white mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
                                <Shield className="text-prakida-flame" size={20} /> MISSION DETAILS
                            </h4>

                            {/* Sport Selection */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">SELECT SPORT</label>
                                    <select
                                        value={selectedSport}
                                        onChange={handleSportChange}
                                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame transition-colors"
                                    >
                                        {Object.keys(SPORTS_CONFIG).map(sport => (
                                            <option key={sport} value={sport} className="bg-gray-900">{sport}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">CATEGORY</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame transition-colors"
                                    >
                                        {SPORTS_CONFIG[selectedSport].categories.map(cat => (
                                            <option key={cat.id} value={cat.id} className="bg-gray-900">{cat.label}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-prakida-water mt-1">
                                        Members Required: {config.minPlayers} - {config.maxPlayers}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">YOUR ROLE (LEADERSHIP ONLY)</label>
                                    <select
                                        value={userRole}
                                        onChange={(e) => setUserRole(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 p-3 text-prakida-flame font-bold focus:outline-none focus:border-prakida-flame transition-colors"
                                    >
                                        <option value="Captain" className="bg-gray-900">Captain</option>
                                        <option value="Vice-Captain" className="bg-gray-900">Vice-Captain</option>
                                    </select>
                                </div>

                                {config.maxPlayers > 1 && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">TEAM NAME</label>
                                        <input
                                            type="text"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame"
                                            placeholder="ENTER TEAM NAME"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">COLLEGE / INSTITUTE</label>
                                    <input
                                        type="text"
                                        value={college}
                                        onChange={(e) => setCollege(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame"
                                        placeholder="ENTER COLLEGE NAME"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">YOUR EMAIL (REQUIRED)</label>
                                        <input
                                            type="email"
                                            value={contactEmail}
                                            onChange={(e) => setContactEmail(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame"
                                            placeholder={user?.email || "EMAIL"}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">YOUR PHONE (REQUIRED)</label>
                                        <input
                                            type="tel"
                                            value={contactPhone}
                                            onChange={(e) => setContactPhone(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 p-3 text-white focus:outline-none focus:border-prakida-flame"
                                            placeholder="+91..."
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Player Roster */}
                    <div className="lg:w-2/3">
                        <div className="mb-6 flex justify-between items-end border-b border-white/10 pb-4">
                            <div>
                                <h4 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                    <Users className="text-prakida-flame" size={20} /> SQUAD ROSTER
                                </h4>
                                <p className="text-gray-400 text-sm mt-1">
                                    {totalTeamSize} / {config.maxPlayers} SLOTS FILLED
                                </p>
                            </div>

                            {totalTeamSize < config.maxPlayers && (
                                <motion.button
                                    type="button"
                                    onClick={addMember}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-sm font-bold border border-white/10 transition-colors"
                                >
                                    <Plus size={16} /> ADD MEMBER
                                </motion.button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {/* Static User Entry (Captain/VC) */}
                            <div className="bg-prakida-flame/10 border border-prakida-flame/30 p-4 flex flex-col md:flex-row gap-4 items-center relative">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-prakida-flame"></div>
                                <span className="text-prakida-flame font-mono text-sm w-8">01</span>
                                <div className="flex-1 w-full md:w-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-black/30 border border-white/10 p-2 text-gray-400 text-sm flex items-center gap-2">
                                        <Crown size={14} className="text-yellow-500" /> {user.user_metadata?.full_name || 'You'}
                                    </div>
                                    <div className="bg-black/30 border border-white/10 p-2 text-prakida-flame font-bold text-sm">
                                        {userRole.toUpperCase()}
                                    </div>
                                    <div className="bg-black/30 border border-white/10 p-2 text-gray-400 text-sm overflow-hidden text-ellipsis">
                                        {contactEmail || 'No Email'}
                                    </div>
                                    <div className="bg-black/30 border border-white/10 p-2 text-gray-400 text-sm">
                                        {contactPhone || 'No Phone'}
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {members.map((member, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-white/5 border border-white/10 p-4 flex flex-col md:flex-row gap-4 items-start md:items-center relative group"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-prakida-flame/50 group-hover:bg-prakida-flame transition-colors"></div>

                                        <span className="text-gray-500 font-mono text-sm w-8">{(index + 2).toString().padStart(2, '0')}</span>

                                        <div className="flex-1 w-full md:w-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                                placeholder="PLAYER NAME"
                                                className="bg-black/30 border border-white/10 p-2 text-white text-sm focus:border-prakida-flame focus:outline-none w-full"
                                                required
                                            />
                                            <select
                                                value={member.role}
                                                onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                                                className="bg-black/30 border border-white/10 p-2 text-white text-sm focus:border-prakida-flame focus:outline-none w-full"
                                            >
                                                <option className="bg-gray-900" value="Player">Player</option>
                                                <option className="bg-gray-900" value="Captain">Captain</option>
                                                <option className="bg-gray-900" value="Vice-Captain">Vice-Captain</option>
                                            </select>
                                            <input
                                                type="email"
                                                value={member.email}
                                                onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                                placeholder="PLAYER EMAIL (REQ)"
                                                className="bg-black/30 border border-white/10 p-2 text-white text-sm focus:border-prakida-flame focus:outline-none w-full"
                                                required
                                            />
                                            <input
                                                type="text"
                                                value={member.contact}
                                                onChange={(e) => handleMemberChange(index, 'contact', e.target.value)}
                                                placeholder={member.role === 'Player' ? "PHONE (OPTIONAL)" : "PHONE (REQUIRED)"}
                                                className={`bg-black/30 border border-white/10 p-2 text-white text-sm focus:border-prakida-flame focus:outline-none w-full ${((member.role === 'Captain' || member.role === 'Vice-Captain') && !member.contact) ? 'border-red-500/50' : ''}`}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeMember(index)}
                                            className="text-gray-600 hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="mt-8">
                            <motion.button
                                whileHover={buttonHover}
                                whileTap={buttonTap}
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-prakida-flame hover:bg-prakida-flameDark text-white font-bold py-4 tracking-[0.25em] disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? 'TRANSMITTING DATA...' : 'CONFIRM REGISTRATION'}
                            </motion.button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Registration;
