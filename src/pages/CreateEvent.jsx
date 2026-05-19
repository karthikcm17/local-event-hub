import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CreateEvent = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({
    title: '', 
    category: 'Business', 
    date: '', 
    location: '', 
    venue: '', 
    image: '',
    price: '',
    description: ''
  });

  if (!user || user.role !== 'organiser') {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const defaultImage = "https://i.pinimg.com/1200x/da/28/cd/da28cdea986b12be82852b87bc1a6e54.jpg";
    
    const finalPrice = form.price.trim() !== '' ? Number(form.price) : 1500;

    const eventPayload = { 
      ...form, 
      price: finalPrice,
      image: form.image.trim() !== '' ? form.image : defaultImage,
      organiserName: user.name, 
      organiserId: user.id 
    };

    try {
      await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload)
      });

      alert("Event Published Successfully!");
      navigate('/');
    } catch (err) {
      alert("Failed to publish event. Check server connection.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">

      <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] bg-[#004D4D]/5 rounded-full blur-[120px]"></div>

      <div className="absolute top-8 left-8 flex items-center gap-6">
        <Link
          to="/"
          className="text-[#004D4D] hover:text-[#D4AF37] transition-colors flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em]"
        >
          <span className="text-xl leading-none">❮</span> Back to Home
        </Link>
      </div>

      <div className="w-full max-w-2xl p-10 rounded-[3rem] bg-[#004D4D] shadow-[0_30px_60px_rgba(0,77,77,0.3)] relative z-10 border border-[#005c5c]">

        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute top-8 right-8 text-[#F7E7CE]/40 hover:text-[#F7E7CE] transition-colors text-2xl font-light"
        >
          ✕
        </button>

        <header className="text-center mb-10">
          <h2 className="text-4xl font-black text-[#F7E7CE] tracking-tighter uppercase italic">Host an Event</h2>
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mt-2 opacity-80">Professional Organiser Dashboard</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#F7E7CE]/50 uppercase tracking-[0.2em] ml-2">Event Title</label>
            <input
              type="text" placeholder="e.g., Annual Tech Leadership Summit" required
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:bg-white/20 outline-none transition-all font-medium"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#F7E7CE]/50 uppercase tracking-[0.2em] ml-2">Date</label>
              <input
                type="date" required
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white focus:border-[#D4AF37] focus:bg-white/20 outline-none transition-all text-xs h-[58px]"
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#F7E7CE]/50 uppercase tracking-[0.2em] ml-2">Category</label>
              <div className="relative">
                <select
                  className="w-full p-4 rounded-2xl bg-[#003d3d] border border-white/10 text-[#F7E7CE] focus:border-[#D4AF37] outline-none appearance-none cursor-pointer h-[58px] text-sm font-medium"
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  defaultValue="Business"
                >
                  <option value="Business">Business</option>
                  <option value="Music">Music</option>
                  <option value="Food & Drink">Food & Drink</option>
                  <option value="Art">Art</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Education">Education</option>
                  <option value="Sports">Sports</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[#F7E7CE]/40 text-xs">▼</div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#F7E7CE]/50 uppercase tracking-[0.2em] ml-2">Ticket Fare (₹)</label>
              <input
                type="number" min="0" placeholder="0 for Free Pass" required
                className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:bg-white/20 outline-none transition-all font-medium h-[58px] text-sm"
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#F7E7CE]/50 uppercase tracking-[0.2em] ml-2">Location / Venue</label>
            <input
              type="text" placeholder="City or Specific Venue Name" required
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:bg-white/20 outline-none transition-all font-medium"
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#F7E7CE]/50 uppercase tracking-[0.2em] ml-2">Event Banner Image URL</label>
            <input
              type="url" 
              placeholder="e.g., https://images.unsplash.com/photo-..." 
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:bg-white/20 outline-none transition-all font-medium"
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#F7E7CE]/50 uppercase tracking-[0.2em] ml-2">Event Description</label>
            <textarea
              placeholder="Describe the impact and details of your event..." rows="4"
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:bg-white/20 outline-none transition-all font-medium resize-none text-sm leading-relaxed"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            ></textarea>
          </div>

          <button className="w-full py-4 mt-4 bg-[#D4AF37] hover:bg-[#F7E7CE] text-[#004D4D] font-black rounded-2xl transition-all shadow-xl uppercase tracking-[0.2em] text-xs transform hover:scale-[1.01] cursor-pointer">
            Publish Event
          </button>
        </form>
      </div>

      <p className="mt-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
        Mathura Events Hub © 2026
      </p>
    </div>
  );
};

export default CreateEvent;