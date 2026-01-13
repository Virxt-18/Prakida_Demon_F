import { motion } from 'framer-motion';
import { useState } from 'react';
import { Trophy, Send, User, Briefcase, Mail, Linkedin } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';

const Alumni = () => {
    // Placeholder data for featured sponsors
    const sponsors = [
        {
            id: 1,
            name: "Aditya Sharma",
            batch: "2018",
            role: "Senior SDE @ Google",
            message: "Proud to support Prakida '25!",
            image: "https://ui-avatars.com/api/?name=Aditya+Sharma&background=F48C06&color=fff"
        },
        {
            id: 2,
            name: "Priya Patel",
            batch: "2019",
            role: "Founder @ TechNova",
            message: "Giving back to where it all started.",
            image: "https://ui-avatars.com/api/?name=Priya+Patel&background=F48C06&color=fff"
        },
        {
            id: 3,
            name: "Rahul Verma",
            batch: "2015",
            role: "Product Manager @ Microsoft",
            message: "Best wishes for the event.",
            image: "https://ui-avatars.com/api/?name=Rahul+Verma&background=F48C06&color=fff"
        }
    ];

    const [formData, setFormData] = useState({
        name: '',
        batch: '',
        role: '',
        email: '',
        linkedin: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Alumni Registration Data:', formData);
        alert('Thank you for registering! We will get back to you soon.');
        setFormData({
            name: '',
            batch: '',
            role: '',
            email: '',
            linkedin: '',
            message: ''
        });
    };

    return (
        <div className="pt-24 min-h-screen container mx-auto px-4 pb-20">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-20"
            >
                <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-prakida-flame to-orange-500 mb-6 tracking-wider">
                    ALUMNI
                </h1>
                <p className="text-xl text-gray-400 font-sans max-w-2xl mx-auto">
                    Honoring our past, building our future. Connect with the legacy of Prakida and support the next generation.
                </p>
            </motion.div>

            {/* Featured Sponsors Section */}
            <div className="mb-24">
                <SectionTitle title="FEATURED SPONSORS" kanji="スポンサー" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {sponsors.map((sponsor, index) => (
                        <motion.div
                            key={sponsor.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:border-prakida-flame/50 transition-colors group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={sponsor.image}
                                    alt={sponsor.name}
                                    className="w-16 h-16 rounded-full border-2 border-prakida-flame"
                                />
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-prakida-flame transition-colors">{sponsor.name}</h3>
                                    <p className="text-sm text-gray-400">Class of {sponsor.batch}</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="flex items-center gap-2 text-gray-300 mb-1">
                                    <Briefcase size={16} className="text-prakida-flame" />
                                    <span className="text-sm">{sponsor.role}</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <p className="italic text-gray-400 text-sm">"{sponsor.message}"</p>
                            </div>
                            <div className="absolute top-4 right-4 text-prakida-flame/20 group-hover:text-prakida-flame/40 transition-colors">
                                <Trophy size={48} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Registration Section */}
            <div>
                <SectionTitle title="ALUMNI REGISTRATION" kanji="登録" />

                <div className="mt-12 max-w-2xl mx-auto bg-black/40 backdrop-blur-md p-8 md:p-12 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-prakida-flame/10 blur-[100px] pointer-events-none rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-display tracking-wider ml-1">NAME</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 py-3 pl-12 pr-4 text-white focus:outline-none focus:border-prakida-flame focus:bg-white/10 transition-all font-sans placeholder-gray-600"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-display tracking-wider ml-1">BATCH (YEAR)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="batch"
                                        value={formData.batch}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 py-3 pl-4 pr-4 text-white focus:outline-none focus:border-prakida-flame focus:bg-white/10 transition-all font-sans placeholder-gray-600"
                                        placeholder="2020"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-display tracking-wider ml-1">CURRENT ROLE / COMPANY</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 py-3 pl-12 pr-4 text-white focus:outline-none focus:border-prakida-flame focus:bg-white/10 transition-all font-sans placeholder-gray-600"
                                    placeholder="Software Engineer @ Tech Corp"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-display tracking-wider ml-1">EMAIL</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 py-3 pl-12 pr-4 text-white focus:outline-none focus:border-prakida-flame focus:bg-white/10 transition-all font-sans placeholder-gray-600"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-display tracking-wider ml-1">LINKEDIN</label>
                                <div className="relative">
                                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 py-3 pl-12 pr-4 text-white focus:outline-none focus:border-prakida-flame focus:bg-white/10 transition-all font-sans placeholder-gray-600"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 font-display tracking-wider ml-1">MESSAGE</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                className="w-full bg-white/5 border border-white/10 py-3 px-4 text-white focus:outline-none focus:border-prakida-flame focus:bg-white/10 transition-all font-sans placeholder-gray-600 resize-none"
                                placeholder="Any message for the juniors or organizers?"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-prakida-flame text-white font-bold py-4 hover:bg-orange-600 transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>REGISTER AS ALUMNI</span>
                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Alumni;
