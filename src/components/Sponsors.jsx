const sponsors = [
  "ASUS ROG",
  "Red Bull",
  "Logitech",
  "Nike",
  "Adidas",
  "Puma",
  "Razer",
  "Sony",
  "Eco-Water",
];

const Sponsors = () => {
  return (
    <section className="py-16 bg-black border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 mb-8 text-center text-sm font-bold text-gray-500 tracking-[0.3em] uppercase">
        Forged In Alliance With
      </div>

      <div className="relative flex overflow-x-hidden group">
        { }
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10"></div>

        <div className="animate-marquee whitespace-nowrap flex gap-16 py-4">
          { }
          {[...sponsors, ...sponsors].map((sponsor, idx) => (
            <div
              key={idx}
              className="text-2xl md:text-4xl font-display font-bold text-white/20 hover:text-prakida-flame transition-colors duration-300 uppercase select-none"
            >
              {sponsor}
            </div>
          ))}
          {[...sponsors, ...sponsors].map((sponsor, idx) => (
            <div
              key={`dup-${idx}`}
              className="text-2xl md:text-4xl font-display font-bold text-white/20 hover:text-prakida-flame transition-colors duration-300 uppercase select-none"
            >
              {sponsor}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
