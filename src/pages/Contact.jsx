import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Instagram, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <div className="pt-32 min-h-screen container mx-auto px-4">
      <h1 className="text-5xl font-russ text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-prakida-flame to-orange-600">
        Send a Crow
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
        <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors group text-center">
          <div className="w-24 h-24 rounded-full bg-white/10 mx-auto mb-4 overflow-hidden border-2 border-prakida-flame/20 group-hover:border-prakida-flame transition-colors">
            { }
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <svg
                className="w-12 h-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-prakida-flame font-display tracking-wider text-xl mb-2">
            CONVENER
          </h3>
          <p className="text-white font-bold text-lg mb-1">Rohit Kumar</p>
          <a href="tel:+91XXXXXXXXXX" className="text-gray-400 group-hover:text-white transition-colors block">
            +91 XXXXX XXXXX
          </a>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors group text-center">
          <div className="w-24 h-24 rounded-full bg-white/10 mx-auto mb-4 overflow-hidden border-2 border-prakida-flame/20 group-hover:border-prakida-flame transition-colors">
            { }
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <svg
                className="w-12 h-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-prakida-flame font-display tracking-wider text-xl mb-2">
            EVENT HEAD
          </h3>
          <p className="text-white font-bold text-lg mb-1">Anurag Anand</p>
          <a href="tel:+91XXXXXXXXXX" className="text-gray-400 group-hover:text-white transition-colors block">
            +91 XXXXX XXXXX
          </a>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors group text-center">
          <div className="w-24 h-24 rounded-full bg-white/10 mx-auto mb-4 overflow-hidden border-2 border-prakida-flame/20 group-hover:border-prakida-flame transition-colors">
            { }
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <svg
                className="w-12 h-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-prakida-flame font-display tracking-wider text-xl mb-2">
            SOCIAL MEDIA HEAD
          </h3>
          <p className="text-white font-bold text-lg mb-1">Udit Ojha</p>
          <a href="tel:+91XXXXXXXXXX" className="text-gray-400 group-hover:text-white transition-colors block">
            +91 XXXXX XXXXX
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        { }
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-prakida-flame/10 rounded-lg text-prakida-flame">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Email Us</h3>
              <p className="text-gray-400">prakrida@bitmesra.ac.in</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-prakida-flame/10 rounded-lg text-prakida-flame">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Call Us</h3>
              <a href="tel:+917903555032" className="text-gray-400 hover:text-prakida-flame transition-colors">+91 79035 55032</a>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-prakida-flame/10 rounded-lg text-prakida-flame">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Headquarters</h3>
              <p className="text-gray-400">
                BIT Patna,
                <br />
                Bihar,
                <br />
                India.
              </p>
            </div>
          </div>
        </div>

        { }
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 bg-gray-900/50 p-8 border border-gray-800"
        >
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Name
            </label>
            <input
              type="text"
              className="w-full bg-black/50 border border-gray-700 px-4 py-3 text-white focus:border-prakida-flame focus:outline-none transition-colors"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-black/50 border border-gray-700 px-4 py-3 text-white focus:border-prakida-flame focus:outline-none transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Message
            </label>
            <textarea
              rows="4"
              className="w-full bg-black/50 border border-gray-700 px-4 py-3 text-white focus:border-prakida-flame focus:outline-none transition-colors"
              placeholder="Your message..."
            ></textarea>
          </div>
          <button
            type="button"
            className="w-full bg-prakida-flame hover:bg-orange-600 text-white font-bold py-4 transition-all transform hover:scale-[1.02]"
          >
            Send Message
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;
