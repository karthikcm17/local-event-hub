import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaUserCircle, FaArrowLeft, FaPen, FaTrashAlt, FaHeart, FaRegHeart, FaTicketAlt, FaTimes } from 'react-icons/fa';
import { authService } from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavourited, setIsFavourited] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user')) || null;
  });

  const baseTicketPrice = event && event.price !== undefined && event.price !== null ? Number(event.price) : 1500;

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/events/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Engagement not found");
        return res.json();
      })
      .then(data => {
        setEvent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (event && user && Array.isArray(user.favourites)) {
      setIsFavourited(user.favourites.includes(event.id));
    } else {
      setIsFavourited(false);
    }
  }, [event, user?.favourites]);

  const handleFavouriteToggle = async () => {
    if (!user) {
      alert("Please sign in to save events to your collection.");
      navigate('/login');
      return;
    }
    try {
      const updatedUser = await authService.toggleFavourite(user.id, event.id, user.favourites || []);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      alert("Failed to synchronize your favourites list.");
    }
  };

  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to complete your reservation.");
      navigate('/login');
      return;
    }

    setIsBooking(true);
    const reservationPayload = {
      id: `res-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      seats: Number(ticketCount),
      totalPaid: baseTicketPrice * ticketCount,
      date: event.date,
      location: event.location,
      image: event.image
    };

    try {
      const updatedUser = await authService.bookReservation(user.id, reservationPayload, user.reservations || []);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsBooking(false);
      setIsModalOpen(false);
      alert(`✨ Reservation Successful! ${ticketCount} Seats secured for Mathura Hub Engagement.`);
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setIsBooking(false);
      alert("Reservation processing anomaly detected.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you absolutely sure you want to permanently remove this event from the marketplace?")) {
      try {
        const res = await fetch(`http://localhost:5000/events/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert("Event successfully unlisted.");
          navigate('/');
        } else {
          alert("Failed to delete event.");
        }
      } catch (err) {
        alert("An error occurred while communicating with the backend.");
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white text-[#004D4D]">
        <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black text-xs uppercase tracking-[0.3em]">Synchronizing Legacy Engine...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white text-slate-900 px-6">
        <h2 className="text-3xl font-black uppercase italic mb-4 text-[#004D4D]">Engagement Not Found</h2>
        <Link to="/" className="bg-[#004D4D] text-[#F7E7CE] px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg">Return to Hub</Link>
      </div>
    );
  }

  const isOwner = user && user.id === event.organiserId;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white pb-24">

      <nav className="fixed top-0 w-full h-20 bg-white/90 backdrop-blur-md border-b border-slate-100 z-50 px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 font-black text-xs uppercase tracking-widest text-[#004D4D] group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-[#D4AF37]" /> Back to Hub
        </Link>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#004D4D] rounded-xl flex items-center justify-center font-black text-[#F7E7CE] shadow-lg">M</div>
          <span className="text-xl font-bold tracking-tighter uppercase hidden sm:inline">MATHURA <span className="text-[#004D4D] font-black"> EVENTS</span></span>
        </Link>
      </nav>

      <header className="pt-28 px-6 max-w-7xl mx-auto">
        <div className="relative h-[45vh] md:h-[55vh] rounded-[3rem] overflow-hidden shadow-2xl bg-slate-900 border border-slate-100">
          <img
            src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://i.pinimg.com/1200x/da/28/cd/da28cdea986b12be82852b87bc1a6e54.jpg"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#003333]/80 via-[#004D4D]/50 to-slate-900/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-4xl relative z-10">
            <span className="flex items-center gap-2 bg-[#D4AF37] text-[#004D4D] font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-lg w-fit mb-4 shadow-lg italic">
              <FaTag /> {event.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tight leading-none mb-4 drop-shadow-md">
              {event.title}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
            <div>
              <h3 className="text-xs font-black uppercase text-[#004D4D] tracking-[0.2em] border-b border-slate-100 pb-4 mb-6">Overview</h3>
              <p className="text-slate-600 text-lg leading-loose font-medium whitespace-pre-line">{event.description}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {!isOwner && (
            <button
              onClick={handleFavouriteToggle}
              className="w-full bg-gradient-to-br from-[#004D4D]/5 to-slate-100 border border-[#004D4D]/10 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#D4AF37] hover:shadow-xl hover:shadow-[#D4AF37]/5 group relative overflow-hidden"
            >
              <div className="absolute top-[-30%] right-[-20%] w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-xl group-hover:bg-[#D4AF37]/10 transition-all pointer-events-none"></div>

              <div
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-md mb-4 transition-transform group-active:scale-95"
                style={{ color: isFavourited ? '#D4AF37' : '#94A3B8' }}
              >
                {isFavourited ? <FaHeart className="scale-110 duration-200" /> : <FaRegHeart className="group-hover:text-[#D4AF37] transition-colors" />}
              </div>

              <h4 className="text-sm font-black text-[#004D4D] uppercase tracking-[0.15em] mb-1">
                {isFavourited ? "Saved to Collections" : "Mark as Favourite"}
              </h4>
            </button>
          )}

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 pb-4">Schedule & Venue</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#004D4D]/5 rounded-xl flex items-center justify-center text-[#004D4D] shrink-0"><FaCalendarAlt /></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Timeline</p><p className="text-sm font-black text-slate-800 mt-1">{event.date}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#004D4D]/5 rounded-xl flex items-center justify-center text-[#004D4D] shrink-0"><FaMapMarkerAlt /></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Venue Location</p><p className="text-sm font-bold text-slate-600 mt-1 leading-relaxed">{event.location}</p></div>
              </div>
            </div>
          </div>

          {isOwner ? (
            <div className="bg-[#004D4D] text-[#F7E7CE] rounded-[2.5rem] p-8 shadow-xl space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">Management Panel</h4>
              <div className="flex flex-col gap-3">
                <Link to={`/edit-event/${event.id}`} className="bg-white text-[#004D4D] py-4 rounded-xl font-black text-center text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg">Modify Event Details</Link>
                <button
                  onClick={handleDelete}
                  className="w-full border border-red-500/30 text-red-400 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-300"
                >
                  <FaTrashAlt className="text-[10px]" /> Delete Event
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[#004D4D] text-[#F7E7CE] hover:bg-[#003333] transition-all py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl border border-white/10"
            >
              {baseTicketPrice === 0 ? "Get Free Pass ❯" : "Reserve Placement ❯"}
            </button>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#001F1F]/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

          <div className="bg-white w-full max-w-md rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors text-xl"><FaTimes /></button>

            <header className="mb-6">
              <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] block mb-1">Pass Reservation</span>
              <h3 className="text-2xl font-black text-[#004D4D] uppercase italic tracking-tight truncate">{event.title}</h3>
            </header>

            <form onSubmit={handleConfirmReservation} className="space-y-6">
              <div className="bg-[#004D4D]/5 border border-[#004D4D]/10 rounded-2xl p-5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="text-xl text-[#004D4D]"><FaTicketAlt /></div>
                  <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Admission Type</p><p className="text-xs font-bold text-slate-500 mt-0.5">{baseTicketPrice === 0 ? "Free General Pass" : "Premium Admission"}</p></div>
                </div>
                <div className="text-xl font-black text-[#004D4D]">
                  {baseTicketPrice === 0 ? "FREE" : `₹${baseTicketPrice}`}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Number of Attendees</label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden h-14 bg-slate-50">
                  <button type="button" onClick={() => setTicketCount(prev => Math.max(1, prev - 1))} className="w-16 h-full font-black text-slate-600 hover:bg-slate-200 transition-colors text-lg">-</button>
                  <div className="flex-1 text-center font-black text-lg text-[#004D4D]">{ticketCount}</div>
                  <button type="button" onClick={() => setTicketCount(prev => Math.min(10, prev + 1))} className="w-16 h-full font-black text-slate-600 hover:bg-slate-200 transition-colors text-lg">+</button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Invoice Balance</p><p className="text-xs font-medium text-slate-400 mt-0.5">Mathura Marketplace Processing Access</p></div>
                <div className="text-3xl font-black text-[#004D4D] italic">
                  {baseTicketPrice * ticketCount === 0 ? "₹0" : `₹${baseTicketPrice * ticketCount}`}
                </div>
              </div>

              <button
                type="submit" disabled={isBooking}
                className="w-full py-4 bg-[#D4AF37] hover:bg-[#bfa032] disabled:opacity-50 text-[#004D4D] font-black rounded-xl uppercase tracking-widest text-xs shadow-xl transition-all"
              >
                {isBooking ? "Securing Placement..." : baseTicketPrice === 0 ? "Claim Free Passes ❯" : "Confirm & Secure Seats ❯"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;