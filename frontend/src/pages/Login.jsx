import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import './Login.css';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.warning('Please fill in all fields');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        console.log('Login result:', result);

        if (result.success) {
            toast.success('Welcome back!');
            console.log('User role:', result.role);
            // Small delay to ensure state update completes before navigation
            setTimeout(() => {
                switch (result.role) {
                    case 'ADMIN':
                        console.log('Navigating to /admin');
                        navigate('/admin', { replace: true });
                        break;
                    case 'TEACHER':
                        console.log('Navigating to /teacher');
                        navigate('/teacher', { replace: true });
                        break;
                    case 'STUDENT':
                        console.log('Navigating to /student');
                        navigate('/student', { replace: true });
                        break;
                    default:
                        console.log('Navigating to /');
                        navigate('/', { replace: true });
                }
            }, 100);
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card animate-fadeIn">
                    <div className="login-header">
                        <div className="login-brand">
                            <GraduationCap size={36} strokeWidth={1.5} />
                        </div>
                        <h1 className="login-title">Welcome Back</h1>
                        <p className="login-subtitle">Sign in to your EduVerse account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg login-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="spinner"></div>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p className="login-help">
                            Need help? Contact your administrator
                        </p>
                    </div>
                </div>

                <div className="login-decoration">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                </div>
            </div>
        </div>
    );
}
