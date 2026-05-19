import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const existing = await authService.checkEmail(formData.email);
    if (existing.length > 0) return alert("Email already exists!");

    await authService.signup(formData);
    alert("Registration Successful!");
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      
      <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] bg-[#004D4D]/5 rounded-full blur-[120px]"></div>

      <div className="absolute top-8 left-8">
        <Link 
          to="/" 
          className="text-[#004D4D] hover:text-[#D4AF37] transition-colors flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em]"
        >
          <span className="text-xl leading-none">❮</span> Back to Hub
        </Link>
      </div>

      <div className="w-full max-w-md p-10 rounded-[3rem] bg-[#004D4D] shadow-[0_30px_60px_rgba(0,77,77,0.3)] relative z-10 border border-[#005c5c]">
        <h2 className="text-3xl font-black text-[#F7E7CE] mb-8 text-center tracking-tighter uppercase italic">
          Join the Hub
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required 
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:border-[#D4AF37] focus:bg-white/20 outline-none transition-all font-medium"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          />

          <input 
            type="email" placeholder="Email" required 
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:border-[#D4AF37] focus:bg-white/20 outline-none transition-all font-medium"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          />

          <input 
            type="password" placeholder="Password" required 
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:border-[#D4AF37] focus:bg-white/20 outline-none transition-all font-medium"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
          />

          <div className="flex gap-4 mt-2">
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, role: 'user' })}
              className={`flex-1 py-3 rounded-xl border-2 transition-all font-black uppercase text-[10px] tracking-widest ${
                formData.role === 'user' 
                ? 'bg-[#D4AF37] border-[#D4AF37] text-[#004D4D]' 
                : 'border-white/20 text-white/60 hover:border-white/40'
              }`}
            >
              I'm a User
            </button>
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, role: 'organiser' })}
              className={`flex-1 py-3 rounded-xl border-2 transition-all font-black uppercase text-[10px] tracking-widest ${
                formData.role === 'organiser' 
                ? 'bg-[#D4AF37] border-[#D4AF37] text-[#004D4D]' 
                : 'border-white/20 text-white/60 hover:border-white/40'
              }`}
            >
              I'm an Organiser
            </button>
          </div>

          <button className="w-full py-4 mt-4 bg-[#D4AF37] hover:bg-[#F7E7CE] text-[#004D4D] font-black rounded-2xl transition-all shadow-xl uppercase tracking-[0.2em] text-xs transform hover:scale-[1.01]">
            Register Account
          </button>
        </form>

        <p className="text-white/60 text-center mt-8 text-sm font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-[#D4AF37] font-black hover:text-[#F7E7CE] hover:underline ml-1">
            Sign in here
          </Link>
        </p>
      </div>

    </div>
  );
};

export default Signup;