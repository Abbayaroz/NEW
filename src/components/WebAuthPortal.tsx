import React, { useState } from 'react';
import { User, Mail, Lock, Sparkles, Building2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface WebAuthPortalProps {
  onLogin: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  onRegister: (name: string, email: string, role: 'Student' | 'Lecturer', matricNo?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
}

export const WebAuthPortal: React.FC<WebAuthPortalProps> = ({ onLogin, onRegister }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Student' | 'Lecturer'>('Student');
  const [matricNo, setMatricNo] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (!name || !email || !password) {
          setError('All fields are required.');
          setLoading(false);
          return;
        }
        const res = await onRegister(name, email, role, role === 'Student' ? matricNo : undefined, password);
        if (res.success) {
          setSuccess(
            role === 'Student'
              ? 'Registration successful! You can now log in immediately.'
              : 'Registration successful! Staff accounts require Administrator verification before logging in.'
          );
          // Auto fill login email and switch tab
          setIsRegistering(false);
        } else {
          setError(res.error || 'Registration failed.');
        }
      } else {
        if (!email || !password) {
          setError('Email and password are required.');
          setLoading(false);
          return;
        }
        const res = await onLogin(email, password);
        if (res.success) {
          setSuccess('Login successful!');
        } else {
          setError(res.error || 'Invalid credentials.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl mt-8">
      {/* Top Accent Header */}
      <div className="bg-emerald-950 text-white p-8 text-center space-y-2 relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-emerald-800 rounded-full opacity-30" />
        <div className="absolute left-[-20px] bottom-[-20px] w-32 h-32 bg-emerald-900 rounded-full opacity-20" />
        
        <div className="w-12 h-12 bg-white text-emerald-950 rounded-2xl flex items-center justify-center font-black text-xl mx-auto shadow-md">
          IK
        </div>
        <h2 className="text-xl font-black tracking-tight uppercase">IKCOE Timetable Portal</h2>
        <p className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
          Isaac Jasper Boro College of Education
        </p>
      </div>

      <div className="p-8 space-y-6">
        {/* Toggle Tabs */}
        <div className="flex border-b border-slate-100 pb-2">
          <button
            onClick={() => { setIsRegistering(false); setError(''); setSuccess(''); }}
            className={`flex-1 text-center py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              !isRegistering
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Portal Sign In
          </button>
          <button
            onClick={() => { setIsRegistering(true); setError(''); setSuccess(''); }}
            className={`flex-1 text-center py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              isRegistering
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-start space-x-2 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs font-semibold animate-pulse">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Bashir Yaroz"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-emerald-600 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yaroz@ikcoe.edu.ng"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-emerald-600 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secure password credentials"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-emerald-600 transition-all font-sans"
              />
            </div>
          </div>

          {isRegistering && (
            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-emerald-600 transition-all"
                  >
                    <option value="Student">Student</option>
                    <option value="Lecturer">Lecturer</option>
                  </select>
                </div>

                {role === 'Student' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Matriculation No</label>
                    <input
                      type="text"
                      required
                      value={matricNo}
                      onChange={(e) => setMatricNo(e.target.value)}
                      placeholder="e.g. IKCOE/CSC/22/014"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-emerald-600 transition-all"
                    />
                  </div>
                )}
              </div>

              {role === 'Lecturer' && (
                <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 p-3 rounded-xl text-[10px] font-bold text-amber-800">
                  <Building2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Important: Academic staff accounts require approval from an Administrator before portal access is granted.</span>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-600/50 text-white font-extrabold text-xs py-3 rounded-xl cursor-pointer shadow-md transition flex items-center justify-center space-x-1.5"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegistering ? 'Submit Registration' : 'Log In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="bg-slate-50 border-t border-slate-100 p-5 text-center text-[10px] text-slate-400 font-semibold select-none">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />
        <span>Enterprise Lecture Allocation System Powered by IKCOE CS Department</span>
      </div>
    </div>
  );
};
