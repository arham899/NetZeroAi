import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

type Step = 'email' | 'code' | 'password' | 'success';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
            setStep('code');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send verification code. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await axios.post(`${API_BASE_URL}/auth/verify-reset-code`, { email, code });
            setStep('password');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);

        try {
            await axios.post(`${API_BASE_URL}/auth/reset-password`, { email, code, newPassword });
            setStep('success');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendCode = async () => {
        setError('');
        setIsSubmitting(true);

        try {
            await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
            setError(''); // Clear any previous errors
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to resend code.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-6">
            {['email', 'code', 'password'].map((s, index) => (
                <div key={s} className="flex items-center">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step === s
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                            : ['email', 'code', 'password'].indexOf(step) > index || step === 'success'
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                    >
                        {['email', 'code', 'password'].indexOf(step) > index || step === 'success' ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            index + 1
                        )}
                    </div>
                    {index < 2 && (
                        <div
                            className={`w-8 h-0.5 mx-1 transition-all ${['email', 'code', 'password'].indexOf(step) > index || step === 'success'
                                ? 'bg-emerald-300'
                                : 'bg-slate-200'
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );

    const renderEmailStep = () => (
        <motion.form
            key="email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSendCode}
            className="space-y-5"
        >
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 text-slate-400">
                        <Mail className="w-5 h-5" />
                    </div>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium"
                        placeholder="Enter your email"
                    />
                </div>
                <p className="text-sm text-slate-500 ml-1">We'll send a 6-digit verification code to this email</p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
                {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        Send Code
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </motion.form>
    );

    const renderCodeStep = () => (
        <motion.form
            key="code"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleVerifyCode}
            className="space-y-5"
        >
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Verification Code</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 text-slate-400">
                        <KeyRound className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        required
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium text-center tracking-[0.5em] text-xl"
                        placeholder="••••••"
                    />
                </div>
                <p className="text-sm text-slate-500 ml-1">
                    Enter the 6-digit code sent to <span className="font-medium text-slate-700">{email}</span>
                </p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || code.length !== 6}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
                {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        Verify Code
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            <div className="flex items-center justify-between text-sm">
                <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Change email
                </button>
                <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isSubmitting}
                    className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors disabled:opacity-50"
                >
                    Resend code
                </button>
            </div>
        </motion.form>
    );

    const renderPasswordStep = () => (
        <motion.form
            key="password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleResetPassword}
            className="space-y-5"
        >
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">New Password</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 text-slate-400">
                        <Lock className="w-5 h-5" />
                    </div>
                    <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium"
                        placeholder="Enter new password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-500 transition-colors"
                    >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                <p className="text-xs text-slate-400 ml-1">Min 8 characters with uppercase, lowercase, and number</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Confirm Password</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500 text-slate-400">
                        <Lock className="w-5 h-5" />
                    </div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all font-medium"
                        placeholder="Confirm new password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-500 transition-colors"
                    >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
                {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        Reset Password
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </motion.form>
    );

    const renderSuccessStep = () => (
        <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
        >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Password Reset Successful!</h2>
            <p className="text-slate-500 mb-6">You can now login with your new password.</p>
            <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
                Go to Login
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );

    const getStepTitle = () => {
        switch (step) {
            case 'email': return 'Reset Password';
            case 'code': return 'Enter Code';
            case 'password': return 'New Password';
            case 'success': return 'All Done!';
        }
    };

    const getStepDescription = () => {
        switch (step) {
            case 'email': return 'Enter your email to receive a verification code';
            case 'code': return 'Check your inbox for the verification code';
            case 'password': return 'Create a strong new password';
            case 'success': return '';
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md px-6 relative z-10"
            >
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl shadow-emerald-900/5">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg shadow-emerald-500/20">
                            <KeyRound className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{getStepTitle()}</h1>
                        {getStepDescription() && (
                            <p className="text-slate-500">{getStepDescription()}</p>
                        )}
                    </div>

                    {step !== 'success' && renderStepIndicator()}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm overflow-hidden"
                        >
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 'email' && renderEmailStep()}
                        {step === 'code' && renderCodeStep()}
                        {step === 'password' && renderPasswordStep()}
                        {step === 'success' && renderSuccessStep()}
                    </AnimatePresence>

                    {step !== 'success' && (
                        <div className="mt-8 text-center pt-6 border-t border-slate-100">
                            <p className="text-slate-500">
                                Remember your password?{' '}
                                <Link to="/login" className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
