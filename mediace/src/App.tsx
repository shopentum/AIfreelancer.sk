import { motion } from "motion/react";
import { Mail, Phone, MapPin, MessageSquare, CheckCircle2, Menu, X, Palette } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "O mně", href: "#o-mne" },
    { name: "Služby", href: "#sluzby" },
    { name: "Ceník", href: "#cenik" },
    { name: "Kontakt", href: "#kontakt" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? (theme === 'solid' ? "bg-navy/90" : (theme === 'vibrant' ? "bg-ivory/90" : "bg-navy/80")) + " backdrop-blur-md py-4" : "bg-transparent py-8"}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className={`font-serif text-xl tracking-widest font-medium ${theme === 'vibrant' ? 'text-navy' : 'text-ivory'}`}>
          SIMONA <span className="text-beige">HRYZÁKOVÁ</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.3em] hover:text-beige transition-colors duration-300 font-medium text-ivory/70"
            >
              {link.name}
            </a>
          ))}
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-beige/60 hover:text-beige"
            title="Změnit styl pozadí"
          >
            <Palette size={16} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full border border-white/10 text-beige/60"
          >
            <Palette size={18} />
          </button>
          <button className="text-ivory" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`md:hidden absolute top-full left-0 w-full py-10 px-6 shadow-2xl border-t border-white/5 ${theme === 'vibrant' ? 'bg-ivory' : 'bg-navy'}`}
        >
          <div className="flex flex-col space-y-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-serif tracking-widest ${theme === 'vibrant' ? 'text-navy' : 'text-ivory'}`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-[110px] overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mt-[20px]"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] w-12 bg-beige/40"></div>
          <span className="text-beige uppercase tracking-[0.4em] text-[10px] font-semibold">
            Profesionální mediace
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-10 font-serif italic text-ivory">
          Cesta k dohodě <br className="hidden md:block" /> začíná pochopením.
        </h1>
        <p className="text-lg md:text-xl text-ivory/60 max-w-lg mb-12 leading-relaxed font-light">
          Pomáhám řešit spory v klidu, diskrétně a lidsky. Bez soudních síní a zbytečného napětí.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <a
            href="#kontakt"
            className="bg-beige text-navy px-10 py-5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-beige-dark transition-all duration-500 shadow-2xl shadow-beige/10 text-center"
          >
            Domluvit konzultaci
          </a>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="relative flex justify-center md:justify-end"
      >
        <div className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px]">
          <div className="absolute inset-0 rounded-full border border-beige/20 animate-pulse"></div>
          <div className="absolute inset-4 rounded-full overflow-hidden border-[1px] border-white/10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
              alt="Simona Hryzáková" 
              className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const About = () => (
  <section id="o-mne" className="py-32 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-12 gap-20">
        <div className="md:col-span-4">
          <h2 className="text-6xl md:text-8xl italic mb-6 opacity-40 font-serif tracking-tighter">O mně</h2>
          <p className="text-sm uppercase tracking-[0.4em] font-bold text-beige">Důvěra a respekt</p>
        </div>
        <div className="md:col-span-8 space-y-10">
          <div className="bg-navy-light/30 p-12 rounded-[40px] border border-white/5 backdrop-blur-sm">
            <p className="text-xl text-ivory/80 leading-relaxed mb-8 font-light italic">
              "Věřím, že každý konflikt má své řešení, které nemusí končit u soudu. Jako mediátorka se zaměřuji na vytváření bezpečného prostoru pro dialog."
            </p>
            <p className="text-ivory/60 leading-relaxed mb-10 text-lg">
              Jmenuji se Simona Hryzáková a mým cílem je pomoci stranám najít společnou řeč tam, kde se zdá, že už žádná není. Zakládám si na empatii, nestrannosti a naprosté diskrétnosti. Každý případ je pro mě jedinečný příběh, který si zaslouží lidský přístup.
            </p>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <p className="text-4xl font-serif text-beige mb-2">10+</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">Let zkušeností</p>
              </div>
              <div>
                <p className="text-4xl font-serif text-beige mb-2">500+</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/40">Vyřešených sporů</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Services = () => {
  const services = [
    {
      title: "Rodinná mediace",
      desc: "Řešení rozvodů, péče o děti, vypořádání majetku a mezigeneračních sporů s ohledem na vztahy.",
    },
    {
      title: "Pracovní mediace",
      desc: "Urovnání konfliktů na pracovišti, mezi kolegy nebo vedením a zaměstnanci pro zdravé prostředí.",
    },
    {
      title: "Obchodní mediace",
      desc: "Efektivní řešení sporů mezi obchodními partnery bez nutnosti zdlouhavých soudních procesů.",
    },
    {
      title: "Sousedské spory",
      desc: "Urovnání neshod týkajících se hranic pozemků, hluku nebo jiných společných soužití.",
    },
  ];

  return (
    <section id="sluzby" className="py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-20">
          <div className="md:col-span-4">
            <h2 className="text-6xl md:text-8xl italic mb-6 opacity-40 font-serif tracking-tighter">Služby</h2>
            <p className="text-ivory/60 text-sm uppercase tracking-[0.3em] leading-loose">
              Mimosoudní řešení sporů v různých oblastech života.
            </p>
          </div>
          <div className="md:col-span-8 grid sm:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                className="bg-navy-light/20 p-10 rounded-[30px] border border-white/5 transition-all duration-500"
              >
                <h3 className="text-xl mb-6 font-serif text-beige italic">{s.title}</h3>
                <p className="text-sm text-ivory/50 leading-relaxed font-light">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Reviews = () => {
  const reviews = [
    {
      text: "Simona nám pomohla najít společnou řeč v situaci, kdy jsme už nevěřili, že je to možné. Její přístup byl profesionální a lidský zároveň.",
      author: "Jana a Petr, rodinná mediace",
    },
    {
      text: "Díky mediaci jsme vyřešili spor ve firmě během dvou odpolední. Ušetřili jsme měsíce soudních sporů a zachovali si korektní vztahy.",
      author: "Marek S., obchodní mediace",
    },
    {
      text: "Oceňuji naprostou diskrétnost a nestrannost. Cítili jsme se v bezpečném prostředí, což bylo pro vyřešení našeho sousedského sporu klíčové.",
      author: "Lucie K., sousedské spory",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section id="recenze" className="py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-20">
          <div className="md:col-span-4">
            <h2 className="text-6xl md:text-8xl italic mb-6 opacity-40 font-serif tracking-tighter">Recenze</h2>
            <p className="text-ivory/60 text-sm uppercase tracking-[0.3em] leading-loose">
              Zkušenosti klientů, kterým jsem pomohla najít cestu k dohodě.
            </p>
          </div>
          <div className="md:col-span-8 relative">
            <div className="bg-navy-light/20 p-12 md:p-20 rounded-[40px] border border-white/5 min-h-[400px] flex flex-col justify-center">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <MessageSquare className="text-beige/40" size={40} />
                <p className="text-2xl md:text-3xl font-serif italic text-ivory/90 leading-relaxed">
                  "{reviews[activeIndex].text}"
                </p>
                <div className="pt-8 border-t border-white/5">
                  <p className="text-sm uppercase tracking-[0.3em] font-bold text-beige">
                    {reviews[activeIndex].author}
                  </p>
                </div>
              </motion.div>
              
              <div className="flex gap-4 mt-12">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-1 transition-all duration-500 ${i === activeIndex ? "w-12 bg-beige" : "w-4 bg-white/10"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing = () => (
  <section id="cenik" className="py-32 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-12 gap-20">
        <div className="md:col-span-4">
          <h2 className="text-6xl md:text-8xl italic mb-6 opacity-40 font-serif tracking-tighter">Ceník</h2>
          <p className="text-ivory/60 text-sm uppercase tracking-[0.3em] leading-loose">
            Transparentní a férové podmínky pro obě strany.
          </p>
        </div>
        <div className="md:col-span-8">
          <div className="bg-navy-light/20 p-12 rounded-[40px] border border-white/5">
            <ul className="space-y-10">
              <li className="flex justify-between items-center group">
                <span className="font-serif text-xl text-ivory/80 group-hover:text-beige transition-colors">Informativní schůzka (30 min)</span>
                <span className="text-beige font-semibold tracking-widest text-sm">ZDARMA</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="font-serif text-xl text-ivory/80 group-hover:text-beige transition-colors">Hodinová sazba mediace</span>
                <span className="text-beige font-semibold tracking-widest text-sm">1 500 KČ / HOD</span>
              </li>
              <li className="flex justify-between items-center group">
                <span className="font-serif text-xl text-ivory/80 group-hover:text-beige transition-colors">Sepsání mediační dohody</span>
                <span className="text-beige font-semibold tracking-widest text-sm">OD 2 000 KČ</span>
              </li>
            </ul>
            <div className="mt-16 pt-10 border-t border-white/5">
              <p className="text-xs text-ivory/30 uppercase tracking-[0.2em] leading-relaxed">
                Náklady na mediaci si strany obvykle dělí rovným dílem. Mediace je výrazně levnější a rychlejší cestou než soudní řízení.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="kontakt" className="py-32 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-12 gap-20">
        <div className="md:col-span-4">
          <h2 className="text-6xl md:text-8xl italic mb-6 opacity-40 font-serif tracking-tighter">Kontakt</h2>
          <p className="text-ivory/60 text-sm uppercase tracking-[0.3em] leading-loose">
            Udělejte první krok k vyřešení Vašeho sporu.
          </p>
        </div>
        <div className="md:col-span-8">
          <div className="grid sm:grid-cols-2 gap-12 mb-20">
            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-10 h-10 rounded-full border border-beige/20 flex items-center justify-center group-hover:bg-beige/10 transition-all">
                  <Mail className="text-beige" size={16} />
                </div>
                <a href="mailto:info@simonahryzakova.cz" className="text-lg text-ivory/70 hover:text-beige transition-colors">info@simonahryzakova.cz</a>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-10 h-10 rounded-full border border-beige/20 flex items-center justify-center group-hover:bg-beige/10 transition-all">
                  <Phone className="text-beige" size={16} />
                </div>
                <a href="tel:+420123456789" className="text-lg text-ivory/70 hover:text-beige transition-colors">+420 123 456 789</a>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-10 h-10 rounded-full border border-beige/20 flex items-center justify-center group-hover:bg-beige/10 transition-all">
                  <MapPin className="text-beige" size={16} />
                </div>
                <p className="text-lg text-ivory/70">Náměstí Svobody 12, Brno</p>
              </div>
            </div>
            <div className="bg-beige/5 p-10 rounded-[40px] border border-beige/10">
              <p className="text-sm italic text-beige/80 leading-relaxed">
                "Každá cesta začíná prvním krokem. Jsem zde, abych Vás na této cestě doprovodila v klidu a s respektem."
              </p>
            </div>
          </div>
          
          <form className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <input type="text" className="w-full bg-navy-light/20 border-b border-white/10 py-4 focus:border-beige transition-all outline-none text-ivory" placeholder="JMÉNO" />
              <input type="email" className="w-full bg-navy-light/20 border-b border-white/10 py-4 focus:border-beige transition-all outline-none text-ivory" placeholder="EMAIL" />
            </div>
            <textarea className="w-full bg-navy-light/20 border-b border-white/10 py-4 h-32 focus:border-beige transition-all outline-none text-ivory resize-none" placeholder="VAŠE ZPRÁVA"></textarea>
            <button className="bg-beige text-navy px-12 py-5 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-beige-dark transition-all shadow-xl shadow-beige/5">
              Odeslat poptávku
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-16 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="font-serif text-xl tracking-[0.2em] text-ivory">
        SIMONA <span className="text-beige">HRYZÁKOVÁ</span>
      </div>
      <div className="flex space-x-12 text-[10px] uppercase tracking-[0.3em] text-ivory/40">
        <a href="#" className="hover:text-beige transition-colors">Ochrana údajů</a>
        <a href="#" className="hover:text-beige transition-colors">Cookies</a>
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-ivory/20">
        © 2026 Simona Hryzáková
      </div>
    </div>
  </footer>
);

export default function App() {
  const [theme, setTheme] = useState('gradient');

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'solid') return 'gradient';
      if (prev === 'gradient') return 'vibrant';
      return 'solid';
    });
  };

  const getBackgroundClass = () => {
    if (theme === 'gradient') return 'bg-gradient-mesh';
    if (theme === 'vibrant') return 'bg-vibrant-blue';
    return 'bg-navy';
  };

  return (
    <div className={`fade-in min-h-screen transition-all duration-1000 ${getBackgroundClass()} ${theme === 'vibrant' ? 'theme-light' : ''}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <About />
      <Services />
      <Reviews />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}
