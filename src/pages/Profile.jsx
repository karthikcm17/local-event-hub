import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaHeart, FaUserCircle, FaMapMarkerAlt, FaSignOutAlt, FaTicketAlt } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('summary');
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:5000/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Error fetching engine data:", err));
  }, [user, navigate]);

  if (!user) return null;

  const hostedEvents = events.filter(event => event.organiserId === user.id);
  const favouriteEvents = events.filter(event => user.favourites?.includes(event.id));
  const safeReservations = Array.isArray(user.reservations) ? user.reservations : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      
      <nav className="fixed top-0 w-full h-20 bg-white/90 backdrop-blur-md border-b border-slate-100 z-50 px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#004D4D] rounded-xl flex items-center justify-center font-black text-[#F7E7CE] shadow-lg">M</div>
          <span className="text-2xl font-bold tracking-tighter uppercase">MATHURA <span className="text-[#004D4D] font-black">EVENTS</span></span>
        </Link>
        <Link to="/" className="text-[#004D4D] hover:text-[#D4AF37] transition-colors font-black uppercase text-[10px] tracking-widest">
          ❮ Back to Hub
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto pt-32 pb-24 px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center h-fit">
          <div className="w-24 h-24 bg-gradient-to-br from-[#004D4D] to-[#D4AF37] rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg mb-4">
            {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">{user.name}</h2>
          <span className="mt-1 bg-[#004D4D]/5 text-[#004D4D] border border-[#004D4D]/10 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            {user.role}
          </span>
          
          <div className="w-full border-t border-slate-100 my-6 pt-6 space-y-3 text-left">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Account Details</div>
            <div className="text-sm font-bold text-slate-700 truncate">{user.email}</div>
          </div>

          <button 
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-red-200 text-red-500 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-50 transition-all"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>

        <div className="lg:col-span-3 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#004D4D] rounded-[2.5rem] p-8 text-[#F7E7CE] shadow-xl relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-[#D4AF37] text-[#004D4D] rounded-xl flex items-center justify-center text-xl shadow-md shrink-0">
                <FaHeart />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Collections</p>
                <h3 className="text-3xl font-black italic mt-0.5">{favouriteEvents.length} <span className="text-[10px] uppercase font-sans tracking-normal opacity-40">Saved</span></h3>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-white text-[#004D4D] rounded-xl flex items-center justify-center text-xl shadow-md shrink-0">
                <FaTicketAlt />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Reservations</p>
                <h3 className="text-3xl font-black italic mt-0.5">{safeReservations.length} <span className="text-[10px] uppercase font-sans tracking-normal opacity-40">Booked</span></h3>
              </div>
            </div>

            {user.role === 'organiser' && (
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                <div className="w-12 h-12 bg-[#F7E7CE] text-[#004D4D] rounded-xl flex items-center justify-center text-xl shadow-md shrink-0">
                  <FaCalendarAlt />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Engagements</p>
                  <h3 className="text-3xl font-black italic mt-0.5">{hostedEvents.length} <span className="text-[10px] uppercase font-sans tracking-normal opacity-40">Live</span></h3>
                </div>
              </div>
            )}
          </div>

          <div className="flex border-b border-slate-200 gap-8">
            <button 
              onClick={() => setActiveTab('summary')}
              className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'summary' ? 'border-[#D4AF37] text-[#004D4D]' : 'border-transparent text-slate-400'}`}
            >
              Favourites ({favouriteEvents.length})
            </button>
            
            <button 
              onClick={() => setActiveTab('reserved')}
              className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'reserved' ? 'border-[#D4AF37] text-[#004D4D]' : 'border-transparent text-slate-400'}`}
            >
              Reservations ({safeReservations.length})
            </button>

            {user.role === 'organiser' && (
              <button 
                onClick={() => setActiveTab('hosted')}
                className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'hosted' ? 'border-[#D4AF37] text-[#004D4D]' : 'border-transparent text-slate-400'}`}
              >
                My Hosted Events ({hostedEvents.length})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {activeTab === 'summary' && (
              favouriteEvents.length > 0 ? favouriteEvents.map(event => (
                <div key={event.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-widest">{event.category}</span>
                    <h4 className="text-xl font-black text-slate-900 mt-2 uppercase italic truncate">{event.title}</h4>
                    <p className="text-slate-400 text-xs font-bold mt-4 flex items-center gap-2 uppercase tracking-wide">
                      <FaMapMarkerAlt className="text-[#004D4D]" /> {event.location}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400">📅 {event.date}</span>
                    <Link to={`/event/${event.id}`} className="text-[#004D4D] font-black text-xs uppercase tracking-wide">View Event ❯</Link>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-16 text-center text-slate-400 font-medium italic bg-white rounded-[2rem] border border-dashed border-slate-200">No events saved to curation list.</div>
              )
            )}

            {activeTab === 'reserved' && (
              safeReservations.length > 0 ? safeReservations.map(res => (
                <div key={res.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col justify-between shadow-sm border-l-4 border-l-[#D4AF37] relative overflow-hidden group hover:shadow-md transition-all">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="bg-[#004D4D] text-[#F7E7CE] text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest italic">Confirmed Pass</span>
                      <span className="text-sm font-black text-[#004D4D]">{res.seats} {res.seats === 1 ? 'Seat' : 'Seats'}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mt-4 uppercase italic truncate">{res.eventTitle}</h4>
                    <p className="text-slate-400 text-xs font-bold mt-2 flex items-center gap-2 uppercase tracking-wide truncate">
                      <FaMapMarkerAlt className="text-[#004D4D]" /> {res.location}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center bg-[#004D4D]/5 -mx-6 -mb-6 p-6 transition-colors group-hover:bg-[#004D4D]/10">
                    <span className="text-[10px] font-black text-slate-500">📅 {res.date}</span>
                    <span className="text-base font-black text-[#004D4D]">Paid: ₹{res.totalPaid}</span>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-16 text-center text-slate-400 font-medium italic bg-white rounded-[2rem] border border-dashed border-slate-200">
                  No active ticket placements reserved for your account.
                </div>
              )
            )}

            {activeTab === 'hosted' && user.role === 'organiser' && (
              hostedEvents.length > 0 ? hostedEvents.map(event => (
                <div key={event.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#004D4D] tracking-widest">{event.category}</span>
                    <h4 className="text-xl font-black text-slate-900 mt-2 uppercase italic truncate">{event.title}</h4>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex gap-4">
                      <Link to={`/edit-event/${event.id}`} className="text-[#004D4D] text-xs font-black uppercase border-b border-[#004D4D]">Edit Details ✎</Link>
                    </div>
                    <Link to={`/event/${event.id}`} className="text-[#D4AF37] font-black text-xs uppercase tracking-wide">Details ❯</Link>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-16 text-center text-slate-400 font-medium italic bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <p className="mb-4">You haven't posted any events yet.</p>
                  <Link to="/create-event" className="inline-block bg-[#004D4D] text-[#F7E7CE] px-6 py-2.5 rounded-xl text-xs font-black uppercase">Create First Event</Link>
                </div>
              )
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;