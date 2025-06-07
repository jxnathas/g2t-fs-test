'use client';

import { ForwardedRef, forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: { message?: string };
  register?: any;
}

const Input = forwardRef(
  (
    { label, error, register, className = '', ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`mt-1 p-2 h-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${className} ${
            error ? 'border-red-500' : 'border'
          }`}
          {...props}
          {...register}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error.message}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;