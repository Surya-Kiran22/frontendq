import React from 'react';
import { designTokens } from '../../styles/designSystemFixed';

const Card = ({ 
  children, 
  className = '', 
  variant = 'base', 
  hover = false, 
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl border border-neutral-200 shadow-md';
  
  const variants = {
    base: baseClasses,
    elevated: `${baseClasses} shadow-lg border-neutral-300`,
    floating: `${baseClasses} shadow-xl border-neutral-300 backdrop-blur-sm`,
    interactive: `${baseClasses} hover:shadow-lg hover:border-primary-400 transition-all duration-200 cursor-pointer`,
    glass: 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl'
  };

  const classes = `
    ${variants[variant]}
    ${hover ? 'hover:scale-105' : ''}
    ${className}
  `.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
