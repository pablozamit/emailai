
import React from 'react';
import { Icon } from './Icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, ...props }) => {
  const baseStyles = 'px-5 py-2.5 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md';

  const variantStyles = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover focus:ring-brand-primary',
    secondary: 'bg-brand-secondary text-brand-text hover:bg-brand-secondary-hover focus:ring-gray-400',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400 shadow-none',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]}`} disabled={isLoading} {...props}>
      {isLoading && <Icon name="spinner" className="w-5 h-5 text-white animate-spin"/>}
      {children}
    </button>
  );
};
