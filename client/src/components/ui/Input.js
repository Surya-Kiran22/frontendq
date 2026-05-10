import React from 'react';
import { designTokens } from '../../styles/designSystem';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  disabled = false, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'block w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-all duration-200';
  
  const variantClasses = {
    primary: 'border-primary-500 focus:ring-primary-500 bg-primary-50 focus:bg-primary-100',
    secondary: 'border-secondary-500 focus:ring-secondary-500 bg-secondary-50 focus:bg-secondary-100',
    error: 'border-error-500 focus:ring-error-500 bg-error-50 focus:bg-error-100'
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[error ? 'error' : 'primary']}
    ${disabled ? 'opacity-50 cursor-not-allowed bg-neutral-100' : ''}
    ${className}
  `.trim();

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={classes}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-error-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;
