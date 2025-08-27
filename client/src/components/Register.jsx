import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, LogIn, AlertCircle, CheckCircle } from 'lucide-react';

const KanvasLogo = () => (
    <div className="flex items-center justify-center mb-8 group">
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 6H15.5L25 16L15.5 26H7L16.5 16L7 6Z" fill="currentColor" />
                    <path d="M16 7H24V9H16V7Z" fill="currentColor" />
                    <path d="M16 13H22V15H16V13Z" fill="currentColor" />
                    <path d="M16 19H20V21H16V19Z" fill="currentColor" />
                </svg>
            </div>
        </div>
        <div className="ml-4 overflow-hidden">
            <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Kanvas
            </span>
        </div>
    </div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '', // ✅ Add confirm password state
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const { name, email, password, password2 } = formData; // ✅ Destructure new field

  const onChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    // ✅ Add password match validation
    if (password !== password2) {
        setError('Passwords do not match');
        return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', { name, email, password });
      setSuccessMessage(res.data.msg); 
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <KanvasLogo />
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-xl p-8">
            {successMessage ? (
                <div className="text-center animate-in fade-in-0 duration-500">
                    <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">Registration Successful!</h2>
                    <p className="text-gray-600 mt-2">{successMessage}</p>
                    <Link to="/login" className="mt-6 inline-block font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                        Back to Login
                    </Link>
                </div>
            ) : (
                <>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
                        <p className="text-gray-600 mt-2">Join Kanvas to start managing your projects.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                id="name"
                                type="text"
                                placeholder="Your Name"
                                name="name"
                                value={name}
                                onChange={onChange}
                                required
                                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                name="password"
                                value={password}
                                onChange={onChange}
                                minLength="6"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                            />
                        </div>

                        {/* ✅ Confirm Password Field */}
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                id="password2"
                                type="password"
                                placeholder="Confirm Password"
                                name="password2"
                                value={password2}
                                onChange={onChange}
                                minLength="6"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                            />
                        </div>

                        {error && (
                            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                <AlertCircle className="h-5 w-5" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center space-x-2 relative overflow-hidden px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <LogIn className="h-5 w-5" />
                            )}
                            <span>{isLoading ? 'Registering...' : 'Register'}</span>
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
                                Login here
                            </Link>
                        </p>
                    </form>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Register;
