import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <AcademicCapIcon className="h-12 w-12" />,
      title: 'Comprehensive Training',
      description: 'Access a wide range of placement preparation materials including aptitude tests, technical assessments, and interview preparation.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <BuildingOfficeIcon className="h-12 w-12" />,
      title: 'Company Applications',
      description: 'Apply to top companies with streamlined application process and track your application status in real-time.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <ChartBarIcon className="h-12 w-12" />,
      title: 'Performance Analytics',
      description: 'Get detailed insights into your preparation progress with comprehensive analytics and performance tracking.',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: <UsersIcon className="h-12 w-12" />,
      title: 'Expert Guidance',
      description: 'Connect with industry experts and get personalized guidance for your career development.',
      color: 'from-amber-500 to-orange-600'
    }
  ];

  const stats = [
    { label: 'Active Students', value: '1,234', icon: <UsersIcon className="h-6 w-6" />, color: 'text-blue-600' },
    { label: 'Placements', value: '892', icon: <CheckCircleIcon className="h-6 w-6" />, color: 'text-emerald-600' },
    { label: 'Companies', value: '45', icon: <BuildingOfficeIcon className="h-6 w-6" />, color: 'text-purple-600' },
    { label: 'Success Rate', value: '92%', icon: <RocketLaunchIcon className="h-6 w-6" />, color: 'text-amber-600' }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer at Microsoft',
      text: 'The comprehensive training materials and mock interviews helped me crack my dream company. The platform\'s analytics showed me exactly where I needed to improve.',
      avatar: 'PS'
    },
    {
      name: 'Rahul Kumar',
      role: 'Data Analyst at Amazon',
      text: 'The application tracking system kept me updated on all my applications. I never missed a deadline thanks to the timely notifications.',
      avatar: 'RK'
    },
    {
      name: 'Anjali Patel',
      role: 'Full Stack Developer at Google',
      text: 'From aptitude tests to technical interviews, this platform prepared me for every stage. The AI interview practice was invaluable.',
      avatar: 'AP'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block">PlacePro</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-light">
                Your Gateway to Career Success
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-indigo-100 max-w-3xl mx-auto">
              Comprehensive placement preparation platform with training, applications, and analytics
            </p>
            <div className="mt-10 sm:mt-12 flex justify-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full text-base sm:text-lg hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full text-base sm:text-lg hover:bg-indigo-50 transition-colors mr-4"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-full text-base sm:text-lg hover:bg-white hover:text-indigo-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Platform Statistics</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Join thousands of students who have successfully placed their dream jobs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} text-white mb-4`}>
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose PlacePro?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Everything you need to succeed in your placement journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent group-hover:border-${feature.color.split(' ')[1]}-200`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  <div className="mt-6">
                    <Link
                      to={user ? "/dashboard" : "/register"}
                      className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${feature.color} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                    >
                      {user ? 'Explore More' : 'Get Started'}
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Success Stories</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Hear from students who achieved their dream jobs through PlacePro
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {testimonial.avatar}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{testimonial.name}</h3>
                    <p className="text-indigo-600 font-semibold mb-3">{testimonial.role}</p>
                    <p className="text-slate-600 leading-relaxed italic">"{testimonial.text}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Join thousands of successful placements today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full text-lg hover:bg-indigo-50 transition-colors shadow-xl"
            >
              <SparklesIcon className="h-6 w-6 mr-2" />
              Create Account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full text-lg hover:bg-white hover:text-indigo-600 transition-colors shadow-xl"
            >
              <ShieldCheckIcon className="h-6 w-6 mr-2" />
              Sign In
            </Link>
          </div>
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
          100% {
            transform: translate(0px, 0px) scale(1);
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
      `}</style>
    </div>
  );
};

export default Home;
