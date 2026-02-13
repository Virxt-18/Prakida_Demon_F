import { motion } from "framer-motion";
import {
  MapPin,
  Bed,
  Wifi,
  Coffee,
  Shield,
  Bus,
  ArrowRight,
} from "lucide-react";
import { SiGooglemaps } from "react-icons/si";
import { Link } from "react-router-dom";

const Accommodation = () => {
  const facilities = [
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "High-Speed Net",
      desc: "24/7 Connectivity",
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Refreshments",
      desc: "In-house cafeteria",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Zone",
      desc: "24/7 Security",
    },
    {
      icon: <Bus className="w-6 h-6" />,
      title: "Transport",
      desc: "Shuttle Service",
    },
  ];

    return (
        <div className="pt-24 min-h-screen container mx-auto px-4 pb-20">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-20 space-y-4"
            >
                <h2 className="text-white font-mono tracking-widest text-sm uppercase">
                    Sector: Residence
                </h2>
                <h1 className="text-5xl font-bold md:text-7xl font-russ text-transparent bg-clip-text bg-gradient-to-r from-prakida-flame to-orange-500 to-gray-500 mb-6">
                    ACCOMMODATION
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    Secure your base of operations. We provide comfortable stay options
                    within the campus perimeter for all outstation operatives.
                </p>
            </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* On-Campus Stay */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-lg p-8 backdrop-blur-sm hover:border-prakida-flame/50 transition-colors group"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-prakida-flame/10 rounded-full text-prakida-flame">
              <Bed className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-white">
                Base Camp Alpha
              </h3>
              <p className="text-prakida-flame text-sm font-mono">
                ON-CAMPUS HOSTELS
              </p>
            </div>
          </div>

          <p className="text-gray-400 mb-8 leading-relaxed">
            Experience the full festival atmosphere by staying right in the
            heart of the action. Our hostels provide a comfortable and secure
            environment for all participants.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {facilities.map((fac, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-gray-300 bg-black/20 p-3 rounded"
              >
                <span className="text-prakida-flame">{fac.icon}</span>
                <span className="text-sm font-medium">{fac.title}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-white/10 pt-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">CHECK-IN</span>
              <span className="text-white font-mono">24/7 AVAILABLE</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">CHARGES</span>
              <span className="text-white font-mono">₹ 1349 / Person</span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/register/accommodation"
              className="flex items-center justify-center gap-2 w-full bg-white text-black py-4 text-xs font-black uppercase hover:bg-prakida-flame hover:text-white transition-all duration-300 transform group-hover:translate-y-[-2px]"
            >
              <span>Register for Accommodation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Location / Instructions */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          {/* Map/Location Card */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <MapPin className="text-prakida-flame w-6 h-6" />
              <h3 className="text-xl font-display font-bold text-white">
                Coordinates
              </h3>
            </div>
            <div className="aspect-video w-full bg-black/50 rounded-lg border border-white/5 mb-4 overflow-hidden relative group">
              {/* Placeholder for map - using an image or just a cool div */}
              <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <iframe
                  src="https://maps.google.com/maps?q=BIT%20Mesra%20Patna&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  className="grayscale-0 filter lg:grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 delay-100 ease-out"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="BIT Patna Location"
                ></iframe>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              BIT Patna Campus, Near Patna Airport, Bihar 800014
            </p>
          </div>

                    {/* Contact for Accommodation */}
                    <div className="bg-prakida-flame/10 border border-prakida-flame/30 rounded-lg p-8">
                        <h3 className="text-2xl font-display font-bold text-white mb-4">
                            Need Assistance?
                        </h3>
                        <p className="text-gray-400 mb-6">
                            For booking inquiries and custom arrangements, contact our
                            hospitality corps.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                                <span className="text-gray-400">Hospitality Head(Shruti)</span>
                                <span className="text-white font-mono">+91 96083 84049</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                                <span className="text-gray-400">Hospitality Head(Vivek Modi)</span>
                                <span className="text-white font-mono">+91 62037 99098</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/5">
                                <span className="text-gray-400">Hospitality Head(Piyush)</span>
                                <span className="text-white font-mono">+91 85218 02612</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Accommodation;
