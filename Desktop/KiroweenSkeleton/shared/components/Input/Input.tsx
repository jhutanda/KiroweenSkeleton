import React from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'textarea';
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  type = 'text',
  required = false,
}) => {
  const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-800' : 'bg-white dark:bg-gray-900';
  
  const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} dark:text-white`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          className={`${inputClasses} resize-vertical min-h-[100px]`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          rows={4}
        />
      ) : (
        <input
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
        />
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;