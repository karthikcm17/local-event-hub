import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const users = await authService.login(formData.email);
      if (users.length > 0 && users[0].password === formData.password) {
        localStorage.setItem('user', JSON.stringify(users[0]));
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Connection to server failed');
    }
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

        <h4 className="text-3xl font-black text-[#F7E7CE] mb-10 text-center tracking-tighter uppercase italic">
          sign in to discover
        </h4>

        {error && (
          <p className="bg-red-500/20 text-red-200 p-4 rounded-xl text-xs font-bold mb-6 text-center border border-red-500/30">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email" required
            placeholder="Email Address"
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:border-[#D4AF37] focus:bg-white/20 outline-none transition-all font-medium"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password" required
            placeholder="Password"
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:border-[#D4AF37] focus:bg-white/20 outline-none transition-all font-medium"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <button className="w-full py-4 bg-[#D4AF37] hover:bg-[#F7E7CE] text-[#004D4D] font-black rounded-2xl transition-all shadow-xl uppercase tracking-[0.2em] text-xs transform hover:scale-[1.01]">
            sign in
          </button>
        </form>

        <p className="text-white/60 text-center mt-8 text-sm font-medium">
          Don't have an account?
          <Link to="/signup" className="text-[#D4AF37] font-black hover:text-[#F7E7CE] hover:underline ml-1">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;