import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: `bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 hover:shadow-lg focus:ring-primary-500 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed`,
    secondary: `bg-gradient-to-r from-secondary-500 via-secondary-600 to-secondary-700 text-white hover:from-secondary-600 hover:to-secondary-800 hover:shadow-lg focus:ring-secondary-500 focus:ring-secondary-300 disabled:opacity-50 disabled:cursor-not-allowed`,
    outline: `border-2 border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-400 focus:ring-neutral-500 focus:ring-neutral-300`,
    ghost: `text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 transition-colors`,
    danger: `bg-gradient-to-r from-error-500 via-error-600 to-error-700 text-white hover:from-error-600 hover:to-error-800 hover:shadow-lg focus:ring-error-500 focus:ring-error-300`
  };
  
  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${loading ? 'cursor-wait' : ''}
    ${className}
  `.trim();

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="inline-flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
          <span className="ml-2">{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
