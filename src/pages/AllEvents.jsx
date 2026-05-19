import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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
    fetch('http://localhost:5000/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setFilteredEvents(data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let result = events;

    if (activeCategory !== 'All') {
      result = result.filter(event => event.category === activeCategory);
    }

    if (searchTerm) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(result);
  }, [searchTerm, activeCategory, events]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      
      <nav className="fixed top-0 w-full h-20 bg-white/90 backdrop-blur-md border-b border-slate-100 z-50 px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 font-black text-xs uppercase tracking-widest text-[#004D4D] group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-[#D4AF37]" /> Back to Hub
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#004D4D] rounded-xl flex items-center justify-center font-black text-[#F7E7CE] shadow-lg">M</div>
          <span className="text-xl font-bold tracking-tighter uppercase hidden sm:inline">MATHURA <span className="text-[#004D4D] font-black"> EVENTS</span></span>
        </div>
      </nav>

      <header className="pt-32 px-6 max-w-7xl mx-auto space-y-8">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            All Marketplace <span className="text-[#004D4D]">Engagements</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Browse our comprehensive legacy index without limitations.</p>
        </div>

        <div className="max-w-3xl bg-white p-3 rounded-2xl shadow-xl shadow-[#004D4D]/5 border border-slate-100 flex flex-col md:flex-row items-center gap-2">
          <div className="flex-1 flex items-center px-5 gap-3 w-full">
            <span className="text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search complete listing ledger..." 
              className="w-full py-4 outline-none text-slate-700 font-bold placeholder:text-slate-300 bg-transparent" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {categories.map((cat) => (
            <button 
              key={cat.name} 
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-3 px-6 py-3 border rounded-xl transition-all font-black text-[10px] uppercase tracking-wider group ${activeCategory === cat.name ? 'bg-[#004D4D] text-[#F7E7CE] border-[#004D4D] shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-[#D4AF37]'}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredEvents.length > 0 ? filteredEvents.map(event => (
            <div key={event.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
              <div className="h-64 bg-slate-100 relative overflow-hidden">
                <div className="absolute top-5 left-5 z-10 bg-[#004D4D] text-[#F7E7CE] px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg italic">
                  {event.category}
                </div>
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1200"; }}
                />
              </div>
              <div className="p-8">
                <h4 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-[#004D4D] transition tracking-tighter uppercase italic leading-none">{event.title}</h4>
                <div className="flex justify-between items-center pt-6 border-t border-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>📅 {event.date}</span>
                  <span className="text-[#004D4D] font-black italic">₹{event.price || 0}</span>
                  <Link to={`/event/${event.id}`} className="text-[#D4AF37] font-black border-b border-[#D4AF37] pb-0.5">Details ❯</Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center text-slate-400 italic font-medium bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              No historical matches found for "{searchTerm}" inside the {activeCategory} ledger category.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllEvents;