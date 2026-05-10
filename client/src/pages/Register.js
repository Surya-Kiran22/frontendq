import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { otpService } from '../services/otpService';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  AcademicCapIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  BuildingLibraryIcon,
  CalendarIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Register = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: Email OTP, 3: Phone OTP, 4: Success
  const [formData, setFormData] = useState({
    rollNumber: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    branch: '',
    year: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // OTP States
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpErrors, setOtpErrors] = useState({});
  const [resendTimer, setResendTimer] = useState({ email: 0, phone: 0 });

  const { register } = useAuth();
  const navigate = useNavigate();

  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];
  const years = ['1st', '2nd', '3rd', '4th'];

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
    
    const rollNumberRegex = /^[0-9]{5}[A-Z][0-9]{2}[A-Z][0-9]$/;
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    } else if (!rollNumberRegex.test(formData.rollNumber)) {
      newErrors.rollNumber = 'Invalid format (e.g., 23761A05M9)';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.branch) {
      newErrors.branch = 'Branch is required';
    }
    
    if (!formData.year) {
      newErrors.year = 'Year is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendEmailOTP = async () => {
    if (!formData.email) {
      toast.error('Please enter your email first');
      return;
    }
    setLoading(true);
    const result = await otpService.sendEmailOTP(formData.email);
    setLoading(false);
    if (result.success) {
      setResendTimer(prev => ({ ...prev, email: 60 }));
      startResendTimer('email');
    }
  };

  const handleSendPhoneOTP = async () => {
    if (!formData.phoneNumber) {
      toast.error('Please enter your phone number first');
      return;
    }
    setLoading(true);
    const result = await otpService.sendPhoneOTP(formData.phoneNumber);
    setLoading(false);
    if (result.success) {
      setResendTimer(prev => ({ ...prev, phone: 60 }));
      startResendTimer('phone');
    }
  };

  const startResendTimer = (type) => {
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev[type] <= 1) {
          clearInterval(timer);
          return { ...prev, [type]: 0 };
        }
        return { ...prev, [type]: prev[type] - 1 };
      });
    }, 1000);
  };

  const handleVerifyEmailOTP = async () => {
    if (!emailOTP || emailOTP.length !== 6) {
      setOtpErrors({ email: 'Please enter valid 6-digit OTP' });
      return;
    }
    setLoading(true);
    const result = await otpService.verifyEmailOTP(formData.email, emailOTP);
    setLoading(false);
    
    if (result.success) {
      setEmailVerified(true);
      toast.success('Email verified successfully!');
      setOtpErrors({});
      if (phoneVerified) {
        completeRegistration();
      } else {
        setStep(3);
      }
    } else {
      setOtpErrors({ email: result.message });
    }
  };

  const handleVerifyPhoneOTP = async () => {
    if (!phoneOTP || phoneOTP.length !== 6) {
      setOtpErrors({ phone: 'Please enter valid 6-digit OTP' });
      return;
    }
    setLoading(true);
    const result = await otpService.verifyPhoneOTP(formData.phoneNumber, phoneOTP);
    setLoading(false);
    
    if (result.success) {
      setPhoneVerified(true);
      toast.success('Phone verified successfully!');
      setOtpErrors({});
      completeRegistration();
    } else {
      setOtpErrors({ phone: result.message });
    }
  };

  const completeRegistration = async () => {
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    
    if (result.success) {
      setStep(4);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setStep(2);
    // Auto-send email OTP when moving to step 2
    await handleSendEmailOTP();
  };

  // Render Step 1: Registration Form
  const renderStep1 = () => (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label flex items-center">
            <UserIcon className="h-4 w-4 mr-2 text-blue-500" />
            Roll Number *
          </label>
          <input
            name="rollNumber"
            type="text"
            value={formData.rollNumber}
            onChange={handleChange}
            className={`input ${errors.rollNumber ? 'input-error' : ''}`}
            placeholder="e.g., 23761A05M9"
          />
          {errors.rollNumber && <p className="mt-1 text-sm text-red-600">{errors.rollNumber}</p>}
        </div>

        <div>
          <label className="label flex items-center">
            <UserIcon className="h-4 w-4 mr-2 text-blue-500" />
            Full Name *
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`input ${errors.name ? 'input-error' : ''}`}
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="label flex items-center">
            <EnvelopeIcon className="h-4 w-4 mr-2 text-blue-500" />
            Email Address *
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`input ${errors.email ? 'input-error' : ''}`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="label flex items-center">
            <PhoneIcon className="h-4 w-4 mr-2 text-blue-500" />
            Phone Number *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
              +91
            </span>
            <input
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`input rounded-l-none ${errors.phoneNumber ? 'input-error' : ''}`}
              placeholder="1234567890"
            />
          </div>
          {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
        </div>

        <div>
          <label className="label flex items-center">
            <BuildingLibraryIcon className="h-4 w-4 mr-2 text-blue-500" />
            Branch *
          </label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className={`input ${errors.branch ? 'input-error' : ''}`}
          >
            <option value="">Select Branch</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
          {errors.branch && <p className="mt-1 text-sm text-red-600">{errors.branch}</p>}
        </div>

        <div>
          <label className="label flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
            Year *
          </label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className={`input ${errors.year ? 'input-error' : ''}`}
          >
            <option value="">Select Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year} Year</option>
            ))}
          </select>
          {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
            <LockClosedIcon className="h-4 w-4 mr-2 text-indigo-500" />
            Password *
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border-2 pr-12 transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.password 
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' 
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
              placeholder="Min 6 characters"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
            <LockClosedIcon className="h-4 w-4 mr-2 text-indigo-500" />
            Confirm Password *
          </label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border-2 pr-12 transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.confirmPassword 
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' 
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
              placeholder="Confirm password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-sm text-rose-600">{errors.confirmPassword}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          <span className="flex items-center justify-center">
            Continue to Verification
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </span>
        )}
      </button>

      <div className="text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
            Sign in here →
          </Link>
        </p>
      </div>
    </form>
  );

  // Render Step 2: Email OTP Verification
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4">
          <EnvelopeIcon className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Verify Your Email</h3>
        <p className="mt-2 text-sm text-slate-600">
          We've sent a 6-digit OTP to <span className="font-bold text-slate-800">{formData.email}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label flex items-center">
            <KeyIcon className="h-4 w-4 mr-2 text-blue-500" />
            Enter Email OTP
          </label>
          <input
            type="text"
            value={emailOTP}
            onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className={`input text-center text-2xl tracking-widest ${otpErrors.email ? 'input-error' : ''}`}
            placeholder="000000"
            maxLength={6}
          />
          {otpErrors.email && <p className="mt-1 text-sm text-red-600">{otpErrors.email}</p>}
        </div>

        <button
          onClick={handleVerifyEmailOTP}
          disabled={loading || emailOTP.length !== 6}
          className="btn-primary w-full py-3"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Verifying...
            </div>
          ) : (
            <span className="flex items-center justify-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Verify Email OTP
            </span>
          )}
        </button>

        <div className="text-center">
          {resendTimer.email > 0 ? (
            <p className="text-sm text-gray-500">Resend OTP in {resendTimer.email}s</p>
          ) : (
            <button
              onClick={handleSendEmailOTP}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Resend Email OTP
            </button>
          )}
        </div>

        <button
          onClick={() => setStep(1)}
          className="w-full text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to Registration
        </button>
      </div>
    </div>
  );

  // Render Step 3: Phone OTP Verification
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <PhoneIcon className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Verify Your Phone</h3>
        <p className="mt-2 text-sm text-gray-600">
          We've sent a 6-digit OTP to <span className="font-semibold">+91 {formData.phoneNumber}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="label flex items-center">
            <KeyIcon className="h-4 w-4 mr-2 text-blue-500" />
            Enter Phone OTP
          </label>
          <input
            type="text"
            value={phoneOTP}
            onChange={(e) => setPhoneOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className={`input text-center text-2xl tracking-widest ${otpErrors.phone ? 'input-error' : ''}`}
            placeholder="000000"
            maxLength={6}
          />
          {otpErrors.phone && <p className="mt-1 text-sm text-red-600">{otpErrors.phone}</p>}
        </div>

        <button
          onClick={handleVerifyPhoneOTP}
          disabled={loading || phoneOTP.length !== 6}
          className="btn-primary w-full py-3"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Verifying...
            </div>
          ) : (
            <span className="flex items-center justify-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Verify Phone OTP & Complete Registration
            </span>
          )}
        </button>

        <div className="text-center">
          {resendTimer.phone > 0 ? (
            <p className="text-sm text-gray-500">Resend OTP in {resendTimer.phone}s</p>
          ) : (
            <button
              onClick={handleSendPhoneOTP}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Resend Phone OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render Step 4: Success
  const renderStep4 = () => (
    <div className="text-center py-8">
      <div className="mx-auto h-20 w-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
        <CheckCircleIcon className="h-12 w-12 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-2">Registration Successful!</h3>
      <p className="text-slate-600 mb-4">Your account has been created successfully.</p>
      <p className="text-sm text-slate-500">Redirecting to dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200">
            <KeyIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
            {step === 1 ? 'Create Account' : step === 4 ? 'Success!' : 'Verify Account'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 font-medium">
            {step === 1 ? 'Join the placement preparation system' : 
             step === 2 ? 'Step 1 of 2: Email Verification' :
             step === 3 ? 'Step 2 of 2: Phone Verification' :
             'Welcome aboard!'}
          </p>
        </div>

        {/* Progress Steps */}
        {step < 4 && (
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`h-3 w-3 rounded-full ${
                  s < step ? 'bg-emerald-500' : s === step ? 'bg-indigo-600' : 'bg-slate-300'
                }`} />
                {s < 3 && <div className={`w-12 h-0.5 ml-1 ${s < step ? 'bg-emerald-500' : 'bg-slate-300'}`} />}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 border border-slate-100">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
};

export default Register;
