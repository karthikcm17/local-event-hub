import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const user = JSON.parse(localStorage.getItem('user'));

  const banners = [
    { image: "banner1.jpg", title: "Elite Mathura Events", subtitle: "Luxury management for social milestones." },
    { image: "banner2.jpg", title: "Create. Host. Celebrate.", subtitle: "Your premier hub for expert organizers." },
    { image: "banner3.jpg", title: "Precision in Every Detail", subtitle: "Discover world-class corporate summits." }
  ];

  const categories = [
    { name: 'All', icon: '✨' },
    { name: 'Music', icon: '🎸' },
    { name: 'Food & Drink', icon: '🥂' },
    { name: 'Business', icon: '💼' },
    { name: 'Art', icon: '🎨' },
    { name: 'Wellness', icon: '🧘' },
    { name: 'Education', icon: '🎓' },
    { name: 'Sports', icon: '🏆' }
  ];

  useEffect(() => {
    fetch('http://localhost:5000/events').then(res => res.json()).then(data => {
      setEvents(data);
      setFilteredEvents(data);
    });

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    let result = events;

    if (activeCategory !== 'All') {
      result = result.filter(event => event.category === activeCategory);
    }

    if (searchTerm) {
      result = result.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(result);
  }, [searchTerm, activeCategory, events]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-500 selection:text-white">

      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#004D4D] rounded-xl flex items-center justify-center font-black text-[#F7E7CE] shadow-lg">M</div>
            <span className="text-2xl font-bold tracking-tighter uppercase">MATHURA <span className="text-[#004D4D] font-black"> EVENTS</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500 h-10">

            <Link to="/" className="text-[#004D4D] border-b-2 border-[#D4AF37] pb-1 h-full flex items-center transition"
            > Home </Link>
            <a href="#" className="hover:text-[#004D4D] border-b-2 border-transparent pb-1 h-full flex items-center transition"
            > About Us </a>
            <a href="#" className="hover:text-[#004D4D] border-b-2 border-transparent pb-1 h-full flex items-center transition"
            > Contact </a>

            {!user ? (
              // <Link to="/login" className="bg-[#004D4D] text-[#F7E7CE] px-6 py-2.5 rounded-lg hover:opacity-90 transition shadow-md font-bold">Sign In</Link>
              <Link to="/login" className="bg-[#004D4D] text-[#F7E7CE] hover:text-white px-5 h-full rounded-lg transition shadow-md font-bold flex items-center justify-center gap-2 border border-[#004D4D] hover:border-[#D4AF37]"
                title="Sign In to Account"
              >
                <FaSignInAlt className="text-sm" />
                <span>Sign In</span>
              </Link>
            ) : (
              <div className="flex items-center gap-5 pl-6 border-l border-slate-200">
                <Link to="/profile" className="flex items-center gap-3 group">
                  <span className="text-[#004D4D] bg-[#004D4D]/5 px-4 py-2 rounded-full border border-[#004D4D]/10 font-bold text-xs uppercase tracking-tighter group-hover:bg-[#004D4D] group-hover:text-[#F7E7CE] transition-all italic">
                    ✨ {user.name}
                  </span>
                  <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-[#D4AF37] transition">Profile</span>
                </Link>
                <button onClick={() => { localStorage.clear(); window.location.reload(); }}
                  className="text-slate-400 hover:text-red-500 transition-colors duration-300 p-2 rounded-lg hover:bg-red-50 text-base flex items-center justify-center"
                  title="Sign Out"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="text-xs">Sign Out</span>
                </button>
                {/* <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-red-500 text-[10px] font-black uppercase hover:underline">Logout</button> */}
              </div>
            )}
          </div>
        </div>
      </nav>

      <header className="relative pt-24 px-6">
        <div className="max-w-7xl mx-auto h-[65vh] rounded-[3rem] overflow-hidden relative shadow-2xl">
          <img src={banners[currentSlide].image} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" alt="Banner" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D4D]/70 via-[#004D4D]/30 to-transparent flex flex-col justify-center px-12 md:px-24">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-6 max-w-3xl uppercase italic">
              {banners[currentSlide].title}
            </h1>
            <p className="text-xl text-[#F7E7CE] mb-10 max-w-lg font-medium tracking-wide">
              {banners[currentSlide].subtitle}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto -mt-12 relative z-20 px-4">
          <div className="bg-white p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,77,77,0.15)] border border-slate-100 flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center px-5 gap-3 w-full">
              <span className="text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search events, organizers, or venues..."
                className="w-full py-4 outline-none text-slate-700 font-bold placeholder:text-slate-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-[#004D4D] text-[#F7E7CE] px-12 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#003333] transition-all w-full md:w-auto shadow-lg">
              Search
            </button>
          </div>
        </div>
      </header>

      <section id="about" className="py-24 bg-[#004D4D]/5 border-y border-slate-100 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-[#004D4D] mb-8 italic">About Our <span className="text-[#D4AF37]">Legacy</span></h2>
          <p className="text-slate-600 text-lg leading-loose font-medium">
            Mathura Events is a high-fidelity multivendor marketplace where precision meets celebration. We bridge the gap between world-class organisers and those seeking extraordinary experiences.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap justify-center gap-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-3 px-8 py-4 border rounded-2xl transition-all font-bold group ${activeCategory === cat.name ? 'bg-[#004D4D] text-[#F7E7CE] border-[#004D4D]' : 'bg-white border-slate-100 text-slate-600 hover:border-[#D4AF37]'}`}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
            <span className="text-[10px] uppercase tracking-[0.2em]">{cat.name}</span>
          </button>
        ))}
      </section>

      <main id="discover" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-16 border-b-4 border-[#004D4D] pb-6">
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Upcoming <span className="text-[#004D4D]">Events</span></h2>
          <div className="flex items-center gap-4">
            <Link to="/all-events" className="text-[#004D4D] hover:text-[#D4AF37] text-xs font-black uppercase tracking-widest border-b-2 border-transparent hover:border-[#D4AF37] pb-1 transition-all">
              View All Events ❯
            </Link>
            {user?.role === 'organiser' && (
              <Link to="/create-event" className="bg-[#D4AF37] text-[#004D4D] px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                + Post Event
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredEvents.length > 0 ? filteredEvents.slice(0, 9).map(event => (
            <div key={event.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
              <div className="h-64 bg-slate-100 relative overflow-hidden">
                <div className="absolute top-5 left-5 z-10 bg-[#004D4D] text-[#F7E7CE] px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg italic">
                  {event.category}
                </div>
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { e.target.src = "https://i.pinimg.com/1200x/da/28/cd/da28cdea986b12be82852b87bc1a6e54.jpg"; }}
                />
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-[#004D4D] transition tracking-tighter uppercase italic leading-none">{event.title}</h4>
                <div className="flex justify-between items-center pt-6 border-t border-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>📅 {event.date}</span>
                  <Link to={`/event/${event.id}`} className="text-[#D4AF37] font-black border-b border-[#D4AF37] pb-0.5">Details ❯</Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center text-slate-400 italic font-medium">No matches found for "{searchTerm}" in {activeCategory}.</div>
          )}
        </div>
      </main>

      <footer id="contact" className="bg-[#004D4D] text-[#F7E7CE] pt-15 pb-5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20 pb-10 border-b border-white/10 mb-5">

          <div className="col-span-1">
            <h4 className="text-3xl font-black mb-6 italic tracking-tighter uppercase">
              MATHURA<span className="text-[#D4AF37]"> EVENTS</span>
            </h4>
            <p className="text-[#F7E7CE]/60 text-xs font-bold uppercase tracking-widest leading-loose max-w-xs">
              The ultimate multivendor marketplace for elite organizers and extraordinary audiences.
            </p>
          </div>

          <div>
            <h5 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 opacity-60">Location</h5>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
              <li className="flex gap-3">
                <span className="text-[#D4AF37]">📍</span>
                <span className="leading-relaxed">
                  16/2, Ellaiyamman Kovil Street <br />
                  Thottiyam, Trichy, <br />
                  Tamilnadu - 621215
                </span>
              </li>
              <li className="flex gap-3 mt-4">
                <span className="text-[#D4AF37]">📞</span>
                <span>+91 93608 59919</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col md:items-end">
            <h5 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 opacity-60">Connect With Us</h5>
            <div className="flex gap-4">
              {[
                { icon: <FaFacebookF />, link: '#' },
                { icon: <FaXTwitter />, link: '#' },
                { icon: <FaInstagram />, link: '#' },
                { icon: <FaLinkedinIn />, link: '#' }
              ].map((social, i) => (
                <a
                  href={social.link}
                  key={i}
                  className="w-12 h-12 border border-[#F7E7CE]/20 rounded-full flex items-center justify-center text-lg hover:bg-[#F7E7CE] hover:text-[#004D4D] transition-all cursor-pointer shadow-lg"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] font-bold uppercase tracking-[0.6em] opacity-40">
          © 2026 Mathura Events Hub. Built for Impact.
        </p>
      </footer>
    </div>
  );
};

export default Home;