import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

import ForgotPasswordModal from '../components/Auth/ForgotPasswordModal';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const performLogin = async (retryCount = 0) => {
            try {
                const response = await api.post('/auth/login', { email, password });

                // Assuming response structure: { token, user: { role, clientId, name } }
                const { token, user } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                if (user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/client/dashboard');
                }
            } catch (err) {
                // If 500 server error and less than 3 attempts, retry
                if (err.response?.status === 500 && retryCount < 3) {
                    console.log(`Server error (likely cold start). Retry attempt ${retryCount + 1}...`);
                    // Small delay to allow DB connection to establish - increased to 1.5s
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    return performLogin(retryCount + 1);
                }

                setError(err.response?.data?.message || err.response?.data?.msg || 'Login failed. Please try again later.');
                setLoading(false);
            }
        };

        performLogin();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-main-gradient p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel w-full max-w-md rounded-2xl p-8"
            >
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-white border border-zinc-200 dark:border-zinc-700">
                        <img src="/favicon.png" alt="Fortimark Logo" className="w-8 h-8 object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Fortimark</h1>
                    <p className="mt-2 text-zinc-600 dark:text-gray-400">Sign in to your account</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-300">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-700 py-2.5 pl-10 pr-4 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-zinc-500 dark:focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:focus:ring-white/50 transition-colors"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-700 py-2.5 pl-10 pr-10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-zinc-500 dark:focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:focus:ring-white/50 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 focus:ring-zinc-500 dark:focus:ring-offset-zinc-800"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-600 dark:text-zinc-400">
                                Remember me
                            </label>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsForgotPasswordOpen(true)}
                            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-silver w-full rounded-lg py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </motion.div>

            <ForgotPasswordModal
                isOpen={isForgotPasswordOpen}
                onClose={() => setIsForgotPasswordOpen(false)}
            />
        </div>
    );
};

export default Login;
