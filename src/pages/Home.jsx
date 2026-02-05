import Hero from "../components/Hero";
import About from "../components/About";
import HashiraShowcase from "../components/HashiraShowcase";
import Gallery from "../components/Gallery";
import Sponsors from "../components/Sponsors";
import Marquee from "../components/ui/Marquee";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Hero />
      <Marquee
        items={[
          "Registration Open Now",
          "Prove Your Strength",
          "Blood Sweat & Glory",
          "March 12-15 2026",
          "Become a Hashira",
        ]}
        speed={30}
      />
      <About />
      { }
      <HashiraShowcase limit={3} />
      <Gallery />

      { }
      <section className="py-24 bg-prakida-bg relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
            READY TO JOIN THE CORPS?
          </h2>
          <Link
            to="/events"
            className="inline-block px-10 py-4 bg-prakida-flame text-white font-bold text-xl tracking-widest hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 skew-x-[-12deg]"
          >
            <span className="block skew-x-[12deg]">VIEW SCHEDULE</span>
          </Link>
        </div>
      </section>

      {/** Sponsors scrolling disabled on Home page **/}
      {/** <Sponsors /> **/}
    </>
  );
};

export default Home;
