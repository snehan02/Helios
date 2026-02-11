import { useState } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Hexagon, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';

export default function LoginPage({ setUser }: { setUser: (user: any) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            navigate(data.user.role === 'CLIENT' ? '/portal' : '/admin');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-inter">
            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex bg-[#0A0D14] relative overflow-hidden items-center justify-center p-20">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0066FF] rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00D9FF] rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center">
                            <Hexagon size={40} className="text-[#0066FF] fill-[#0066FF]/20" />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">HELIOS</h1>
                    </div>
                    <h2 className="text-5xl font-black text-white leading-tight tracking-tight mb-6">
                        The Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#00D9FF]">Elite Agencies.</span>
                    </h2>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
                        Streamlining client relationships, project visibility, and agency transparency in one unified platform.
                    </p>

                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0D14] bg-slate-800 flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700"></div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-slate-500 tracking-tight">Trusted by 200+ global agencies</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex items-center justify-center p-8 sm:p-20 relative">
                <div className="max-w-md w-full animate-fade-in">
                    <div className="mb-12">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-3">Welcome back</h3>
                        <p className="text-slate-500 font-medium">Please enter your credentials to access your dashboard.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in shake duration-500">
                                <ShieldCheck className="text-red-500" size={20} />
                                <p className="text-red-600 text-sm font-bold">{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0066FF] transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#0066FF]/5 focus:border-[#0066FF] transition-all font-bold text-slate-800 placeholder:text-slate-300"
                                    placeholder="name@agency.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Phrase</label>
                                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-[#0066FF] hover:underline">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0066FF] transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#0066FF]/5 focus:border-[#0066FF] transition-all font-bold text-slate-800 placeholder:text-slate-300"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0A0D14] text-white py-5 rounded-[24px] font-black text-lg hover:bg-slate-800 transition shadow-2xl shadow-slate-900/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Authenticate</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-20 flex items-center justify-between pt-8 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v1.2.4 "HELIOS"</p>
                        <div className="flex gap-4">
                            <span className="text-[10px] font-black text-slate-900 uppercase cursor-pointer hover:text-[#0066FF]">System Status</span>
                            <span className="text-[10px] font-black text-slate-900 uppercase cursor-pointer hover:text-[#0066FF]">Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
