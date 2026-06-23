// Componente Input reutilizable con TypeScript y Tailwind CSS

import React from 'react';
import { InputHTMLAttributes, forwardRef } from 'react';

// Variantes del input
type InputVariant = 'default' | 'error' | 'success';
type InputSize = 'sm' | 'md' | 'lg';

// Props del componente Input
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: InputVariant;
  size?: InputSize;
  fullWidth?: boolean;
}

// Componente Input con forwardRef para poder acceder al DOM element
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  id,
  ...props
}, ref) => {
  // Usar un ID determinista basado en el label si no se proporciona
  const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase() || 'field'}`;

  // Estilos según la variante
  const variantClasses: Record<InputVariant, string> = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
  };

  // Estilos según el tamaño
  const sizeClasses: Record<InputSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const baseClasses = 'block w-full rounded-md border shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900';
  
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];
  const widthClass = fullWidth ? 'w-full' : '';
  
  const inputClasses = `
    ${baseClasses}
    ${variantClass}
    ${sizeClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        ref={ref}
        className={inputClasses}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
