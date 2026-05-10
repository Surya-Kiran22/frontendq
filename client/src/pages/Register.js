import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { otpService } from '../services/otpService';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  BuildingLibraryIcon,
  CalendarIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  KeyIcon,
  SparklesIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Debounce utility function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

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
  
  // OTP States
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpErrors, setOtpErrors] = useState({});
  const [resendTimer, setResendTimer] = useState({ email: 0, phone: 0 });
  
  // Per-button loading states for instant feedback
  const [buttonLoading, setButtonLoading] = useState({
    sendEmail: false,
    verifyEmail: false,
    sendPhone: false,
    verifyPhone: false,
    submit: false
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];
  const years = ['1st', '2nd', '3rd', '4th'];

  // Simple validation for instant feedback
  const validateField = (name, value) => {
    const newErrors = { ...otpErrors };
    
    if (name === 'rollNumber' && value) {
      const rollNumberRegex = /^[0-9]{5}[A-Z][0-9]{2}[A-Z][0-9]$/;
      if (!rollNumberRegex.test(value)) {
        newErrors.rollNumber = 'Invalid format (e.g., 23761A05M9)';
      } else {
        delete newErrors.rollNumber;
      }
    }
    
    if (name === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = 'Invalid email format';
      } else {
        delete newErrors.email;
      }
    }
    
    if (name === 'phoneNumber' && value) {
      if (!/^\d{10}$/.test(value)) {
        newErrors.phoneNumber = 'Phone number must be 10 digits';
      } else {
        delete newErrors.phoneNumber;
      }
    }
    
    if (name === 'password' && value) {
      if (value.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else {
        delete newErrors.password;
      }
    }
    
    if (name === 'confirmPassword' && value) {
      if (value !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete newErrors.confirmPassword;
      }
    }
    
    setOtpErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error immediately for instant feedback
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Debounced validation
    validateField(name, value);
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
    setButtonLoading(prev => ({ ...prev, sendEmail: true }));
    try {
      const result = await otpService.sendEmailOTP(formData.email);
      if (result.success) {
        toast.success('OTP sent successfully!');
        setResendTimer(prev => ({ ...prev, email: 60 }));
        startResendTimer('email');
      }
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setButtonLoading(prev => ({ ...prev, sendEmail: false }));
    }
  };

  const handleSendPhoneOTP = async () => {
    if (!formData.phoneNumber) {
      toast.error('Please enter your phone number first');
      return;
    }
    setButtonLoading(prev => ({ ...prev, sendPhone: true }));
    try {
      const result = await otpService.sendPhoneOTP(formData.phoneNumber);
      if (result.success) {
        toast.success('OTP sent successfully!');
        setResendTimer(prev => ({ ...prev, phone: 60 }));
        startResendTimer('phone');
      }
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setButtonLoading(prev => ({ ...prev, sendPhone: false }));
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
    setButtonLoading(prev => ({ ...prev, verifyEmail: true }));
    try {
      const result = await otpService.verifyEmailOTP(formData.email, emailOTP);
      
      if (result.success) {
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
    } catch (error) {
      setOtpErrors({ email: 'Verification failed. Please try again.' });
    } finally {
      setButtonLoading(prev => ({ ...prev, verifyEmail: false }));
    }
  };

  const handleVerifyPhoneOTP = async () => {
    if (!phoneOTP || phoneOTP.length !== 6) {
      setOtpErrors({ phone: 'Please enter valid 6-digit OTP' });
      return;
    }
    setButtonLoading(prev => ({ ...prev, verifyPhone: true }));
    try {
      const result = await otpService.verifyPhoneOTP(formData.phoneNumber, phoneOTP);
      
      if (result.success) {
        setPhoneVerified(true);
        toast.success('Phone verified successfully!');
        setOtpErrors({});
        completeRegistration();
      } else {
        setOtpErrors({ phone: result.message });
      }
    } catch (error) {
      setOtpErrors({ phone: 'Verification failed. Please try again.' });
    } finally {
      setButtonLoading(prev => ({ ...prev, verifyPhone: false }));
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
    
    setButtonLoading(prev => ({ ...prev, submit: true }));
    setStep(2);
    // Auto-send email OTP when moving to step 2
    await handleSendEmailOTP();
    setButtonLoading(prev => ({ ...prev, submit: false }));
  };

  // Render Step 1: Registration Form
  const renderStep1 = () => (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { name: 'rollNumber', label: 'Roll Number', icon: UserIcon, placeholder: 'e.g., 23761A05M9' },
          { name: 'name', label: 'Full Name', icon: UserIcon, placeholder: 'John Doe' },
          { name: 'email', label: 'Email Address', icon: EnvelopeIcon, placeholder: 'john@example.com', type: 'email' },
        ].map((field) => (
          <div key={field.name} className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <field.icon className="h-4 w-4 mr-2 text-indigo-500 group-hover:text-purple-500 transition-colors" />
              {field.label} *
            </label>
            <input
              name={field.name}
              type={field.type || 'text'}
              value={formData[field.name]}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                errors[field.name] 
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50' 
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200 bg-white/50 hover:bg-white'
              }`}
              placeholder={field.placeholder}
            />
            {errors[field.name] && <p className="mt-1 text-sm text-rose-600">{errors[field.name]}</p>}
          </div>
        ))}

        <div className="group">
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
            <PhoneIcon className="h-4 w-4 mr-2 text-indigo-500 group-hover:text-purple-500 transition-colors" />
            Phone Number *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-4 bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-r-0 border-slate-200 rounded-l-xl text-slate-600 text-sm font-medium">
              +91
            </span>
            <input
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`flex-1 px-4 py-3 rounded-r-xl border-2 border-l-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                errors.phoneNumber 
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50' 
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200 bg-white/50 hover:bg-white'
              }`}
              placeholder="1234567890"
            />
          </div>
          {errors.phoneNumber && <p className="mt-1 text-sm text-rose-600">{errors.phoneNumber}</p>}
        </div>

        {[
          { name: 'branch', label: 'Branch', icon: BuildingLibraryIcon, options: branches },
          { name: 'year', label: 'Year', icon: CalendarIcon, options: years, suffix: ' Year' },
        ].map((field) => (
          <div key={field.name} className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <field.icon className="h-4 w-4 mr-2 text-indigo-500 group-hover:text-purple-500 transition-colors" />
              {field.label} *
            </label>
            <select
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                errors[field.name] 
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50' 
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200 bg-white/50 hover:bg-white'
              }`}
            >
              <option value="">Select {field.label}</option>
              {field.options.map(opt => (
                <option key={opt} value={opt}>{opt}{field.suffix || ''}</option>
              ))}
            </select>
            {errors[field.name] && <p className="mt-1 text-sm text-rose-600">{errors[field.name]}</p>}
          </div>
        ))}

        {[
          { name: 'password', label: 'Password', placeholder: 'Min 6 characters' },
          { name: 'confirmPassword', label: 'Confirm Password', placeholder: 'Confirm password' },
        ].map((field) => (
          <div key={field.name} className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
              <LockClosedIcon className="h-4 w-4 mr-2 text-indigo-500 group-hover:text-purple-500 transition-colors" />
              {field.label} *
            </label>
            <div className="relative">
              <input
                name={field.name}
                type={field.name === 'password' ? (showPassword ? 'text' : 'password') : (showConfirmPassword ? 'text' : 'password')}
                value={formData[field.name]}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 pr-12 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  errors[field.name] 
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50' 
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200 bg-white/50 hover:bg-white'
                }`}
                placeholder={field.placeholder}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                onClick={() => field.name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
              >
                {field.name === 'password' ? (showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />) : (showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />)}
              </button>
            </div>
            {errors[field.name] && <p className="mt-1 text-sm text-rose-600">{errors[field.name]}</p>}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={buttonLoading.submit}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-purple-300/50 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100"
      >
        {buttonLoading.submit ? (
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
    </form>
  );

  // Render Step 2: Email OTP Verification
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-20 w-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 animate-pulse">
          <EnvelopeIcon className="h-10 w-10 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
          Verify Your Email
        </h3>
        <p className="mt-3 text-base text-slate-600">
          We've sent a 6-digit OTP to <span className="font-bold text-slate-800 bg-gradient-to-r from-indigo-100 to-purple-100 px-2 py-1 rounded-lg">{formData.email}</span>
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
            <KeyIcon className="h-4 w-4 mr-2 text-indigo-500" />
            Enter Email OTP
          </label>
          <input
            type="text"
            value={emailOTP}
            onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className={`w-full px-4 py-4 text-center text-3xl tracking-[0.5em] rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 font-mono ${
              otpErrors.email 
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50' 
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-200 bg-white/50 hover:bg-white'
            }`}
            placeholder="000000"
            maxLength={6}
          />
          {otpErrors.email && <p className="mt-2 text-sm text-rose-600 font-medium">{otpErrors.email}</p>}
        </div>

        <button
          onClick={handleVerifyEmailOTP}
          disabled={buttonLoading.verifyEmail || emailOTP.length !== 6}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-purple-300/50 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100"
        >
          {buttonLoading.verifyEmail ? (
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
            <p className="text-sm text-slate-500">Resend OTP in <span className="font-bold text-indigo-600">{resendTimer.email}s</span></p>
          ) : (
            <button
              onClick={handleSendEmailOTP}
              disabled={buttonLoading.sendEmail}
              className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
            >
              {buttonLoading.sendEmail ? 'Sending...' : 'Resend Email OTP'}
            </button>
          )}
        </div>

        <button
          onClick={() => setStep(1)}
          className="w-full text-sm text-slate-500 hover:text-slate-700 font-medium flex items-center justify-center transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Registration
        </button>
      </div>
    </div>
  );

  // Render Step 3: Phone OTP Verification
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-20 w-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-200 animate-pulse">
          <PhoneIcon className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
          Verify Your Phone
        </h3>
        <p className="mt-3 text-base text-slate-600">
          We've sent a 6-digit OTP to <span className="font-bold text-slate-800 bg-gradient-to-r from-emerald-100 to-teal-100 px-2 py-1 rounded-lg">+91 {formData.phoneNumber}</span>
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
            <KeyIcon className="h-4 w-4 mr-2 text-emerald-500" />
            Enter Phone OTP
          </label>
          <input
            type="text"
            value={phoneOTP}
            onChange={(e) => setPhoneOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className={`w-full px-4 py-4 text-center text-3xl tracking-[0.5em] rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 font-mono ${
              otpErrors.phone 
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50' 
                : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-200 bg-white/50 hover:bg-white'
            }`}
            placeholder="000000"
            maxLength={6}
          />
          {otpErrors.phone && <p className="mt-2 text-sm text-rose-600 font-medium">{otpErrors.phone}</p>}
        </div>

        <button
          onClick={handleVerifyPhoneOTP}
          disabled={buttonLoading.verifyPhone || phoneOTP.length !== 6}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-emerald-300/50 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100"
        >
          {buttonLoading.verifyPhone ? (
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
            <p className="text-sm text-slate-500">Resend OTP in <span className="font-bold text-emerald-600">{resendTimer.phone}s</span></p>
          ) : (
            <button
              onClick={handleSendPhoneOTP}
              disabled={buttonLoading.sendPhone}
              className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50"
            >
              {buttonLoading.sendPhone ? 'Sending...' : 'Resend Phone OTP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render Step 4: Success
  const renderStep4 = () => (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-300/50 animate-bounce">
        <CheckCircleIcon className="h-14 w-14 text-white" />
      </div>
      <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 bg-clip-text text-transparent mb-3">
        Registration Successful!
      </h3>
      <p className="text-slate-600 mb-4 text-lg">Your account has been created successfully.</p>
      <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-200 animate-float">
            <SparklesIcon className="h-12 w-12 text-white" />
          </div>
          <h2 className="mt-8 text-5xl font-extrabold bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent animate-gradient">
            {step === 1 ? 'Create Account' : step === 4 ? 'Success!' : 'Verify Account'}
          </h2>
          <p className="mt-3 text-base text-slate-600 font-medium">
            {step === 1 ? 'Join our placement preparation platform' : 
             step === 2 ? 'Step 1 of 2: Email Verification' :
             step === 3 ? 'Step 2 of 2: Phone Verification' :
             'Welcome aboard!'}
          </p>
        </div>

        {/* Progress Steps */}
        {step < 4 && (
          <div className="flex items-center justify-center space-x-6 py-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`h-4 w-4 rounded-full transition-all duration-300 ${
                  s < step 
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200 scale-110' 
                    : s === step 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-200 scale-125 animate-pulse' 
                    : 'bg-slate-200'
                }`} />
                {s < 3 && <div className={`w-16 h-1 ml-2 rounded-full transition-all duration-300 ${s < step ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-200/50 p-8 border border-white/50 relative overflow-hidden">
          {/* Card Shine Effect */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            {step === 1 ? (
              <>
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Sign in here →
                </Link>
              </>
            ) : (
              <Link to="/login" className="text-slate-400 hover:text-slate-600">
                ← Back to Login
              </Link>
            )}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Register;
