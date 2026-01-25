import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Instagram, Twitter } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!user) {
      setStatus({
        type: "error",
        message: "You must be logged in to send a message.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    const { name, email, phone, message } = formData;
    if (!name || !email || !message) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "Contact_us"), {
        name,
        email,
        phone: phone || "",
        message,
        user_id: user.uid, // Linking to user
        created_at: new Date().toISOString(),
      });
      setStatus({ type: "success", message: "Message sent successfully!" });
      setFormData({ name: "", email: user.email, phone: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <a
            href="tel:+91XXXXXXXXXX"
            className="text-gray-400 group-hover:text-white transition-colors block"
          >
            +91 79035 55032
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
          <a
            href="tel:+91XXXXXXXXXX"
            className="text-gray-400 group-hover:text-white transition-colors block"
          >
            +91 84093 06029
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
          <a
            href="tel:+91XXXXXXXXXX"
            className="text-gray-400 group-hover:text-white transition-colors block"
          >
            +91 79 7986 5972
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
              <a
                href="tel:+917903555032"
                className="text-gray-400 hover:text-prakida-flame transition-colors"
              >
                +91 79035 55032
              </a>
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
        {!user ? (
          <div className="bg-white/5 border border-white/10 p-8 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-display font-bold text-white mb-4">
              LOGIN REQUIRED
            </h3>
            <p className="text-gray-400 mb-6">
              You must be logged in to send a message to the council.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-2 bg-prakida-flame text-white font-bold hover:bg-prakida-flameDark transition-colors"
              >
                LOGIN
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 border border-white/20 text-white font-bold hover:bg-white/10 transition-colors"
              >
                SIGN UP
              </Link>
            </div>
          </div>
        ) : (
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 bg-gray-900/50 p-8 border border-gray-800"
            onSubmit={handleSendMessage}
          >
            {status && (
              <div
                className={`p-4 rounded border ${status.type === "success"
                  ? "bg-green-900/20 border-green-500/50 text-green-400"
                  : "bg-red-900/20 border-red-500/50 text-red-400"
                  }`}
              >
                {status.message}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-black/50 border border-gray-700 px-4 py-3 text-white focus:border-prakida-flame focus:outline-none transition-colors"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email <span className="text-gray-500">(Auto-filled)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full bg-black/50 border border-gray-700 px-4 py-3 text-gray-400 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Phone Number <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-black/50 border border-gray-700 px-4 py-3 text-white focus:border-prakida-flame focus:outline-none transition-colors"
                placeholder="+91..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-black/50 border border-gray-700 px-4 py-3 text-white focus:border-prakida-flame focus:outline-none transition-colors"
                placeholder="Your message..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-prakida-flame hover:bg-orange-600 text-white font-bold py-4 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default Contact;
