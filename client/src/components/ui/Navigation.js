import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navigation = () => {
  const { user } = useAuth();
  const location = useLocation();

  const studentNavItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: '🏠',
      label: 'Overview'
    },
    { 
      name: 'Companies', 
      href: '/companies', 
      icon: '🏢',
      label: 'Browse'
    },
    { 
      name: 'Tests', 
      href: '/tests', 
      icon: '📝',
      label: 'Assess'
    },
    { 
      name: 'Applications', 
      href: '/applications', 
      icon: '📋',
      label: 'Track'
    },
    { 
      name: 'Payment', 
      href: '/payment', 
      icon: '💳',
      label: 'Billing'
    },
    { 
      name: 'Profile', 
      href: '/profile', 
      icon: '👤',
      label: 'Account'
    }
  ];

  const adminNavItems = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: '📊',
      label: 'Analytics'
    },
    { 
      name: 'Companies', 
      href: '/admin/companies', 
      icon: '🏢',
      label: 'Manage'
    },
    { 
      name: 'Students', 
      href: '/admin/students', 
      icon: '👥',
      label: 'Users'
    },
    { 
      name: 'Payments', 
      href: '/admin/payments', 
      icon: '💳',
      label: 'Revenue'
    }
  ];

  const navItems = user?.isAdmin ? adminNavItems : studentNavItems;

  return (
    <nav 
      className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-neutral-900 to-neutral-800 transform transition-transform duration-300 ease-in-out z-50 ${
        location.pathname.startsWith('/admin') ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <div className="flex items-center space-x-3">
            <div className="text-white">
              {user?.isAdmin ? '🎛' : '👤'}
            </div>
            <span className="text-white font-semibold">
              {user?.isAdmin ? 'Admin Panel' : 'Student Portal'}
            </span>
          </div>
          <button
            onClick={() => document.body.classList.toggle('sidebar-collapsed')}
            className="text-white hover:text-neutral-300 transition-colors"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={`flex items-center px-4 py-3 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-all duration-200 group ${
              location.pathname === item.href || location.pathname.startsWith(item.href + '/') 
                ? 'bg-neutral-700 text-white' : ''
            }`}
          >
            <span className="text-2xl mr-3">{item.icon}</span>
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-neutral-400">{item.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-700">
        <div className="text-center text-neutral-400 text-sm">
          &copy;&copy; 2024 PlacePro Platform
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
