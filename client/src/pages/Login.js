import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  AcademicCapIcon, 
  UserIcon, 
  LockClosedIcon, 
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    rollNumber: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await login(formData.rollNumber, formData.password);
    setLoading(false);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200 transform hover:scale-105 transition-transform duration-300">
            <SparklesIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
            PlacePro
          </h2>
          <p className="mt-2 text-slate-500 font-medium">Placement Portal</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="rollNumber" className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                <UserIcon className="h-4 w-4 mr-2 text-indigo-500" />
                Roll Number
              </label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                value={formData.rollNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.rollNumber 
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' 
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'
                }`}
                placeholder="e.g., 23761A05M9"
                disabled={loading}
              />
              {errors.rollNumber && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span> {errors.rollNumber}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                <LockClosedIcon className="h-4 w-4 mr-2 text-indigo-500" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 pr-12 transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.password 
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' 
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'
                  }`}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-rose-600 flex items-center">
                  <span className="mr-1">⚠️</span> {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  Sign in
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </span>
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Register here →
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="text-xs text-slate-500 text-center space-y-2">
                <p className="font-bold text-slate-700 flex items-center justify-center">
                  <SparklesIcon className="h-4 w-4 mr-1 text-amber-500" />
                  Demo Credentials
                </p>
                <div className="flex justify-center space-x-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 px-4 py-3 rounded-xl border border-blue-100">
                    <p className="font-bold text-blue-700">Admin</p>
                    <p className="font-mono text-blue-600 text-xs">***** / surya*****</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-3 rounded-xl border border-emerald-100">
                    <p className="font-bold text-emerald-700">Student</p>
                    <p className="font-mono text-emerald-600 text-xs">23761A05M9 / password123</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
