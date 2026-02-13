import { SiInstagram, SiGmail, SiGooglemaps, SiWhatsapp } from "react-icons/si";
import { FaPhone } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer id="footer" className="bg-black border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-16 items-start">
          <div className="text-center md:text-left md:w-1/3">
            <a
              href="#"
              className="flex items-center gap-3 text-3xl font-display font-bold text-white mb-4"
            >
              <img src="/prakida-favicon.png" alt="logo" className="w-8 h-8" />
              PRAKRIDA
            </a>
            <p className="text-gray-500 max-w-sm mb-6">
              Forged in Sportsmanship, Inspired by Hashira. The ultimate
              inter-college sports festival.
            </p>
            <div className="flex justify-center md:justify-start gap-6">
              <a
                href="https://www.instagram.com/bitp_prakrida/"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#E1306C] hover:text-white transition-all duration-300"
                target="_blank"
                rel="noreferrer"
              >
                <SiInstagram size={20} />
              </a>
              <a
                href="https://chat.whatsapp.com/C6ZzJfmFfgk9tSclTa7nmZ"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#25D366] hover:text-white transition-all duration-300"
                target="_blank"
                rel="noreferrer"
              >
                <SiWhatsapp size={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full md:w-auto items-center md:items-start">
            <div className="flex flex-col items-center md:items-start gap-3 text-base md:text-lg text-gray-400">
              <a
                href="https://www.google.com/maps/search/?api=1&query=BIT%20Patna%2C%20Bihar%2C%20India"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 group cursor-pointer"
              >
                <SiGooglemaps
                  size={20}
                  className="group-hover:text-[#34A853] transition-colors duration-300"
                />
                <span className="group-hover:text-white transition-colors duration-300">
                  BIT Patna, Bihar, India
                </span>
              </a>
              <div className="flex items-center gap-3 group cursor-pointer">
                <FaPhone
                  size={20}
                  className="group-hover:text-[#25D366] transition-colors duration-300"
                />
                <a
                  href="tel:+917070747693"
                  className="group-hover:text-white transition-colors duration-300"
                >
                  Contact: 70707 47693
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <SiGmail
                  size={20}
                  className="group-hover:text-[#EA4335] transition-colors duration-300"
                />
                <a
                  href="mailto:prakida@bitmesra.ac.in"
                  className="group-hover:text-white transition-colors duration-300"
                >
                  prakrida@bitmesra.ac.in
                </a>
              </div>
            </div>

            <div className="w-full md:w-72 h-48 rounded-lg overflow-hidden border border-white/10 bg-white/5 relative group">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10"></div>
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
        </div>

        <div className="border-t border-white/5 pt-8 flex justify-center text-center text-sm text-gray-600">
          <div>© 2026 PRAKRIDA Sports Fest. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
